import pym from "pym.js";

const setQueryParams = (params) => {
  console.log(params.toString());
  history.replaceState(null, window.title, `?${params.toString()}`);
};

const getQueryParams = () => {
  const params = new URLSearchParams(location.search.slice(1));
  return params;
};

const setWidth = (width) => {
  document.querySelector("#graphic").style.width = `${width}px`;
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
  console.log("Michigan Daily graphics preview");
  const parent = new pym.Parent("graphic", "./graphic/index.html", {});

  // Set the width on load if exists
  if (location.hash) {
    const params = getQueryParams();
    if (params.has("width")) {
      setWidth(params.get("width"));
    }
  }

  document.querySelector(
    "#url-input"
  ).value = `${window.location.href}graphic/index.html`;

  const resizeObserver = new ResizeObserver(
    debounce((entries) => {
      const width = entries[0].contentRect.width;
      setWidth(width);
    })
  );
  resizeObserver.observe(document.querySelector("#graphic"));

  document.querySelector("#desktop-preview").addEventListener("click", () => {
    setWidth(780);
  });

  document
    .querySelector("#small-mobile-preview")
    .addEventListener("click", () => {
      setWidth(288);
    });

  document
    .querySelector("#large-mobile-preview")
    .addEventListener("click", () => {
      setWidth(338);
    });

  document.querySelector("#copy-url-button").addEventListener("click", () => {
    let inputc = document.querySelector("#url-input");
    inputc.select();
    inputc.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.querySelector("#copy-url-button").innerHTML = "Copied!";
  });
};
