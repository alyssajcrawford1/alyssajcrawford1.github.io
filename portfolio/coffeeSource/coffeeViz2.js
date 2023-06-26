// create spec
var spec = {
  $schema: "https://vega.github.io/schema/vega/v5.json",
  description: "vega visualization scatterplot with individual and mean coffee quality scores organized by categories such as species or variety, and qualities like acidity and aroma",
  width: 600,
  height: 500,
  padding: 10,
  signals: [
    { 
      name: "CategorySelect",
      value: ["Processing.Method"],
      bind: {
        input: "select",
        options: ['Processing.Method', 'Species', 'Variety', 'Country.of.Origin'],
        name: "Category "
      }
    },
    { 
      name: "Attribute",
      value: ["Acidity"],
      bind: {
        input: "select",
        options: ['Acidity', 'Aftertaste', 'Aroma', 'Balance', 'Body',
                  'Clean.Cup', 'Flavor', 'Sweetness', 'Uniformity', 'Cupper.Points', 
                  'Category.One.Defects', 'Quakers', 'Category.Two.Defects'],
        name: "Attribute "
      }
    }
  ],
  data: [
    {
      name: "arabica1",
      url: "https://raw.githubusercontent.com/alyssajcrawford1/csc444/main/coffee_data_clean.csv",
      format: { type: "csv" },
      transform: [
        {
          type: "formula",
          as: "score",
          expr: "datum[Attribute]"
        },
        {
          type: "filter",
          //expr: "(isValid(datum['Total.Cup.Points']) && datum['Total.Cup.Points'] > 0 && datum['Total.Cup.Points'] <= 100)"
          expr: "(isValid(datum.score) && datum.score >= 0 && datum.score <= 10)"
        },
        {
          type: "formula",
          as: "category",
          expr: "datum[CategorySelect]"
        },
        {
          type: "filter",
          expr: "(isValid(datum.category) && datum.category != '')"
        }
      ]
    },
    {
      name: "aggregatedAttr",
      source: "arabica1",
      transform: [
        {
          type: "aggregate",
          groupby: ["category"],  // independent variable (a-axis)
          fields: ["score", "score"],  // dependent variable (y-axis)
          ops: ["mean", "count"],
          as: ["avg_attr", "count"]
        },
        {
          type: "formula",
          as: "avg_attr",
          expr: "round(datum.avg_attr * 100) / 100"
        },
        {
          type: "filter",
          expr: "(datum.count > 1)"
        },
        {
          type: "collect",
          sort: { field: "category", order: "ascending" }
        }
      ]
    },
    {
      name: "aggregatedTotal",
      source: "arabica1",
      transform: [
        {
          type: "aggregate",
          groupby: ["category"],  // independent variable (a-axis)
          fields: ["Total\\.Cup\\.Points", "Total\\.Cup\\.Points"],  // dependent variable (y-axis)
          ops: ["mean", "distinct"],
          as: ["avg_score", "count"]
        },
        {
          type: "formula",
          as: "avg_score",
          expr: "round(datum.avg_score * 100) / 100"
        },
        {
          type: "filter",
          expr: "(datum.count > 1)"
        },
        {
          type: "collect",
          sort: { field: "avg_score", order: "ascending" }
        }
      ]
    },
    {
      name: "arabica",
      source: "arabica1",
      transform: [
        {
          type: "lookup",
          from: "aggregatedAttr",
          key: "category",
          fields: ["category"],
          values: ["count"],
          default: 1,
          as: ["count"]
        },
        {
          type: "filter",
          expr: "(datum.count > 1)"
        }
      ]
    }
  ],



  scales: [
    {
      name: "xScale",
      type: "linear",
      //domain: { data: "arabica", field: "score" },
      domain: [0, 10],
      range: "width",
      zero: false
    },
    {
      name: "yScale",
      type: "band",
      domain: { data: "aggregatedTotal", field: "category" },
      range: "height",
      padding: 2
    }
  ],
  axes: [
    { 
      orient: "bottom", 
      scale: "xScale", 
      grid: true, 
      title: "Attribute Score (0-10)"
    },
    {
      orient: "left",
      scale: "yScale",
      //title: "Category",
      grid: true,
      gridDash: 3,
      gridOpacity: .5
    }
  ],
  marks: [
    {
      type: "symbol",
      from: { data: "arabica" },
      encode: {
        update: {
          x: { field: "score", scale: "xScale" },
          y: { field: "category", scale: "yScale" },
          zindex: { value: 1 },
          
          fill: { value: "peru" },
          fillOpacity: { value: 0.3 },
          stroke: { value: "lightskyblue" },
          strokeWidth: { value: 0 }
        },
        hover: { 
          tooltip: { signal: "datum.score" },
          fill: { value: "lightskyblue" },
          fillOpacity: { value: 1 },
          strokeWidth: { value: 2 },
          zindex: { value: 2 },
        }
      },
    },
    {
      type: "symbol",
      from: { data: "aggregatedAttr" },
      encode: {
        update: {
          x: { field: "avg_attr", scale: "xScale" },
          y: { field: "category", scale: "yScale" },
          size: { value: 100 },

          fill: { value: "saddlebrown" },
          fillOpacity: { value: 0.8 },
          stroke: { value: "dodgerblue" },
          strokeWidth: { value: 0 }
        },
        hover: { 
          tooltip: { signal: "'Average: ' + datum.avg_attr"},
          fill: { value: 'dodgerblue'},
          fillOpacity: { value: 1 },
          strokeWidth: { value: 3 }
        }
      }
    },
  ],
  title: {
    text: "Coffee Attribute Scores by Variety",
    subtitle: 
    [
      "Coffee attribute scores (acidity, aftertaste, aroma, balance,",
      "body, clean cup, flavor, sweetness, uniformity, subjective cupper score)",
      "and # different defects, organized by variety of Arabica coffee",
      "from CQI database (2010-2018)"
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
                   .initialize("#view2")
                   .hover();

// run it
view.run();