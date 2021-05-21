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
    notRunningCommand: AppCommand,
    hiddenCommand: AppCommand = notRunningCommand,
    visibleCommand: AppCommand = hiddenCommand,
  ) {
    const encoder = new TextEncoder();
    const request = {
      id,
      notRunningCommand,
      hiddenCommand,
      visibleCommand,
    };
    this.swiftProcess.stdin.write(
      encoder.encode(JSON.stringify(request) + "\n"),
    );
  }
}
