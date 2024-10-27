import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "./Avatar";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";
import { LinkPreview } from "@flyerhq/react-native-link-preview";
import { Image } from "expo-image";

const Message = ({ message, user2 }) => {
  const { user } = useAuth();

  const findLinksInText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const links = text.match(urlRegex);

    return links || [];
  };

  const links = findLinksInText(message.body);

  const renderMinimizedImage = (imageData) => {
    // Vérifie si l'image existe dans les données
    if (imageData && imageData.url) {
      return (
        <View style={{ paddingTop: 0, marginTop: 0 }}>
          <Image
            source={{ uri: imageData.url }}
            transition={100}
            style={{
              width: 200,
              height: 300,
            }}
          />
        </View>
      );
    }
    return null; // Retourne rien si aucune image n’est présente
  };

  return (
    <View
      style={[
        styles.container,
        {
          alignItems: message?.senderId === user.id ? "flex-end" : "flex-start",
          justifyContent:
            message?.senderId === user.id ? "flex-end" : "flex-start",
        },
      ]}
    >
      {message?.senderId !== user.id && (
        <Avatar uri={user2?.image} size={hp(4)} />
      )}
      <View style={styles.body}>
        {links.length > 0 ? (
          <View style={{ gap: 8 }}>
            <LinkPreview
              metadataContainerStyle={{
                flexDirection: "column",
                gap: 10,
                alignItems: "center",
              }}
              textContainerStyle={{
                marginHorizontal: 0,
                marginVertical: 0,
              }}
              containerStyle={{
                flexDirection: "column-reverse",
                backgroundColor: "white",
                borderRadius: theme.radius.md,
                overflow: "hidden",
              }}
              renderMinimizedImage={renderMinimizedImage}
              renderDescription={() => null}
              renderText={() => null}
              renderTitle={(title) => (
                <Text style={{ paddingBottom: 8 }}>{title}</Text>
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
                backgroundColor: "white",
                borderRadius: theme.radius.md,
                overflow: "hidden",
              }}
              renderText={(text) => (
                <Text
                  style={{
                    paddingHorizontal: 8,
                    fontWeight: theme.fonts.bold,
                  }}
                >
                  {text}
                </Text>
              )}
              renderMinimizedImage={() => null}
              renderImage={() => null}
              renderTitle={() => null}
              renderDescription={() => null}
              text={message.body}
            />
          </View>
        ) : (
          <Text
            style={{
              padding: 8,
              backgroundColor: "white",
              borderRadius: theme.radius.md,
            }}
          >
            {message.body}
          </Text>
        )}
      </View>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
  },
  body: {
    width: "fit-content",
    maxWidth: 200,
    overflow: "hidden",
  },
});
