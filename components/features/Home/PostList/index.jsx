import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Loading from "../../../shared/Loading";
import { hp, wp } from "../../../../helpers/common";
import { theme } from "../../../../constants/theme";
import PostCard from "../../PostCard";

const PostList = ({
  posts,
  user,
  router,
  hasMore,
  refreshing,
  handleRefresh,
  getPosts,
}) => {
  return (
    <FlatList
      data={posts}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listStyle}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <PostCard item={item} currentUser={user} router={router} />
      )}
      onEndReached={() => {
        getPosts();
      }}
      onEndReachedThreshold={0}
      ListFooterComponent={
        hasMore ? (
          <View style={{ marginVertical: posts?.length == 0 ? 200 : 30 }}>
            <Loading />
          </View>
        ) : (
          <View style={{ marginVertical: posts?.length == 0 ? 200 : 30 }}>
            <Text style={styles.noPosts}>No more posts</Text>
          </View>
        )
      }
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
};

export default PostList;

const styles = StyleSheet.create({
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text,
  },
});
