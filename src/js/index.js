import pym from "pym.js";

const { history, title, location } = window;

const $ = (selector) => document.querySelector(selector);

const setQueryParams = (params) => {
  history.replaceState(null, title, `?${params.toString()}`);
};

const getQueryParams = () => new URLSearchParams(location.search.slice(1));

const setWidth = (width) => {
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

window.onload = async () => {
  const graphic = $("#graphic");

  // Set the width on load if exists
  const params = getQueryParams();

  const { entries } = await import("../../config.json");
  let entry = params.get("entry") ?? Object.keys(entries)[0];

  if (!Object.hasOwn(entries, entry)) {
    params.delete("entry");
    setQueryParams(params);
    entry = Object.keys(entries)[0];
  }

  let parent = new pym.Parent("graphic", `./graphic/${entry}`, {});

  const viewRaw = $("#view-raw");
  viewRaw.href = `./graphic/${entry}`;

  const urlInput = $("#url-input");
  urlInput.value = `${location.origin + location.pathname}graphic/${entry}`;
  urlInput.size = urlInput.value.length;

  const entrypointSelect = $("#entrypoint-select");

  Object.keys(entries).forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    if (key === entry) {
      option.selected = true;
    }
    entrypointSelect.appendChild(option);
  });

  entrypointSelect.disabled = Object.keys(entries).length <= 1;
  entrypointSelect.addEventListener("change", (e) => {
    urlInput.value = `${location.origin + location.pathname}graphic/${
      e.target.value
    }`;
    urlInput.size = urlInput.value.length;

    viewRaw.href = `./graphic/${e.target.value}`;

    params.set("entry", e.target.value);
    setQueryParams(params);

    parent.remove();
    parent = new pym.Parent("graphic", `./graphic/${e.target.value}`, {});
  });

  if (params.has("width")) {
    setWidth(params.get("width"));
  }

  const resizeObserver = new ResizeObserver(
    debounce(([e]) => {
      setWidth(e.contentRect.width);
    })
  );
  resizeObserver.observe(graphic);

  $("#desktop-preview").addEventListener("click", () => {
    setWidth(780);
  });
  $("#small-mobile-preview").addEventListener("click", () => {
    setWidth(288);
  });
  $("#large-mobile-preview").addEventListener("click", () => {
    setWidth(338);
  });

  const copyButton = $("#copy-url-button");

  copyButton.addEventListener("click", () => {
    urlInput.select();
    urlInput.setSelectionRange(0, urlInput.value.length);
    document.execCommand("copy");
    copyButton.innerHTML = "Copied!";
  });

  $("#download-png").addEventListener("click", () => {
    parent.sendMessage(
      "download",
      JSON.stringify({
        format: "png",
        width: graphic.clientWidth,
      })
    );
  });

  $("#download-svg").addEventListener("click", () => {
    parent.sendMessage(
      "download",
      JSON.stringify({
        format: "svg",
        width: graphic.clientWidth,
      })
    );
  });
};
