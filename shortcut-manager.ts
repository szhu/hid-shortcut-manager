import { readLines } from "https://deno.land/std@0.77.0/io/bufio.ts";

interface AppAction {
  type: "app";
  action: "open" | "quit" | "hide";
  app: ["id", string] | ["dockIndex", number];
}

type Action = AppAction;

const SHORTCUTS: { [key: string]: Action | undefined } = {
  // "^@W": { type: "app", action: "open", app: ["id", "com.google.Chrome"] },
  // "^@E": { type: "app", id: "com.microsoft.VSCode" },
  "~n0": { type: "app", action: "hide", app: ["dockIndex", 0] },
  "n0": { type: "app", action: "open", app: ["dockIndex", 0] },
  "n1": { type: "app", action: "open", app: ["dockIndex", 1] },
  "n2": { type: "app", action: "open", app: ["dockIndex", 2] },
  "n3": { type: "app", action: "open", app: ["dockIndex", 3] },
  "n4": { type: "app", action: "open", app: ["dockIndex", 4] },
  "n5": { type: "app", action: "open", app: ["dockIndex", 5] },
  "n6": { type: "app", action: "open", app: ["dockIndex", 6] },
  "n7": { type: "app", action: "open", app: ["dockIndex", 7] },
  "n8": { type: "app", action: "open", app: ["dockIndex", 8] },
  "n9": { type: "app", action: "open", app: ["dockIndex", 9] },
  "@n0": { type: "app", action: "quit", app: ["dockIndex", 0] },
  "@n1": { type: "app", action: "quit", app: ["dockIndex", 1] },
  "@n2": { type: "app", action: "quit", app: ["dockIndex", 2] },
  "@n3": { type: "app", action: "quit", app: ["dockIndex", 3] },
  "@n4": { type: "app", action: "quit", app: ["dockIndex", 4] },
  "@n5": { type: "app", action: "quit", app: ["dockIndex", 5] },
  "@n6": { type: "app", action: "quit", app: ["dockIndex", 6] },
  "@n7": { type: "app", action: "quit", app: ["dockIndex", 7] },
  "@n8": { type: "app", action: "quit", app: ["dockIndex", 8] },
  "@n9": { type: "app", action: "quit", app: ["dockIndex", 9] },

  "p1": { type: "app", action: "open", app: ["dockIndex", 0] },
};

let keys = Object.keys(SHORTCUTS);

console.log(["swift", "global-key-listener.swift", keys.join("\n")])
let keyListenerProcess = Deno.run({
  cmd: ["swift", "global-key-listener.swift", keys.join("\n")],
  stdout: "piped",
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

async function hideAppId(id: string) {
  let process = Deno.run({ cmd: ["swift", "runningApps.swift", id, "hide"] });
  await process.status();
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

for await (let key of readLines(keyListenerProcess.stdout)) {
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

      switch (action.action) {
        case "open":
          openAppId(id);
          break;
        case "quit":
          quitAppId(id);
          break;
        case "hide":
          hideAppId(id);
          break;
      }
      break;
    }
  }
}
await keyListenerProcess.status();
