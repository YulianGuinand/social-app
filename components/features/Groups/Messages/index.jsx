import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { supabase } from "../../../../lib/supabase";
import { fetchGroupMessages } from "../../../../services/messageService";
import MessageG from "./Message";

const GroupMessage = ({
  id,
  setIsVisible,
  setMessage,
  refresh,
  setRefresh,
}) => {
  const [messages, setMessages] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const getMessages = async () => {
    if (!id) return null;
    let res = await fetchGroupMessages(id);

    if (res.success) {
      setMessages(res.data);
    }
  };

  useEffect(() => {
    getMessages();
  }, [refresh]);

  useEffect(() => {
    getMessages();

    let reactionChannel = supabase
      .channel("group_reactions")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "group_reactions",
          filter: `groupId=eq.${id}`,
        },
        (payload) => {
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
      data={messages}
      showsVerticalScrollIndicator={false}
      inverted
      contentContainerStyle={{
        paddingTop: 10,
        gap: 10,
      }}
      keyExtractor={(message) => message.id.toString()}
      renderItem={({ item, index }) => (
        <MessageG
          message={item}
          setIsVisible={setIsVisible}
          setMessage={setMessage}
          setRefresh={setRefresh}
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

export default GroupMessage;

const styles = StyleSheet.create({});
