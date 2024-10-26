import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getUserData } from "../services/userService";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "./Avatar";
import { fetchMessageById } from "../services/messageService";
import moment from "moment";
import { useRouter } from "expo-router";
import { theme } from "../constants/theme";
import { supabase } from "../lib/supabase";

const Thread = ({ item }) => {
  const router = useRouter();
  const [user2, setUser2] = useState([]);
  const [lastMessage, setLastMessage] = useState();

  const { user } = useAuth();

  const getUsers = async () => {
    let res;
    if (user.id == item.user1_Id) {
      res = await getUserData(item.user2_Id);
    } else {
      res = await getUserData(item.user1_Id);
    }

    if (res.success) {
      setUser2(res.data);
    }
  };

  const getLastMessage = async () => {
    let res = await fetchMessageById(item.lastMessage);

    if (res.success) {
      setLastMessage(res.data[0]);
    }
  };

  const handleNewMessage = async (payload) => {
    console.log(payload);

    if (payload.eventType === "INSERT" && payload.new.id) {
      setLastMessage(payload.new);
    }
  };

  useEffect(() => {
    getUsers();
    getLastMessage();

    let messagesChannel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiverId=eq.${user?.id}&senderId=eq.${user2?.id}`,
        },
        handleNewMessage
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, []);

  const handleOnPress = () => {
    router.push({
      pathname: `/threads/${item.id}`,
      params: { user2Id: user2.id },
    });
  };

  const createdAt = moment(lastMessage?.created_at).fromNow();
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white",
        padding: 15,
        borderRadius: theme.radius.md,
      }}
      onPress={handleOnPress}
    >
      <View
        style={{
          width: "50%",
          flexDirection: "row",
          alignItems: "center",
          gap: 15,
        }}
      >
        <Avatar uri={user2?.image} size={45} />

        <View>
          <Text>{user2?.name}</Text>
          <Text>{lastMessage?.body.slice(0, 15)}...</Text>
        </View>
      </View>

      <View style={{ width: "50%", alignItems: "flex-end" }}>
        <Text>{createdAt}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Thread;

const styles = StyleSheet.create({
  avatar: {},
});
