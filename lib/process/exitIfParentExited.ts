async function isPidAlive(pid: string) {
  const process = Deno.run({
    cmd: ["kill", "-0", `${pid}`],
    stdin: "null",
    stdout: "null",
    stderr: "null",
  });
  const status = await process.status();
  return status.success;
}

export default async function exitIfParentExited() {
  // deno-lint-ignore no-explicit-any
  const { ppid } = (Deno as any);
  if (!await isPidAlive(ppid)) {
    Deno.exit(0);
  }
}
