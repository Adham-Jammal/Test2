// Edit Youtube Link Function
export const EditYouTubeLink = (url: string): string => {
  if (url.includes('watch?v=') && !url?.includes('embed')) {
    // Handle First Situation Youtube Link if Contain watch?v= example (https://www.youtube.com/watch?v=5HqjoPsxrNI)
    const emPlace = url.indexOf('.com') + 4;
    const firstPart = url.slice(0, emPlace);
    let secondPart = url.slice(emPlace);
    if (secondPart.includes('watch?v=')) {
      const watchPlace = secondPart.indexOf('watch?v=') + 8;
      secondPart = secondPart.slice(watchPlace);
    }

    // Adding Embed
    return `${firstPart}/embed/${secondPart}`;
  } else if (!url.includes('watch?v=') && !url?.includes('embed') && url.includes('.be/')) {
    // Handle Second Situation Youtube Link if Contain .be example (https://youtu.be/5HqjoPsxrNI)
    const emPlace = url.indexOf('.be');
    const firstPart = `${url.slice(0, emPlace)}be.com`;
    const secondPart = url.slice(emPlace + 3);

    // Adding Embed
    return `${firstPart}/embed${secondPart}`;
  }
  return url;
};
