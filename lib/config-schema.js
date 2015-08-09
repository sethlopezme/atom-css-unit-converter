'use babel';

export default {
  comments: {
    title: 'Comments',
    description: 'Comment the conversion math at the end of the line. E.g. /* 24/16 */',
    type: 'boolean',
    default: true
  },
  lineHeightUnits: {
    title: 'Line Height Units',
    description: 'Apply a unit when converting line-heights.',
    type: 'boolean',
    default: false
  },
  decimalLength: {
    title: 'Decimal Length',
    description: 'Maximum number of digits that may appear after a decimal.',
    type: 'integer',
    default: 3,
    minimum: 0,
    maximum: 10
  },
  defaultBase: {
    title: 'Default Base',
    description: 'The base pixel size for conversions. This can be overridden inline.',
    type: 'integer',
    default: 16
  }
};
