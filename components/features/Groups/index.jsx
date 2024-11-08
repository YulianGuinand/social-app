import React from "react";
import { FlatList } from "react-native";
import GroupItem from "./GroupItem";

const GroupsList = ({ groups }) => {
  return (
    <FlatList
      data={groups}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        marginTop: 10,
        gap: 10,
      }}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <GroupItem item={item} />}
      onEndReached={() => {
        // FETCH
      }}
      onEndReachedThreshold={0}
    />
  );
};

export default GroupsList;
