# CSS Unit Converter

Performs conversions between different CSS units.

Currently supports the following:

- Pixels to Ems
- Pixels to Rems
- Pixels to Points
- Pixels to Percents

The base pixel size for conversions is 16px by default. This can be change within the settings, or you can set the base pixel size at the end of the line you want to convert. E.g. `/24` at the end of a line sets the base pixel size to 24px for that line only.

See the examples below.

## Converting One Line

Activating one of the conversion commands will automatically convert the values on the same line as your cursor.

![Converting One Line](https://raw.githubusercontent.com/sethlopezme/atom-css-unit-converter/master/resources/single-line.gif)

## Converting Multiple Lines

Conversion commands also work with multiple cursors.

![Converting One Line](https://raw.githubusercontent.com/sethlopezme/atom-css-unit-converter/master/resources/multiple-lines.gif)

## Converting Selections

You can even convert values within a selection.

![Converting Selections](https://raw.githubusercontent.com/sethlopezme/atom-css-unit-converter/master/resources/selections.gif)
