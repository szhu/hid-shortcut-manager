export type AppCommand =
  | "noop"
  | "reopen"
  | "launch"
  | "hide"
  | "show"
  | "quit";

export default class AppManipulator {
  swiftProcess: Deno.Process<{ cmd: string[]; stdin: "piped" }>;

  constructor() {
    this.swiftProcess = Deno.run({
      cmd: ["swift", "lib/apps/Apps.swift"],
      stdin: "piped",
    });
  }

  manipulateApp(
    id: string,
    commandIfNotRunning: AppCommand,
    commandIfHidden: AppCommand = commandIfNotRunning,
    commandIfVisible: AppCommand = commandIfHidden,
  ) {
    const encoder = new TextEncoder();
    this.swiftProcess.stdin.write(encoder.encode(id + "\n"));
    this.swiftProcess.stdin.write(encoder.encode(commandIfNotRunning + "\n"));
    this.swiftProcess.stdin.write(encoder.encode(commandIfHidden + "\n"));
    this.swiftProcess.stdin.write(encoder.encode(commandIfVisible + "\n"));
  }
}
