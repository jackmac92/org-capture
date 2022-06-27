import yargs from "https://deno.land/x/yargs/deno.ts";
import { Arguments } from "https://deno.land/x/yargs/deno-types.ts";
import { orgCaptureUrlFactoryCore } from "./app.ts";
import * as path from "https://deno.land/std/path/mod.ts";

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

      yargs.option("with-dir", {
        type: "boolean",
      });
      yargs.default("with-dir", false);

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

        const params = JSON.parse(input);
        if (argv["with-dir"].length > 0) {
          params["capture-from-directory"] = path.dirname(inputFile);
        }

        console.log(
          orgCaptureUrlFactoryCore(argv.subprotocol, params).toString()
        );
      })();
    }
  )
  //@ts-expect-error :noidea: for yargs type
  .strictCommands().argv;
