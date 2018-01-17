import DOMNodeCollection from './dom_node_collection';

window.$g = (arg) => {
  switch (typeof arg) {
    case 'string':
      return getNodesFromDOM(arg);
    case 'object':
      if (arg instanceof HTMLElement) {
        return new DOMNodeCollection([arg]);
      }
  }
};

const getNodesFromDOM = (selector) => {
  const nodes = document.querySelectorAll(selector);
  const nodesArray = Array.from(nodes);
  return new DOMNodeCollection(nodesArray);
}
