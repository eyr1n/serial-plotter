import { blue, red, yellow } from "https://deno.land/std@0.116.0/fmt/colors.ts";

const entryPoint = "./src/main.ts";
const compilerOptions = {
  lib: ["esnext", "dom"],
};

export const bundle = async () => {
  const { files, diagnostics } = await Deno.emit(entryPoint, {
    bundle: "module",
    compilerOptions,
  }).catch((err) => {
    throw new Error(err.message);
  });

  for (const item of diagnostics) {
    const message = item.messageText ?? "";
    if (!item.messageText) {
      continue;
    }

    switch (item.category) {
      case Deno.DiagnosticCategory.Warning:
        console.warn(yellow(message));
        break;
      case Deno.DiagnosticCategory.Error:
        console.error(red(message));
        break;
      case Deno.DiagnosticCategory.Suggestion:
        console.info(blue(message));
        break;
      case Deno.DiagnosticCategory.Message:
        console.log(message);
        break;
    }
  }

  return files["deno:///bundle.js"];
};

if (import.meta.main) {
  const file = await bundle().catch((err) => {
    console.error(err.message);
    return undefined;
  });

  if (file) {
    await Deno.writeFile("./static/main.js", new TextEncoder().encode(file));
  }
}
