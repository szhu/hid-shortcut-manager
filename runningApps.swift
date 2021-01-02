import AppKit

if (CommandLine.argc > 4) {
  let id = CommandLine.arguments[1]
  let notRunningAction = CommandLine.arguments[2]
  let hiddenAction = CommandLine.arguments[3]
  let visibleAction = CommandLine.arguments[4]

  let apps = NSRunningApplication
    .runningApplications(withBundleIdentifier: id)
  var action: String
  if (apps.count == 0) {
    action = notRunningAction
  } else if apps[0].isActive {
    action = visibleAction
  } else {
    action = hiddenAction
  }

  switch action {
  case "launch":
    guard let url =
      NSWorkspace.shared.urlForApplication(withBundleIdentifier: id)
    else { break }

    let configuration = NSWorkspace.OpenConfiguration()
    configuration.activates = true

    NSWorkspace.shared.openApplication(
      at: url,
      configuration: configuration,
      completionHandler: nil
    )
    break

  case "reopen":
    let task = Process()
    task.launchPath = "/usr/bin/open"
    task.arguments = ["-b", id]
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

    break

  case "show":
    for app in apps { app.unhide() }
    break

  case "hide":
    for app in apps { app.hide() }
    break

  case "quit":
    for app in apps { app.terminate() }
    break

  default:
    break
  }
}
