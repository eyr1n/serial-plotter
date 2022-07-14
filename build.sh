#!/bin/sh

export DENO_INSTALL="./.deno"
curl -fsSL https://deno.land/x/install/install.sh | sh -s v1.19.3

./.deno/bin/deno run --unstable --allow-net --allow-read --allow-write bundle.ts
npx esbuild --minify ./static/main.js --outdir=./static --allow-overwrite
