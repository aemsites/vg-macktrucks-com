import { getTextLabel, createElement, getJsonFromUrl } from '../../scripts/common.js';

const docRange = document.createRange();
const blockName = 'vin-number';

const apiConfig = {
  dev: {
    url: 'https://vinlookup-dev-euw-ase-01.azurewebsites.net/v1/api/',
    key: '0e13506b59674706ad9bae72d94fc83c',
  },
  qa: {
    url: 'https://vinlookup-qa-euw-ase-01.azurewebsites.net/v1/api/',
    key: '0e13506b59674706ad9bae72d94fc83c',
  },
  prod: {
    url: 'https://vinlookup-prod-euw-ase-01.azurewebsites.net/v1/api/',
    key: '0e13506b59674706ad9bae72d94fc83c',
  },
};

// list of things to be display for each recall
const valueDisplayList = [
  {
    key: 'recall_date',
  },
  {
    key: 'mfr_recall_number',
  },
  {
    key: 'nhtsa_recall_number',
  },
  {
    key: 'tc_recall_nbr',
  },
  {
    key: 'mfr_recall_status',
  },
  {
    key: 'recall_description',
    class: `${blockName}__detail-item--column`,
  },
  {
    key: 'safety_risk_description',
    class: `${blockName}__detail-item--column`,
  },
  {
    key: 'remedy_description',
    class: `${blockName}__detail-item--column`,
  },
  {
    key: 'mfr_notes',
    class: `${blockName}__detail-item--column`,
  },
];

// use this to map values from API
const recallStatus = {
  11: 'recall_incomplete',
  0: 'recall_complete',
  12: 'recall_incomplete_no_remedy',
};

function getAPIConfig() {
  let env = 'prod';

  if (window.location.host.includes('hlx.page')) {
    env = 'qa';
  } else if (window.location.host.includes('localhost')) {
    env = 'dev';
  }

  return apiConfig[env];
}

function getStorageItem(key) {
  // get the parsed value of the given key
  const result = JSON.parse(window.localStorage.getItem(key));

  // if the key has value
  if (result) {
    // if the entry is expired remove the entry and return null
    if (result.expireTime <= Date.now()) {
      window.localStorage.removeItem(key);
      return null;
    }
    // else return the value
    return result.data;
  }
  // if the key does not have value
  return null;
}

function setStorageItem(key, value) {
  // store the value as object along with expiry date
  const result = {
    data: value,
    expireTime: Date.now() + 60 * 60 * 1000, // set the expiry from the current date for a day
  };

  // stringify the result and the data in original storage
  window.localStorage.setItem(key, JSON.stringify(result));
}

async function fetchRefreshDate() {
  const { url, key } = getAPIConfig();
  try {
    const response = await getJsonFromUrl(`${url}refreshdate?api_key=${key}`);
    setStorageItem('refreshDate-MT', response.refresh_date);
    return response.refresh_date;
  } catch (error) {
    console.error('Error fetching refresh date:', error);
  }
  return null;
}

