import { a, button, div, domEl, p, ul, li } from '../../scripts/scripts.js';
import { loadScript } from '../../scripts/aem.js';
import { getTextLabel } from '../../scripts/common.js';

const MQ = window.matchMedia('(min-width: 744px)');
const blockName = 'performance-specifications';

// TODO get all these to placeholder.json for translations
const TEXTS = {
  btnText: getTextLabel('SpecsCharts:DownloadButton'),
  engineRatings: getTextLabel('SpecsCharts:RatingLabels'),
  bottomChartLabel: getTextLabel('SpecsCharts:RPM'),
  facts: [
    [getTextLabel('SpecsCharts:PeakPower'), getTextLabel('SpecsCharts:NoData')],
    [getTextLabel('SpecsCharts:PeakPowerRPM'), getTextLabel('SpecsCharts:NoData')],
    [getTextLabel('MaxTorque'), getTextLabel('SpecsCharts:NoData')],
    [getTextLabel('MaxTorqueRPM'), getTextLabel('SpecsCharts:NoData')],
  ],
  noData: getTextLabel('SpecsCharts:NoData'),
};

const COLORS = {
  white: '#ffffff',
  chartLines: ['#b3976b', '#ffffff'],
  bgColor: '#1D1D1D',
  verticalLines: '#8e8e8e',
};

const rpmValues = [600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200];

/**
 * as multiple blocks might be on the same page, the data is accessed using they block node as the
 * key.
 *
 * @type {Map<HTMLElement, Record<string, CategoryData>>}>}
 */
const engineData = new Map();

// Selected engine doesn't have data available in the JSON file
const NoDataEngineDetail = {
  'download specs': null,
  facts: TEXTS.facts,
  model: TEXTS.noData,
  performanceData: {},
  series: TEXTS.noData,
  rpm: {},
};

const moveNavigationLine = (navigationLine, activeTab, tabNavigation) => {
  const { x: navigationX } = tabNavigation.getBoundingClientRect();
  const { x, width } = activeTab.getBoundingClientRect();
  Object.assign(navigationLine.style, {
    left: `${x + tabNavigation.scrollLeft - navigationX}px`,
    width: `${width}px`,
  });
};

const centerTab = (tabList, itemTab) => {
  const { clientWidth: itemWidth, offsetLeft } = itemTab;
  const scrollPosition = offsetLeft - (tabList.clientWidth - itemWidth) / 2;
  tabList.scrollTo({
    left: scrollPosition,
    behavior: 'smooth',
  });
};

/**
 * @param chartContainer {HTMLElement}
 * @param performanceData {Array<Array<string>>}
 */
