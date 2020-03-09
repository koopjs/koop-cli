# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased
### Fixed
* A path with spaces can crash the `serve` command (#42)

## 0.6.0 - 2019-12-09

### Added
* support to `yarn`
* `--watch` option to the `serve` command for restart-on-change
* `--debug` option to the `serve` command for nodejs inspector

### Changed
* clean up templates and add tests

## 0.5.0 - 2019-07-08

### Added

* output template (#32)
* `serve` command support for different plugin types (#33)

## 0.4.0 - 2019-05-28

### Changed

* simplify project templates (#30)
* allow starting a dev server with the local Koop CLI in a Koop project (#31)

## 0.3.3 - 2019-05-16

### Fixed

* `add` command doesn't install the correct package name (#29)

## 0.3.2 - 2019-04-19

### Fixed

* Node.js `add()` API is broken (#27)

## 0.3.1 - 2019-04-18

### Removed

* `.npmignore` file (#26)

## 0.3.0 - 2019-04-18

### Added

* `--local` option for the `add` command (#22)

### Fixed

* cache plugins are not registered before provider plugins (#23)

## 0.2.0 - 2019-03-21

### Added

* project template for authorization plugin (#18)

### Updated

* `new` command is able to create authorization plugin projects (#18)
* `add` command is able to add authorization plugin to the existing app (#20)

## 0.1.0 - 2019-03-14

This is the initial development.

### Added
* `new`, `add`, `test`, and `serve` commands
* Koop `app` and `provider` plugin project templates
