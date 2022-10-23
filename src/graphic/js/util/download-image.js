const downloadImage = async (message) => {
  const { entry, format, width } = JSON.parse(message);
  const { toSvg, toPng } = await import("html-to-image");
  const converter = format === "svg" ? toSvg : toPng;
  const imgurl = await converter(document.body, {
    width: width,
    backgroundColor: "white",
  });
  const a = document.createElement("a");
  a.href = imgurl;
  a.download = `cookie-graphic-${entry}-${width}-${new Date().toISOString()}.${format}`;
  a.click();
  a.remove();
};

export default downloadImage;
