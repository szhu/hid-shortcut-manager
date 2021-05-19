import { readLines } from "https://deno.land/std@0.77.0/io/bufio.ts";

type SingleAppCommand = "noop" | "reopen" | "launch" | "hide" | "show" | "quit";

type ConditionalAppCommand = SingleAppCommand | [
  SingleAppCommand,
  SingleAppCommand,
  SingleAppCommand,
];

interface AppAction {
  type: "app";
  command: ConditionalAppCommand;
  app: ["id", string] | ["dockIndex", number];
}

interface JsAction {
  type: "js";
  command: () => void;
}

interface ApplescriptAction {
  type: "as";
  command: string;
}

type SpotifyCommand = ["playTrack", string, boolean] | ["playPause"];

interface SpotifyAction {
  type: "spotify";
  command: SpotifyCommand;
}

type Action = AppAction | JsAction | ApplescriptAction | SpotifyAction;

let cycle1: ConditionalAppCommand = ["reopen", "reopen", "hide"];
let cycle2: ConditionalAppCommand = ["noop", "reopen", "hide"];
let cycle3: ConditionalAppCommand = ["reopen", "reopen", "reopen"];
let cycle4: ConditionalAppCommand = ["noop", "reopen", "reopen"];
cycle1 = cycle3;
cycle2 = cycle4;

function app(command: ConditionalAppCommand, id: string): Action {
  return { type: "app", command, app: ["id", id] };
}

function play(spotifyUri: string, shuffle: boolean = true): SpotifyAction {
  return {
    type: "spotify",
    command: ["playTrack", spotifyUri, shuffle],
  };
}

