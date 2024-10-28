import { FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Message from "./Message";
import { fetchMessagesByThreadId } from "../services/messageService";

var limit = 2;
const Messages = ({ user2, id, refresh }) => {
  const [newMessages, setNewMessages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getMessages = async () => {
    limit += 2;
    let res = await fetchMessagesByThreadId(id, limit);
    if (res.success) {
      setNewMessages(res.data);
    }
  };

  useEffect(() => {
    getMessages();
  }, [refresh]);

  useEffect(() => {
    getMessages();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    getMessages();
    setRefreshing(false);
  };

  return (
    <FlatList
      data={newMessages}
      showsVerticalScrollIndicator={false}
      inverted
      contentContainerStyle={{
        paddingTop: 10,
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
      automaticallyAdjustKeyboardInsets
    />
  );
};

export default Messages;

const styles = StyleSheet.create({});
