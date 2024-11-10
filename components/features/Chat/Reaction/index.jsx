import moment from "moment";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "../../../../assets/icons";
import { theme } from "../../../../constants/theme";
import { hp, wp } from "../../../../helpers/common";
import { fetchMessageById } from "../../../../services/messageService";
import { createOrUpdateReaction } from "../../../../services/reactionService";
import ReactionsPicker from "./ReactionPicker";

const ReactionModal = ({
  isVisible,
  setIsVisible,
  user,
  message,
  id,
  setReply,
  onDelete,
  currentUser,
}) => {
  const messageId = message?.id;
  const [mine, setMine] = useState(false);

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

  const onReply = () => {
    setReply({ isReplying: true, messageId: messageId });
    setIsVisible(false);
  };

  const getMessageData = async () => {
    let res = await fetchMessageById(messageId);

    if (res.success) {
      setMine(res.data[0]?.senderId == currentUser.id);
    }
  };

  if (isVisible) {
    getMessageData();
  }

  const handleOnDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this message ?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => onDelete(messageId),
        style: "destructive",
      },
    ]);
  };

  const createdAt = moment(message?.created_at).fromNow();
  return (
    <ReactionsPicker isVisible={isVisible} onClose={() => setIsVisible(false)}>
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
        {/* REACTIONS */}
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

      {/* ACTIONS */}
      <View
        style={{
          paddingVertical: hp(4),
          paddingHorizontal: wp(4),
          gap: 10,
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          onPress={onReply}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            width: "100%",
          }}
        >
          <Icon name="reply" size={hp(4)} color={theme.colors.primary} />
          <Text style={{ fontSize: hp(2) }}>Reply</Text>
        </TouchableOpacity>

        {mine && (
          <TouchableOpacity
            onPress={handleOnDelete}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
              width: "100%",
            }}
          >
            <Icon name="delete" size={hp(4)} color={theme.colors.primary} />
            <Text style={{ fontSize: hp(2) }}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* INFO */}
      <View style={{ paddingHorizontal: wp(4) }}>
        <Text style={{ color: theme.colors.textLight }}>
          Sent by {message?.senderId?.username} - {createdAt}
        </Text>
      </View>
    </ReactionsPicker>
  );
};

export default ReactionModal;

const styles = StyleSheet.create({});
