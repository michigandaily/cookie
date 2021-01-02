// JS for your graphic
import pym from "pym.js";

const resize = () => {};

window.onload = function () {
  const pymChild = new pym.Child({ renderCallback: resize, polling: 500 });
  pymChild.sendHeight();
};
