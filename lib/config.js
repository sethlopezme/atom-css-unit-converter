'use babel';

export default {
  conversionComments: {
    title: 'Conversion Comments',
    description: 'Comment the numbers used for the conversion at the end of the line. E.g. /* 24/16 */',
    type: 'boolean',
    default: true
  },
  stripLineHeightUnits: {
    title: 'Strip Line Height Units',
    description: 'Should line-heights be given a unit when converted?',
    type: 'boolean',
    default: 'true'
  },
  decimalLength: {
    title: 'Decimal Length',
    description: 'Maximum number of digits that may appear after a decimal.',
    type: 'integer',
    default: 3,
    minimum: 0,
    maximum: 10
  },
  defaultPixelContext: {
    title: 'Default Pixel Context',
    description: 'The default pixel context to use when converting to/from ems and rems.',
    type: 'integer',
    default: 16
  }
};
