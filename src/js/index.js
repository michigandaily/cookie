import pym from "pym.js";
import { $, debounce, getQueryParams, updateQueryParams } from "./util";

window.onload = async () => {
  const graphic = $("#graphic");

  const params = getQueryParams();

  const setQueryParam = (key, value) => {
    params.set(key, value);
    updateQueryParams(params);
  };

  const { entries } = await import("../../config.json");
  const keys = Object.keys(entries);
  let entry = params.get("entry") ?? keys[0];

  if (!Object.hasOwn(entries, entry)) {
    entry = keys[0];
    setQueryParam("entry", entry);
  }

  const viewRawButton = $("#view-raw");
  const urlInput = $("#url-input");
  const copyButton = $("#copy-url-button");
  let parent;

  const setEntry = (e, parameters = {}) => {
    let p = "";
    if (Object.keys(parameters).length > 0) {
      p = `?${new URLSearchParams(parameters).toString()}`;
    }
    viewRawButton.href = `graphic/${e}${p}`;
    urlInput.value = viewRawButton.href;
    urlInput.size = urlInput.value.length;
    copyButton.textContent = "Copy";

    setQueryParam("entry", e);
    entry = e;

    if (parent) {
      parent.remove();
    }

    ["hed", "dek", "note", "source", "byline"].forEach((property) => {
      $(`#${property}-checkbox`).disabled = !Object.hasOwn(
        entries[e],
        property
      );
    });

    parent = new pym.Parent("graphic", viewRawButton.href, {});
  };

  const displayOptions = Array.from($(".options#display").children);

  const getDisplayOptionsFromQueryParams = () => {
    return Object.fromEntries(
      displayOptions
        .filter((d) => params.has(d.name))
        .map((d) => [d.name, params.get(d.name)])
    );
  };

  displayOptions.forEach((option) => {
    if (params.has(option.name)) {
      option.checked = params.get(option.name) === "true";
    }

    option.addEventListener("change", ({ target: { name, checked } }) => {
      if ((name === "home" && !checked) || (name !== "home" && checked)) {
        params.delete(name);
      } else if (
        (name === "home" && checked) ||
        (name !== "home" && !checked)
      ) {
        params.set(name, checked);
      }
      updateQueryParams(params);
      setEntry(entry, getDisplayOptionsFromQueryParams());
    });
  });

  setEntry(entry, getDisplayOptionsFromQueryParams());

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
    setEntry(e.target.value, getDisplayOptionsFromQueryParams());
  });

  const setWidth = (width) => {
    graphic.style.width = `${width}px`;
    setQueryParam("width", width);
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

  copyButton.addEventListener("click", () => {
    urlInput.select();
    urlInput.setSelectionRange(0, urlInput.value.length);
    document.execCommand("copy");
    copyButton.textContent = "Copied!";
  });

  const downloadMessage = (format) =>
    JSON.stringify({
      entry,
      format,
      width: graphic.clientWidth,
    });

  $("#download-png").addEventListener("click", () => {
    parent.sendMessage("download", downloadMessage("png"));
  });

  $("#download-svg").addEventListener("click", () => {
    parent.sendMessage("download", downloadMessage("svg"));
  });
};
