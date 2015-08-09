'use babel';

import { CompositeDisposable } from 'atom';
import ConfigSchema from './config-schema';

let subscriptions;

export const config = ConfigSchema;

export function activate() {
  subscriptions = new CompositeDisposable();

  subscriptions.add(atom.commands.add('atom-text-editor', {
    'atom-css-unit-converter:pixels-to-ems': convert,
    'atom-css-unit-converter:pixels-to-percents': convert,
    'atom-css-unit-converter:pixels-to-points': convert,
    'atom-css-unit-converter:pixels-to-rems': convert
  }));
};

export function convert(event) {
  const [, action] = event.type.split(':');
  const editor = atom.workspace.getActiveTextEditor();

  if (editor) {
    const config = {
      comments: atom.config.get('atom-css-unit-converter.comments'),
      decimalLength: atom.config.get('atom-css-unit-converter.decimalLength'),
      lineHeightUnits: atom.config.get('atom-css-unit-converter.lineHeightUnits'),
      defaultBase: atom.config.get('atom-css-unit-converter.defaultBase')
    };
    const selections = editor.getSelections();

    // loop through the selections and perform the edits
    for (let i = 0, selection; (selection = selections[i++]);) {
      const editor = selection.editor;

      if (selection.isEmpty()) {
        selection.expandOverLine();
      }

      editor.scanInBufferRange(/([a-z-]+):\s*(.+);(\s*\/\s*([0-9]+)\s*)?$/gm, selection.getBufferRange(), ({ match, replace }) => {
        let replacement;

        switch (action) {
          case 'pixels-to-ems':
            if (/([0-9]+)px/i.test(match[2])) {
              replacement = pixelsToUnit(config, match, 'em');
            }

            break;
          case 'pixels-to-percents':
            if (/([0-9]+)px/i.test(match[2])) {
              replacement = pixelsToUnit(config, match, '%');
            }

            break;
          case 'pixels-to-points':
            if (/([0-9]+)px/i.test(match[2])) {
              replacement = pixelsToUnit(config, match, 'pt');
            }

            break;
          case 'pixels-to-rems':
            if (/([0-9]+)px/i.test(match[2])) {
              replacement = pixelsToUnit(config, match, 'rem');
            }

            break;
          // do nothing
          default:
            break;
        }

        if (replacement) {
          replace(replacement);
        }
      });
    }
  }
};

function pixelsToUnit(config, match, unit) {
  const [fullMatch, property, value, eolBaseDefinition, eolBase] = match;
  const conversions = [];
  let base, newValue, result;

  // set the base according to the unit
  if (unit === 'pt') {
    base = .75;
  } else {
    base = eolBase || config.defaultBase;
  }

  // replace pixel values with the appropriate unit value
  newValue = value.replace(/([0-9]+)px/gi, (match, value) => {
    let conversion;

    // push this conversion onto the conversions stack for commenting
    conversions.push(`${value}/${base}`);

    // set the math according to the unit
    switch (unit) {
      case '%':
        conversion = +value / base * 100;
        break;
      case 'pt':
        conversion = +value * base;
        break;
      default:
        conversion = +value / base;
        break;
    }

    // if conversion is a float, limit the number of digits
    if (conversion % 1) {
      conversion = conversion.toFixed(config.decimalLength);
    }

    // omit the unit if the user has chosen to do so
    return (!config.lineHeightUnits && property === 'line-height') ? `${+conversion}` : `${+conversion}${unit}`;
  });

  // remove the EOL base definition so it doesn't stick around
  result = fullMatch.replace(eolBaseDefinition, '');

  // insert conversion comments if the user has chosen to do so
  if (config.comments) {
    result += ` /* ${conversions.join(', ')} */`;
  }

  return result.replace(value, newValue);
}
