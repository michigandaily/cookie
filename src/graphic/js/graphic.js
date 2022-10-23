// JS for your graphic
import pym from "pym.js";
// import * as d3 from "d3";

import downloadImage from "./util/download-image";
import setDisplayOptions from "./util/set-display";

const draw = () => {
  // step 1: access data
  // step 2: create chart dimensions
  // step 3: draw canvas
  // step 4: create scales
  // step 5: draw data
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
