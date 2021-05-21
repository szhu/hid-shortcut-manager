export default async function open(...args: string[]) {
  const process = Deno.run({ cmd: ["open", ...args] });
  await process.status();
}
