# masontidy-vscode

This extension is a simple formatter for mason code using Mason::Tidy.

## Features

* Format mason code using default formatting command
* Format on save
* Format selected text
* Basic linting

## Changes
See [CHANGELOG.md](CHANGELOG.md)

## Requirements

This extension requires that Mason::Tidy is installed.
To install Mason::Tidy:
* cpan install Mason::Tidy

## Extension Settings

This extension contributes the following settings:

* `masontidy.executable`: path to masontidy executable
* `masontidy.masonVersion`: what version of mason to run Mason::Tidy against
* `masontidy.additionalArguments`: array listing any additional arguments to be used with the masontidy command
