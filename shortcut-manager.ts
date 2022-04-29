import AppControl, { AppCommand } from "./lib/apps/Apps.ts";
import GlobalKeyListener from "./lib/keys/GlobalKeyListener.ts";
import replaceAscii from "./lib/keys/replaceAscii.ts";
import osascript from "./lib/osascript/osascript.ts";
import SpotifyControl from "./lib/spotify/Spotify.ts";
import open from "./lib/docs/open.ts";
import shell from "./lib/shell/shell.ts";
import exitIfParentExited from "./lib/process/exitIfParentExited.ts";

type Action = (() => void) & { description?: string };

function Play(
  spotifyUri: string,
  description: string | undefined = undefined,
  shuffle = true,
) {
  function fn() {
    SpotifyControl.playTrack(spotifyUri, shuffle);
  }
  fn.description = description ?? `Spotify: ${spotifyUri}`;
  return fn;
}

function Volume(level: number | string) {
  function fn() {
    SpotifyControl.setVolume(level);
  }
  fn.description = `Spotify Volume: ${level}`;
  return fn;
}

const AppShorthandToCommand = {
  h: "hide" as AppCommand,
  l: "launch" as AppCommand,
  n: "noop" as AppCommand,
  q: "quit" as AppCommand,
  r: "reopen" as AppCommand,
  s: "show" as AppCommand,
};
type AppCommandShorthand = keyof typeof AppShorthandToCommand;
type AppCommandsShorthand =
  `${AppCommandShorthand}${AppCommandShorthand}${AppCommandShorthand}`;

function App(shorthand: AppCommandsShorthand, ...ids: string[]): Action {
  let shorthandLetters = [...shorthand] as [AppCommandShorthand];
  let commands = shorthandLetters.map((c) => AppShorthandToCommand[c]) as [
    AppCommand,
    AppCommand,
    AppCommand,
  ];
  function fn() {
    apps.manipulateApp(ids, ...commands);
  }
  fn.description = `App: ${ids[0]} (and ${ids.length - 1} alternatives)`;
  return fn;
}

function Open(...args: string[]): Action {
  async function fn() {
    await open(...args);
  }
  fn.description = `Open: ${args.join(" ")}`;
  return fn;
}

function Shell(...args: string[]): Action {
  async function fn() {
    await shell(...args);
  }
  fn.description = `Shell: ${args.join(" ")}`;
  return fn;
}

async function countdown(h: number, m: number, s: number) {
  await osascript(`
      tell application id "${MenubarCountdown}"
        set hours to ${h}
        set minutes to ${m}
        set seconds to ${s}
        start timer
      end tell
    `);
}

function ChromeJs(js: string) {
  return () => {
    osascript(`tell application "Google Chrome"
      set |tab| to front window's active tab
      execute |tab| javascript "${js.replace(/"/g, '\\"')}"
    end tell`);
  };
}

const ActivityMonitor = "com.apple.ActivityMonitor";
const AirtableCr = "com.google.Chrome.app.ljknakahiebfmdmakamebpbhbikdkjfm";
const ArduinoIDE = "arduino.ProIDE";
const AsanaCr = "com.google.Chrome.app.dpbfphgmphbjphnhpceopljnkmkbpfhi";
const Calendar = "com.apple.iCal";
const Chrome = "com.google.Chrome";
const ClickUp = "com.google.Chrome.app.edcmabgkbicempmpgmniellhbjopafjh";
const ClockBar = "cn.licardo.ClockBar";
const Discord = "com.hnc.Discord";
const DiscordCr = "com.google.Chrome.app.pliiebkcmokkgndfalahlmimanmbjlab";
const FigmaCr = "com.google.Chrome.app.anhmnecnhcoggkaemikcpdnmleknnmpc";
const Finder = "com.apple.finder";
const GitUp = "co.gitup.mac";
const GlitchCr = "com.google.Chrome.app.bpkjipklloacmopdonccbdaiabfdgmgf";
const GmailCr = "com.google.Chrome.app.kmhopmchchfpfdcdjodmpfaaphdclmlj";
const HotKey = "de.codenuts.HotKey";
const Instagram = "com.google.Chrome.app.maonlnecdeecdljpahhnnlmhbmalehlm";
const MenubarCountdown = "net.kristopherjohnson.MenubarCountdown";
const Messages = "com.apple.MobileSMS";
const Messenger = "com.facebook.archon";
const MessengerCr = "com.google.Chrome.app.fmpeogjilmkgcolmjmaebdaebincaebh";
const Pock = "com.pigigaldi.pock";
const ScreenSaver = "com.apple.ScreenSaver.Engine";
const Simplenote = "com.automattic.SimplenoteMac";
const SlabCr = "com.google.Chrome.app.paccjkgbiiccgmgdhgdimdnohecgcgka";
const Slack = "com.tinyspeck.slackmacgap";
const SlackCr = "com.google.Chrome.app.cbiamopdajbbpeleeemeomhjmfhpmnna";
const SoundtrapCr = "com.google.Chrome.app.ifjccnkgpmdifkdpmkiebcbnakhblaoa";
const Spotify = "com.spotify.client";
const SpotifyCr = "com.google.Chrome.app.pjibgclleladliembfgfagdaldikeohf";
const Stickies = "com.stickes.Stickies";
const Sublime = "com.sublimetext.4";
const SystemPreferences = "com.apple.systempreferences";
const Tandem = "tandem.app";
const Terminal = "com.apple.Terminal";
const TypewriterCr = "com.google.Chrome.app.kggncmaejimakapagjggjhademakcnna";
const VSCode = "com.microsoft.VSCode";
const VSCodeCr = "com.google.Chrome.app.jhdpafkbedbgckdnecbbppbpboebapeb";
const Zoom = "us.zoom.xos";

