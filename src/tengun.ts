export class Tengun {
  #plotly;
  #layout = {
    margin: {
      t: 0,
      r: 0,
      b: 0,
      l: 0,
      pad: 0,
    },
    showlegend: false,
    xaxis: {
      automargin: true,
    },
    yaxis: {
      automargin: true,
      scaleanchor: 'x',
      scaleratio: 1,
    },
  };

  #data = {
    x: [] as number[],
    y: [] as number[],
    mode: 'markers',
    type: 'scatter',
  };

  constructor(plotly: HTMLDivElement) {
    this.#plotly = plotly;
    Plotly.newPlot(this.#plotly, [this.#data], this.#layout);

    setInterval(() => {
      Plotly.update(this.#plotly, [this.#data], this.#layout);
    }, 500);
  }

  update(x: number, y: number) {
    this.#data.x.push(x);
    this.#data.y.push(y);
    if (this.#data.x.length > 1000) {
      this.#data.x.shift();
      this.#data.y.shift();
    }
  }
}
