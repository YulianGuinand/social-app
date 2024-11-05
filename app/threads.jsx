import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Thread from "../components/features/Threads/Thread";
import Header from "../components/shared/Header";
import Loading from "../components/shared/Loading";
import ScreenWrapper from "../components/shared/ScreenWrapper";
import { useAuth } from "../contexts/AuthContext";
import { wp } from "../helpers/common";
import { supabase } from "../lib/supabase";
import { fetchThreads } from "../services/threadService";

const threads = () => {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getThreads = async (reload = true) => {
    if (!hasMore && reload) return null;
    let res = await fetchThreads(user?.id);

    if (res.success) {
      if (threads.length == res.data.length && reload) setHasMore(false);
      if (reload === false) {
        setThreads([]);
      }
      setThreads(res.data);
    }
  };

  const handlethreads = (payload) => {
    if (payload.eventType === "UPDATE" && payload.new) {
      getThreads(false);
    }
  };
  useEffect(() => {
    getThreads();

    let threadsChannel = supabase
      .channel("threads")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "threads" },
        (payload) => handlethreads(payload)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(threadsChannel);
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    getThreads(false);
    setRefreshing(false);
  };

  return (
    <ScreenWrapper>
      <View style={{ paddingHorizontal: wp(4) }}>
        <Header title="Chat" />
        <FlatList
          data={threads}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Thread item={item} handleRefresh={handleRefresh} />
          )}
          onEndReached={() => {
            getThreads();
          }}
          onEndReachedThreshold={0}
          ListFooterComponent={
            hasMore ? (
              <View style={{ marginVertical: threads.length == 0 ? 200 : 30 }}>
                <Loading />
              </View>
            ) : (
              <View style={{ marginVertical: threads.length == 0 ? 200 : 30 }}>
                <Text style={{ marginHorizontal: "auto" }}>No more chats</Text>
              </View>
            )
          }
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </View>
    </ScreenWrapper>
  );
};

export default threads;

const styles = StyleSheet.create({
  listStyle: {
    marginTop: 10,
    gap: 10,
  },
});