const updateChart = async (chartContainer, engineDetails) => {
  const performanceData = engineDetails.performanceData;

  if (!window.echarts) {
    // delay by 3 seconds to ensure a good lighthouse score

    await new Promise((resolve) => setTimeout(resolve, 3000));

    // custom small bundle created on https://echarts.apache.org/en/builder.html
    await loadScript('/common/echarts-5.4.2/echarts.custom.only-linecharts.min.js');
  }

  const chartHeight = () => ({
    height: MQ.matches ? 540 : 480,
  });

  let myChart = window.echarts.getInstanceByDom(chartContainer);
  if (!myChart) {
    myChart = window.echarts.init(chartContainer, 'dark', chartHeight());
    window.addEventListener('resize', () => {
      myChart.resize(chartHeight());
      if (!myChart.isDisposed()) {
        myChart.resize();
      }
    });
  }

  const getEchartsSeries = () => {
    const metrics = Object.keys(performanceData);
    const series = metrics.map((title, idx) => {
      const metricValues = Object.entries(performanceData[title]).map(([rpm, value]) => [Number(rpm), Number(value)]);

      return {
        type: 'line',
        name: title.toUpperCase(),
        yAxisIndex: idx,
        symbolSize: 12,
        itemStyle: {
          borderWidth: 1,
          borderType: 'solid',
          borderColor: COLORS.bgColor,
        },
        smooth: false,
        data: metricValues,
      };
    });

    return series;
  };

  const option = {
    legend: {
      icon: 'circle',
      fontFamily: 'Inter 75 Bold',
      top: 'top',
      left: MQ.matches ? 'auto' : '0',
      right: MQ.matches ? '0' : 'auto',
      itemHeight: 25,
      itemGap: MQ.matches ? 50 : 10,
      selectedMode: false,
      textStyle: {
        fontSize: 12,
        lineHeight: 15,
        fontWeight: 700,
        color: COLORS.white,
      },
    },

    series: getEchartsSeries(),
    // Global palette:
    color: COLORS.chartLines,
    backgroundColor: COLORS.bgColor,
    //  reduce space around the chart
    grid: {
      left: '0',
      right: '0',
      top: '80',
      containLabel: true,
    },
    textStyle: {
      color: COLORS.white,
    },
    xAxis: {
      min: rpmValues.at(0),
      max: rpmValues.at(-1),
      interval: 200,
      type: 'value',

      // label center bellow chart
      name: TEXTS.bottomChartLabel,
      nameGap: 40,
      nameLocation: 'center',
      nameTextStyle: {
        fontSize: 15,
        fontWeight: 'bold',
      },

      // use lines at each 100 RPM
      splitLine: {
        show: true,
        lineStyle: {
          color: COLORS.verticalLines,
          width: 1,
        },
      },
      minorSplitLine: {
        show: true,
        lineStyle: {
          color: COLORS.verticalLines,
          width: 1,
        },
      },
      axisTick: {
        show: false,
      },
      minorTick: {
        show: false,
        splitNumber: 2,
      },
      axisLabel: {
        show: true,
        interval: 0,
        showMinLabel: true,
        showMaxLabel: true,
        formatter(value) {
          // remove thousands separator
          return value;
        },
        margin: 15,
      },
      axisLine: {
        show: false,
      },
    },
    yAxis: [
      {
        // torque values
        type: 'value',
        position: 'left',
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          formatter(value) {
            // remove thousands separator
            return value;
          },
          margin: 20,
        },
        splitLine: {
          show: false,
        },
        min: 0,
        max: 2000,
        interval: 200,
      },
      {
        // power values
        type: 'value',
        position: 'right',
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          formatter(value) {
            // remove thousands separator
            return value;
          },
          margin: 20,
        },
        splitLine: {
          show: false,
        },
        min: 0,
        max: 600,
        interval: 50,
      },
    ],
    animation: true,
    animationDuration: 400,
  };

  myChart.setOption(option, {
    // https://github.com/apache/echarts/issues/6202
    notMerge: true,
  });
};

/**
 * @typedef {Object} EngineDetail
 * @property {Array<Array<string>>} facts
 * @property {Object<string, Object<number, number>>} performanceData
 */
const renderEngineSpecs = (engineDetails) => {
  const factsDownloadSpecs = engineDetails.facts.filter((fact) => fact[0] === 'download specs')[0]?.[1] || null;
  // remove download specs from facts
  if (factsDownloadSpecs) {
    engineDetails.facts = engineDetails.facts.filter((fact) => fact[0] !== 'download specs');
  }
  const downloadSpecs = factsDownloadSpecs || engineDetails['download specs'] || null;
  // check if the download specs share the same domain as the current page
  const isSameDomain = downloadSpecs && downloadSpecs.includes(window.location.origin);
  const specsLink = downloadSpecs && new URL(downloadSpecs);
  if (downloadSpecs && !isSameDomain) {
    specsLink.hostname = window.location.hostname;
    specsLink.protocol = window.location.protocol;
    if (window.location.port) {
      specsLink.port = window.location.port;
    }
  }

  // noinspection JSCheckFunctionSignatures
  return div(
    { class: 'key-specs' },
    domEl('dl', {}, ...engineDetails.facts.map((cells) => [domEl('dt', cells[0]), domEl('dd', cells[1])]).flat()),
    p(
      { class: 'button-container' },
      a(
        {
          class: 'button button--primary download-specs',
          href: downloadSpecs ? specsLink.toString() : '#',
          target: '_blank',
          style: `display: ${downloadSpecs ? 'block' : 'none'};`,
        },
        TEXTS.btnText,
      ),
    ),
  );
};

const refreshDetailView = (block) => {
  const { categoryId } = block.querySelector('.category-tablist button[aria-selected="true"]')?.dataset || null;
  const engineId = block.querySelector('.engine-tablist button[aria-selected="true"]')?.textContent || null;
  const engineDetail = engineData.get(block)[categoryId]?.engines[engineId];
  const engineDetails = engineDetail || NoDataEngineDetail || {};

  // replace key specs
  block.querySelector('.key-specs').replaceWith(renderEngineSpecs(engineDetails));

  // update chart
  const chartContainer = block.querySelector('.performance-chart');
  // noinspection JSIgnoredPromiseFromCall
  updateChart(chartContainer, engineDetails);
};

