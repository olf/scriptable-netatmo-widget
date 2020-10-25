# Scriptable-netatmo-widget

Widget for the [Scriptable][app] iOS app to display data from [Netatmo][netatmo] personal weather stations.

## Installation

Pre-requisite: You need to [register a new application][newapp] in the [Netatmo Developer Portal][devportal] to get readings from your personal weather station.

* rename the `Netatmo.config-template` file to `Netatmo.config` and fill in your details from the app registration and your login/password
* copy both the Netatmo.config and Netatmo.js files to the scriptable folder in your iCloud Drive
* add a new Scriptable widget in iOS, specify the name of the Netatmo module you want to display in the widget "Parameter" setting

## Preview

![Preview Image][preview]

[app]: https://scriptable.app
[devportal]: https://dev.netatmo.com/
[netatmo]: https://www.netatmo.com/weather
[newapp]: https://dev.netatmo.com/apps/createanapp
[preview]: preview.png