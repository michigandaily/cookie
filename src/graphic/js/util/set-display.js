import { $, getQueryParams } from "../../../js/util";

const params = getQueryParams();

const shouldHide = (prop) => params.get(prop) === "false";
const hide = (selector) => {
  const element = $(selector);
  if (element) {
    $(selector).style.display = "none";
  }
};

const setDisplay = () => {
  if (shouldHide("hed")) hide(".figure__title");
  if (shouldHide("dek")) hide(".figure__caption");
  if (shouldHide("note")) hide(".figure__note");
  if (shouldHide("source")) hide(".figure__source");
  if (shouldHide("byline")) hide(".figure__byline");
  if (params.get("home") === "true") document.body.classList.add("homepage");
};

export default setDisplay;
