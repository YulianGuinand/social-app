import { Video } from "expo-av";
import React from "react";
import { TouchableOpacity } from "react-native";
import { theme } from "../../../../../../../constants/theme";

const MessageVideo = ({ message, setMessageId, setIsVisible, imageUrl }) => {
  return (
    <TouchableOpacity
      onLongPress={() => {
        setMessageId(message.id);
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
