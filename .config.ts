import { config as env } from "https://deno.land/x/dotenv/mod.ts";
import type { DenonConfig } from "https://deno.land/x/denon/mod.ts";

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: "deno run mod.ts",
      desc: "run my mod.ts file",
      lock: "lock.json", // check specified lockfile
      unstable: true,
      env: env(),
      tsconfig: "tsconfig.json",
      log: "debug", // or 'info'
      allow: {
        read: "/etc,/tmp", // --allow-read=/etc,/tmp
        env: true, // --allow-env
      },
    },
  },
  watcher: {
    // The number of milliseconds after the last change.
    interval: 350,
    // The file extensions that it will scan for.
    exts: ["js", "jsx", "ts", "tsx", "json"],
    // The globs that it will scan for.
    match: ["**/*.*"],
    // The globs that it will not scan for.
    skip: ["*/.git/*"],
    // Use the legacy file monitoring algorithm. (walking)
    legacy: false,
  },
  logger: {
    // Clear screen after every restart.
    fullscreen: false,
    // Output only errors
    quiet: false,
    // Output debug messages
    debug: true,
  },
  // globally applied to all scripts
  // as object ...
  allow: {
    read: "/etc,/tmp", // --allow-read=/etc,/tmp
    env: true, // --allow-env
  },
  // // ... or as array
  // allow: [
  //   "run", // --allow-run
  //   "net", // --allow-net
  // ],
};

export default config;
