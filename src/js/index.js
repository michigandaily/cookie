import pym from "pym.js";

const { history, title, location } = window;
const { origin, pathname } = location;

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

  const params = getQueryParams();

  const { entries } = await import("../../config.json");
  let entry = params.get("entry") ?? Object.keys(entries)[0];

  if (!Object.hasOwn(entries, entry)) {
    params.delete("entry");
    setQueryParams(params);
    entry = Object.keys(entries)[0];
  }

  const raw = $("#view-raw");
  const url = $("#url-input");
  let parent;

  const setEntry = (e) => {
    raw.href = `./graphic/${e}`;

    url.value = `${origin + pathname}graphic/${e}`;
    url.size = url.value.length;

    params.set("entry", e);
    setQueryParams(params);
    entry = e;

    if (parent) {
      parent.remove();
    }
    parent = new pym.Parent("graphic", raw.href, {});
  };

  setEntry(entry);

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

  entrypointSelect.disabled = Object.keys(entries).length < 2;
  entrypointSelect.addEventListener("change", (e) => {
    setEntry(e.target.value);
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

  const copy = $("#copy-url-button");
  copy.addEventListener("click", () => {
    url.select();
    url.setSelectionRange(0, url.value.length);
    document.execCommand("copy");
    copy.innerHTML = "Copied!";
  });

  const downloadMessage = (fmt) =>
    JSON.stringify({
      entry,
      fmt,
      width: graphic.clientWidth,
    });

  $("#download-png").addEventListener("click", () => {
    parent.sendMessage("download", downloadMessage("png"));
  });

  $("#download-svg").addEventListener("click", () => {
    parent.sendMessage("download", downloadMessage("svg"));
  });
};
