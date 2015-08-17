# CSS Unit Converter

Performs conversions between different CSS units.

Conversions can be made forward and backward between the following units:

- cm
- em
- in
- mm
- pc
- %
- pt
- px
- rem

The base pixel size for conversions is 16px by default. This can be changed within the settings, or you can set the base pixel size at the end of the line you want to convert. E.g. `/24` at the end of a line sets the base pixel size to `24px` for that line only.

See the examples below.

## Converting Lines

If no selections are made, the entire line will be selected and converted. You can convert a single line at once, or use multiple cursors to convert many lines at once.

![Converting One Line](https://raw.githubusercontent.com/sethlopezme/atom-css-unit-converter/master/resources/single-line.gif)

![Converting Multiple Lines](https://raw.githubusercontent.com/sethlopezme/atom-css-unit-converter/master/resources/multiple-lines.gif)

## Converting Selections

If a selection is made, conversions will be performed only within the bounds of the selection. You can convert a single selection at once, or use multiple selections to convert many areas at once.

![Converting Selections](https://raw.githubusercontent.com/sethlopezme/atom-css-unit-converter/master/resources/selections.gif)

## Converting Lines and Selections

Converting lines and selections works the way you would expect and as described above.

## Interactive Converter

Managing keyboard shortcuts for every conversion isn't very practical, so this package also provides an interactive converter that you can use to convert between less-common units.

![Interactive Converter](https://raw.githubusercontent.com/sethlopezme/atom-css-unit-converter/master/resources/interactive-converter.png)
