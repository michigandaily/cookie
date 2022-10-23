const $ = (selector) => document.querySelector(selector);

// https://www.freecodecamp.org/news/javascript-debounce-example/
const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

const getQueryParams = () =>
  new URLSearchParams(window.location.search.slice(1));

const updateQueryParams = (params) => {
  const { history, title } = window;
  history.replaceState(null, title, `?${params.toString()}`);
};

export { $, debounce, updateQueryParams, getQueryParams };