function renderRecalls(recallsData) {
  const resultText = document.querySelector(`.${blockName}__results-text`);
  let resultContent = getTextLabel('result text')
    .replace(/\${count}/, recallsData.number_of_recalls)
    .replace(/\${vin}/, recallsData.vin);

  const blockEl = document.querySelector(`.${blockName}__recalls-wrapper`);

  const recallsMake = createElement('div', { classes: `${blockName}__recalls-make-wrapper` });
  const makeFragment = docRange.createContextualFragment(`
    <div class="${blockName}__recalls-md-row">
      <h5 class="${blockName}__recalls-md-title">${getTextLabel('model year')}</h5>
      <span> ${recallsData.year}</span>
    </div>
    <div class="${blockName}__recalls-md-row">
      <h5 class="${blockName}__recalls-md-title">${getTextLabel('make')}</h5>
      <span> ${recallsData.make}</span>
    </div>
    <div class="${blockName}__recalls-md-row">
      <h5 class="${blockName}__recalls-md-title">${getTextLabel('model')}</h5>
      <span> ${recallsData.model}</span>
    </div>
  `);

  recallsMake.append(...makeFragment.children);
  blockEl.append(recallsMake);

  if (recallsData.recalls_available) {
    const listWrapperFragment = docRange.createContextualFragment(`
      <div class="${blockName}__recalls-heading-wrapper">
        <span class="${blockName}__recalls-alert-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.537 2.77441C12.4523 2.60503 12.2792 2.49804 12.0898 2.49805C11.9004 2.49805 11.7273 2.60506 11.6426 2.77445L2.14458 21.7711C2.06709 21.9261 2.07537 22.1102 2.16647 22.2576C2.25758 22.405 2.41851 22.4947 2.5918 22.4947H21.5897C21.7629 22.4947 21.9239 22.405 22.015 22.2576C22.1061 22.1102 22.1144 21.9261 22.0369 21.7711L12.537 2.77441ZM3.4008 21.4947L12.0898 4.11603L20.7806 21.4947H3.4008ZM12.9995 14.6796V15.7512C12.9995 15.8619 12.9046 15.9974 12.7538 15.9974L12.4304 15.9969C12.2549 15.9965 12.0583 15.9961 11.9556 15.9961H11.2484C11.0976 15.9961 11.0027 15.8606 11.0027 15.7499V14.6796L11.0027 8.24501C11.0027 8.13425 11.0976 7.99874 11.2484 7.99874H11.9556C12.0581 7.99874 12.2545 7.99834 12.4299 7.99798H12.43L12.4304 7.99798L12.7538 7.99744C12.9046 7.99744 12.9995 8.13295 12.9995 8.2437L12.9995 14.6796ZM12.9964 18.8443V19.7512C12.9964 19.8619 12.9015 19.9974 12.7507 19.9974L12.4273 19.9969C12.2517 19.9965 12.0551 19.9961 11.9524 19.9961H11.2452C11.0944 19.9961 10.9995 19.8606 10.9995 19.7499V18.8443V18.2437C10.9995 18.1329 11.0944 17.9974 11.2452 17.9974H11.9524C12.0551 17.9974 12.2517 17.997 12.4273 17.9967L12.7507 17.9961C12.9015 17.9961 12.9964 18.1316 12.9964 18.2424L12.9964 18.8443Z" fill="var(--color-icon, #000)"/>
          </svg>
        </span>
        <h4 class="${blockName}__recalls-heading" >${getTextLabel('recalls')}  &nbsp; &nbsp;</h4>
        <p class="${blockName}__recalls-refresh-date"> [${getTextLabel('recall_oldest_info')} ${recallsData.recalls_since}] </p>
      </div>
    `);

    // create each recall
    const list = createElement('ul', { classes: `${blockName}__list` });
    recallsData.recalls.forEach((recall) => {
      const liEl = createElement('li', {
        classes: `${blockName}__list-item`,
      });

      // map the number from api to correct status
      recall.mfr_recall_status = recallStatus[recall.mfr_recall_status];

      const recallDetailsList = createElement('ul', { classes: `${blockName}__detail-list` });

      valueDisplayList.forEach((item) => {
        if (recall[item.key]) {
          const recallClass = item.key === 'mfr_recall_status' ? `${blockName}__${recall.mfr_recall_status.replace(/_/g, '-').toLowerCase()}` : '';
          let itemValue = recall[item.key];

          if (recallClass) {
            itemValue = getTextLabel(recall[item.key]);
          }

          const itemFragment = docRange.createContextualFragment(`<li class="${blockName}__detail-item ${item.class ? item.class : ''}" >
            <h5 class="${blockName}__detail-title"> ${getTextLabel(item.key)} </h5>
            <span class="${blockName}__detail-value ${recallClass}">${itemValue}</span>
          </li>`);
          recallDetailsList.append(...itemFragment.children);
        }
      });
      liEl.append(recallDetailsList);
      list.append(liEl);
    });

    blockEl.append(listWrapperFragment);
    blockEl.appendChild(list);
  } else {
    resultContent = `${resultContent} [${getTextLabel('recall_available_info')} ${recallsData.recalls_since}]`;
  }
  resultText.innerText = resultContent;
}

