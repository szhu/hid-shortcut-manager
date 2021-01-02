// https://stackoverflow.com/a/31898592/782045
// https://stackoverflow.com/a/44507450/782045
import Foundation
import Carbon.HIToolbox.Events
import AppKit

var debugMode = true
var patterns: [String] = []
if (CommandLine.argc > 1) {
  patterns = CommandLine
    .arguments[1]
    .split(whereSeparator: \.isNewline)
    .map(String.init)
  debugMode = false
}

func onKeyEvent(
  proxy: CGEventTapProxy,
  type: CGEventType,
  event: CGEvent,
  refcon: Optional<UnsafeMutableRawPointer>
) -> Unmanaged<CGEvent>? {
  if [.keyDown , .keyUp].contains(type) {
    let flags = event.flags

    var eventString = ""
    eventString += flags.contains(.maskAlphaShift)  ? "c" : ""
    eventString += flags.contains(.maskShift)       ? "$" : ""
    eventString += flags.contains(.maskControl)     ? "^" : ""
    eventString += flags.contains(.maskAlternate)   ? "~" : ""
    eventString += flags.contains(.maskCommand)     ? "@" : ""
    eventString += flags.contains(.maskSecondaryFn) ? "f" : ""
    eventString += flags.contains(.maskNumericPad)  ? "n" : ""

    let eventCopy = event.copy()!
    eventCopy.flags = CGEventFlags()

    if let nsEvent = NSEvent(cgEvent: eventCopy), let chars = nsEvent.charactersIgnoringModifiers {
      eventString += chars.uppercased()
    }

    let isMatching = patterns.contains(eventString)

    if (debugMode || isMatching && type == .keyUp) {
      print(eventString)
      fflush(stdout)
    }
    if (isMatching) {
      return nil
    }
  }

  return Unmanaged.passRetained(event)
}

let eventMask =
  (1 << CGEventType.keyDown.rawValue) | (1 << CGEventType.keyUp.rawValue)
// let eventMask = 1 << CGEventType.keyUp.rawValue
guard let eventTap = CGEvent.tapCreate(
  tap: .cgSessionEventTap,
  place: .tailAppendEventTap,
  options: .defaultTap,
  eventsOfInterest: CGEventMask(eventMask),
  callback: onKeyEvent,
    userInfo: nil
) else {
  print("Failed to create event tap")
  exit(1)
}

let runLoopSource =
  CFMachPortCreateRunLoopSource(kCFAllocatorDefault, eventTap, 0)
CFRunLoopAddSource(CFRunLoopGetCurrent(), runLoopSource, .commonModes)
CGEvent.tapEnable(tap: eventTap, enable: true)
print("Ready!")
fflush(stdout)
CFRunLoopRun()
