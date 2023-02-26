const downloadImage = async (message) => {
  const { entry, format, width } = JSON.parse(message);
  const a = document.createElement("a");
  a.download = `cookie-graphic-${entry}-${width}-${new Date().toISOString()}.${format}`;

  if (format === "png") {
    const { toPng } = await import("html-to-image");
    const url = await toPng(document.body, {
      backgroundColor: "white",
      width,
    });
    a.href = url;
  } else if (format === "svg") {
    const { elementToSVG } = await import("dom-to-svg");
    const xml = elementToSVG(document.body.querySelector("svg"));
    const svgString = new XMLSerializer().serializeToString(xml);
    a.href = `data:text/plain;charset=utf-8,${encodeURIComponent(svgString)}`;
  } else {
    throw new Error(`Unknown format: ${format}`);
  }

  a.click();
  a.remove();
};

export default downloadImage;
