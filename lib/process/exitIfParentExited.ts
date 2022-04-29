async function isPidAlive(pid: number) {
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
  if (!(await isPidAlive(Deno.ppid))) {
    Deno.kill(-Deno.pid, "SIGTERM");
  }
}
