const downloadImage = async (message) => {
  const { entry, format, width } = JSON.parse(message);
  const a = document.createElement("a");
  const { elementToSVG } = await import("dom-to-svg");
  const xml = elementToSVG(document.body);
  const svgString = new XMLSerializer().serializeToString(xml);

  a.download = `cookie-graphic-${entry}-${width}-${new Date().toISOString()}.${format}`;
  if (format === "svg") {
    a.href = `data:text/plain;charset=utf-8,${encodeURIComponent(svgString)}`;
    a.click();
    a.remove();
  } else if (format === "png") {
    const img = new Image();

    img.onload = () => {
      const dpr = window.devicePixelRatio ?? 1;

      const canvas = document.createElement("canvas");
      canvas.width = width * dpr;
      canvas.height = document.body.clientHeight * dpr;

      const context = canvas.getContext("2d");
      context.scale(dpr, dpr);
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0);

      a.href = canvas.toDataURL("image/png");
      a.click();
      a.remove();
    };

    img.src = `data:image/svg+xml;base64,${window.btoa(svgString)}`;
  }
};

export default downloadImage;
