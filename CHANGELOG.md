## 1.1.1

- Fix #4: [Leading zero setting ignored for negative lengths](https://github.com/sethlopezme/atom-css-unit-converter/issues/4),
  caused by not taking a leading sign into account for values.
- Rename the "Leading Zero" option to "Preserve Leading Zero", and updated the
  examples for that option to be more clear.
- Update the css-length library to the latest version.
- Screwed up the semver...

## 1.0.2

- Update the README to have clearer keybindings and explanations.

## 1.0.1

- Fix #1, caused by a typo which resulted in the Decimal Length setting to be
  ignored.
- Update the README to include the default keybindings for Mac, Windows, and Linux.

## 1.0.0

- Add the ability to convert between all calculable CSS units.
- Add an interactive conversion dialog.
- Add an option for removing the leading zero from values < 1.
- Add commands, menus, and shortcuts for quick conversion between `px`, `em`,
  and `rem`.
- Remove the option to leave units off of line-heights. This was necessary in
  order to make the converter more flexible.

## 0.1.0 - Initial Release

Releasing with the following features:

- Pixels to Ems
- Pixels to Rems
- Pixels to Points
- Pixels to Percents
