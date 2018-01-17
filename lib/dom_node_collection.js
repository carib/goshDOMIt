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

export default DOMNodeCollection;