const SHORTCUTS: { [key: string]: Action | undefined } = {
  // System
  "^@,": app(cycle1, "com.apple.systempreferences"),
  "^@S": app(cycle1, "com.apple.finder"),
  "$^@S": app(["noop", "quit", "quit"], "com.apple.finder"),
  "^@b": app(cycle1, "com.apple.ActivityMonitor"),
  "^~b": app(cycle1, "com.apple.Terminal"),
  "~/": app(cycle3, "com.apple.ScreenSaver.Engine"),

  // Utility
  // "^@.": app(cycle1, "de.codenuts.HotKey"),
  "^@0": app(cycle1, "tandem.app"),
  "$^@P": app(["launch", "quit", "quit"], "com.pigigaldi.pock"),

  // Development
  "^@E": app(cycle1, "com.microsoft.VSCode"),
  "$^@E": app(cycle4, "arduino.ProIDE"),
  "^@G": app(cycle2, "co.gitup.mac"),

  // Life
  "$^@T": app(cycle1, "com.spotify.client"),
  "^@C": app(cycle1, "com.apple.iCal"),
  "^@Y": app(cycle1, "com.automattic.SimplenoteMac"),
  "^~@Y": app(cycle1, "com.apple.Stickies"),
  "^@T": app(cycle1, "com.google.Chrome.app.paccjkgbiiccgmgdhgdimdnohecgcgka"),

  // Web
  "$^@M": app(cycle2, "com.facebook.archon"),
  "^@A": app(cycle1, "com.google.Chrome.app.dpbfphgmphbjphnhpceopljnkmkbpfhi"),
  "^@K": app(cycle1, "com.google.Chrome.app.magkoliahgffibhgfkmoealggombgknl"),
  "^@U": app(cycle1, "com.google.Chrome.app.edcmabgkbicempmpgmniellhbjopafjh"),
  "^@W": app(cycle3, "com.google.Chrome"),
  "^@Z": app(cycle1, "us.zoom.xos"),

  // Spotify
  "n.": app(["launch", "hide", "hide"], "com.spotify.client"),
  "n*": {
    type: "as",
    command: `tell application "Spotify" to set sound volume to 0`,
  },
  "n+": {
    type: "as",
    command:
      `tell application "Spotify" to set sound volume to (sound volume + 1) * 1.2 + 1`,
  },
  "n-": {
    type: "as",
    command:
      `tell application "Spotify" to set sound volume to (sound volume) * 0.8333`,
  },
  "^@=": {
    type: "as",
    command:
      `tell application "Spotify" to set sound volume to (sound volume + 1) * 1.2 + 1`,
  },
  "^@-": {
    type: "as",
    command:
      `tell application "Spotify" to set sound volume to (sound volume) * 0.8333`,
  },
  "^@ ": { type: "spotify", command: ["playPause"] },
  //
  "ne": app(["reopen", "reopen", "hide"], "com.spotify.client"),
  //
  "n0": { type: "spotify", command: ["playPause"] },
  // Coffee Shop Vibes
  "n1": play("spotify:station:playlist:2s9R059mmdc8kz6lrUqZZd"),
  // Chill Hits
  "n2": play("spotify:station:playlist:37i9dQZF1DX4WYpdgoIcn6"),
  // Creamy
  "n3": play("spotify:station:playlist:37i9dQZF1DXdgz8ZB7c2CP"),
  // NIKI - lowkey
  "n4": play("spotify:station:track:5TTXEcfsYLh6fTarLaevTi"),
  // XCRPT
  "n5": play("spotify:station:artist:2cGJym7cmkjHnXbQuZosPk"),
  //
  "n6": undefined,
  // 1 Hour
  "n7": {
    type: "js",
    command: () => {
      spotifyPlayTrack("spotify:playlist:3wOYpqLSqMHweMcinQuzQQ", false);
      osascript(`
        tell application "Menubar Countdown"
          set hours to 0
          set minutes to 56
          set seconds to 0
          start timer
        end tell
      `);
    },
  },
  "f7": {
    type: "js",
    command: () => {
      spotifyPlayTrack("spotify:playlist:3wOYpqLSqMHweMcinQuzQQ", false);
      osascript(`
        tell application "Menubar Countdown"
          set hours to 0
          set minutes to 56
          set seconds to 0
          start timer
        end tell
      `);
    },
  },
  // BBC Minute
  "n8": play("spotify:show:4BIebsx0fW1Z6aptl05HBj"),
  // Daily Drive
  "n9": play("spotify:playlist:37i9dQZF1EfQP9X79Savvn"),
  //
  // "~n0": { type: "app", command: "hide", app: ["dockIndex", 0] },
  // "n0": { type: "app", command: cycle, app: ["dockIndex", 0] },
  // "n1": { type: "app", command: cycle, app: ["dockIndex", 1] },
  // "n2": { type: "app", command: cycle, app: ["dockIndex", 2] },
  // "n3": { type: "app", command: cycle, app: ["dockIndex", 3] },
  // "n4": { type: "app", command: cycle, app: ["dockIndex", 4] },
  // "n5": { type: "app", command: cycle, app: ["dockIndex", 5] },
  // "n6": { type: "app", command: cycle, app: ["dockIndex", 6] },
  // "n7": { type: "app", command: cycle, app: ["dockIndex", 7] },
  // "n8": { type: "app", command: cycle, app: ["dockIndex", 8] },
  // "n9": { type: "app", command: cycle, app: ["dockIndex", 9] },
  // "@n0": { type: "app", command: "quit", app: ["dockIndex", 0] },
  // "@n1": { type: "app", command: "quit", app: ["dockIndex", 1] },
  // "@n2": { type: "app", command: "quit", app: ["dockIndex", 2] },
  // "@n3": { type: "app", command: "quit", app: ["dockIndex", 3] },
  // "@n4": { type: "app", command: "quit", app: ["dockIndex", 4] },
  // "@n5": { type: "app", command: "quit", app: ["dockIndex", 5] },
  // "@n6": { type: "app", command: "quit", app: ["dockIndex", 6] },
  // "@n7": { type: "app", command: "quit", app: ["dockIndex", 7] },
  // "@n8": { type: "app", command: "quit", app: ["dockIndex", 8] },
  // "@n9": { type: "app", command: "quit", app: ["dockIndex", 9] },
  // "p1": { type: "app", action: "open", app: ["dockIndex", 0] },
};

