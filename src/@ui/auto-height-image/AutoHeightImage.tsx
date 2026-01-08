import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  ImageSourcePropType,
  ImageResolvedAssetSource,
  ImageStyle,
} from "react-native";

interface AutoHeightImageProps {
  source: ImageSourcePropType;
  width: number;
  styles?: ImageStyle;
}

const getImageSize = (filePath: string) => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      filePath,
      (width, height) => resolve({ width, height }),
      (error) => reject(error)
    );
  });
};

const AutoHeightImage: React.FC<AutoHeightImageProps> = ({
  source,
  width,
  styles,
}) => {
  const [height, setHeight] = useState<number>(150); // Default height if dimensions are not available

  useEffect(() => {
    const fetchImageSize = async () => {
      try {
        let imageWidth: number | undefined;
        let imageHeight: number | undefined;

        if (typeof source === "number") {
          // Handle imported image
          const imageSource: ImageResolvedAssetSource =
            Image.resolveAssetSource(source);
          imageWidth = imageSource.width;
          imageHeight = imageSource.height;
        } else if (Array.isArray(source)) {
          // Handle array of image sources, assuming the first one
          const firstSource = source[0];
          if (firstSource.uri) {
            console.log("firstSource");

            const size: any = await getImageSize(firstSource.uri);
            imageWidth = size.width;
            imageHeight = size.height;
          }
        } else if (source.uri) {
          // Handle single remote image

          const size: any = await getImageSize(source.uri);
          imageWidth = size.width;
          imageHeight = size.height;
        }

        if (imageWidth && imageHeight) {
          const aspectRatio = imageWidth / imageHeight;
          setHeight(width / aspectRatio);
        }
      } catch (error) {
        console.error("Error fetching image size:", error);
      }
    };

    fetchImageSize();
  }, [source, width]);

  return (
    <View style={[classes.container, { width }]}>
      <Image
        source={source}
        style={[styles, classes.image, { height, width }]}
      />
    </View>
  );
};

const classes = StyleSheet.create({
  container: {
    width: "100%",
  },
  image: {
    resizeMode: "contain", // or 'cover' based on your requirement
  },
});

export default AutoHeightImage;