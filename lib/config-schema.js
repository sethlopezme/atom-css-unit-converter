'use babel';

export default {
  comments: {
    title: 'Comments',
    description: 'Comment the conversion math at the end of the line. E.g. /* 24/16 */',
    type: 'boolean',
    default: true
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
  },
  leadingZero: {
    title: 'Leading Zero',
    description: 'Keep the leading zero for converted values < 1. E.g. 0.5em or .5em',
    type: 'boolean',
    default: true
  }
};
