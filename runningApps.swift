import AppKit

if (CommandLine.argc > 1) {
  let id = CommandLine.arguments[1]

  let apps = NSRunningApplication
    .runningApplications(withBundleIdentifier: id)

  if (CommandLine.argc > 2) {
    let action = CommandLine.arguments[2]

    for app in apps {
      if (action == "hide") {
        app.hide()
      }
    }
  }

  print(apps.count)
}
