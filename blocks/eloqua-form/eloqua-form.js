import { loadScriptIfNotLoadedYet } from '../../scripts/scripts.js';
import { createElement, getTextLabel, isTargetingAllowed } from '../../scripts/common.js';

// Every eloqua form has it's own JS, CSS and HTML.
// Once the form is loaded all the JS and CSS are added to the body.
// One form should be loaded only once, so there won't be any conflict in
// inline JS provided inside the form template
// (Eloqua forms add events to form elements by searching by ids,
// so loading the same form twice will break the form)

// cache contains the form element that should be reused
const eloquaFormCache = new Map();

const loadFormStyles = (el) => {
  const styles = el.querySelectorAll('style');

  styles.forEach((styleSheet) => {
    document.head.appendChild(styleSheet);
  });
};

const loadFormScripts = async (elqForm) => {
  // loading scripts one by one to prevent inappropriate script execution order.

  for (const script of [...elqForm.querySelectorAll('script')]) {
    let waitForLoad = Promise.resolve();
    const scriptAttrs = {};

    // coping all script attribute to the new one

    script.getAttributeNames().forEach((attrName) => {
      const attrValue = script.getAttribute(attrName);
      scriptAttrs[attrName] = attrValue;
    });

    // script with external script link
    if (script.getAttribute('src')) {
      waitForLoad = loadScriptIfNotLoadedYet(script.getAttribute('src'), scriptAttrs);
    } else {
      // scripts with inline code

      // the script element added by innerHTML is NOT executed
      // the workaround is to create the new script tag, copy attibutes and content
      const newScript = createElement('script', { props: { type: 'text/javascript' } });

      newScript.innerHTML = script.innerHTML;
      document.body.append(newScript);
    }

    script.remove();

    await waitForLoad;
  }
};

const formFieldAdjustment = (elqForm) => {
  elqForm.querySelectorAll('.form-element-layout').forEach((el) => {
    // displaying label content as input placeholder
    const input = el.querySelector('input[type="text"], select');
    const label = el.querySelector('label');

    if (input && label) {
      input.setAttribute('placeholder', label.innerText.replace(/\s+/g, ' ').trim());
      label.remove();
    }
  });

  // adding class to the select parent element, so the select's arrow could be displayed
  elqForm.querySelectorAll('select').forEach((el) => {
    el.parentElement.classList.add('eloqua-select-wrapper');
  });

  // replacing eloqua default values
  elqForm.querySelectorAll('[value^="~~"]').forEach((el) => {
    el.setAttribute('value', '');
  });
  elqForm.querySelectorAll('input').forEach((el) => {
    if (el.value.trim().startsWith('<eloqua')) {
      el.value = '';
    }
  });
};

const thankYouResponse = (elqForm, thankYou) => {
  const form = elqForm.querySelector('form');
  const oldSubmit = form.onsubmit;
  form.onsubmit = function handleSubmit() {
    if (oldSubmit.call(this)) {
      const body = new FormData(this);
      const { action, method } = this;
      fetch(action, { method, body, redirect: 'manual' }).then((resp) => {
        if (!resp.ok) {
          console.error(`form submission failed: ${resp.status} / ${resp.statusText}`);
        }
        const firstContent = thankYou.firstElementChild;
        if (firstContent.tagName === 'A') {
          // redirect to thank you page
          window.location.href = firstContent.href;
        } else {
          // show thank you content
          elqForm.replaceChildren(thankYou);
          elqForm.classList.add('eloqua-form-thank-you');
        }
      });
    }
    return false;
  };
};

const addForm = async (block) => {
  // hidding till ready to display
  const displayValue = block.style.display;
  block.style.display = 'none';

  const formName = block.firstElementChild.innerText.trim();
  const thankYou = block.firstElementChild.nextElementSibling;

  if (eloquaFormCache.get(formName)) {
    const form = eloquaFormCache.get(formName);
    block.append(form);
    block.style.display = displayValue;
    return;
  }

  const data = await fetch(`${window.hlx.codeBasePath}/blocks/eloqua-form/forms/${formName}.html`);

  if (!data.ok) {
    console.error(`failed to load form: ${formName}`);
    block.innerHTML = '';
    return;
  }

  const text = await data.text();
  const formWrapper = createElement('div', { classes: 'eloqua-form-container' });
  formWrapper.innerHTML = text;
  block.innerHTML = '';
  block.append(formWrapper);
  eloquaFormCache.set(formName, formWrapper);

  if (thankYou) {
    thankYouResponse(block, thankYou);
  }

  loadFormStyles(block);
  await loadFormScripts(block);
  formFieldAdjustment(block);

  block.style.display = displayValue;
};

export const addNoCookieMessage = (messageContainer) => {
  const messageText = getTextLabel('no form message');
  const messageLinkText = getTextLabel('no form link message');

  const messageEl = createElement('div', ['eloqua-form-no-cookie']);
  messageEl.innerHTML = `
    <span>${messageText}</span>
    <button>${messageLinkText}</button>
  `;

  messageEl.querySelector('button').addEventListener('click', () => {
    window.OneTrust.ToggleInfoDisplay();
  });

  messageContainer.replaceChildren(messageEl);
};

export default async function decorate(block) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        if (!isTargetingAllowed()) {
          addNoCookieMessage(block);

          return;
        }

        observer.disconnect();
        addForm(block);
      }
    },
    {
      rootMargin: '300px',
    },
  );
  observer.observe(block);
}
