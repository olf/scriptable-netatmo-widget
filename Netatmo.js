// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: umbrella;
function createWidget(moduleName, moduleData, temperature_unit) {
  let widget = new ListWidget()

  widget.backgroundColor = Color.black()

  let title = widget.addText(moduleName)
  title.font = Font.boldSystemFont(18)
  title.minimumScaleFactor = 0.8
  title.lineLimit = 2
  title.textColor = Color.white()

  widget.addSpacer(8)

  // Temperature

  let temperature = widget.addText(
    "" + moduleData.Temperature + temperature_unit
  )
  temperature.font = Font.regularSystemFont(24)
  temperature.textColor = Color.white()
  temperature.centerAlignText()

  widget.addSpacer(8)

  // CO2

  if ("CO2" in moduleData) {
    co2value = moduleData.CO2

    let co2 = widget.addText("CO₂: " + co2value + " ppm")
    co2.font = Font.regularSystemFont(16)
    co2.centerAlignText()

    co2.textColor = Color.green()
    if (co2value >= 1000) {
      co2.textColor = Color.orange()
    } else if (co2value >= 1500) {
      co2.textColor = Color.red()
    }

    widget.addSpacer(8)
  }

  // Timestamp

  const date = new Date(moduleData.time_utc * 1000)
  let dateFormatter = new DateFormatter()
  dateFormatter.useShortDateStyle()
  dateFormatter.useShortTimeStyle()
  let strDate = dateFormatter.string(date)

  let footer = widget.addText(strDate)
  footer.minimumScaleFactor = 0.5
  footer.lineLimit = 1
  footer.textColor = Color.lightGray()
  footer.centerAlignText()

  return widget
}

async function authenticate(app_id, app_secret, username, password) {
  let req = new Request("https://api.netatmo.net/oauth2/token")

  req.method = "POST"

  req.addParameterToMultipart("grant_type", "password")
  req.addParameterToMultipart("client_id", app_id)
  req.addParameterToMultipart("client_secret", app_secret)
  req.addParameterToMultipart("username", username)
  req.addParameterToMultipart("password", password)
  req.addParameterToMultipart("scope", "read_station")

  let response = await req.loadJSON()
  return response.access_token
}

async function getData(token) {
  let req = new Request(
    "https://api.netatmo.net/api/getstationsdata?access_token=" +
      encodeURI(token)
  )

  let response = await req.loadJSON()
  return response.body
}

function getModuleData(moduleName, data) {
  const device = data.devices[0]

  if (device.module_name === moduleName) {
    return device.dashboard_data
  }

  const modules = device.modules.filter(
    (item) => item.module_name === moduleName
  )

  if (modules.length === 0) {
    return {}
  } else {
    return modules[0].dashboard_data
  }
}

let netatmoConfig = importModule("Netatmo.config")

let token = await authenticate(
  netatmoConfig.app_id,
  netatmoConfig.app_secret,
  netatmoConfig.username,
  netatmoConfig.password
)
let data = await getData(token)

temperature_unit = data.user.administrative.unit === 0 ? "°C" : "°F"

if (config.runsInApp) {
  // For in-app testing
  const module_name = "Indoor"

  let widget = createWidget(
    module_name,
    getModuleData(module_name, data),
    temperature_unit
  )

  widget.presentSmall()
} else {
  let parameter = args.widgetParameter

  let widget = createWidget(
    parameter,
    getModuleData(parameter, data),
    temperature_unit
  )

  Script.setWidget(widget)
}
