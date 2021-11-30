import "https://esm.sh/@types/w3c-web-serial@1.0.2/index.d.ts";
import { SerialPlotter } from "./serialPlotter.ts";
import { SerialMonitor } from "./serialMonitor.ts";
import { StreamTransformer } from "./streamTransformer.ts";

class Serial {
  port: SerialPort | null = null;
  #reader: ReadableStreamDefaultReader | null = null;
  #inputDone: Promise<void> | null | undefined;
  #inputStream: ReadableStream | undefined;

  #serialPlotter = document.querySelector<SerialPlotter>("serial-plotter")!;
  #serialMonitor = document.querySelector<SerialMonitor>("serial-monitor")!;
  #baudRateInput = document.querySelector<HTMLInputElement>("#baud-rate")!;

  async connect() {
    this.port = await navigator.serial.requestPort();
    await this.port.open({ baudRate: parseInt(this.#baudRateInput.value) });

    const decoder = new TextDecoderStream();
    this.#inputDone = this.port.readable?.pipeTo(decoder.writable);
    this.#inputStream = decoder.readable.pipeThrough(
      new TransformStream(new StreamTransformer()),
    );
    this.#reader = this.#inputStream.getReader();

    while (true) {
      const { value, done } = await this.#reader.read();
      if (value) {
        this.#serialMonitor.addLine(value);
        this.#serialPlotter.addValue(value);
      }
      if (done) {
        this.#reader.releaseLock();
        break;
      }
    }
  }

  async disconnect() {
    if (this.#reader) {
      await this.#reader.cancel();
      await this.#inputDone?.catch(() => {});
      this.#reader = null;
      this.#inputDone = null;
    }
    await this.port?.close();
    this.port = null;
  }
}

const serial = new Serial();

document.querySelector<HTMLElement>("#connect")?.addEventListener(
  "click",
  async () => {
    const connectButton = document.querySelector<HTMLElement>("#connect")!;
    if (!document.querySelector("input")!.checkValidity()) {
      return;
    }
    if (serial.port) {
      await serial.disconnect();
      connectButton.innerText = "Connect";
      return;
    }
    await serial.connect();
    connectButton.innerText = "Disconnect";
  },
);

document.querySelector<HTMLElement>("#settings")?.addEventListener(
  "submit",
  (e) => {
    e.preventDefault();
  },
);

customElements.define("serial-monitor", SerialMonitor);
customElements.define("serial-plotter", SerialPlotter);
