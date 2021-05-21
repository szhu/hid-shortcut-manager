export default async function openAppId(id: string) {
  const process = Deno.run({ cmd: ["open", "-b", id] });
  await process.status();
}
