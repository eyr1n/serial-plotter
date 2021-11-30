export class StreamTransformer {
  #container = "";

  transform(chunk: string, controller: TransformStreamDefaultController) {
    this.#container += chunk;
    const lines = this.#container.split(/\n|\r\n/);
    this.#container = lines.pop() ?? "";
    lines.forEach((line) => controller.enqueue(line.replace("\0", "")));
  }

  flush(controller: TransformStreamDefaultController) {
    controller.enqueue(this.#container);
  }
}
