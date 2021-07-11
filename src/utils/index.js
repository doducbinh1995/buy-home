//@ts-check

export const getImageResolution = (linkFile) => {
  return new Promise((resolve) => {
    let img = new Image();
    img.src = linkFile;
    img.onload = function () {
      const { width, height } = img;
      resolve({ width, height });
    };
  });
};
