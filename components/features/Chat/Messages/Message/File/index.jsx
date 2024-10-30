import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../../../../../constants/theme";
import MessageImage from "./Image";
import MessageVideo from "./Video";

const MessageFile = ({
  isVideo,
  setMessageId,
  setIsVisible,
  message,
  imageUrl,
  setState,
  state,
}) => {
  return (
    <View style={{ gap: 5 }}>
      {isVideo ? (
        <MessageVideo
          message={message}
          setMessageId={setMessageId}
          setIsVisible={setIsVisible}
          imageUrl={imageUrl}
        />
      ) : (
        <MessageImage
          message={message}
          setMessageId={setMessageId}
          setIsVisible={setIsVisible}
          setState={setState}
          imageUrl={imageUrl}
          state={state}
        />
      )}

      {message.body && (
        <TouchableOpacity
          onLongPress={() => {
            setMessageId(message.id);
            setIsVisible((prev) => !prev);
          }}
        >
          <Text
            style={{
              padding: 8,
              backgroundColor: "white",
              borderRadius: theme.radius.md,
            }}
          >
            {message.body}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MessageFile;