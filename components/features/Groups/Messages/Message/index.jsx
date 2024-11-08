import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../../../../constants/theme";
import { useAuth } from "../../../../../contexts/AuthContext";
import { hp } from "../../../../../helpers/common";
import { removeGroupReaction } from "../../../../../services/reactionService";
import { getUserData } from "../../../../../services/userService";
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
          alignItems:
            message?.user_id.id === user.id ? "flex-end" : "flex-start",
          justifyContent:
            message?.user_id.id === user.id ? "flex-end" : "flex-start",
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
        {message?.user_id.id !== user.id && (
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

export default MessageG;

const MessageText = ({ message, reply, user, deleteReaction }) => {
  const [userReply, setUserReply] = useState();
  const getReplyData = async () => {
    let res = await getUserData(reply?.user_id);
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
            message?.user_id.id === user.id ? "flex-end" : "flex-start",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            borderRadius: theme.radius.md,
            // overflow: "hidden",
            backgroundColor:
              message?.user_id.id === user.id
                ? theme.colors.primary
                : "#EEEEEE",
          }}
        >
          <Text
            style={{
              padding: 6,
              color:
                message?.user_id.id === user.id ? "white" : theme.colors.text,
              fontSize: 20,
            }}
          >
            {message.body}
          </Text>

          {/* REACTIONS */}
          <ReactionsG message={message} deleteReaction={deleteReaction} />
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
