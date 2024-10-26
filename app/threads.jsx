import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { useAuth } from "../contexts/AuthContext";
import { fetchThreads } from "../services/threadService";
import Thread from "../components/Thread";
import { hp, wp } from "../helpers/common";
import Header from "../components/Header";
import Loading from "../components/Loading";

const threads = () => {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getThreads = async () => {
    if (!hasMore) return null;
    let res = await fetchThreads(user?.id);

    if (res.success) {
      if (threads.length == res.data.length) setHasMore(false);
      setThreads(res.data);
    }
  };

  useEffect(() => {
    getThreads();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    getThreads();
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
          renderItem={({ item }) => <Thread item={item} />}
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
                <Text>No more chats</Text>
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
  },
});
