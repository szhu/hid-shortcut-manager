export default async function getDockAppIds() {
  const process = Deno.run({
    cmd: ["defaults", "read", "com.apple.dock", "persistent-apps"],
    stdout: "piped",
  });
  const decoder = new TextDecoder();
  const rawOutput = await process.output();
  const output = decoder.decode(rawOutput);

  const appIds = ["com.apple.finder"];
  for (const m of output.matchAll(/"bundle-identifier" = "([^"]+)"/g)) {
    appIds.push(m[1]);
  }
  return appIds;
}
