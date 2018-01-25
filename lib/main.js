import DOMNodeCollection from './dom_node_collection';

const _onloadCallStack = [];
let _loaded = false;

window.$g = (arg) => {
  switch (typeof arg) {
    case 'function':
      (loaded) ? arg() : _onloadCallStack.push(arg);
    case 'string':
      return getNodesFromDOM(arg);
    case 'object':
      if (arg instanceof HTMLElement) {
        return new DOMNodeCollection([arg]);
      }
  }
};

$g.extend = (...objects) => Object.assign({}, ...objects);


$g.ajax = (options) => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    const defaults = {
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      method: 'GET',
      url: "",
      success: () => {},
      error: () => {},
      data: {},
    };
    options = $g.extend(defaults, options);
    options.method = options.method.toUpperCase();
    if (options.method === 'GET') {
      options.url += `${toQuery(options.data)}`;
      // options.url += `?${toQuery(options.data)}`;
    }

    request.open(options.method, options.url, true);
    request.onload = (e) => {
      if (request.status === 200) {
        options.success(request.response);
        resolve(request.response);
      } else {
        options.error(request.response);
        reject(request.response);
      }
    };
  request.send(JSON.stringify(options.data));
  });
};

document.addEventListener("DOMContentLoaded", () => {
  _loaded = true;
  _onloadCallStack.forEach(func => func());
});

const toQuery = (data) => {
  let result = "";
  for (let prop in data) {
    // if (data.hasOwnProperty(prop)) {
    //   result += `${prop}=${obj[prop]}&`;
    // }
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      result += `${prop}=${obj[prop]}&`;
    }
  }
  // return result.substring(0, result.length - 1);
  return result.slice(0, -2)
};

const getNodesFromDOM = (selector) => {
  const nodes = document.querySelectorAll(selector);
  const nodesArray = Array.from(nodes);
  return new DOMNodeCollection(nodesArray);
}
