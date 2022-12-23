import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

const outDir = "./dist-npm";
await emptyDir(outDir);

await build({
  outDir,
  entryPoints: ["./mod.ts"],
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    name: "org-protocol-url-from-json",
    version: Deno.args[0],
  },
});

// // post build steps
// Deno.copyFileSync("LICENSE", "npm/LICENSE");
// Deno.copyFileSync("README.md", "npm/README.md");
