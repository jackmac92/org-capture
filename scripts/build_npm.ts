import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
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
