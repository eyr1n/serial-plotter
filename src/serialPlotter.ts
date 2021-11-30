import uPlot from "https://esm.sh/uplot@1.6.17";

export class SerialPlotter extends HTMLElement {
  #uplot: uPlot;
  #wrapper: HTMLElement;
  #data: uPlot.AlignedData = [
    [...Array(500 + 1)].map((_, i) => i),
  ];
  #count = 0;

  #resize = () => {
    const uplot = this.#wrapper.querySelector<HTMLElement>(".uplot")!;
    const ratio = this.#wrapper.getBoundingClientRect().width / 800;
    uplot.style.transform = `scale(${ratio})`;
    uplot!.style.margin = `${
      uplot.getBoundingClientRect().height * (ratio - 1) / (2 * ratio)
    }px 0`;
  };
  #colors = [
    "blue",
    "red",
    "green",
    "darkorange",
    "purple",
    "gray",
    "teal",
    "black",
  ];

  constructor() {
    super();
    this.#wrapper = document.createElement("div");
    this.#wrapper.setAttribute("id", "wrapper");
    this.#uplot = new uPlot(
      {
        width: 800,
        height: 200,
        scales: {
          x: {
            min: 0,
            max: 500,
            auto: true,
            time: false,
          },
          y: {
            min: -5,
            max: 5,
            auto: true,
          },
        },
        series: [],
        hooks: {
          ready: [
            this.#resize,
          ],
        },
      },
      this.#data,
      this.#wrapper,
    );
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "closed" });
    shadow.innerHTML =
      `<link rel="stylesheet" href="https://esm.sh/uplot@1.6.17/dist/uPlot.min.css" />
      <style>
        :host {
          color: #000;
        }
        #wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
          border-radius: .25rem;
          background-color: #fff;
          pointer-events: none;
          overflow: hidden;
        }
        .u-series th::after {
          display: none;
        }
        .u-series .u-value {
          display: none;
        }
        .u-series:first-child {
          display: none;
        }
      </style>`;

    shadow.appendChild(this.#wrapper);
    globalThis.window.addEventListener("resize", this.#resize);
  }

  addValue(str: string) {
    const parsed = this.#parse(str);
    if (!parsed) return;

    for (const { label, value } of parsed) {
      const idx = (() => {
        const tmp = this.#uplot.series.findIndex((val) => {
          return val.label === label;
        });

        if (tmp === -1) {
          this.#data.push([]);
          this.#uplot.addSeries({
            stroke: this.#colors[(this.#data.length - 2) % 8],
            label,
          }, this.#data.length - 1);
          return this.#data.length - 1;
        }

        return tmp;
      })();

      if (this.#count > 500 + 1) {
        this.#data[idx].length = 500 + 1;
      } else {
        this.#data[idx].length = this.#count;
      }
      this.#data[idx].push(value);
    }

    if (this.#count > 500 + 1) {
      this.#data[0].push(this.#count);
      this.#data.forEach((data, idx) => {
        data.shift();
        if (data.length === 0) {
          this.#uplot.delSeries(idx);
          this.#data.splice(idx, 1);
        }
      });
    }

    this.#count++;
    this.#uplot.setData(this.#data);
  }

  #parse(str: string) {
    const values = str.trim().split(" ").map((x: string) => {
      return x.split(":");
    });

    const res: { label: string; value: number }[] = [];

    for (const idx in values) {
      const length = values[idx].length;
      const value = parseFloat(values[idx][length - 1]);
      if (Number.isNaN(value)) {
        return undefined;
      }
      if (length === 1) {
        res.push({
          label: `${idx}`,
          value,
        });
      } else if (length === 2) {
        res.push({
          label: `${values[idx][0]}`,
          value,
        });
      } else {
        return undefined;
      }
    }

    return res;
  }
}
