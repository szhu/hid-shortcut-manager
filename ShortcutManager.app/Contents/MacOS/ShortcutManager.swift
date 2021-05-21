#!/usr/bin/swift

import AppKit

func applicationShouldTerminate() {
  let task = Process()
  task.executableURL = URL(fileURLWithPath: "/bin/bash")
  task.arguments = ["-c", "touch /Users/Sean/test"]
  do {
    try task.run()
  } catch {}
}

func getAppName() -> String {
  guard let appName = Bundle
    .main
    .infoDictionary!["CFBundleName"]
  else {
    return "App"
  }
  return appName as! String
}

class AppMenu: NSMenu {
  override init(title: String) {
    super.init(title: title)

    let menuItemOne = NSMenuItem()
    menuItemOne.submenu = NSMenu(title: "menuItemOne")
    menuItemOne.submenu?.items = [NSMenuItem(title: "Quit \(getAppName())", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")]
    items = [menuItemOne]
  }

  required init(coder: NSCoder) {
    super.init(coder: coder)
  }
}

let menu = AppMenu()
NSApplication.shared.mainMenu = menu

let checkOptPrompt = kAXTrustedCheckOptionPrompt.takeUnretainedValue() as NSString
// set the options: false means it wont ask
// true means it will popup and ask
let options = [checkOptPrompt: true]
// translate into boolean value
let accessEnabled = AXIsProcessTrustedWithOptions(options as CFDictionary?)
if !accessEnabled {
  exit(0)
}

let process = Process()
process.currentDirectoryURL = URL(fileURLWithPath: "/Users/Sean/Code/szhu/hid-shortcut-manager")
process.executableURL = URL(fileURLWithPath: "/usr/local/bin/deno")
process.arguments = ["run", "--unstable", "--allow-run", "shortcut-manager.ts"]
try process.run()

// task.waitUntilExit()

// applicationShouldTerminate()
// exit(0)

NSApplication.shared.run()
