// create spec
var spec = {
  $schema: "https://vega.github.io/schema/vega/v5.json",
  description: "vega visualization world map of average coffee quality scores by country",
  width: 700,
  height: 500,
  //padding: 10,
  autosize: "none",
  data: [
    {
      name: "rawdata",
      url: "https://raw.githubusercontent.com/alyssajcrawford1/csc444/main/coffee_data_clean.csv",
      format: { type: "csv" }
    },
    {
      name: "arabica",
      url: "https://raw.githubusercontent.com/alyssajcrawford1/csc444/main/coffee_data_clean.csv",
      format: { type: "csv" },
      transform: [
        {
          type: "filter",
          expr: "(isValid(datum['Total.Cup.Points']) && datum['Total.Cup.Points'] > 0 && datum['Total.Cup.Points'] <= 100)"
        },
        {
          type: "filter",
          expr: "(isValid(datum['Country.of.Origin']) && datum['Country.of.Origin'] != '')"
        }
      ]
    },
    {
      name: "aggregated",
      source: "arabica",
      transform: [
        {
          type: "aggregate",
          groupby: ["id", "Country\\.of\\.Origin"],  // independent variable (a-axis)
          fields: ["Total\\.Cup\\.Points"],  // dependent variable (y-axis)
          ops: ["mean"],
          as: ["avg_score"]
        },
        {
          type: "formula",
          as: "avg_score",
          expr: "round(datum.avg_score * 100) / 100"
        },
        {
          type: "collect",
          sort: { field: "avg_score", order: "ascending" }
        }
      ]
    },
    {
      name: "world",
      url: "https://raw.githubusercontent.com/vega/vega/main/docs/data/world-110m.json",
      format: {
        type: "topojson",
        feature: "countries"
      },
      transform: [
        {
          type: "lookup",
          from: "aggregated",
          key: "id",
          fields: ["id"],
          values: ["avg_score"],
          default: 0
        },
        {
          type: "collect",
          sort: { field: "avg_score", order: "descending" }
        },
        {
          type: "window",
          ops: ["row_number"], as: ["rank"]
        },
        {
          type: "formula",
          as: "rank",
          expr: "datum.avg_score <= 0 ? '' : '(#' + datum.rank + ')'"
        },
        {
          type: "lookup",
          from: "rawdata",
          key: "id",
          fields: ["id"],
          values: ["Country\\.of\\.Origin"],
        }
      ],
    },
    {
      name: "graticule",
      transform: [
        { type: "graticule", step: [23, 23] }
      ]
    }
  ],
  projections: [
    {
      name: "projection",
      type: "mercator",
      scale: 100,
      center: [60, 25]
    }
  ],
  scales: [
    {
      name: "fillScale",
      type: "linear",
      domain: { data: "aggregated", field: "avg_score" },
      //domain: [0,100],
      range: { scheme: "browns" }
    }
  ],
  marks: [
    {
      type: "shape",
      from: { data: "graticule"},
      encode: {
        enter: {
          strokeWidth: { value: 1},
          stroke: { value: "#ddd"},
          fill: { value: null }
        }
      },
      transform: [
        { type: "geoshape", projection: "projection" }
      ]
    },
    {
      type: "shape",
      from: { data: "world" },
      encode: {
        update: {
          stroke: { value: "black" },
          fill: { field: "avg_score", scale: "fillScale" },
          zindex: { value: 0 }
        },
        hover: {
          stroke: { value: "firebrick" },
          zindex: { value: 1 },
          //tooltip: { signal: "datum.name + ': ' + datum.avg_score"}
          tooltip: { signal: "datum['Country.of.Origin'] + ': ' + datum.avg_score + datum.rank"}
        }
      },
      transform: [
        { type: "geoshape", projection: "projection" }
      ]
    }
  ],
  legends: [
    {
      fill: "fillScale",
      orient: "left-bottom"
    }
  ],
  title: {
    text: "Overall Coffee Score by Country of Origin",
    subtitle: 
    [
      "Overall coffee quality scores organized by country of origin",
      "of Arabica coffee, from CQI database (2010-2018)"
    ],
    fontSize: { value: 20 },
    subtitleFontSize: { value: 13 }
  }
};

// create runtime
var runtime = vega.parse(spec);

// create view
var view = new vega.View(runtime)
                   .logLevel(vega.Error)
                   .renderer("svg")
                   .initialize("#view3")
                   .hover();

// run it
view.run();