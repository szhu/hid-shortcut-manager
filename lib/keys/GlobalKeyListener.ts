import { readLines } from "https://deno.land/std@0.77.0/io/bufio.ts";

type Key = string;
type OnKey = (key: Key) => void;

export default class GlobalKeyListener {
  swiftProcess: Deno.Process<{ cmd: string[]; stdout: "piped" }>;
  onKey: OnKey;

  constructor(keys: Key[], onKey: OnKey) {
    this.onKey = onKey;
    this.swiftProcess = Deno.run({
      cmd: ["swift", "lib/keys/GlobalKeyListener.swift", keys.join("\n")],
      stdin: "null",
      stdout: "piped",
    });
    this.start();
  }

  async start() {
    for await (const key of readLines(this.swiftProcess.stdout)) {
      this.onKey(key);
    }
  }

  get done() {
    return this.swiftProcess.status();
  }
}
