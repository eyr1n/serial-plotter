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

  x = [] as number[];
  y = [] as number[];

  constructor(plotly: HTMLDivElement) {
    this.#plotly = plotly;
    Plotly.newPlot(this.#plotly, [this.#data], this.#layout);

    setInterval(() => {
      Plotly.extendTraces(
        this.#plotly,
        {
          x: [this.x],
          y: [this.y],
        },
        [0]
      );
      this.x.length = 0;
      this.y.length = 0;
    }, 500);
  }

  update(x: number, y: number) {
    this.x.push(x);
    this.y.push(y);
  }
}
