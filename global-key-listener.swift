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

    // var msg = ""
    // msg += type == .keyDown ? "->" : "<-"
    // msg += " "

    var eventString = ""
    eventString += flags.contains(.maskAlphaShift)  ? "c" : ""
    eventString += flags.contains(.maskShift)       ? "$" : ""
    eventString += flags.contains(.maskControl)     ? "^" : ""
    eventString += flags.contains(.maskAlternate)   ? "~" : ""
    eventString += flags.contains(.maskCommand)     ? "@" : ""
    eventString += flags.contains(.maskSecondaryFn) ? "f" : ""
    eventString += flags.contains(.maskNumericPad)  ? "n" : ""

    // eventString += getFootPedalReading()  ? "p" : ""

    let eventCopy = event.copy()!
    eventCopy.flags = CGEventFlags()
    // var char = UniChar()
    // var length = 0
    // eventCopy.keyboardGetUnicodeString(
    //   maxStringLength: 1,
    //   actualStringLength: &length,
    //   unicodeString: &char
    // )
    // msg += "'" + String(UnicodeScalar(char)!).uppercased() + "'"

    if let nsEvent = NSEvent(cgEvent: eventCopy), let chars = nsEvent.charactersIgnoringModifiers {
      eventString += chars.uppercased()
    }

    // msg += eventString

    let isMatching = patterns.contains(eventString)

    if (debugMode || isMatching && type == .keyUp) {
      print(eventString)
      fflush(stdout)
    }
    if (isMatching) {
      return nil
    }

    // var keyCode = event.getIntegerValueField(.keyboardEventKeycode)

    // var char = UniChar()
    // var length = 0

    // let eventCopy = event.copy()!
    // eventCopy.flags = 0
    // eventCopy.keyboardGetUnicodeString(
    //   maxStringLength: 1,
    //   actualStringLength: &length,
    //   unicodeString: &char
    // )




    // let typeString = type == .keyDown ? "->" : "<-"
    // let flagsString = String(event.flags.rawValue, radix: 2)
    //   .padding(toLength: 32, withPad: "0", startingAt: 0)


    // print("\(typeString) \(flagsString) '\(UnicodeScalar(char)!)'")

    // if keyCode == kVK_ANSI_X {
    //     keyCode = Int64(kVK_ANSI_Z)
    // } else if keyCode == kVK_ANSI_Z {
    //     return nil
    // }
    // event.setIntegerValueField(.keyboardEventKeycode, value: keyCode)
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
