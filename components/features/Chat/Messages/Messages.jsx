import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { supabase } from "../../../../lib/supabase";
import { fetchMessagesByThreadId } from "../../../../services/messageService";
import Message from "./Message/Message";

var limit = 2;
const Messages = ({
  user2,
  id,
  refresh,
  setRefresh,
  setIsVisible,
  setMessageId,
}) => {
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

    let reactionChannel = supabase
      .channel("reactions")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reactions",
          filter: `threadId=eq.${id}`,
        },
        (payload) => {
          console.log(payload);
          if (payload.eventType == "INSERT") {
            getMessages();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(reactionChannel);
    };
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
      renderItem={({ item, index }) => (
        <Message
          setRefresh={setRefresh}
          message={item}
          user2={user2}
          isLast={index === 0}
          setIsVisible={setIsVisible}
          setMessageId={setMessageId}
        />
      )}
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
