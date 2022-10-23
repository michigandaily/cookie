const $ = (selector) => document.querySelector(selector);

const hide = (selector) => {
  const element = $(selector);
  if (element) {
    element.style.display = "none";
  }
};

const setDisplayOptions = () => {
  const q = new URLSearchParams(window.location.search.slice(1));
  const shouldHide = (prop) => q.get(prop) === "false";
  if (shouldHide("hed")) hide(".figure__title");
  if (shouldHide("dek")) hide(".figure__caption");
  if (shouldHide("note")) hide(".figure__note");
  if (shouldHide("source")) hide(".figure__source");
  if (shouldHide("byline")) hide(".figure__byline");

  if (q.get("homepage") === "true") {
    document.body.classList.add("homepage");
  }
};

export default setDisplayOptions;
