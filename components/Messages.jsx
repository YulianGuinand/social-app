import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { hp, wp } from "../helpers/common";
import Message from "./Message";
import { fetchMessagesByThreadId } from "../services/messageService";

const Messages = ({ user2, id }) => {
  const [newMessages, setNewMessages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const getMessages = async () => {
    let res = await fetchMessagesByThreadId(id);
    if (res.success) {
      setNewMessages(res.data);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    getMessages();
    setRefreshing(false);
  };

  return (
    <View>
      <FlatList
        data={newMessages}
        showsVerticalScrollIndicator={false}
        inverted
        contentContainerStyle={{
          // width: "100%",
          height: "100%",
          gap: 10,
        }}
        keyExtractor={(message) => message.id.toString()}
        renderItem={({ item }) => <Message message={item} user2={user2} />}
        onEndReached={() => {
          getMessages();
        }}
        onEndReachedThreshold={0}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({});
