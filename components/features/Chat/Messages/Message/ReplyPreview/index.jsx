import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "../../../../../../assets/icons";
import { theme } from "../../../../../../constants/theme";
import { hp } from "../../../../../../helpers/common";
import { fetchRepliedMessageById } from "../../../../../../services/messageService";
import Avatar from "../../../../../shared/Avatar";

const ReplyPreview = ({ setReply, reply }) => {
  const [messageData, setMessageData] = useState();

  const getMessageData = async () => {
    if (!reply.isReplying) return null;
    let res = await fetchRepliedMessageById(reply?.messageId);

    if (res.success) {
      setMessageData(res.data[0]);
    }
  };

  useEffect(() => {
    getMessageData();
  }, []);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setReply({ isReplying: false, messageId: null })}
        style={{ position: "absolute", top: 5, right: 5 }}
      >
        <Icon name="cross" color="black" />
      </Pressable>
      <Avatar uri={messageData?.senderId.image} size={hp(4)} />
      <Text style={{ fontSize: 14 }}>{messageData?.body.slice(0, 10)}...</Text>
    </View>
  );
};

export default ReplyPreview;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    height: 50,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    gap: 10,
    marginVertical: 10,
    borderRadius: theme.radius.md,
  },
});
