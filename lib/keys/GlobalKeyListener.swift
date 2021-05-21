import AppKit
import Carbon.HIToolbox.Events
import Foundation

/*
 https://stackoverflow.com/questions/59147944/how-to-provide-accessibility-permissions-to-swift-apps-in-development
 https://stackoverflow.com/questions/53616609/how-to-ask-for-accessibility-permission-in-macos

 */

// https://stackoverflow.com/a/31898592/782045
// https://stackoverflow.com/a/44507450/782045

var debugMode = true
var patterns: [String] = []

enum EventReprLib {
  static func reprEvent(
    type _: CGEventType,
    event: CGEvent
  ) -> String {
    let flags = event.flags

    var eventString = ""
    eventString += flags.contains(.maskAlphaShift) ? "c" : ""
    eventString += flags.contains(.maskShift) ? "$" : ""
    eventString += flags.contains(.maskControl) ? "^" : ""
    eventString += flags.contains(.maskAlternate) ? "~" : ""
    eventString += flags.contains(.maskCommand) ? "@" : ""
    eventString += flags.contains(.maskSecondaryFn) ? "f" : ""
    eventString += flags.contains(.maskNumericPad) ? "n" : ""

    let eventCopy = event.copy()!
    eventCopy.flags = CGEventFlags()

    if
      let nsEvent = NSEvent(cgEvent: eventCopy),
      let chars = nsEvent.charactersIgnoringModifiers
    {
      eventString += chars.uppercased()
      if debugMode {
        eventString +=
          " (\(chars.unicodeScalars.map { $0.escaped(asASCII: true) }.joined()))"
      }
    }

    return eventString
  }
}

var isKeyDown = false

func KeyListener_onKeyEvent(
  proxy _: CGEventTapProxy,
  type: CGEventType,
  event: CGEvent,
  refcon _: UnsafeMutableRawPointer?
) -> Unmanaged<CGEvent>? {
  if [.keyDown, .keyUp].contains(type) {
    let eventString = EventReprLib.reprEvent(type: type, event: event)

    let isMatching = patterns.contains(eventString)

    // Naive way to ignore key repeats:
    if isMatching {
      if type == .keyUp {
        isKeyDown = false
      }
      if isKeyDown {
        return nil
      }
      if type == .keyDown {
        isKeyDown = true
      }
    }

    if debugMode || isMatching && type == .keyDown {
      print(eventString)
      fflush(stdout)
    }
    if isMatching {
      return nil
    }
  }

  return Unmanaged.passRetained(event)
}

enum KeyListener {
  static func run() {
    let eventMask =
      (1 << CGEventType.keyDown.rawValue) | (1 << CGEventType.keyUp.rawValue)
    // let eventMask = 1 << CGEventType.keyUp.rawValue
    guard let eventTap = CGEvent.tapCreate(
      tap: .cgSessionEventTap,
      place: .tailAppendEventTap,
      options: .defaultTap,
      eventsOfInterest: CGEventMask(eventMask),
      callback: KeyListener_onKeyEvent,
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
  }
}

func main() -> Int32 {
  if CommandLine.argc > 1 {
    patterns = CommandLine
      .arguments[1]
      .split(whereSeparator: \.isNewline)
      .map(String.init)
    debugMode = false
  }

  KeyListener.run()

  return 0
}

exit(main())
