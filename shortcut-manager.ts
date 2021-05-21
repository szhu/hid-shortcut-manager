// deno-lint-ignore-file prefer-const
import Apps, { AppCommand } from "./lib/apps/Apps.ts";
import GlobalKeyListener from "./lib/keys/GlobalKeyListener.ts";
import replaceAscii from "./lib/keys/replaceAscii.ts";
import osascript from "./lib/osascript/osascript.ts";
import Spotify from "./lib/spotify/Spotify.ts";
import open from "./lib/docs/open.ts";
import exitIfParentExited from "./lib/process/exitIfParentExited.ts";

type Action = (() => void) & ({ description?: string });

let rrh: [AppCommand, AppCommand, AppCommand] = ["reopen", "reopen", "hide"];
let nrh: [AppCommand, AppCommand, AppCommand] = ["noop", "reopen", "hide"];
let rrr: [AppCommand, AppCommand, AppCommand] = ["reopen", "reopen", "reopen"];
let nrr: [AppCommand, AppCommand, AppCommand] = ["noop", "reopen", "reopen"];
// rrh = rrr;
// nrh = nrr;

function Play(
  spotifyUri: string,
  description: string | undefined = undefined,
  shuffle = true,
) {
  function fn() {
    Spotify.playTrack(spotifyUri, shuffle);
  }
  fn.description = description ?? `Spotify: ${spotifyUri}`;
  return fn;
}

function Volume(level: number | string) {
  function fn() {
    Spotify.setVolume(level);
  }
  fn.description = `Spotify Volume: ${level}`;
  return fn;
}

function App(command: [AppCommand, AppCommand, AppCommand], ...ids: string[]) {
  function fn() {
    apps.manipulateApp(ids, ...command);
  }
  fn.description = `App: ${ids}`;
  return fn;
}

function Vscode(path: string) {
  async function fn() {
    await open("-b", "com.microsoft.VSCode", path);
  }
  fn.description = `Open with VSCode: ${path}`;
  return fn;
}