for (let oldKey in SHORTCUTS) {
  let key = oldKey;
  key = key.replace("b", "\x7F"); // "backspace"
  key = key.replace("w", "\uF700"); // "up"
  key = key.replace("s", "\uF701"); // "down"
  key = key.replace("a", "\uF702"); // "left"
  key = key.replace("d", "\uF703"); // "right"
  key = key.replace("r", "\r"); // "return"
  key = key.replace("e", "\x03"); // "enter"
  key = key.replace("f01", "f\uF704"); // function key
  key = key.replace("f02", "f\uF705"); // function key
  key = key.replace("f03", "f\uF706"); // function key
  key = key.replace("f04", "f\uF707"); // function key
  key = key.replace("f05", "f\uF708"); // function key
  key = key.replace("f06", "f\uF709"); // function key
  key = key.replace("f07", "f\uF70A"); // function key
  key = key.replace("f08", "f\uF70B"); // function key
  key = key.replace("f09", "f\uF70C"); // function key
  key = key.replace("f10", "f\uF70D"); // function key
  key = key.replace("f11", "f\uF70E"); // function key
  key = key.replace("f12", "f\uF70F"); // function key
  key = key.replace("f13", "f\uF710"); // function key
  key = key.replace("f14", "f\uF711"); // function key
  key = key.replace("f15", "f\uF712"); // function key
  key = key.replace("f16", "f\uF713"); // function key
  key = key.replace("f17", "f\uF714"); // function key
  key = key.replace("f18", "f\uF715"); // function key
  key = key.replace("f19", "f\uF716"); // function key
  if (key !== oldKey) {
    SHORTCUTS[key] = SHORTCUTS[oldKey];
    delete SHORTCUTS[oldKey];
  }
}

let keys = Object.keys(SHORTCUTS);

let keysProcess = Deno.run({
  cmd: ["swift", "lib-swift/input-keys.swift", keys.join("\n")],
  stdout: "piped",
});

let appsProcess = Deno.run({
  cmd: ["swift", "lib-swift/output-apps.swift", keys.join("\n")],
  stdin: "piped",
});

async function osascript(cmd: string) {
  let process = Deno.run({ cmd: ["osascript", "-e", cmd] });
  return await process.status();
}

async function openAppId(id: string) {
  let process = Deno.run({ cmd: ["open", "-b", id] });
  await process.status();
}

async function quitAppId(id: string) {
  await osascript(`quit app id "${id}"`);
}

async function spotifyPlayPause() {
  await osascript(
    `if running of application "Spotify" then tell application "Spotify" to playpause`,
  );
}

async function spotifyPlayTrack(track: string, shuffle: boolean) {
  osascript(`
    tell application "Spotify"
      pause
      delay 1
      if shuffling enabled then set shuffling to ${shuffle}
      play track "${track}"
    end tell
  `);
}

async function manipulateApp(id: string, x: string, y: string, z: string) {
  const encoder = new TextEncoder();
  appsProcess.stdin.write(encoder.encode(id + "\n"));
  appsProcess.stdin.write(encoder.encode(x + "\n"));
  appsProcess.stdin.write(encoder.encode(y + "\n"));
  appsProcess.stdin.write(encoder.encode(z + "\n"));
}

async function getDockAppIds() {
  let process = Deno.run({
    cmd: ["defaults", "read", "com.apple.dock", "persistent-apps"],
    stdout: "piped",
  });
  const decoder = new TextDecoder();
  const rawOutput = await process.output();
  let output = decoder.decode(rawOutput);

  let appIds = ["com.apple.finder"];
  for (let m of output.matchAll(/"bundle-identifier" = "([^"]+)"/g)) {
    appIds.push(m[1]);
  }
  return appIds;
}

let DOCK_APP_IDS = await getDockAppIds();

for await (let key of readLines(keysProcess.stdout)) {
  let action = SHORTCUTS[key];
  console.log(key, action);

  if (!action) continue;

  switch (action.type) {
    case "app": {
      let id;
      switch (action.app[0]) {
        case "id":
          id = action.app[1];
          break;
        case "dockIndex":
          id = DOCK_APP_IDS[action.app[1]];
          break;
      }

      let command: [string, string, string];
      if (typeof action.command === "string") {
        command = [action.command, action.command, action.command];
      } else {
        command = action.command;
      }
      manipulateApp(id, ...command);
      break;
    }
    case "js": {
      action.command();
      break;
    }
    case "as": {
      osascript(action.command);
      break;
    }
    case "spotify": {
      switch (action.command[0]) {
        case "playPause":
          spotifyPlayPause();
          break;

        case "playTrack": {
          let [_, track, shuffle] = action.command;
          spotifyPlayTrack(track, shuffle);
        }
      }
    }
  }
}
await keysProcess.status();
