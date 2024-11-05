import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";

const ResultList = (data) => {
  return (
    <FlatList
      data={data.data}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{}}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Text>{item.name}</Text>}
      onEndReached={() => {
        console.log("END");
        // getThreads();
      }}
      onEndReachedThreshold={0}
      // ListFooterComponent={
      //   hasMore ? (
      //     <View style={{ marginVertical: threads.length == 0 ? 200 : 30 }}>
      //       <Loading />
      //     </View>
      //   ) : (
      //     <View style={{ marginVertical: threads.length == 0 ? 200 : 30 }}>
      //       <Text style={{ marginHorizontal: "auto" }}>No more chats</Text>
      //     </View>
      //   )
      // }
      // refreshing={refreshing}
      // onRefresh={handleRefresh}
    />
  );
};

export default ResultList;

const styles = StyleSheet.create({});