const Shortcuts: { [key: string]: Action | undefined } = {
  // System
  "^@,": App(rrh, "com.apple.systempreferences"),
  "^@S": App(rrh, "com.apple.finder"),
  "$^@S": App(["noop", "quit", "quit"], "com.apple.finder"),
  "^@b": App(rrh, "com.apple.ActivityMonitor"),
  "^~b": App(rrh, "com.apple.Terminal"),
  "~/": App(rrr, "com.apple.ScreenSaver.Engine"),

  // Utility
  // "^@.": App(rrh, "de.codenuts.HotKey"),
  "^@.": Vscode("/Users/Sean/Code/szhu/hid-shortcut-manager"),
  "^@0": App(rrh, "tandem.App"),
  "$^@P": App(["launch", "quit", "quit"], "com.pigigaldi.pock"),

  // Development
  "^@E": App(rrh, "com.microsoft.VSCode"),
  "$^@E": App(nrr, "arduino.ProIDE"),
  "^@G": App(nrh, "co.gitup.mac"),

  // Life/Office
  "$^@T": App(rrh, "com.spotify.client"),
  "^@C": App(rrh, "com.apple.iCal"),
  "^@Y": App(rrh, "com.automattic.SimplenoteMac"),
  "^~@Y": App(rrh, "com.apple.Stickies"),
  "^@T": App(rrh, "com.google.Chrome.App.paccjkgbiiccgmgdhgdimdnohecgcgka"),

  // Web
  "$^@M": App(
    rrh,
    "com.google.Chrome.app.fmpeogjilmkgcolmjmaebdaebincaebh",
    "com.facebook.archon",
  ),
  "^@A": App(rrh, "com.google.Chrome.App.dpbfphgmphbjphnhpceopljnkmkbpfhi"),
  "^@K": App(rrh, "com.google.Chrome.App.magkoliahgffibhgfkmoealggombgknl"),
  "^@U": App(rrh, "com.google.Chrome.App.edcmabgkbicempmpgmniellhbjopafjh"),
  "^@W": App(rrr, "com.google.Chrome"),
  "^@Z": App(rrh, "us.zoom.xos"),

  // Spotify
  "n.": App(["launch", "hide", "hide"], "com.spotify.client"),
  "n*": Volume(0),
  "n+": Volume("(x + 1) * 1.2 + 1"),
  "n-": Volume("x * 0.8333"),
  "^@=": Volume("(x + 1) * 1.2 + 1"),
  "^@-": Volume("x * 0.8333"),
  "^@ ": () => Spotify.playPause(),
  //
  "ne": App(["reopen", "reopen", "hide"], "com.spotify.client"),
  //
  "n0": () => Spotify.playPause(),
  "n1": Play("spotify:station:playlist:2s9R059mmdc8kz6lrUqZZd", "Coffee Shop"),
  "n2": Play("spotify:station:playlist:37i9dQZF1DX4WYpdgoIcn6", "Chill Hits"),
  "n3": Play("spotify:station:playlist:37i9dQZF1DXdgz8ZB7c2CP", "Creamy"),
  "n4": Play("spotify:station:track:5TTXEcfsYLh6fTarLaevTi", "NIKI - lowkey"),
  "n5": Play("spotify:station:artist:2cGJym7cmkjHnXbQuZosPk", "XCRPT"),
  "n6": undefined,
  "n7"() {
    Spotify.playTrack("spotify:playlist:3wOYpqLSqMHweMcinQuzQQ", false);
    osascript(`
      tell application "Menubar Countdown"
        set hours to 0
        set minutes to 56
        set seconds to 0
        start timer
      end tell
    `);
  },
  "f7"() {
    Spotify.playTrack("spotify:playlist:3wOYpqLSqMHweMcinQuzQQ", false);
    osascript(`
        tell application "Menubar Countdown"
          set hours to 0
          set minutes to 56
          set seconds to 0
          start timer
        end tell
      `);
  },
  "n8": Play("spotify:show:4BIebsx0fW1Z6aptl05HBj", "BBC Minute"),
  "n9": Play("spotify:playlist:37i9dQZF1EfQP9X79Savvn", "Daily Drive"),
  //
  // "~n0": { type: "App", command: "hide", App: ["dockIndex", 0] },
  // "n0": { type: "App", command: cycle, App: ["dockIndex", 0] },
  // "n1": { type: "App", command: cycle, App: ["dockIndex", 1] },
  // "n2": { type: "App", command: cycle, App: ["dockIndex", 2] },
  // "n3": { type: "App", command: cycle, App: ["dockIndex", 3] },
  // "n4": { type: "App", command: cycle, App: ["dockIndex", 4] },
  // "n5": { type: "App", command: cycle, App: ["dockIndex", 5] },
  // "n6": { type: "App", command: cycle, App: ["dockIndex", 6] },
  // "n7": { type: "App", command: cycle, App: ["dockIndex", 7] },
  // "n8": { type: "App", command: cycle, App: ["dockIndex", 8] },
  // "n9": { type: "App", command: cycle, App: ["dockIndex", 9] },
  // "@n0": { type: "App", command: "quit", App: ["dockIndex", 0] },
  // "@n1": { type: "App", command: "quit", App: ["dockIndex", 1] },
  // "@n2": { type: "App", command: "quit", App: ["dockIndex", 2] },
  // "@n3": { type: "App", command: "quit", App: ["dockIndex", 3] },
  // "@n4": { type: "App", command: "quit", App: ["dockIndex", 4] },
  // "@n5": { type: "App", command: "quit", App: ["dockIndex", 5] },
  // "@n6": { type: "App", command: "quit", App: ["dockIndex", 6] },
  // "@n7": { type: "App", command: "quit", App: ["dockIndex", 7] },
  // "@n8": { type: "App", command: "quit", App: ["dockIndex", 8] },
  // "@n9": { type: "App", command: "quit", App: ["dockIndex", 9] },
  // "p1": { type: "App", action: "open", App: ["dockIndex", 0] },
};

for (let oldKey in Shortcuts) {
  let key = replaceAscii(oldKey);
  if (key !== oldKey) {
    Shortcuts[key] = Shortcuts[oldKey];
    delete Shortcuts[oldKey];
  }
}

let apps = new Apps();

let keyListener = new GlobalKeyListener(Object.keys(Shortcuts), async (key) => {
  await exitIfParentExited();

  let action = Shortcuts[key];
  console.log(key, Boolean(action), action?.description);

  if (!action) return;

  action();
});

await keyListener.done;
