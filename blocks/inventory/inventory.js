const addInventory = async (block) => {
  // hiding till ready to display
  const displayValue = block.style.display;
  block.style.display = 'none';

  const truckName = block.firstElementChild.innerText.trim();
  const data = await fetch(`${window.hlx.codeBasePath}/blocks/inventory/html/${truckName}.html`);

  if (!data.ok) {
    console.error(`failed to load html: ${truckName}`);
    block.innerHTML = '';
    return;
  }

  const text = await data.text();
  block.innerHTML = text;

  const styles = block.querySelectorAll('style');

  styles.forEach((styleSheet) => {
    document.head.appendChild(styleSheet);
  });

  // loading scripts one by one to prevent inappropriate script execution order.

  for (const script of [...block.querySelectorAll('script')]) {
    let waitForLoad = Promise.resolve();
    // the script element added by innerHTML is NOT executed
    // the workaround is to create the new script tag, copy attibutes and content
    const newScript = document.createElement('script');

    newScript.setAttribute('type', 'text/javascript');
    // coping all script attribute to the new one
    script.getAttributeNames().forEach((attrName) => {
      const attrValue = script.getAttribute(attrName);
      newScript.setAttribute(attrName, attrValue);

      if (attrName === 'src') {
        waitForLoad = new Promise((resolve) => {
          newScript.addEventListener('load', resolve);
        });
      }
    });
    newScript.innerHTML = script.innerHTML;
    script.remove();
    document.body.append(newScript);

    await waitForLoad;
  }

  removeContactButtons(block);
  block.style.display = displayValue;
};

const removeContactButtons = async (block) => {
  const buttons = block.getElementsByClassName('contact-buttons');
  if (buttons) {
    const buttonsArray = Array.from(buttons);
    buttonsArray.forEach((button) => {
      button.remove();
    });
  }

  const contactUsButtons = document.querySelectorAll('button.widget-details.listings-button.collapsible-contacts');
  if (contactUsButtons) {
    const contactUsButtonsArray = Array.from(contactUsButtons);
    contactUsButtonsArray.forEach((cuButton) => {
      cuButton.remove();
    });
  }
};

export default async function decorate(block) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        addInventory(block);
      }
    },
    {
      rootMargin: '300px',
    },
  );
  observer.observe(block);
}
