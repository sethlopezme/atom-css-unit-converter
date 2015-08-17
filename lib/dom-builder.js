'use babel';

import { TextEditorView } from 'atom-space-pen-views';

const defaults = {
  prefix: 'db-'
};

function extend (target, source) {
  const a = Object.create(target);

  Object.keys(source).map(function (prop) {
    prop in a && (a[prop] = source[prop]);
  });

  return a;
};

// We don't need no stinking "space-pen" package...
export default class DOMBuilder {
  constructor(opts = {}) {
    this.config = extend(defaults, opts);
  }

  create(type, opts = {}, ...children) {
    let element;

    if (type === 'fragment') {
      element = document.createDocumentFragment();
    } else {
      element = document.createElement(type);
    }

    // apply classes
    if (opts.classes) {
      element.className = opts.classes;
    }

    // apply attributes
    if (opts.attributes) {
      for (let prop in opts.attributes) {
        if (opts.attributes.hasOwnProperty(prop)) {
          element.setAttribute(prop, opts.attributes[prop]);
        }
      }
    }

    // apply properties
    if (opts.setProps) {
      for (let prop in opts.setProps) {
        if (opts.setProps.hasOwnProperty(prop)) {
          element[prop] = opts.setProps[prop];
        }
      }
    }

    // append children
    for (let i = 0, child; (child = children[i++]);) {
      element.appendChild(child);
    }

    return element;
  }

  textNode(text) {
    return document.createTextNode(text);
  }

  fragment(...children) {
    return this.create('fragment', {}, ...children);
  }

  div(opts, ...children) {
    return this.create('div', opts, ...children);
  }

  block(opts, ...children) {
    opts.classes = opts.classes || '';
    opts.classes += ' block';

    return this.div(opts, ...children);
  }

  span(opts, ...children) {
    return this.create('span', opts, ...children);
  }

  label(opts, ...children) {
    return this.create('label', opts, ...children);
  }

  input(opts) {
    const editorOpts = {
      mini: true,
      placeholderText: opts.placeholderText,
      attributes: opts.attributes
    };
    const editor = new TextEditorView(editorOpts);

    if (opts.text && opts.text.constructor === String) {
      editor.setText(opts.text);
    }

    return editor;
  }

  select(opts, ...children) {
    return this.create('select', opts, ...children);
  }

  option(opts, child) {
    return this.create('option', opts, child);
  }

  button(opts, ...children) {
    opts.classes = opts.classes || '';
    opts.classes += ' btn';

    return this.create('button', opts, ...children);
  }

  buttonGroup(opts, ...children) {
    opts.classes = opts.classes || '';
    opts.classes += ' btn-group';

    return this.div(opts, ...children);
  }
}
