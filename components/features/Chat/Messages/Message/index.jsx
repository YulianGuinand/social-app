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
import MessageFile from "../../../Groups/Messages/Message/File";
import MessageLink from "./Link";
import Reactions from "./Reactions";

const Message = ({ message, user2, setIsVisible, setMessage, setRefresh }) => {
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
          alignItems:
            message?.senderId.id === user.id ? "flex-end" : "flex-start",
          justifyContent:
            message?.senderId.id === user.id ? "flex-end" : "flex-start",
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
        {message?.senderId.id !== user.id && (
          <Avatar uri={user2?.image} size={hp(4)} />
        )}
        <View style={{ flexDirection: "column" }}>
          <View
            style={[styles.body, { marginTop: message.messageReplyId ? 0 : 0 }]}
          >
            {message.file ? (
              // MESSAGE FILE
              <MessageFile
                isVideo={isVideo}
                setMessage={setMessage}
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
                setMessage={setMessage}
                setIsVisible={setIsVisible}
                links={links}
                deleteReaction={deleteReaction}
                mine={message?.senderId.id === user.id}
              />
            ) : (
              // MESSAGE TEXT
              <TouchableOpacity
                onLongPress={() => {
                  setMessage(message);
                  setIsVisible((prev) => !prev);
                }}
              >
                <MessageText
                  message={message}
                  reply={message.messageReplyId}
                  user={user}
                  deleteReaction={deleteReaction}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Message;

const MessageText = ({ message, reply, user, deleteReaction }) => {
  const [userReply, setUserReply] = useState();
  const getReplyData = async () => {
    let res = await getUserData(reply?.senderId.id);
    if (res.success) setUserReply(res.data);
  };

  useEffect(() => {
    if (reply) getReplyData();
  }, []);

  return (
    <View>
      {/* REPLY */}
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
              {/* IMAGE  */}
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
                // VIDEO
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
                @{userReply?.username}
              </Text>
              <Text style={{ fontSize: 11 }}>{reply?.body}</Text>
            </>
          )}
        </View>
      )}

      <View
        style={{
          alignSelf:
            message?.senderId.id === user.id ? "flex-end" : "flex-start",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            borderRadius: theme.radius.md,
            // overflow: "hidden",
            backgroundColor:
              message?.senderId.id === user.id
                ? theme.colors.primary
                : "#EEEEEE",
          }}
        >
          <Text
            style={{
              padding: 6,
              color:
                message?.senderId.id === user.id ? "white" : theme.colors.text,
              fontSize: 20,
            }}
          >
            {message.body}
          </Text>

          {/* REACTIONS */}
          <Reactions message={message} deleteReaction={deleteReaction} />
        </View>
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
});
