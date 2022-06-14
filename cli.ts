// TODO should parse json stdin and convert it to an org capture link which it opens

import { exists } from "https://deno.land/std@0.99.0/fs/mod.ts";
import yargs from "https://deno.land/x/yargs/deno.ts";
import { Arguments } from "https://deno.land/x/yargs/deno-types.ts";
import os from "https://deno.land/x/dos@v0.11.0/mod.ts";

const homepath = Deno.env.get("HOME");
const encoder = new TextEncoder();
const encoded = (val: string) => encoder.encode(val);

const findBrowserConfigDir = async (browser: string) => {
  const osPlatform = os.platform();
  console.log(`Looking up dir for ${browser} on ${osPlatform}`);

  //@ts-expect-error
  const orderedLocationsToCheck: string | undefined = {
    "linux chrome": [".config/google-chrome", ".config/google-chrome-beta"],
    "linux chromium": [".config/chromium"],
    "linux brave": [".config/BraveSoftware/Brave-Browser"],
    "linux vivaldi": [".config/vivaldi"],
    "darwin chrome": [
      "Library/Application Support/Google/Chrome",
      "Library/Application Support/Google/Chrome Beta",
    ],
    "darwin chromium": ["Library/Application Support/Chromium"],
    "darwin vivaldi": ["Library/Application Support/Vivaldi"],
  }[`${osPlatform} ${browser}`];

  if (!orderedLocationsToCheck) {
    throw new Error("Unknown browser/os combo");
  }

  for (const potentialLocation of orderedLocationsToCheck) {
    const p = `${homepath}/${potentialLocation}`;
    if (await exists(p)) {
      return p;
    }
  }
  throw new Error("Unable to locate chrome config dir");
};

const lookupDenoPath = async () => {
  const x = Deno.run({
    cmd: ["which", "deno"],
    stdout: "piped",
    stderr: "piped",
  });

  await x.status();

  const o = await x.output();

  const decoder = new TextDecoder();
  const outstr = decoder.decode(o);
  return outstr.split("\n").filter(Boolean)[0];
};

const writeShellScript = async (
  targetPath: string,
  codeURI: string,
  denoFlags: string
) => {
  const denoCmd = await lookupDenoPath();

  const scriptContent = `#!/usr/bin/env bash\n${denoCmd} run ${denoFlags} ${codeURI}`;
  const loadProc = Deno.run({
    cmd: [denoCmd, "cache", ...denoFlags.split(" ").filter(Boolean), codeURI],
  });
  await Deno.writeFile(targetPath, encoded(scriptContent));
  await Deno.chmod(targetPath, 0o777);
  await loadProc.status();
};

const scriptURItoConfigURI = (denoURI: string) =>
  `${denoURI.split("/").slice(0, -1).join("/")}/native-host-params.ts`;

yargs(Deno.args)
  .command(
    "capture",
    "Capture from json arg (or - for stdin json)",
    (yargs) => {
      yargs.positional("subprotocol", {
        description: "the org-protocol protocol to use",
      });
      yargs.option("file", {
        type: "string",
        nargs: 1,
      });
    },
    async (argv: Arguments) => {
      let inputFile = argv.file;
      if (argv.file === "-") {
        inputFile = Deno.stdin;
      }
      const input = await Deno.readTextFile(inputFile);

      // console.log();
    }
  )
  // @ts-expect-error
  .strictCommands().argv;
