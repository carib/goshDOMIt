import DOMNodeCollection from './dom_node_collection';

window.$g = (arg) => {
  if (typeof arg === 'string') return getNodesFromDOM(arg);
  if (arg instanceof HTMLElement) arg = [arg];
  return new DOMNodeCollection(arg);
};

const getNodesFromDOM = (selector) => {
  const nodes = document.querySelectorAll(selector);
  const nodesArray = Array.from(nodes);
  return new DOMNodeCollection(nodesArray);
}
