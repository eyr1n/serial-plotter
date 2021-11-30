#!/usr/bin/env -S deno run --unstable --allow-net --allow-read

import { Application } from "https://deno.land/x/oak@v10.0.0/mod.ts";
import { bundle } from "./bundle.ts";

const app = new Application();

app.use(async (context, next) => {
  if (!context.request.url.pathname.startsWith("/main.js")) {
    await next();
    return;
  }

  const file = await bundle().catch((err) => {
    return `console.error("${err.message}");`;
  });
  context.response.body = file;
  context.response.headers.set(
    "content-type",
    "text/javascript; charset=utf-8",
  );
});

app.use(async (context) => {
  await context.send({
    root: `./static`,
    index: "index.html",
  });
});

app.addEventListener("listen", ({ hostname, port }) => {
  console.log(`Listening on http://${hostname}:${port}`);
});

await app.listen({ hostname: "127.0.0.1", port: 8000 });
