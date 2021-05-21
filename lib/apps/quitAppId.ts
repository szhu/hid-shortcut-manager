import osascript from "../../lib/osascript/osascript.ts";

export default async function quitAppId(id: string) {
  await osascript(`quit app id "${id}"`);
}
