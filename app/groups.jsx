import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Header from "../components/shared/Header";
import ScreenWrapper from "../components/shared/ScreenWrapper";
import { useAuth } from "../contexts/AuthContext";
import { wp } from "../helpers/common";
import { fetchGroups } from "../services/groupService";

const groups = () => {
  const { user: currentUser } = useAuth();
  const [groups, setGroups] = useState();

  const getGroups = async () => {
    if (!currentUser) return null;
    let res = await fetchGroups(currentUser.id);

    if (res.success) {
      setGroups(res.data);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <ScreenWrapper bg="white">
      <View style={{ paddingHorizontal: wp(4) }}>
        <Header title="Groups" />
        <FlatList
          data={groups}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{}}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <Text>{item.group_id.name}</Text>}
          onEndReached={() => {
            // getThreads();
          }}
          onEndReachedThreshold={0}
        />
      </View>
    </ScreenWrapper>
  );
};

export default groups;

const styles = StyleSheet.create({});

("test@test.com");
