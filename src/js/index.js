import pym from "pym.js";
import { $, debounce, getQueryParams, setQueryParams } from "./util";

const { origin, pathname } = window.location;

window.onload = async () => {
  const graphic = $("#graphic");

  const params = getQueryParams();

  const updateQueryParams = (key, value) => {
    params.set(key, value);
    setQueryParams(params);
  };

  const { entries } = await import("../../config.json");
  const keys = Object.keys(entries);
  let entry = params.get("entry") ?? keys[0];

  if (!Object.hasOwn(entries, entry)) {
    entry = keys[0];
    updateQueryParams("entry", entry);
  }

  const viewRawButton = $("#view-raw");
  const urlInput = $("#url-input");
  let parent;

  const setEntry = (e) => {
    viewRawButton.href = `./graphic/${e}`;
    urlInput.value = `${origin + pathname}graphic/${e}`;
    urlInput.size = urlInput.value.length;

    updateQueryParams("entry", e);
    entry = e;

    if (parent) {
      parent.remove();
    }
    parent = new pym.Parent("graphic", viewRawButton.href, {});
  };

  setEntry(entry);

  const entrypointSelect = $("#entrypoint-select");

  keys.forEach((key) => {
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

  const setWidth = (width) => {
    graphic.style.width = `${width}px`;
    updateQueryParams("width", width);
  };

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
    urlInput.select();
    urlInput.setSelectionRange(0, urlInput.value.length);
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
