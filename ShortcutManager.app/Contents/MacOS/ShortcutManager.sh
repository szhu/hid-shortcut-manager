#!/bin/sh

set -e

# https://unix.stackexchange.com/a/76604/64762
here=$(cd -P -- "$(dirname -- "$0")" && printf '%s\n' "$(pwd -P)")


cd "$here"
swift ShortcutManager.swift &


cd "$here/../../.."
ls
# swift lib-swift/input-keys.swift > out
bash -c 'sleep 1; /usr/local/bin/deno run --allow-run shortcut-manager.ts' > out
