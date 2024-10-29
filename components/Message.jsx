import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "./Avatar";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";
import { LinkPreview } from "@flyerhq/react-native-link-preview";
import { Image } from "expo-image";
import { getSupabaseFileUrl } from "../services/imageService";
import { Video } from "expo-av";
import ImageView from "react-native-image-viewing";
import { removeReaction } from "../services/reactionService";

const Message = ({
  message,
  user2,
  isLast,
  setIsVisible,
  setMessageId,
  setRefresh,
}) => {
  const { user } = useAuth();
  const [state, setState] = useState(false);

  const findLinksInText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const links = text.match(urlRegex);

    return links || [];
  };

  const links = findLinksInText(message.body);

  const renderMinimizedImage = (imageData) => {
    if (imageData && imageData.url) {
      return (
        <TouchableOpacity
          onLongPress={() => {
            setMessageId(message.id);
            {
              setMessageId(message.id);
              setIsVisible((prev) => !prev);
            }
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

  let reactions = [];
  if (message.reactions) reactions = message.reactions;

  const imageUrl = getSupabaseFileUrl(message.file);
  const isVideo = imageUrl?.uri.includes("postVideos");

  // DELETE REACTIONS
  const deleteReaction = async (reactionId) => {
    let res = await removeReaction(reactionId);

    if (res.success) {
      setRefresh((prev) => !prev);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          elevation: isLast ? 100 : 0,
          alignItems: message?.senderId === user.id ? "flex-end" : "flex-start",
          justifyContent:
            message?.senderId === user.id ? "flex-end" : "flex-start",
          marginBottom: message.reactions.length > 0 ? 20 : 0,
        },
      ]}
    >
      {message?.senderId !== user.id && (
        <Avatar uri={user2?.image} size={hp(4)} />
      )}
      <View style={styles.body}>
        {message.file ? (
          <View style={{ gap: 5 }}>
            {isVideo ? (
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
            ) : (
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
        ) : links.length > 0 ? (
          <View style={{ gap: 8 }}>
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
                backgroundColor: "white",
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
                backgroundColor: "white",
                borderRadius: theme.radius.md,
                overflow: "hidden",
              }}
              renderText={(text) => (
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
              )}
              renderMinimizedImage={() => null}
              renderImage={() => null}
              renderTitle={() => null}
              renderDescription={() => null}
              text={message.body}
            />
          </View>
        ) : (
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

        {/* REACTIONS */}
        {message.reactions.length > 0 && (
          <View
            style={[
              styles.reactions,
              {
                left: message?.senderId === user.id ? -15 : null,
                right: message?.senderId === user.id ? null : -15,
              },
            ]}
          >
            {message.reactions.map((reaction) => {
              return (
                <TouchableOpacity
                  key={reaction.id}
                  onPress={() => deleteReaction(reaction.id)}
                >
                  <Text style={{ fontSize: 16 }}>{reaction.body}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
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
  },
  reactions: {
    position: "absolute",
    bottom: "-10%",
    transform: [{ translateY: 20 }],
    backgroundColor: "white",
    padding: 5,
    borderRadius: theme.radius.md,
    flexDirection: "row",
    gap: 5,
  },
});
