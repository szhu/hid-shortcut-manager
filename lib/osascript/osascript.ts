export default async function osascript(cmd: string) {
  const process = Deno.run({ cmd: ["osascript", "-e", cmd] });
  return await process.status();
}
