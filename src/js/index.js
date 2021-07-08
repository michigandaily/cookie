import pym from "pym.js";

window.onload = () => {
  console.log("Michigan Daily graphics preview");
  const parent = new pym.Parent("graphic", "./graphic/index.html", {});

  document.querySelector("#url-input").value = `${window.location.href}graphic/index.html`;

  document.querySelector("#desktop-preview").addEventListener('click', () => {
    document.querySelector("#graphic").style.width = "780px";
  })

  document.querySelector("#small-mobile-preview").addEventListener('click', () => {
    document.querySelector("#graphic").style.width = "288px";
  })

  document.querySelector("#large-mobile-preview").addEventListener('click', () => {
    document.querySelector("#graphic").style.width = "338px";
  })

  document.querySelector("#copy-url-button").addEventListener('click', () => {
    let inputc = document.querySelector("#url-input")
    inputc.select();
    inputc.setSelectionRange(0, 99999);
    document.execCommand('copy');
    document.querySelector("#copy-url-button").innerHTML = "Copied!"
  })
};
