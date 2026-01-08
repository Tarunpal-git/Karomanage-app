import React, { FC } from "react";
import AutoHeightImage from "../auto-height-image/AutoHeightImage";
import { IMAGES } from "../../images";
import Flex from "../flex/Flex";

interface IAppLogo {
  size: "small" | "default";
  orient?: "vertical" | "horizontal";
}

const AppLogo: FC<IAppLogo> = ({ size = "default", orient = "vertical" }) => {
  if (orient === "vertical") {
    return (
      <Flex flexDirection="column">
        <AutoHeightImage
          source={IMAGES.logo}
          width={size === "default" ? 148 : 74}
        />
        <Flex my={10} />
        <AutoHeightImage
          source={IMAGES.logoName}
          width={size === "default" ? 214 : 144}
        />
      </Flex>
    );
  } else {
    return (
      <Flex>
        <AutoHeightImage source={IMAGES.logo} width={30} />
        <Flex ml={17} mt={7}>
          <AutoHeightImage source={IMAGES.logoName} width={130} />
        </Flex>
      </Flex>
    );
  }
};

export default AppLogo;
