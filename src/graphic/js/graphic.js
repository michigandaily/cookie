// JS for your graphic
import pym from "pym.js";
import { select } from "d3";
import { build, BarChart } from "@michigandaily/bore";

import downloadImage from "./util/download-image";
import setDisplayOptions from "./util/set-display";

const draw = () => {
  // step 1: access data
  const data = new Map().set("A", 5).set("B", 10).set("C", 2).set("D", 6);

  // step 2: create chart dimensions
  const height = 150;
  const margin = { left: 0, right: 20, bottom: 20, top: 20 };

  // step 3: draw canvas
  const svg = select("figure").append("svg");

  // step 4: create scales

  // step 5: draw data
  const chart = new BarChart().height(height).margin(margin).wrappx(0);
  svg.datum(data).call(build(chart));

  // step 6: draw peripherals
  // step 7: set up interactions
};

window.onresize = () => {};

window.onload = () => {
  const child = new pym.Child({ polling: 500 });
  child.sendHeight();
  child.onMessage("download", downloadImage);
  setDisplayOptions();
  draw();
};
