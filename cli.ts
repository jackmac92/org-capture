import yargs from "https://deno.land/x/yargs/deno.ts";
import { Arguments } from "https://deno.land/x/yargs/deno-types.ts";
import { orgCaptureUrlFactoryCore } from "./app.ts";

yargs(Deno.args)
  .command(
    "toUrl",
    "Capture from json arg (or - for stdin json)",
    (yargs: any) => {
      yargs.positional("subprotocol", {
        description: "the org-protocol protocol to use",
      });
      yargs.default("subprotocol", "capture");

      yargs.option("file", {
        type: "string",
        nargs: 1,
      });
      yargs.default("file", "-");
      return yargs;
    },
    (argv: Arguments) => {
      let input,
        inputFile = argv.file;

      return (async () => {
        if (argv.file !== "-") {
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

        console.log(
          orgCaptureUrlFactoryCore(argv.subprotocol, params).toString()
        );
      })();
    }
  )
  // @ts-expect-error
  .strictCommands().argv;
