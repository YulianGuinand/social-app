import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../../../constants/theme";
import { createOrUpdateReaction } from "../../../../services/reactionService";
import ReactionsPicker from "./ReactionPicker";

const ReactionModal = ({ isVisible, setIsVisible, user, messageId, id }) => {
  // REACTIONS ITEMS
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

  let reaction = {};
  const handleOnChoose = async (item) => {
    let data = {
      userId: user.id,
      body: item.emoji,
      messageId: messageId,
      threadId: id,
    };
    let res = await createOrUpdateReaction(data);
    reaction = { ...data, id: res };
    setIsVisible(false);
  };
  return (
    <ReactionsPicker isVisible={isVisible} onClose={() => setIsVisible(false)}>
      <>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            gap: 10,
            marginTop: 20,
          }}
        >
          {ReactionItems.map((item) => {
            return (
              <View
                key={item.id}
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <TouchableOpacity
                  onPress={() => handleOnChoose(item)}
                  style={{
                    padding: 6,
                    borderRadius: theme.radius.md,
                    backgroundColor: theme.colors.darkLight,
                  }}
                >
                  <Text style={{ fontSize: 30 }}>{item.emoji}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </>
    </ReactionsPicker>
  );
};

export default ReactionModal;

const styles = StyleSheet.create({});
