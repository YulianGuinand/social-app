import { Image } from "expo-image";
import React from "react";
import { TouchableOpacity } from "react-native";
import ImageView from "react-native-image-viewing";
import { theme } from "../../../../../../../constants/theme";
import { hp } from "../../../../../../../helpers/common";

const MessageImage = ({
  message,
  setMessageId,
  setIsVisible,
  setState,
  imageUrl,
  state,
}) => {
  return (
    <>
      <TouchableOpacity
        onLongPress={() => {
          setMessageId(message.id);
          setIsVisible((prev) => !prev);
        }}
        onPress={() => setState(true)}
      >
        <Image
          source={imageUrl}
          contentFit="cover"
          style={{
            height: hp(30),
            width: 200,
            borderRadius: theme.radius.xl,
          }}
          transition={100}
        />
      </TouchableOpacity>
      <ImageView
        images={[imageUrl]}
        imageIndex={0}
        visible={state}
        onRequestClose={() => setState(false)}
      />
    </>
  );
};

export default MessageImage;
