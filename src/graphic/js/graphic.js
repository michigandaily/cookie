// JS for your graphic
import pym from "pym.js";
import * as d3 from "d3";

const resize = () => {};

window.onload = function () {
  const pymChild = new pym.Child({ renderCallback: resize, polling: 500 });
  pymChild.sendHeight();
};