const renderCategoryDetail = (block, categoryData, selectEngineId = null) => {
  const categoryDetails = div({ class: 'category-detail' });
  categoryDetails.innerHTML = `
    <h3>${categoryData.nameHTML}</h3>
    ${categoryData.descriptionHTML ? `<p class="category-description">${categoryData.descriptionHTML}</p>` : ''}
    <div class="engine-navigation">
      <p class="engine-ratings">${TEXTS.engineRatings}</p>
      <div class="engine-tablist" role="tablist" aria-label="${TEXTS.engineRatings}"> </div>
    </div>`;

  const tabList = categoryDetails.querySelector('.engine-tablist');

  if (Object.keys(categoryData.engines).length === 0) {
    categoryData.engines = { 'No Data': NoDataEngineDetail };
  }

  Object.keys(categoryData.engines).forEach((engineId, index) => {
    const isSelected = selectEngineId ? engineId === selectEngineId : index === 0;
    const engineButton = button({ role: 'tab', 'aria-selected': isSelected }, engineId);

    engineButton.addEventListener('click', () => {
      // ignore click if already selected
      if (engineButton.getAttribute('aria-selected') === 'true') {
        return;
      }

      // Remove selection from currently selected tabs and set this tab as selected
      tabList.querySelectorAll('[aria-selected="true"]').forEach((tab) => tab.setAttribute('aria-selected', false));
      engineButton.setAttribute('aria-selected', true);

      centerTab(tabList, engineButton);

      refreshDetailView(block);
    });
    tabList.append(engineButton);
  });

  return categoryDetails;
};

const tabListClickHandler = ({ ...params }) => {
  const { tabList, activeLine, block } = params;
  tabList.addEventListener('click', (e) => {
    const isIcon = e.target.parentElement.tagName === 'BUTTON';
    const isButton = e.target.tagName === 'BUTTON' || isIcon;
    const isActiveBtn = e.target.getAttribute('aria-selected') === 'true';
    if (!isButton || isActiveBtn) {
      return;
    }

    const buttonTab = isIcon ? e.target.parentElement : e.target;
    const activeTab = tabList.querySelectorAll('.active');
    [...activeTab].forEach((tab) => {
      tab.classList.remove('active');
      tab.firstElementChild.setAttribute('aria-selected', false);
    });
    buttonTab.setAttribute('aria-selected', true);
    buttonTab.parentElement.classList.add('active');

    moveNavigationLine(activeLine, buttonTab, tabList);
    if (!MQ.matches) {
      centerTab(tabList, buttonTab.parentElement);
    }

    block.querySelector('.category-detail').replaceWith(renderCategoryDetail(block, engineData.get(block)[buttonTab.dataset.categoryId]));

    refreshDetailView(block);
  });
};

const tabListHoverHandler = ({ ...params }) => {
  const { tabList, activeLine } = params;
  tabList.addEventListener('mouseover', (e) => {
    const isButton = e.target.tagName === 'BUTTON';
    if (!isButton) {
      return;
    }
    moveNavigationLine(activeLine, e.target, tabList);
  });
};

const renderCategoryTabList = ({ block, categoryData, activeCategory }) => {
  const tabListWrapper = div({ class: 'category-tablist-wrapper' });
  const tabList = ul({ role: 'tablist', class: 'category-tablist' });
  const activeLine = li({ class: 'active-line' });

  Object.keys(categoryData).forEach((categoryId) => {
    const isActive = categoryId === activeCategory;
    const { nameHTML } = categoryData[categoryId];
    const tabItem = li({ class: `category-tab${isActive ? ' active' : ''}` });
    const tabButton = button({
      class: 'tab',
      role: 'tab',
      'aria-selected': isActive,
      'data-category-id': categoryId,
    });
    tabButton.innerHTML = nameHTML;
    tabItem.append(tabButton);
    tabList.append(tabItem);
  });
  tabList.append(activeLine);
  tabListWrapper.append(tabList);

  tabListClickHandler({ tabList, activeLine, block });
  tabListHoverHandler({ tabList, activeLine });

  return tabListWrapper;
};

/**
 * converts the rows into columns, and vice versa.
 * @return {Object<string, string[]>}
 */
const transposeTable = (data) => {
  const newData = {};
  data.forEach((row) => {
    const label = row.ID.toLowerCase().trim();
    for (const modelId in row) {
      if (modelId !== 'ID') {
        if (!newData[modelId]) {
          newData[modelId] = [];
        }
        newData[modelId].push([label, row[modelId]]);
      }
    }
  });
  return newData;
};

