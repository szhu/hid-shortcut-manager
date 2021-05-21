import AppKit

struct AppAction: Codable {
  var id: String
  // var command: String
  var notRunningCommand: String
  var hiddenCommand: String
  var visibleCommand: String
}

func readAppAction() -> AppAction? {
  guard let input = readLine(strippingNewline: true)
  else {
    print("[Apps.swift] Error: End of input. Exiting.")
    exit(0)
  }

  guard let data = input.data(using: .utf8)
  else {
    print("[Apps.swift] Error: Encoding error.")
    return nil
  }

  let decoder = JSONDecoder()
  guard let parsed = try? decoder.decode(AppAction.self, from: data)
  else {
    print("[Apps.swift] Error: JSON invalid or not in correct format.")
    return nil
  }

  return parsed
}

while true {
  guard let action = readAppAction()
  else { continue }

  let apps = NSRunningApplication
    .runningApplications(withBundleIdentifier: action.id)
  var command: String
  if apps.count == 0 {
    command = action.notRunningCommand
  } else if apps[0].isActive {
    command = action.visibleCommand
  } else {
    command = action.hiddenCommand
  }

  print("[Apps.swift]  id: \(action.id)  command: \(command)")

  switch command {
  case "launch":
    guard let url =
      NSWorkspace.shared.urlForApplication(withBundleIdentifier: action.id)
    else { break }

    let configuration = NSWorkspace.OpenConfiguration()
    configuration.activates = true

    NSWorkspace.shared.openApplication(
      at: url,
      configuration: configuration,
      completionHandler: nil
    )

  case "reopen":
    let task = Process()
    task.launchPath = "/usr/bin/env"
    task.arguments = ["-i", "/usr/bin/open", "-b", action.id]
    task.launch()
    task.waitUntilExit()

    // let targetDescriptor: NSAppleEventDescriptor
    //  AECreateDesc(
    //   typeKernelProcessID,
    //   &apps[0].processIdentifier,
    //   MemoryLayout.size(ofValue: apps[0].processIdentifier),
    //   targetDescriptor
    // );

    // var pid = apps[0].processIdentifier
    // let target = NSAppleEventDescriptor(
    //   descriptorType: typeKernelProcessID,
    //   bytes: &pid,
    //   length: MemoryLayout.size(ofValue: pid)
    // )

    // let reopenEvent = NSAppleEventDescriptor(
    //   eventClass: AEEventClass(kCoreEventClass),
    //   eventID: AEEventID(kAEReopenApplication),
    //   targetDescriptor: target,
    //   returnID: AEReturnID(kAutoGenerateReturnID),
    //   transactionID: AETransactionID(kAnyTransactionID)
    // )

    // AESendMessage(
    //   reopenEvent.aeDesc,
    //   nil,
    //   AESendMode(kAENoReply),
    //   kAEDefaultTimeout
    // )

  case "show":
    for app in apps { app.unhide() }

  case "hide":
    for app in apps { app.hide() }

  case "quit":
    for app in apps { app.terminate() }

  default:
    break
  }
}
