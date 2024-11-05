import { useRouter } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../../../constants/theme";
import { useAuth } from "../../../../contexts/AuthContext";
import { supabase } from "../../../../lib/supabase";
import { fetchMessageById } from "../../../../services/messageService";
import { removeThread } from "../../../../services/threadService";
import { getUserData } from "../../../../services/userService";
import Avatar from "../../../shared/Avatar";

const Thread = ({ item, handleRefresh }) => {
  const router = useRouter();
  const [user2, setUser2] = useState([]);
  const [lastMessage, setLastMessage] = useState();

  const { user } = useAuth();

  const getUsers = async () => {
    let res;
    if (user.id == item.user1_id) {
      res = await getUserData(item.user2_id);
    } else {
      res = await getUserData(item.user1_id);
    }

    if (res.success) {
      setUser2(res.data);
    }
  };

  const getLastMessage = async () => {
    let res = await fetchMessageById(item.lastMessage);

    if (res?.success) {
      setLastMessage(res.data[0]);
    }
  };

  const handleNewMessage = async (payload) => {
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

  const isLastMessageMine = item.lastSender === user.id;

  const deleteThread = async () => {
    let res = await removeThread(item.id);

    if (res.success) {
      handleRefresh();
    }
  };

  const onDeleteThread = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this chat ?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => deleteThread(),
        style: "destructive",
      },
    ]);
  };

  return (
    <TouchableOpacity
      onLongPress={onDeleteThread}
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
          <Text style={{ fontWeight: isLastMessageMine ? "normal" : "bold" }}>
            {lastMessage?.body.slice(0, 15)}...
          </Text>
        </View>
      </View>

      <View
        style={{
          width: "50%",
          alignItems: "flex-end",
        }}
      >
        <Text style={{ fontWeight: isLastMessageMine ? "normal" : "bold" }}>
          {createdAt}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Thread;
