const downloadImage = async (message) => {
  const { format, width } = JSON.parse(message);
  const { toSvg, toPng } = await import("html-to-image");
  const converter = format === "svg" ? toSvg : toPng;
  const imgurl = await converter(document.body);
  const a = document.createElement("a");
  a.href = imgurl;
  a.download = `cookie-graphic-${new Date().toISOString()}-${width}.${format}`;
  a.click();
  a.remove();
};

export default downloadImage;
