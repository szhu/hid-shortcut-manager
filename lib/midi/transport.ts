#!/usr/bin/env deno run --allow-run
// Usage:
//   receivemidi dev 'Keystation 61 MK3 (Transport)' | deno run --allow-run lib/midi/transport.ts | xargs -L1 cliclick

import { readLines } from "https://deno.land/std@0.119.0/io/buffer.ts";

// let subprocess = Deno.run({
//   cmd: ["receivemidi", "dev", "Keystation 61 MK3 (Transport)"],
//   stdout: "piped",
// });

let map: Record<string, string | undefined> = {
  A5: new Array(16).fill("kp:brightness-down").join(" "),
  "A#5": new Array(4).fill("kp:brightness-down").join(" "),
  B5: new Array(4).fill("kp:brightness-up").join(" "),
  C6: "kp:volume-up",
  "C#6": "kp:volume-down",
  D6: "kp:arrow-left",
  "D#6": "kp:arrow-right",
  E6: "kp:play-pause",
};

// for await (let line of readLines(subprocess.stdout)) {
for await (let line of readLines(Deno.stdin)) {
  let [channelText, channel, command, note, vel] = line.split(/ +/g);
  if (command === "note-on") {
    let key = map[note];
    if (key) {
      console.log(`${key}`);
      continue;
    }
  } else {
    continue;
  }

  console.error(line);
}
