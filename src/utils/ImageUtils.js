import ColorThief from 'colorthief';

class ImageUtils {
    
    // Extract the dominant colors from an image using ColorThief
    static extractColorsFromArtwork = async (artworkSrc) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = artworkSrc;

        return new Promise((resolve, reject) => {
            img.onload = () => {
                const colorThief = new ColorThief();
                const colorPalette = colorThief.getPalette(img, 2); // Get a palette of the two dominant colors
                resolve(colorPalette);
            };

            img.onerror = (error) => {
                reject(error);
            };
        });
    };

    // Update the background gradient using the dominant colors from the artwork
    static updateBackgroundGradient = async (artworkSrc) => {
        try {
          const colorPalette = await ImageUtils.extractColorsFromArtwork(artworkSrc);
    
          // Compare the brightness of the two colors
          const brightness1 = (colorPalette[0][0] * 299 + colorPalette[0][1] * 587 + colorPalette[0][2] * 114) / 1000;
          const brightness2 = (colorPalette[1][0] * 299 + colorPalette[1][1] * 587 + colorPalette[1][2] * 114) / 1000;
    
          let rgbString1, rgbString2;
    
          if (brightness1 < brightness2) {
            rgbString1 = `rgb(${colorPalette[0][0]}, ${colorPalette[0][1]}, ${colorPalette[0][2]})`;
            rgbString2 = `rgb(${colorPalette[1][0]}, ${colorPalette[1][1]}, ${colorPalette[1][2]})`;
          } else {
            rgbString1 = `rgb(${colorPalette[1][0]}, ${colorPalette[1][1]}, ${colorPalette[1][2]})`;
            rgbString2 = `rgb(${colorPalette[0][0]}, ${colorPalette[0][1]}, ${colorPalette[0][2]})`;
          }
    
          document.documentElement.style.setProperty('--gradient-color-1', rgbString1);
          document.documentElement.style.setProperty('--gradient-color-2', rgbString2);
        } catch (error) {
          console.error('Error extracting colors:', error);
        }
      };
}

export default ImageUtils;