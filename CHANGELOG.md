# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Fixed
### Added
### Changed
- replaced tap-spec with tap-arc
- changed CI/CD from travis to github actions

### Removed

## [2.0.0] - 2021-06-13

Breaking release

### Breaking changes
- No default export (this does not actually affect CommonJS usage)
- Removed several public facing members (`verifyAlgorithmAndDigest`, `ALGORITHMS`, `DIGEST_METHODS`)

### Added
- Typescript support (library rewritten to Typescript)
- ES Modules support (CommonJS support is maintained)

### Removed
- The `verifyAlgorithmAndDigest` method
- The `ALGORITHMS` property (one can use `crypto.getHashes()` if the list is needed)
- The `DIGEST_METHODS` property (`'hex'` and `'base64'` are the only supported ones, `'latin1'` is no longer supported)


## [1.0.8] - 2020-09-06

Maintenance release

### Changed
- Minimum Node.js version is now 8 (earliest offically supported version)
- Updated travis test targets to include Node.js 13 and 14, removing Node.js 7
- Skip tests for hmac using shake128 and shake256 entirely


## [1.0.7] - 2019-08-26

Maintenance release

## Changed
- Updated dependencies: @konfirm/labrat minor upgrade
- removed package lock (so our users always update to the lastest versions of our dependencies)

## [1.0.6] - 2019-07-14

Maintenance release

### Changed
- Updated dependencies: fixes CVE-2019-10744 on lodash < 4.17.13 (sub) dev dependency
- Publication of new packages is now handled by Travis CI
- Added test for hmac using shake128, it fails

## [1.0.5] - 2019-06-05

Maintenance release

### Changed
- Updated dependencies: @konfirm/labrat major upgrade
- Updated travis test targets to include Node.js 11 and 12


## [1.0.4] - 2019-02-08

Maintenance release

### Changed
- Updated dependencies: potential lodash 4.17.11 vulnerability in (sub) dev dependency


## [1.0.3] - 2018-07-11

Implementation change

### Fixed
- Objects now have every property (that is not a function) taken into account


## [1.0.2] - 2018-04-27

Maintenance release

### Changed
- Updated dependencies (@konfirm/labrat)
- Updated travis test targets to include Node.js 10


## [1.0.1] - 2017-12-22

Maintenance release

### Removed
- Remove from publication: test, configuration files


## [1.0.0] - 2017-12-06

Initial release.


[Unreleased]: https://github.com/konfirm/node-checksum/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/konfirm/node-checksum/compare/v1.0.8...v2.0.0
[1.0.8]: https://github.com/konfirm/node-checksum/compare/v1.0.7...v1.0.8
[1.0.7]: https://github.com/konfirm/node-checksum/compare/v1.0.6...v1.0.7
[1.0.6]: https://github.com/konfirm/node-checksum/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/konfirm/node-checksum/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/konfirm/node-checksum/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/konfirm/node-checksum/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/konfirm/node-checksum/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/konfirm/node-checksum/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/konfirm/node-checksum/releases/tag/v1.0.0
