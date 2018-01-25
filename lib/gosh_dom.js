/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dom_node_collection__ = __webpack_require__(1);


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
        return new __WEBPACK_IMPORTED_MODULE_0__dom_node_collection__["a" /* default */]([arg]);
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
  return new __WEBPACK_IMPORTED_MODULE_0__dom_node_collection__["a" /* default */](nodesArray);
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class DOMNodeCollection {
  constructor(nodes) {
    this.nodes = nodes;
  }

  each(callback) {
    this.nodes.forEach(callback);
  }

  on(eventType, action) {
    this.each(node => {
      node.addEventListener(eventType, action);
      const eventKey = `goshDOMEvents-${eventType}`;
      if (typeof node[eventKey] === 'undefined') {
        node[eventKey] = [];
      }
      node[eventKey].push(action);
    });
  }

  off(eventType) {
    this.each(node => {
      const eventKey = `goshDOMEvents-${eventType}`;
      if (node[eventKey]) {
        node[eventKey].forEach(action => {
          node.removeEventListener(eventType, action)
        });
      }
      node[eventKey] = [];
    });
  }

  html(string) {
    if (!string) return this.nodes[0].innerHTML;
    this.nodes.map(el => (el.innerHTML += ` ${string}`))
  }

  empty() {
    this.nodes.map(el => (el.innerHTML = ""))
  }

  append(content) {
    if (typeof content === 'string') this.html(content);
    else if (content instanceof HTMLElement) this.append(content.outerHTML);
    else if (content instanceof DOMNodeCollection) {
      Object.values(content)[0].map(el => this.append(el))
    }
  }

  attr(attribute, value) {
    const matches = [];
    Object.values(this.nodes).filter(node => {
      if (node.getAttributeNames().includes(attribute)) {
        matches.push(node);
      }
    });
    if (!value && matches.length) return matches[0].getAttribute(attribute);
    matches.map(match => {
      let currentAttr = match.getAttribute(attribute)
      match.setAttribute(attribute, (currentAttr += ` ${value}`))
    });
    return matches;
  }

  addClass(className) {
    const classes = className.split(' ');
    classes.forEach(klass => this.attr('class', klass));
  }

  removeClass(className) {
    const remAll = (!className);
    this.each(node => {
      let classes = (remAll) ? node.getAttribute('class') : className;
      classes.split(' ').forEach(klass => node.classList.remove(klass));
    })
  }

  toggleClass(className) {
    this.each(node => node.classList.toggle(toggleClass))
  }

  children() {
    let childNodes = [];
    this.each(node => {
      childNodes = childNodes.concat(Array.from(node.children));
    })
    return $g(childNodes);
  }

  parent() {
    let parentNodes = [];
    this.each(node => {
      if (!parentNodes.includes(node.parentNode)) {
        parentNodes = parentNodes.concat(node.parentNode);
      }
    });
    return $g(parentNodes);
  }

  find(selector) {
    let found = [];
    this.each(node => {
      const nodeArray = Array.from(node.querySelectorAll(selector))
      found = found.concat(nodeArray);
    });
    return found;
  }

  remove() {
    this.each(node => $g(node).empty());
    this.parent().empty();
  }
}

/* harmony default export */ __webpack_exports__["a"] = (DOMNodeCollection);


/***/ })
/******/ ]);