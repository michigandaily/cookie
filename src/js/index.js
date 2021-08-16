import pym from "pym.js";

const $ = selector => document.querySelector(selector);

const setQueryParams = params => {
  history.replaceState(null, window.title, `?${params.toString()}`);
};

const getQueryParams = () => new URLSearchParams(location.search.slice(1));

const setWidth = width => {
  $("#graphic").style.width = `${width}px`;
  const params = getQueryParams();
  params.set("width", width);
  setQueryParams(params);
};

// https://www.freecodecamp.org/news/javascript-debounce-example/
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

window.onload = () => {
  console.log("The Michigan Daily graphics preview");
  new pym.Parent("graphic", "./graphic/index.html", {});

  // Set the width on load if exists
  if (location.hash) {
    const params = getQueryParams();
    if (params.has("width")) {
      setWidth(params.get("width"));
    }
  }

  const resizeObserver = new ResizeObserver(
    debounce(entries => {
      const width = entries[0].contentRect.width;
      setWidth(width);
    })
  );
  resizeObserver.observe($("#graphic"));

  $("#desktop-preview").addEventListener("click", () => { setWidth(780); });
  $("#small-mobile-preview").addEventListener("click", () => { setWidth(288); });
  $("#large-mobile-preview").addEventListener("click", () => { setWidth(338); });

  const urlInput = $("#url-input");
  urlInput.value = `${window.location.origin + window.location.pathname}graphic/index.html`;

  const copyButton = $("#copy-url-button");

  copyButton.addEventListener("click", () => {
    urlInput.select();
    urlInput.setSelectionRange(0, urlInput.value.length);
    document.execCommand("copy");
    copyButton.innerHTML = "Copied!";
  });
};
