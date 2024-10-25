import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "./Avatar";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";

const Message = ({ message, user2 }) => {
  const { user } = useAuth();
  return (
    <View
      style={[
        styles.container,
        {
          alignItems: message?.senderId === user.id ? "flex-end" : "flex-start",
          justifyContent:
            message?.senderId === user.id ? "flex-end" : "flex-start",
        },
      ]}
    >
      {message?.senderId !== user.id && (
        <Avatar uri={user2?.image} size={hp(4)} />
      )}
      <Text style={styles.body}>{message?.body}</Text>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: wp(2),
    flexDirection: "row",
    gap: 10,
  },
  body: {
    width: "fit-content",
    maxWidth: 200,
    borderRadius: theme.radius.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fff",
  },
});
