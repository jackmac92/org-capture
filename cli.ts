import yargs from "https://deno.land/x/yargs/deno.ts";
import { Arguments } from "https://deno.land/x/yargs/deno-types.ts";
import { orgCaptureUrlFactoryCore } from "./mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";

const encoder = new TextEncoder();

yargs(Deno.args)
  .command(
    "toUrl",
    "Capture from json arg (or - for stdin json)",
    // deno-lint-ignore no-explicit-any
    (yargs: any) => {
      yargs.positional("subprotocol", {
        description: "the org-protocol protocol to use",
      });
      yargs.default("subprotocol", "capture");

      yargs.option("with-files", {
        type: "boolean",
      });
      yargs.option("with-dir", {
        type: "boolean",
      });

      yargs.option("file", {
        type: "string",
        nargs: 1,
      });
      yargs.default("file", "-");
      return yargs;
    },
    (argv: Arguments) => {
      let input;
      const inputFile = argv.file;

      return (async () => {
        if (inputFile !== "-") {
          input = await Deno.readTextFile(inputFile);
        } else {
          const buf = new Uint8Array(1024);
          /* Reading into `buf` from start.
           * buf.subarray(0, n) is the read result.
           * If n is instead Deno.EOF, then it means that stdin is closed.
           */
          const n = await Deno.stdin.read(buf);
          if (n === null) {
            throw Error("unable to read stdin");
          }
          input = new TextDecoder().decode(buf.subarray(0, n));
        }

        if (!path.isAbsolute(inputFile)) {
          throw Error("Must provide an absolute path");
        }
        const inputFileAbsPath = inputFile;
        const inputFileAbsPathDir = path.dirname(inputFileAbsPath);
        const params = JSON.parse(input);
        if (argv["with-dir"]) {
          params["capture-from-directory"] = inputFileAbsPathDir;
        }

        if (argv["with-files"]) {
          const attachments = [];
          for await (const dirEntry of Deno.readDir(inputFileAbsPathDir)) {
            await Deno.stderr.write(
              encoder.encode(`Checking ${dirEntry.name}\n`),
            );

            if (dirEntry.isFile && dirEntry.name !== "Dictionary.json") {
              await Deno.stderr.write(
                encoder.encode(`Adding ${dirEntry.name}\n`),
              );
              attachments.push(path.join(inputFileAbsPathDir, dirEntry.name));
            }
          }
          if (attachments.length > 0) {
            await Deno.stderr.write(
              encoder.encode(
                `\n\n\nFound attachments w/in ${inputFileAbsPathDir}\n`,
              ),
            );
            params["attachments"] = attachments;
          }
        }

        console.log(
          orgCaptureUrlFactoryCore(argv.subprotocol, params).toString(),
        );
      })();
    },
  )
  //@ts-expect-error :noidea: for yargs type
  .strictCommands().argv;
