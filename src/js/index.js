import pym from "pym.js";

window.onload = () => {
  console.log("Michigan Daily graphics preview");
  const parent = new pym.Parent("graphic", "./graphic/index.html", {});

  document.querySelector("#code-snippet").value = `
  <div id="#${window.config.slug}"></div>
  <script type="text/javascript">
  new pym.Parent("#${window.config.slug}", "https://magnify.michigandaily.us/${window.config.slug}/graphic/index.html", {})
  </script>
  `.trim();
};
