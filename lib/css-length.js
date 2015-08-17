'use babel';

function extend (target, source) {
  const a = Object.create(target);

  Object.keys(source).map(function (prop) {
    prop in a && (a[prop] = source[prop]);
  });

  return a;
};

function percentToPx(value, base) { return value / 100 * base; }
function pxToPercent(value, base) { return value / base * 100; }

function absoluteToPx(value, base) { return value / base; }
function pxToAbsolute(value, base) { return value * base; }

function relativeToPx(value, base) { return value * base; }
function pxToRelative(value, base) { return value / base; }

// map units to the appropriate conversion functions for easier calling
const conversions = {
  cm: { from: absoluteToPx, to: pxToAbsolute },
  em: { from: relativeToPx, to: pxToRelative },
  in: { from: absoluteToPx, to: pxToAbsolute },
  mm: { from: absoluteToPx, to: pxToAbsolute },
  pc: { from: absoluteToPx, to: pxToAbsolute },
  pct: { from: percentToPx, to: pxToPercent },
  pt: { from: absoluteToPx, to: pxToAbsolute },
  px: { from: absoluteToPx, to: pxToAbsolute },
  rem: { from: relativeToPx, to: pxToRelative }
};
const absoluteBases = {
  cm: 2.54 / 96,
  in: 1 / 96,
  mm: 25.4 / 96,
  pc: 6 / 96,
  pt: 72 / 96
};
const absoluteUnits = Object.keys(absoluteBases);
const defaults = {
  base: 16,
  formatter(value) {
    return value;
  }
};

/**
 * @class CSSLength
 *
 * Represents a CSS length value and handles the conversion between the original
 * unit and other calculable units.
 */
export default class CSSLength {
  constructor(raw, options = {}) {
    const [, value, unit] = raw.match(/^([+-]?[0-9\.]+)(cm|em|in|mm|pc|%|pt|px|rem)$/);

    this.$config = extend(defaults, options);
    this.$raw = raw;
    this.$value = +value;
    this.$unit = unit;

    // override the base if the length is an absolute unit
    if (absoluteUnits.indexOf(this.$unit) > -1) {
      this.$config.base = absoluteBases[this.$unit];
    }
  }

  get cm() { return this.convert('cm'); }
  get em() { return this.convert('em'); }
  get in() { return this.convert('in'); }
  get mm() { return this.convert('mm'); }
  get pc() { return this.convert('pc'); }
  get pct() { return this.convert('%'); }
  get pt() { return this.convert('pt'); }
  get px() { return this.convert('px'); }
  get rem() { return this.convert('rem'); }

  /**
   * Converts the CSS length to a given unit.
   *
   * @param    {String}  toUnit  The destination unit for the original value.
   * @returns  {String}          The converted unit.
   */
  convert(toUnit) {
    const fromProp = this.$unit === '%' ? 'pct' : this.$unit;
    const toProp = toUnit === '%' ? 'pct' : toUnit;
    const fromBase = this.$config.base;
    let toBase = this.$config.base;
    let normalized, converted, formatted;

    // cancel early if the units are the same - no need for conversion
    if (this.$unit === toUnit) { return this.$raw; }

    // override the base in toUnit is an absolute unit
    if (absoluteUnits.indexOf(toUnit) > -1) {
      toBase = absoluteBases[toUnit];
    }

    try {
      // shortcut if the pixel value is already known
      if (this.$unit === 'px') {
        normalized = this.$value;
      } else {
        normalized = conversions[fromProp].from(this.$value, fromBase);
      }

      // shortcut if the pixel value is already known
      if (toUnit === 'px') {
        converted = normalized;
      } else {
        converted = conversions[toProp].to(normalized, toBase);
      }

      formatted = this.$config.formatter(converted, toUnit);
    } catch(error) {
      throw new Error(
        `An error occurred while attempting to convert from "${this.$value + this.$unit}" to "${toUnit}":
        ${error.message}`
      );
    }

    return {
      result: formatted,
      conversion: `${this.$value}/${toBase}`
    };
  }
}
