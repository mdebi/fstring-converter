# Change Log

All notable changes to the "fstring-converter" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2022-01-23

### Changed

- Handle nested f-string better. Only add f if it is used as an index to access array elements. Any other specific use cases are to be implemented when one is discovered that is not handled correctly.
- Bump the major.

## [0.1.2] - 2022-01-23

### Added

- added capability to remove f manually and the extension won't add it again. This is default behaviour now and can be turned off by unchecking `fstring-converter.skipEvaluationPostManualDeletionOfF`.

_Note_:

- There is no change to existing behaviour unless we manually edit the f added.
- It is still not possible to add f to a string that is not a f-string.
- This only allows to remove f from an already added f-string. Undo works as before.

## [0.1.1] - 2021-10-18

### Added

- added logo

## [0.1.0] - 2021-10-17

### Added

- Initial release
