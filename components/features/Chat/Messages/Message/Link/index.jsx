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
}) => {
  const renderMinimizedImage = (imageData) => {
    if (imageData && imageData.url) {
      return (
        <TouchableOpacity
          onLongPress={() => {
            setMessageId(message.id);
            setIsVisible((prev) => !prev);
          }}
          style={{ paddingTop: 0, marginTop: 0 }}
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
    <View style={{}}>
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
          backgroundColor: "#EEEEEE",
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
            <Text style={{ paddingBottom: 8 }}>{title}</Text>
          </TouchableOpacity>
        )}
        text={links[0]}
        enableAnimation
      />
      <LinkPreview
        textContainerStyle={{
          marginHorizontal: 0,
          marginVertical: 0,
          paddingHorizontal: 8,
          paddingTop: 10,
        }}
        containerStyle={{
          flexDirection: "column-reverse",
          backgroundColor: "#EEEEEE",
          borderRadius: theme.radius.md,
          overflow: "hidden",
        }}
        renderText={(text) => (
          <View style={{ gap: 20 }}>
            <TouchableOpacity
              onLongPress={() => {
                setMessageId(message.id);
                setIsVisible((prev) => !prev);
              }}
            >
              <Text
                style={{
                  paddingHorizontal: 8,
                  fontWeight: theme.fonts.bold,
                }}
              >
                {text}
              </Text>
            </TouchableOpacity>
            {/* REACTIONS */}
            <Reactions message={message} deleteReaction={deleteReaction} />
          </View>
        )}
        renderMinimizedImage={() => null}
        renderImage={() => null}
        renderTitle={() => null}
        renderDescription={() => null}
        text={message.body}
      />
    </View>
  );
};

export default MessageLink;
