export class SerialMonitor extends HTMLElement {
  #monitor = document.createElement("pre");

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "closed" });
    shadow.innerHTML =
      `<link rel="stylesheet" href="https://esm.sh/@picocss/pico@1.4.1?css" />
      <style>
        .monitor {
          display: flex;
          flex-direction: column-reverse;
          height: 16rem;
          padding: .5rem;
          overflow-y: scroll;
        }
        .monitor code {
          padding: 0;
        }
      </style>`;

    this.#monitor.setAttribute("class", "monitor");
    shadow.appendChild(this.#monitor);
  }

  addLine(str: string) {
    const line = document.createElement("code");
    line.innerText = str;
    this.#monitor.insertBefore(line, this.#monitor.firstElementChild);
    if (this.#monitor.childElementCount > 500 + 1) {
      this.#monitor.lastElementChild?.remove();
    }
  }
}
