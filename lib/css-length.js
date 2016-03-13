/**
 * This is a slightly modified version of my css-length library found here:
 * https://github.com/sethlopezme/css-length
 */

'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function pctToPx(value, base) {
  return value / 100 * base;
}
function pxToPct(value, base) {
  return value / base * 100;
}

function absToPx(value, base) {
  return value / base;
}
function pxToAbs(value, base) {
  return value * base;
}

function relToPx(value, base) {
  return value * base;
}
function pxToRel(value, base) {
  return value / base;
}

// map units to the appropriate conversion functions for easier calling
var conversions = {
  cm: { from: absToPx, to: pxToAbs },
  em: { from: relToPx, to: pxToRel },
  in: { from: absToPx, to: pxToAbs },
  mm: { from: absToPx, to: pxToAbs },
  pc: { from: absToPx, to: pxToAbs },
  pct: { from: pctToPx, to: pxToPct },
  pt: { from: absToPx, to: pxToAbs },
  px: { from: absToPx, to: pxToAbs },
  rem: { from: relToPx, to: pxToRel }
};
var absBases = {
  cm: 2.54 / 96,
  in: 1 / 96,
  mm: 25.4 / 96,
  pc: 6 / 96,
  pt: 72 / 96
};
var absUnits = Object.keys(absBases);
var defaults = {
  base: 16,
  formatter: function formatter(value, unit) {
    return value + unit;
  }
};

/**
 * @class CSSLength
 *
 * Represents a CSS length value and handles the conversion between the original
 * unit and other calculable units.
 */
module.exports = function () {
  function CSSLength(raw) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, CSSLength);

    var _raw$match = raw.match(/^([+-]?[0-9\.]+)(cm|em|in|mm|pc|%|pt|px|rem)$/);

    var _raw$match2 = _slicedToArray(_raw$match, 3);

    var value = _raw$match2[1];
    var unit = _raw$match2[2];


    this.$config = _extends({}, defaults, options);
    this.raw = raw;
    this.unit = unit;
    this.value = +value;

    // override the base if the length is an absolute unit
    if (absUnits.indexOf(this.unit) > -1) {
      this.$config.base = absBases[this.unit];
    }
  }

  _createClass(CSSLength, [{
    key: 'convert',


    /**
     * Converts the CSS length to a given unit.
     *
     * @param    {String}  unit  The destination unit for the original value.
     * @returns  {String}        The converted unit.
     */
    value: function convert(unit) {
      var fromUnit = this.unit === '%' ? 'pct' : this.unit;
      var toUnit = unit === '%' ? 'pct' : unit;
      var fromBase = this.$config.base;
      var toBase = this.$config.base;
      var normalized = void 0,
          converted = void 0,
          formatted = void 0;

      // cancel early if the units are the same - no need for conversion
      if (this.unit === unit) {
        return this.$config.formatter(this.value, this.unit);
      }

      // override the base if unit is an absolute unit
      if (absUnits.indexOf(unit) > -1) {
        toBase = absBases[unit];
      }

      try {
        // shortcut if the pixel value is already known
        if (this.unit === 'px') {
          normalized = this.value;
        } else {
          normalized = conversions[fromUnit].from(this.value, fromBase);
        }

        // shortcut if the pixel value is already known
        if (unit === 'px') {
          converted = normalized;
        } else {
          converted = conversions[toUnit].to(normalized, toBase);
        }

        formatted = this.$config.formatter(converted, unit);
      } catch (error) {
        throw new Error('An error occurred while attempting to convert from "' + (this.value + this.unit) + '" to "' + unit + '":\n' + error.message);
      }

      return {
        result: formatted,
        conversion: `${this.value}/${toBase}`
      };
    }
  }, {
    key: 'cm',
    get: function get() {
      return this.convert('cm');
    }
  }, {
    key: 'em',
    get: function get() {
      return this.convert('em');
    }
  }, {
    key: 'in',
    get: function get() {
      return this.convert('in');
    }
  }, {
    key: 'mm',
    get: function get() {
      return this.convert('mm');
    }
  }, {
    key: 'pc',
    get: function get() {
      return this.convert('pc');
    }
  }, {
    key: 'pct',
    get: function get() {
      return this.convert('%');
    }
  }, {
    key: 'pt',
    get: function get() {
      return this.convert('pt');
    }
  }, {
    key: 'px',
    get: function get() {
      return this.convert('px');
    }
  }, {
    key: 'rem',
    get: function get() {
      return this.convert('rem');
    }
  }]);

  return CSSLength;
}();
