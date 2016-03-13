'use babel';

import { CompositeDisposable } from 'atom';
import ConfigSchema from './config-schema';
import CSSLength from './css-length';
import ConverterView from './converter-view.js';

let subscriptions;
let converterView;
let converterPanel;

export default {
  config: ConfigSchema,
  activate() {
    subscriptions = new CompositeDisposable();
    converterView = new ConverterView();
    converterPanel = atom.workspace.addModalPanel({
      item: converterView.$el,
      visible: false
    });

    converterView.on('close', hideConverterPanel);
    converterView.on('submit', onConverterViewSubmit);

    subscriptions.add(atom.commands.add('atom-text-editor', {
      'atom-css-unit-converter:px-to-em': onCommand,
      'atom-css-unit-converter:px-to-rem': onCommand,
      'atom-css-unit-converter:em-to-px': onCommand,
      'atom-css-unit-converter:em-to-rem': onCommand,
      'atom-css-unit-converter:rem-to-px': onCommand,
      'atom-css-unit-converter:rem-to-em': onCommand,
      'atom-css-unit-converter:converter-ui': onCommand
    }));
  },
  deactivate() {
    subscriptions.dispose();
    converterPanel.destroy();
    converterView = null;
  }
};

function onCommand(event) {
  const editor = atom.workspace.getActiveTextEditor();
  const action = event.type.split(':')[1];

  if (editor) {
    if (action === 'converter-ui') {
      showConverterPanel(editor);
    } else {
      const [from, to] = action.split('-to-');

      convert({ editor, from, to });
    }
  }
}

function hideConverterPanel(editor) {
  converterPanel.hide();
  atom.views.getView(editor).focus();
  converterView.editor = null;
}

function showConverterPanel(editor) {
  converterPanel.show();
  converterView.editor = editor;
}

function onConverterViewSubmit(opts) {
  convert(opts);
}

function convert(opts) {
  const { editor } = opts;
  const config = {
    comments: atom.config.get('atom-css-unit-converter.comments'),
    decimalLength: atom.config.get('atom-css-unit-converter.decimalLength'),
    defaultBase: atom.config.get('atom-css-unit-converter.defaultBase'),
    leadingZero: atom.config.get('atom-css-unit-converter.leadingZero')
  };

  // loop through all selections and mutate them in one transaction
  editor.mutateSelectedText((selection, index) => {
    const scanner = new RegExp(`[+-]?[0-9\.]+${opts.from}`, 'gm');
    const rowMap = {};
    let selectionRange;
    let selectionRows;

    // select the whole line if the selection is empty
    if (selection.isEmpty()) {
      const selectionRow = selection.getBufferRange().getRows()[0];
      const selectionRowRange = editor.buffer.rangeForRow(selectionRow, false);

      selection.setBufferRange(selectionRowRange);
    }

    selectionRange = selection.getBufferRange();
    selectionRows = selectionRange.getRows();

    // go through the selection row by row, so any alterations don't affect
    // subsequent rows
    for (let i = 0, l = selectionRows.length; i < l; i++) {
      const row = selectionRows[i];
      const rowRange = editor.buffer.rangeForRow(row, false);
      const commentStack = [];
      let rowSelectedRange = rowRange.copy();

      // clip the beginning of rowSelectedRange by the start of the selection
      if (i === 0) {
        rowSelectedRange.start = selectionRange.start;
      }

      // clip the end of rowSelectedRange by the end of the selection
      if (i === (l - 1)) {
        rowSelectedRange.end = selectionRange.end;
      }

      // scan this row for length values to convert
      editor.scanInBufferRange(scanner, rowSelectedRange, (result) => {
        let cssLength;
        let cssLengthConversion;

        // if a base isn't cached for this row, then get the base and cache it
        if (!rowMap[row]) {
          rowMap[row] = {
            base: opts.base || config.defaultBase
          };

          // get the base definition at EOL and then remove it
          editor.backwardsScanInBufferRange(/\s*\/\s*([0-9\.]+)\s*$/, rowRange, (result) => {
            rowMap[row].base = +result.match[1];
            result.replace('');
            result.stop();
          });
        }

        cssLength = new CSSLength(result.matchText, {
          base: rowMap[row].base,
          formatter: getFormatter(config)
        });
        cssLengthConversion = cssLength[opts.to === '%' ? 'pct' : opts.to];

        commentStack.push(cssLengthConversion.conversion);
        result.replace(cssLengthConversion.result);
      });

      // if the user wants conversion comments, place them at EOL
      if (config.comments && commentStack.length) {
        const newRowRange = editor.buffer.rangeForRow(row, false);
        editor.buffer.insert(newRowRange.end, ` /* ${commentStack.join(', ')} */`);
      }
    }
  });
};

/**
 * Formats a CSS value based on user preferences.
 *
 * @param    {Number}  value   The value to format.
 * @param    {String}  toUnit  The unit for the value.
 *
 * @returns  {String}          The formatted value with unit.
 */
function getFormatter(config) {
  return function formatter(value, toUnit) {
    const decimal = String(value).split('.')[1];
    let formatted = value;

    // if the decimal length is longer than user preferences allow, round to the
    // defined length
    if (decimal) {
      if (decimal.length > config.decimalLength || toUnit == 'px') {
        formatted = +value.toFixed(toUnit === 'px' ? 1 : config.decimalLength);
      }
    }

    // if the user wants, round the decimal to the proper length for values < 1
    if (config.leadingZero === false) {
      formatted = String(formatted);

      if (value < 1) {
        formatted = formatted.replace(/^([-+])?0+/, '$1');
      }
    }

    return `${formatted + toUnit}`;
  }
}
