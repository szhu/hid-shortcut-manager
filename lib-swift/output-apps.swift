import AppKit

func readLineWithPrompt(_: String) -> String {
  // print(prompt, terminator: " ")
  guard let answer = readLine(strippingNewline: true) else { exit(0) }
  return answer
}

while true {
  let id = readLineWithPrompt("id:")
  let notRunningAction = readLineWithPrompt("notRunningAction:")
  let hiddenAction = readLineWithPrompt("hiddenAction:")
  let visibleAction = readLineWithPrompt("visibleAction:")

  let apps = NSRunningApplication
    .runningApplications(withBundleIdentifier: id)
  var action: String
  if apps.count == 0 {
    action = notRunningAction
  } else if apps[0].isActive {
    action = visibleAction
  } else {
    action = hiddenAction
  }

  print("id: \(id)  action: \(action)")

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
