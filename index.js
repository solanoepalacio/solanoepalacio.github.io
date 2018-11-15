'use strict'

const svgNs = 'http://www.w3.org/2000/svg';

function adjustSvgProps () {
  const parentWidth = document.querySelector('.history-element').offsetWidth;
  const lineContainers = document.querySelectorAll('.line-container');
  lineContainers.forEach((cnt, i) => {
    cnt.innerHTML = '';
    
    const svgContainer = document.createElementNS(svgNs, 'svg');
    svgContainer.setAttribute('width', parentWidth);
    const group = document.createElementNS(svgNs, 'g');

    const isLeftSided = window.innerWidth >= 1025 && i % 2 > 0;

    const mask = getMask(parentWidth, isLeftSided);
    cnt.appendChild(mask);
    
    const lines = getLines(parentWidth, isLeftSided);
    lines.forEach(line => {
      line.setAttribute('class', 'line');
      group.appendChild(line);
    });

    svgContainer.appendChild(group);
    cnt.appendChild(svgContainer);
  });
}

function getMask (width, isLeft) {
  const maskElement = document.createElement('div');

  maskElement.classList.add('mask');

  if (isLeft) {
    maskElement.classList.add('mask-left');
  } else {
    maskElement.classList.add('mask-right');
  }

  return maskElement;
}

function getLines (svgWidth, mirror) {
  return [
    getDiagonal(svgWidth, mirror),
    getHzLine(svgWidth, mirror)
  ]
}

function getDiagonal (svgWidth, mirror) {
  const attributes = {
    x1: 42,
    x2: 110,
    y1: 45,
    y2: 3,
    'stroke-width': 3
  }

  if (mirror) {
    attributes.x1 = svgWidth - attributes.x1;
    attributes.x2 = svgWidth - attributes.x2;
  }
  const line = document.createElementNS(svgNs, 'line');
  Object.keys(attributes).forEach((name) => {
    line.setAttribute(name, attributes[name]);
  });

  return line;
}

function getHzLine (svgWidth, mirror) {
  const attributes = {
    x1: 109,
    x2: svgWidth,
    y1: 3,
    y2: 3,
    'stroke-width': 3
  }
  if (mirror) {
    console.log('mirroring')
    attributes.x1 = 0;
    attributes.x2 = svgWidth - 109;
  }

  const line = document.createElementNS(svgNs, 'line');
  Object.keys(attributes).forEach((name) => {
    line.setAttribute(name, attributes[name]);
  });
  return line;
}

window.onload = adjustSvgProps;

window.addEventListener('resize', adjustSvgProps);

const unrenderedElements = document.querySelectorAll('.scrollable')
window.addEventListener('scroll', function () {
  let lastOffset = 0
  unrenderedElements.forEach((element) => {
    if (element.classList.contains('active')) {
      return
    }

    const { top } = element.getBoundingClientRect()
    const windowBottomOffset = top - window.innerHeight
    if (windowBottomOffset <= - 72) {

      const currentOffset = element.offsetTop
      const segmentHeight = currentOffset - lastOffset
      lastOffset += currentOffset

      const segment = element.querySelector('.segment')
      if (segment) {
        segment.style.top = -segmentHeight + 100
        segment.style.height = segmentHeight - 70
      }

      element.classList.add('active')
    }
  })
});

const timestamp = new Date();
const host = 'https://cwl7d2cqd7.execute-api.us-west-2.amazonaws.com/default/cvtracker';

const onunload = () => {
  if (!window.navigator || !window.navigator.sendBeacon) {
    return;
  }
  const { sendBeacon, language, platform } = window.navigator;
  const navigator = window.navigator.appCodeName;
  
  const params = {
    language,
    platform,
    navigator,
    timestamp: timestamp.toJSON(),
    sessionDuration: new Date().getTime() - timestamp.getTime()
  };

  const queryString = Object.keys(params).reduce(
    (acc, key, index) => {
      if (index !== 0) {
        acc += '&';
      }
      acc += `${key}=${params[key]}`;
      return acc;
    },
    '?'
  );
  window.navigator.sendBeacon(`${host}?${queryString}`);
}



function updateActiveList (list, name) {
  list.forEach((tab) => {
    if (
      !tab.classList.contains(name) &&
      tab.classList.contains('active')
    ) {
      tab.classList.remove('active');
    }
    
    if (
      tab.classList.contains(name) &&
      !tab.classList.contains('active')
    ) {
      tab.classList.add('active');
    }
  });
}

const tabs = document.querySelectorAll('.tab');
const contexts = document.querySelectorAll('.context');
tabs.forEach((tab) => {
  const tagName = tab.classList.contains('uiux') ? 'uiux' : 'serverside';
  tab.addEventListener('click', (e) => {
    updateActiveList(tabs, tagName);
    updateActiveList(contexts, tagName)
  });
});

window.onunload = onunload;
