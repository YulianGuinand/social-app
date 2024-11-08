import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../../../../contexts/AuthContext";
import { hp } from "../../../../../helpers/common";
import { removeGroupReaction } from "../../../../../services/reactionService";
import Avatar from "../../../../shared/Avatar";
import ReactionsG from "./Reactions";

const MessageG = ({ message, setMessageId, setIsVisible, setRefresh }) => {
  const { user } = useAuth();

  const deleteReaction = async (reactionId) => {
    let res = await removeGroupReaction(reactionId);

    if (res.success) {
      setRefresh((prev) => !prev);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          alignItems: message?.user_id === user.id ? "flex-end" : "flex-start",
          justifyContent:
            message?.user_id === user.id ? "flex-end" : "flex-start",
          marginBottom: message.group_reactions.length > 0 ? 20 : 0,
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
        {message?.user_id !== user.id && (
          <Avatar uri={message?.user_id.image} size={hp(4)} />
        )}
        <View style={{ flexDirection: "column" }}>
          <View style={styles.body}>
            {/* FILE ? */}
            {message.file ? (
              // FILE
              <></>
            ) : (
              // TEXT
              <TouchableOpacity
                onLongPress={() => {
                  setMessageId(message.id);
                  setIsVisible((prev) => !prev);
                }}
              >
                {/* <MessageText
                  message={message}
                  reply={message.messageReplyId}
                  user={user}
                  deleteReaction={deleteReaction}
                /> */}
                <Text>{message.body}</Text>
              </TouchableOpacity>
            )}
            <ReactionsG message={message} deleteReaction={deleteReaction} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default MessageG;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
  },
  body: {
    maxWidth: 200,
  },
});