async function fetchRecalls(e) {
  e.preventDefault();
  if (e && e.target) {
    // disable submit while fetching data
    const submitBtn = e.target.querySelector('button');
    submitBtn.disabled = true;

    const recalls = document.querySelector(`.${blockName}__recalls-wrapper`);
    recalls.innerHTML = '';

    const resultText = document.querySelector(`.${blockName}__results-text`);
    resultText.innerText = getTextLabel('loading recalls');

    const formData = new FormData(e.target);
    const vin = formData.get('vin');

    if (vin) {
      try {
        const { url, key } = getAPIConfig();
        getJsonFromUrl(`${url}vin/${vin}?api_key=${key}&mode=company`).then((response) => {
          if (response.error_code) {
            resultText.innerHTML = `${getTextLabel('no recalls')} ${vin}`;
          } else {
            response.recalls.sort((a, b) => b.mfr_recall_status - a.mfr_recall_status || new Date(b.date) - new Date(a.date));
            renderRecalls(response);
          }

          const vinInput = document.querySelector('.vin-number__input');
          vinInput.value = '';
          submitBtn.disabled = false;
        });
      } catch (error) {
        console.error('Error fetching Recalls:', error);
      }
      return null;
    }
  }
  return null;
}

export default async function decorate(block) {
  const refreshDate = getStorageItem('refreshDate-MT') || '';
  const refresDateWrapper = createElement('div', {
    classes: `${blockName}__refresh-date-wrapper`,
  });
  const refreshFragment = docRange.createContextualFragment(`<span>
    ${getTextLabel('published_info')}:
    </span>
    <strong class="${blockName}__refresh-date">${refreshDate}</strong>
  `);

  const form = createElement('form', {
    classes: [`${blockName}__form`],
  });
  const formChildren = document.createRange().createContextualFragment(`
    <div class="${blockName}__input-wrapper">
      <input
        type="text"
        name="vin"
        id="vin_number"
        autocomplete="off"
        placeholder=" "
        minlength="17"
        maxlength="17"
        required
        class="${blockName}__input"
        pattern="^[1,4][M,m][1,2,4,5][A,G,L,P,T,M,a,g,l,p,t,m][A-Za-z0-9]{13}$"
      />
      <label for="vin_number" class="${blockName}__label">${getTextLabel('vinlabel')}</label>
    </div>
    <button class="button button--primary ${blockName}__submit" type="submit" name="submit">${getTextLabel('submit')}</button>
  `);

  const vinResultsContainer = createElement('div', { classes: `${blockName}__results-container` });
  const innerContent = docRange.createContextualFragment(`
    <span class="${blockName}__results-text"></span>
    <div class="${blockName}__recalls-wrapper"></div>
  `);

  vinResultsContainer.append(innerContent);

  form.addEventListener('submit', fetchRecalls, false);
  form.append(...formChildren.children);
  refresDateWrapper.append(...refreshFragment.children);
  block.append(form, refresDateWrapper);
  block.append(vinResultsContainer);

  const vinInput = block.querySelector(`.${blockName}__input`);

  vinInput.oninvalid = (e) => {
    e.target.setCustomValidity(getTextLabel('vinformat'));
  };

  vinInput.oninput = (e) => {
    e.target.setCustomValidity('');
  };

  if (!refreshDate) {
    fetchRefreshDate().then((response) => {
      const refreshEle = block.querySelector(`.${blockName}__refresh-date`);
      refreshEle.textContent = response;
    });
  }
}
