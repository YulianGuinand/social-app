import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../../../../constants/theme";
import { useAuth } from "../../../../../contexts/AuthContext";
import { hp } from "../../../../../helpers/common";
import { getSupabaseFileUrl } from "../../../../../services/imageService";
import { removeReaction } from "../../../../../services/reactionService";
import Avatar from "../../../../shared/Avatar";
import MessageFile from "./File";
import MessageLink from "./Link";

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
          // MESSAGE LINKS
          <MessageFile
            isVideo={isVideo}
            setMessageId={setMessageId}
            setIsVisible={setIsVisible}
            message={message}
            imageUrl={imageUrl}
            setState={setState}
            state={state}
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
          <Reactions
            message={message}
            user={user}
            deleteReaction={deleteReaction}
          />
        )}
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
