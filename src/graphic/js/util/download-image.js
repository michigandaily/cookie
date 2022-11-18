const downloadImage = async (message) => {
  const { entry, format, width } = JSON.parse(message);
  const a = document.createElement("a");
  if (format === "svg") {
    const { elementToSVG } = await import("dom-to-svg");
    const xml = elementToSVG(document.body);
    const svgString = new XMLSerializer().serializeToString(xml);
    a.href = `data:text/plain;charset=utf-8,${encodeURIComponent(svgString)}`;
  } else if (format === "png") {
    const { toPng } = await import("html-to-image");
    const imgurl = await toPng(document.body, {
      width: width,
      backgroundColor: "white",
    });
    a.href = imgurl;
  }

  a.download = `cookie-graphic-${entry}-${width}-${new Date().toISOString()}.${format}`;
  a.click();
  a.remove();
};

export default downloadImage;
