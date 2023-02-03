#!/usr/bin/swift
// https://theswiftdev.com/how-to-build-macos-apps-using-only-the-swift-package-manager/

import AppKit
import SwiftUI

@discardableResult
func shell(_ args: String...) -> Int32 {
  let task = Process()
  task.launchPath = "/usr/bin/env"
  task.arguments = args
  task.launch()
  task.waitUntilExit()
  return task.terminationStatus
}

func alert(_ message: String) {
  NSApplication.shared.activate(ignoringOtherApps: true)
  let alert = NSAlert()
  alert.messageText = "Error"
  alert.informativeText = message
  alert.addButton(withTitle: "OK")
  alert.alertStyle = .critical
  alert.runModal()
}

@available(macOS 10.15, *)
class AppDelegate: NSObject, NSApplicationDelegate {
  func applicationDidFinishLaunching(_: Notification) {
    //
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
    process.currentDirectoryPath = "/Users/Sean/Code/github.com/szhu/hid-shortcut-manager.code"
    process.launchPath = "/usr/bin/env"
    process.arguments = ["./shortcut-manager.ts"]
    process.launch()
  }

  func applicationWillFinishLaunching(_: Notification) {
    let appMenu = NSMenuItem()
    appMenu.submenu = NSMenu()
    appMenu.submenu?.addItem(NSMenuItem(
      title: "Quit",
      action: #selector(NSApplication.terminate(_:)),
      keyEquivalent: "q"
    ))
    let mainMenu = NSMenu()
    mainMenu.addItem(appMenu)
    NSApplication.shared.mainMenu = mainMenu

    NSApp.setActivationPolicy(.accessory)
  }
}

let delegate = AppDelegate()
NSApplication.shared.delegate = delegate
NSApplication.shared.run()
