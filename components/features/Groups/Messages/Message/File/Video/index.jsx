import { Video } from "expo-av";
import React from "react";
import { TouchableOpacity } from "react-native";
import { theme } from "../../../../../../../constants/theme";
import { hp } from "../../../../../../../helpers/common";

const MessageVideo = ({ message, setMessage, setIsVisible, imageUrl }) => {
  return (
    <TouchableOpacity
      onLongPress={() => {
        setMessage(message);
        setIsVisible((prev) => !prev);
      }}
    >
      <Video
        style={{
          width: 200,
          height: hp(40),
          borderRadius: theme.radius.xl,
        }}
        source={imageUrl}
        useNativeControls
        resizeMode="cover"
        isLooping
        posterSource={imageUrl.uri}
      />
    </TouchableOpacity>
  );
};

export default MessageVideo;
