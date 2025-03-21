import { loadScript } from '../../scripts/aem.js';
import { createElement } from '../../scripts/common.js';
import { logResults } from '../v2-newsletter/v2-newsletter.js';

// cache contains the form element that should be reused
const formCache = new Map();
const blockName = 'v2-forms';

function serialize(obj) {
  const str = Object.keys(obj).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
  return str.join('&');
}

function constructPayload(form) {
  const payload = {};
  [...form.elements].forEach((fe) => {
    if (!fe.name) {
      return;
    }
    if (fe.type === 'radio' && fe.checked) {
      payload[fe.name] = fe.value;
    } else if (fe.type === 'checkbox' && fe.checked) {
      payload[fe.name] = payload[fe.name] ? `${payload[fe.name]},${fe.value}` : fe.value;
    } else if (fe.type !== 'file') {
      payload[fe.name] = fe.value;
    }
  });
  payload.callback = 'logResult';
  return { payload };
}

async function prepareRequest(form) {
  const { payload } = constructPayload(form);
  const url = form.dataset.action;

  const serializedData = serialize(payload);

  return loadScript(`${url}?${serializedData}`, { type: 'text/javascript', charset: 'UTF-8' });
}

async function handleSubmit(form) {
  if (form.getAttribute('data-submitting') !== 'true') {
    form.setAttribute('data-submitting', 'true');
    try {
      await prepareRequest(form);
    } catch (error) {
      window.logResult({ result: logResults.success, log: error });
    }
  }
}

const addForm = async (block) => {
  const displayValue = block.style.display;
  block.style.display = 'none';

  const formName = block.firstElementChild.innerText.trim();
  const formAction = block.firstElementChild.nextElementSibling.innerText.trim();

  const formContent = await import(`./forms/${formName}.js`);

  const form = `
    <form
      method="post"
      name="form-${formName}"
      action="${formAction}"
    >${formContent.default}

      <div style="position:absolute; left:-9999px; top: -9999px;" aria-hidden="true">
        <label for="pardot_extra_field">Comments</label>
        <input type="text" id="pardot_extra_field" name="pardot_extra_field" />
      </div>
    </form>
  `;

  if (formCache.get(formName)) {
    const cachedForm = formCache.get(formName);
    block.replaceWith(cachedForm);
    block.style.display = displayValue;
    return;
  }

  const formWrapper = createElement('div', { classes: `${blockName}__container` });
  formWrapper.innerHTML = form;
  block.replaceWith(formWrapper);
  formCache.set(formName, formWrapper);

  block.style.display = displayValue;

  const formObj = formWrapper.querySelector('form');

  formObj.addEventListener('submit', (e) => {
    if (formContent.onSubmit) {
      e.preventDefault();
      formObj.dataset.action = e.currentTarget.action;
      formContent.onSubmit(formObj, handleSubmit);
    }

    e.preventDefault();
    let isValid = true;
    if (formObj.hasAttribute('novalidate')) {
      isValid = formObj.checkValidity();
    }
    if (isValid) {
      e.submitter.setAttribute('disabled', '');
      formObj.dataset.action = e.currentTarget.action;

      handleSubmit(formObj);
    }
  });

  formContent.postLoad?.(formObj);
};

export default async function decorate(block) {
  const forceLoad = block?.getAttribute('data-force-load');

  if (forceLoad === 'true') {
    await addForm(block);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
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