const BluetoothPreferences =
  "/System/Library/PreferencePanes/Bluetooth.prefPane";
const Self = "/Users/Sean/Code/szhu/hid-shortcut-manager";

const Shortcuts: { [key: string]: Action | undefined } = {
  // YouTube Music
  // $8: () => {
  //   App(rrh, "com.spotify.client")();
  //   App(rrh, "com.google.Chrome.app.cinhimbnkkaeohfgghhklpknlkffjgod")();
  // },

  // "^F": ChromeJs(`for (let name of document.querySelectorAll('.name-uJV0GL')) {
  //     if (name.innerText.trim() === 'natayie') {
  //         name.click();
  //     }
  // }`),

  // System
  "^@,": App("rrh", SystemPreferences),
  "^@S": App("rrr", Finder),
  "^~@W": App("rrr", Finder),
  "$^@S": App("nqq", Finder),
  "^@B": Open(BluetoothPreferences),
  "^@b": App("rrh", ActivityMonitor),
  "^~b": App("rrh", Terminal),
  // "~/": App(rrr, ScreenSaver),

  // Utility
  // "^@.": App(rrh, HotKey),
  "^@.": Open("-b", VSCode, Self),
  // "^@.": async () => {
  //   // App(rrr, Sublime)();
  //   Open("-b", VSCode, Self)();
  // },
  "^@0": App("rrh", Tandem),
  "$^@P": App("lqq", Pock),

  // Development
  "^@E": App("nrr", Sublime, ArduinoIDE, GlitchCr, VSCodeCr, VSCode),
  "$^@E": App("rrr", VSCode),
  "^@G": App("nrh", GitUp),
  "^@P": App("nrh", GitUp, FigmaCr),
  // "^@R": App("rrr", SoundtrapCr),

  // Life/Office
  "$^@T": App("rrh", Spotify, SpotifyCr),
  "^@C": App("rrh", Calendar),
  "^@Y": App("rrh", Simplenote),
  "^~@Y": App("rrh", Stickies),
  "^@T": App("rrr", TypewriterCr),
  "$^@0": App("lqq", ClockBar),

  // Web
  "^~@N": App("rrh", GmailCr),
  "^@M": App("rrh", Messages),
  "$^@M": App("rrh", MessengerCr, Messenger),
  "^@I": App("rrh", Instagram),
  // "^@A": App('rrh', Asana), // Asana
  "^@A": App("rrh", AirtableCr),
  "^@R": App("rrh", DiscordCr, Discord),
  "^@K": App("rrh", DiscordCr, Discord),
  "^@L": App("rrh", Slack, SlackCr),
  "^@U": App("rrh", ClickUp),
  "^@W": App("rrr", Chrome),
  "^@Z": App("rrh", Zoom),

  // Spotify
  "n.": App("lhh", Spotify),
  "n*": Volume(0),
  "n+": Volume("(x + 1) * 1.2 + 1"),
  "n-": Volume("x * 0.8333"),
  "^@=": Volume("(x + 1) * 1.2 + 1"),
  "^@-": Volume("x * 0.8333"),
  "^@ ": () => SpotifyControl.playPause(),
  //
  ne: App("rrh", "com.spotify.client"),
  //
  n0: () => SpotifyControl.playPause(),
  n1: Play("spotify:station:playlist:2s9R059mmdc8kz6lrUqZZd", "Coffee Shop"),
  n2: Play("spotify:station:playlist:37i9dQZF1DX4WYpdgoIcn6", "Chill Hits"),
  n3: Play("spotify:station:playlist:37i9dQZF1DXdgz8ZB7c2CP", "Creamy"),
  n4: Play("spotify:station:track:5TTXEcfsYLh6fTarLaevTi", "NIKI - lowkey"),
  n5: Play("spotify:station:artist:2cGJym7cmkjHnXbQuZosPk", "XCRPT"),
  n6: undefined,
  n7() {
    Play("spotify:playlist:3wOYpqLSqMHweMcinQuzQQ", "1 Hour", false)();
    countdown(0, 56, 0);
  },
  f7() {
    Play("spotify:playlist:3wOYpqLSqMHweMcinQuzQQ", "1 Hour", false)();
    countdown(0, 56, 0);
  },
  n8: Play("spotify:show:4BIebsx0fW1Z6aptl05HBj", "BBC Minute"),
  n9: Play("spotify:playlist:37i9dQZF1EfQP9X79Savvn", "Daily Drive"),
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

const apps = new AppControl();

const keyListener = new GlobalKeyListener(
  Object.keys(Shortcuts),
  async (key) => {
    await exitIfParentExited();

    let action = Shortcuts[key];
    let actionString = action
      ? action?.description ?? "(No description provided)"
      : action;

    console.log();
    console.log("Received key:", key);
    console.log("      Action:", actionString);

    if (!action) return;

    Deno.run({
      cmd: ["afplay", "--volume", "0.1", "/System/Library/Sounds/Purr.aiff"],
    }).status();
    action();
  },
);

// Deno.run({
//   cmd: [
//     "bash",
//     "-c",
//     `receivemidi dev 'Keystation 61 MK3 (Transport)' | deno run --allow-run lib/midi/transport.ts | xargs -L1 cliclick`,
//   ],
// });

await keyListener.done;
