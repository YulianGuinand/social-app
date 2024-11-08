import { LinkPreview } from "@flyerhq/react-native-link-preview";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../../../../../constants/theme";
import Reactions from "../Reactions";

const MessageLink = ({
  message,
  setMessageId,
  setIsVisible,
  links,
  deleteReaction,
  mine,
}) => {
  const renderMinimizedImage = (imageData) => {
    if (imageData && imageData.url) {
      return (
        <TouchableOpacity
          onLongPress={() => {
            setMessageId(message.id);
            setIsVisible((prev) => !prev);
          }}
          style={{ padding: 0 }}
        >
          <Image
            source={{ uri: imageData.url }}
            transition={100}
            style={{
              width: 200,
              height: 300,
            }}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={{ gap: 5 }}>
      <LinkPreview
        metadataContainerStyle={{
          flexDirection: "column",
          gap: 10,
          alignItems: "center",
        }}
        textContainerStyle={{
          marginHorizontal: 2,
          marginVertical: 0,
        }}
        containerStyle={{
          flexDirection: "column-reverse",
          backgroundColor: mine ? theme.colors.primary : "#EEEEEE",
          borderRadius: theme.radius.md,
          overflow: "hidden",
        }}
        renderMinimizedImage={renderMinimizedImage}
        renderDescription={() => null}
        renderText={() => null}
        renderTitle={(title) => (
          <TouchableOpacity
            onLongPress={() => {
              setMessageId(message.id);
              setIsVisible((prev) => !prev);
            }}
          >
            <Text
              style={{
                paddingBottom: 8,
                color: mine ? "white" : theme.colors.text,
              }}
            >
              {title}
            </Text>
          </TouchableOpacity>
        )}
        text={links[0]}
        enableAnimation
      />
      <TouchableOpacity
        onLongPress={() => {
          setMessageId(message.id);
          setIsVisible((prev) => !prev);
        }}
      >
        <View
          style={{
            backgroundColor: mine ? theme.colors.primary : "#EEEEEE",
            padding: 8,
            borderRadius: theme.radius.md,
            alignSelf: "flex-end",
            gap: 10,
          }}
        >
          <Text
            style={{
              color: mine ? "white" : theme.colors.text,
              fontWeight: theme.fonts.bold,
            }}
          >
            {message.body}
          </Text>
          <Reactions message={message} deleteReaction={deleteReaction} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MessageLink;
