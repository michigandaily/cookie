const downloadImage = async (format) => {
  const { toSvg, toPng } = await import("html-to-image");
  const converter = format === "svg" ? toSvg : toPng;
  const imgurl = await converter(document.body);
  const a = document.createElement("a");
  a.href = imgurl;
  a.download = `cookie-graphic-${new Date().toISOString()}.${format}`;
  a.click();
  a.remove();
};

export default downloadImage;