const parseEngineJsonData = (data, block) => {
  // need to convert because the Excel sheet is column based and the JSON API returns rows.
  const rows = transposeTable(data);
  Object.values(rows).forEach((modelArray) => {
    const engine = { facts: [], performanceData: {} };
    let metricName = null;
    // extract RPM data into engine.performanceData. The rows after the key `rpm`
    // are the performance data. They value of the RPM row contains the metric name.
    for (const [key, value] of modelArray) {
      if (key === 'rpm') {
        metricName = value;
      } else if (key === 'model' || key === 'series' || key === 'download specs') {
        engine[key] = value;
      } else if (metricName !== null) {
        // handle performance data
        if (!engine.performanceData[metricName]) {
          engine.performanceData[metricName] = {};
        }
        const rpmValue = Number(key);
        engine.performanceData[metricName][rpmValue] = Number(value);
      } else {
        engine.facts.push([key, value]);
      }
    }

    // remove empty performance data
    Object.keys(engine.performanceData).forEach((key) => {
      if (Object.values(engine.performanceData[key])[0] === 0 && Object.values(engine.performanceData[key])[1] === 0) {
        delete engine.performanceData[key];
      }
    });

    const categoryId = engine.series.replaceAll('®', '').toLowerCase().trim();
    if (!engineData.get(block)[categoryId]) {
      console.error(
        `The engine type ${categoryId} was used in Excel, but the not defined in the Engine-Specifications block. Please update the block used on this page.`,
      );
      // create empty object to prevent errors
      engineData.get(block)[categoryId] = { engines: {}, nameHTML: engine.series, descriptionHTML: '' };
    }
    engineData.get(block)[categoryId].engines[engine.model] = engine;
  });
};

export default async function decorate(block) {
  const blockSection = block.closest('.section');
  const sectionTitle = blockSection.querySelector('h2');
  if (sectionTitle) {
    sectionTitle.classList.add(`${blockName}__section-title`);
  }
  engineData.set(block, {});

  let jsonUrl;
  // load categories  data
  [...block.children].forEach((rawTabHeader) => {
    // any first cell that contains a link is the json url
    if (rawTabHeader.children[0].querySelector('a')) {
      jsonUrl = rawTabHeader.children[0].querySelector('a').getAttribute('href');
      return;
    }
    const categoryId = rawTabHeader.children[0].textContent.replaceAll('®', '').toLowerCase().trim();
    engineData.get(block)[categoryId] = {
      nameHTML: rawTabHeader.children[0].innerHTML,
      descriptionHTML: rawTabHeader.children[1].innerHTML,
      engines: {},
    };
  });
  [...block.children].forEach((node) => node.remove());

  // load data
  const response = await fetch(jsonUrl);
  const result = await response.json();
  parseEngineJsonData(result.data, block);

  const initialCategoryId = Object.keys(engineData.get(block))[0];
  const initialEngineId = Object.keys(engineData.get(block)[initialCategoryId].engines)[0];

  // add tabs
  block.append(
    renderCategoryTabList({
      block,
      categoryData: engineData.get(block),
      activeCategory: initialCategoryId,
    }),
  );

  // Render the navigation line below the active tab when the section is loaded
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type !== 'attributes') {
        return;
      }
      const { sectionStatus } = mutation.target.dataset;
      if (sectionStatus !== 'loaded') {
        return;
      }
      const tabList = block.querySelector('.category-tablist');
      const tabLine = block.querySelector('.active-line');
      moveNavigationLine(tabLine, tabList.querySelector('.active'), tabList);
      observer.disconnect();
    });
  });

  observer.observe(blockSection, { attributes: true, attributeFilter: ['data-section-status'] });

  // add category details and engine selection ("XY HP")
  block.append(renderCategoryDetail(block, engineData.get(block)[initialCategoryId], initialEngineId));

  // Add detail panel with facts and chart
  const engineDetails = engineData.get(block)[initialCategoryId].engines[initialEngineId];
  const detailPanel = div(
    { class: 'details-panel' },
    renderEngineSpecs(engineDetails),
    div({ class: 'performance-chart' }, div({ class: 'loading-spinner' })),
  );
  block.append(detailPanel);

  const chartContainer = block.querySelector('.performance-chart');
  // noinspection JSIgnoredPromiseFromCall,ES6MissingAwait
  updateChart(chartContainer, engineDetails);
}
