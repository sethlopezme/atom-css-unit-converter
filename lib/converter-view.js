'use babel';

import EventEmitter from 'events';
import DOMBuilder from './dom-builder';

const $ = new DOMBuilder();
const options = [
  { text: 'Centimeters (cm)', value: 'cm' },
  { text: 'Ems (em)', value: 'em' },
  { text: 'Inches (in)', value: 'in' },
  { text: 'Millimeters (mm)', value: 'mm' },
  { text: 'Picas (pc)', value: 'pc' },
  { text: 'Percents (%)', value: '%' },
  { text: 'Points (pt)', value: 'pt' },
  { text: 'Pixels (px)', value: 'px' },
  { text: 'Rems (rem)', value: 'rem' }
];
let blurTimer;

export default class ConverterView extends EventEmitter {
  constructor() {
    super();

    this.data = {
      editor: null,
      from: options[0].value,
      to: options[1].value,
      base: atom.config.get('atom-css-unit-converter.defaultBase')
    };

    this.$el = $.div({ classes: 'atom-css-unit-converter', attributes: { tabindex: 0 } },
      $.div({ classes: 'panel-heading' }, $.textNode('Atom CSS Unit Converter')),
      $.div({ classes: 'panel-body padded' },
        $.block({ classes: 'unit-selects' },
          $.block({ classes: 'unit-from' },
            $.label({}, $.textNode('Convert from...')),
            (this.$from = $.select({ classes: 'form-control' },
              createOptionsFromArray(options)
            ))
          ),
          $.block({ classes: 'unit-to' },
            $.label({}, $.textNode('Convert to...')),
            (this.$to = $.select({ classes: 'form-control' },
              createOptionsFromArray(options, options[0].value)
            ))
          )
        ),
        $.block({ classes: 'unit-base' },
          $.label({}, $.textNode('Pixel Base')),
          (this.$base = $.input({ placeholderText: 'Pixel Base', text: String(this.data.base) }))[0]
        ),
        $.block({ classes: 'actions text-right' },
          (this.$cancel = $.button({ classes: 'inline-block' }, $.textNode('Cancel'))),
          (this.$submit = $.button({ classes: 'btn-primary inline-block' }, $.textNode('Convert!')))
        )
      )
    );

    // add event listeners
    this.$el.addEventListener('keydown', this.onKeydown.bind(this));

    this.$from.addEventListener('change', this.onChangeFrom.bind(this));
    this.$to.addEventListener('change', this.onChangeTo.bind(this));

    this.$base.model.onDidChange(this.onChangeBase.bind(this));

    this.$cancel.addEventListener('click', this.onCancel.bind(this));
    this.$submit.addEventListener('click', this.onSubmit.bind(this));
  }

  destroy() {
    this.$el.remove();
  }

  set editor(editor = null) {
    this.data.editor = editor || null;
  }

  onKeydown(event) {
    if (event.which === 27) {
      this.close();
    }
  }

  onChangeFrom() {
    this.data.from = this.$from.value;
    this.data.to = options[0].value;
    this.$to.options.length = 0;
    this.$to.appendChild(createOptionsFromArray(options, { value: this.data.from }));
    this.$submit.disabled = !this.validate();
  }

  onChangeTo() {
    this.data.to = this.$to.value;
    this.$submit.disabled = !this.validate();
  }

  onChangeBase() {
    this.data.base = this.$base.model.getText();
    this.$submit.disabled = !this.validate();
  }

  onCancel() {
    this.close();
  }

  onSubmit() {
    if (this.validate()) {
      this.emit('submit', this.data);
      this.close();
    }
  }

  close() {
    this.emit('close', this.data.editor);
  }

  validate() {
    if (this.data.editor === null) {
      return false;
    }

    if (this.data.from === this.data.to) {
      return false;
    }

    if (!+this.data.base) {
      return false;
    }

    return true;
  }
}

function createOptionsFromArray(data, exclude) {
  const options = document.createDocumentFragment();
  let option;

  for (let i = 0, datum; (datum = data[i++]);) {
    if (exclude !== datum.value) {
      option = $.option({
        setProps: {
          selected: i === 0,
          value: datum.value
        }
      }, $.textNode(datum.text));

      options.appendChild(option);
    }
  }

  return options;
}
