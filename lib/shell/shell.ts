export default async function shell(...args: string[]) {
  const process = Deno.run({ cmd: args });
  await process.status();
}
