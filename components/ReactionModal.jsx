import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";
import { TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import {
  createOrUpdateReaction,
  removeReaction,
} from "../services/reactionService";

const ReactionModal = ({
  isShow = true,
  messageId,
  threadId,
  onChoose,
  reactions,
  setRefresh,
}) => {
  const { user } = useAuth();
  let reaction = {};

  const ReactionItems = [
    {
      id: 0,
      emoji: "😇",
      title: "like",
    },
    {
      id: 1,
      emoji: "🥰",
      title: "love",
    },
    {
      id: 2,
      emoji: "🤗",
      title: "care",
    },
    {
      id: 3,
      emoji: "😘",
      title: "kiss",
    },
    {
      id: 4,
      emoji: "😂",
      title: "laugh",
    },
    {
      id: 5,
      emoji: "😎",
      title: "cool",
    },
  ];

  if (!isShow) {
    return null;
  }

  const handleOnChoose = async (item) => {
    if (reaction && reaction.body === item.emoji) {
      await removeReaction(reaction.id);
      setRefresh((prev) => !prev);
      reaction = {};
      onChoose();
      return;
    }
    let data = {
      userId: user.id,
      body: item.emoji,
      messageId,
      threadId,
    };
    let res = await createOrUpdateReaction(data);
    reaction = { ...data, id: res };
    onChoose();
  };

  useEffect(() => {
    if (reactions.length > 0) {
      reactions.forEach((react) => {
        if (react.userId === user.id) {
          reaction = react;
        }
      });
    }
  }, []);

  return (
    <View style={styles.container}>
      {ReactionItems.map((reaction) => {
        return (
          <TouchableOpacity
            onPress={() => handleOnChoose(reaction)}
            style={{
              padding: 5,
              borderRadius: theme.radius.sm,
            }}
            key={reaction.id}
          >
            <Text>{reaction.emoji}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ReactionModal;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 200,
    height: hp(5),
    backgroundColor: "white",
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    bottom: 50,
  },
});
