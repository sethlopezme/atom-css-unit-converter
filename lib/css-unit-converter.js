'use babel';

import { CompositeDisposable } from 'atom';
import config from './config';

let subscriptions;

export default class CSSUnitConverter {
  constructor() {
    this.config = config;
  }

  activate() {
    subscriptions = new CompositeDisposable();

    subscriptions.add(atom.commands.add('atom-text-editor', {
      'css-unit-converter:pixels-to-ems': this.convert,
      'css-unit-converter:pixels-to-rems': this.convert
    }));
  }

  convert(event) {
    const [, action] = event.type.split(':');
    const editor = atom.workspace.getActiveTextEditor();

    if (editor) {
      let selections = editor.getSelections();

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
                replacement = pixelsToUnit(match, 'em');
              }

              break;
            case 'pixels-to-rems':
              if (/([0-9]+)px/i.test(match[2])) {
                replacement = pixelsToUnit(match, 'rem');
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
  }
}

function pixelsToUnit([match, property, value, contextString, context], unit) {
  const conversionComments = atom.config.get('css-unit-converter.conversionComments');
  const decimalLength = atom.config.get('css-unit-converter.decimalLength');
  const stripLineHeightUnits = atom.config.get('css-unit-converter.stripLineHeightUnits');
  const replacementContext = context || atom.config.get('css-unit-converter.defaultPixelContext');
  const conversions = [];
  const newValue = value.replace(/([0-9]+)px/gi, (match, p1) => {
    let conversion = +p1 / replacementContext;

    conversions.push(`${+p1}/${replacementContext}`);

    if (conversion % 1) {
      conversion = conversion.toFixed(decimalLength);
    }

    return `${+conversion}${stripLineHeightUnits && property === 'line-height' ? '' : unit}`;
  });

  let result = match.replace(value, newValue);

  if (conversionComments) {
    let comment = ` /* ${conversions.join(', ')} */`;

    if (contextString) {
      result = result.replace(contextString, '');
    }

    result += comment;
  }

  return result;
}
