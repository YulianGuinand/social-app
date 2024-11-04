import { Video } from "expo-av";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../../../../constants/theme";
import { useAuth } from "../../../../../contexts/AuthContext";
import { hp } from "../../../../../helpers/common";
import { getSupabaseFileUrl } from "../../../../../services/imageService";
import { removeReaction } from "../../../../../services/reactionService";
import { getUserData } from "../../../../../services/userService";
import Avatar from "../../../../shared/Avatar";
import MessageFile from "./File";
import MessageLink from "./Link";

const Message = ({
  message,
  user2,
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
          alignItems: message?.senderId === user.id ? "flex-end" : "flex-start",
          justifyContent:
            message?.senderId === user.id ? "flex-end" : "flex-start",
          marginBottom: message.reactions.length > 0 ? 20 : 0,
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 10,
        }}
      >
        {message?.senderId !== user.id && (
          <Avatar uri={user2?.image} size={hp(4)} />
        )}
        <View style={{ flexDirection: "column" }}>
          <View
            style={[styles.body, { marginTop: message.messageReplyId ? 0 : 0 }]}
          >
            {message.file ? (
              // MESSAGE LINKS
              <MessageFile
                isVideo={isVideo}
                setMessageId={setMessageId}
                setIsVisible={setIsVisible}
                message={message}
                imageUrl={imageUrl}
                setState={setState}
                state={state}
                reply={message.messageReplyId}
              />
            ) : links.length > 0 ? (
              // MESSAGE LINKS
              <MessageLink
                message={message}
                setMessageId={setMessageId}
                setIsVisible={setIsVisible}
                links={links}
              />
            ) : (
              // MESSAGE TEXT
              <TouchableOpacity
                onLongPress={() => {
                  setMessageId(message.id);
                  setIsVisible((prev) => !prev);
                }}
              >
                <MessageText
                  message={message}
                  reply={message.messageReplyId}
                  user={user}
                />
              </TouchableOpacity>
            )}

            {/* REACTIONS */}
            {message.reactions.length > 0 && (
              <Reactions
                message={message}
                user={user}
                deleteReaction={deleteReaction}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Message;

const Reactions = ({ message, user, deleteReaction }) => {
  return (
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
  );
};

const MessageText = ({ message, reply, user }) => {
  const [userReply, setUserReply] = useState();
  const getReplyData = async () => {
    let res = await getUserData(reply?.senderId);
    if (res.success) setUserReply(res.data);
  };

  useEffect(() => {
    if (reply) getReplyData();
  }, []);

  return (
    <View>
      {reply && (
        <View
          style={{
            marginBottom: 5,
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          {/* FILE */}

          {reply?.file && (
            <View>
              {reply?.file.includes("postImages") ? (
                <View>
                  <Image
                    source={getSupabaseFileUrl(reply?.file)}
                    width={150}
                    height={200}
                    style={{ borderRadius: theme.radius.md }}
                  />
                </View>
              ) : (
                <View>
                  <Video
                    source={getSupabaseFileUrl(reply?.file)}
                    style={{
                      width: 150,
                      height: 200,
                      borderRadius: theme.radius.md,
                    }}
                    resizeMode="cover"
                  />
                </View>
              )}
            </View>
          )}

          {!reply?.file && (
            <>
              <Avatar uri={userReply?.image} size={hp(2.5)} />
              <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                @{userReply?.name}
              </Text>
              <Text style={{ fontSize: 11 }}>{reply?.body}</Text>
            </>
          )}
        </View>
      )}

      <View
        style={{
          alignSelf: message?.senderId === user.id ? "flex-end" : "flex-start",
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
  },
  body: {
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
