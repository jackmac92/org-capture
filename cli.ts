import { parseArgs } from "jsr:@std/cli/parse-args";
import { dirname, join } from "https://deno.land/std/path/mod.ts";
import { orgCaptureUrlFactoryCore } from "./mod.ts";
import type { capTypes } from "./mod.ts";

async function readInput(file: string): Promise<string> {
  if (file === "-") {
    const buf = new Uint8Array(1024);
    const n = await Deno.stdin.read(buf);
    if (n === null) {
      throw Error("unable to read stdin");
    }
    return new TextDecoder().decode(buf.subarray(0, n));
  }
  return await Deno.readTextFile(file);
}

if (import.meta.main) {
  const flags = parseArgs(Deno.args, {
    string: ["file", "subprotocol"],
    boolean: ["with-files", "with-dir"],
    default: {
      file: "-",
      subprotocol: "capture",
    },
  });

  if (flags._[0] !== "toUrl") {
    console.error("Usage: cli.ts toUrl [options]");
    Deno.exit(1);
  }

  try {
    const input = await readInput(flags.file);
    const params = JSON.parse(input);
    const inputFileAbsPath = flags.file;
    const inputFileAbsPathDir = dirname(inputFileAbsPath);

    if (flags["with-dir"]) {
      params["capture-from-directory"] = inputFileAbsPathDir;
    }

    if (flags["with-files"]) {
      const attachments = [];
      for await (const dirEntry of Deno.readDir(inputFileAbsPathDir)) {
        if (dirEntry.isFile && dirEntry.name !== "Dictionary.json") {
          attachments.push(join(inputFileAbsPathDir, dirEntry.name));
        }
      }
      if (attachments.length > 0) {
        params["attachments"] = attachments;
      }
    }

    console.log(
      orgCaptureUrlFactoryCore(
        flags.subprotocol as capTypes,
        params,
      ).toString(),
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    Deno.exit(1);
  }
}
