import osascript from "../../lib/osascript/osascript.ts";

const Spotify = {
  async playPause() {
    await osascript(
      `if running of application "Spotify" then tell application "Spotify" to playpause`,
    );
  },

  async playTrack(track: string, shuffle: boolean) {
    await osascript(`
      tell application "Spotify"
        pause
        delay 1
        if shuffling enabled then set shuffling to ${shuffle}
        play track "${track}"
      end tell
    `);
  },

  async setVolume(level: number | string) {
    if (typeof level === "string") {
      level = level.replace(/\bx\b/g, "sound volume");
    }

    await osascript(
      `tell application "Spotify" to set sound volume to ${level}`,
    );
  },
};

export default Spotify;
