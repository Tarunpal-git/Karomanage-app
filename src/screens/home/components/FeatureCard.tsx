import { StyleSheet } from "react-native";
import React, { FC, memo } from "react";
import Card from "../../../@ui/card/Card";
import ScalableText from "../../../@ui/scalable-text/ScalableText";
import AutoHeightImage from "../../../@ui/auto-height-image/AutoHeightImage";
import { TImages } from "../../../images/images";
import { IMAGES } from "../../../images";

export interface IFeatureCard {
  feature: string;
  icon: TImages;
  imageWidth?: number;
  show: boolean;
  handleClick: () => void;
}

const FeatureCard: FC<IFeatureCard> = ({
  feature,
  icon,
  imageWidth = 67,
  show,
  handleClick,
}) => {
  if (show)
    return (
      <Card
        onPress={handleClick}
        justify="space-evenly"
        styles={styles.featureCard}
        align="center"
      >
        <AutoHeightImage source={IMAGES[icon]} width={imageWidth} />
        <ScalableText style={styles.featureTitle} fontFamily="SemiBold">
          {feature}
        </ScalableText>
      </Card>
    );
};

export default memo(FeatureCard);

const styles = StyleSheet.create({
  featureTitle: {
    fontSize: 14,

    textAlign: "center",
    flexWrap: "wrap",
  },
  featureCard: {
    borderRadius: 5,
    width: "40%",
    marginVertical: 20,
    margin: 10,
    aspectRatio: 3 / 3,
  },
});
