# Atom CSS Unit Converter

Performs conversions between different CSS units.

Conversions can be made forward and backward between the following units:

- `cm`
- `em`
- `in`
- `mm`
- `pc`
- `%`
- `pt`
- `px`
- `rem`

The base pixel size for conversions is `16px` by default. This can be changed within the settings, or you can set the base pixel size at the end of the line you want to convert. E.g. `/24` at the end of a line sets the base pixel size to `24px` for that line only.

## Default Keybindings

### Mac
- `ctrl-c` `e`: Convert pixels to `em`s
- `ctrl-c` `r`: Convert pixels to `rem`s
- `ctrl-c` `c`: Open the conversion panel

### Windows / Linux

- `alt-c` `e`: Convert pixels to `em`s
- `alt-c` `r`: Convert pixels to `rem`s
- `alt-c` `c`: Open the conversion panel

## Converting Lines

If no selections are made, each line with a cursor will be selected and converted. You can convert a single line at once, or use multiple cursors to convert many lines at once.

![Converting One Line](https://raw.githubusercontent.com/sethlopezme/atom-css-unit-converter/master/resources/single-line.gif)

![Converting Multiple Lines](https://raw.githubusercontent.com/sethlopezme/atom-css-unit-converter/master/resources/multiple-lines.gif)

## Converting Selections

If a selection is made, conversions will be performed only within the bounds of the selection. You can convert a single selection at once, or use multiple selections to convert many areas at once.

![Converting Selections](https://raw.githubusercontent.com/sethlopezme/atom-css-unit-converter/master/resources/selections.gif)

## Converting Lines and Selections Simultaneously

If selections have been made and you also have cursors on other lines (outside the selection bounds), each line with a cursor is selected and all selections are then converted.

## Converter UI

Having keybindings for every conversion isn't very practical, so this package also provides a UI that allows you to convert between any of the units listed above. The UI allows you to define a custom pixel base for conversions, as well.

![Converter UI](https://raw.githubusercontent.com/sethlopezme/atom-css-unit-converter/master/resources/interactive-converter.png)
