import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { wp } from "../../../../../helpers/common";
import PostCard from "../../../PostCard";
import UserHeader from "../../UserHeader";

const PostText = ({
  postsText,
  user,
  router,
  handleLogOut,
  setWithImage,
  withImage,
  len,
  setPostsText,
  refreshing,
  handleRefresh,
  getPosts,
}) => {
  return (
    <FlatList
      data={postsText}
      ListHeaderComponent={
        <UserHeader
          user={user}
          router={router}
          handleLogOut={handleLogOut}
          setWithImage={setWithImage}
          withImage={withImage}
          nbPosts={len}
        />
      }
      ListHeaderComponentStyle={{}}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listStyle}
      keyExtractor={(_, index) => index}
      renderItem={({ item }) => (
        <PostCard
          setPosts={setPostsText}
          item={item}
          currentUser={user}
          router={router}
        />
      )}
      onEndReached={() => {
        setWithImage(false);
        getPosts();
      }}
      onEndReachedThreshold={0}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
};

export default PostText;

const styles = StyleSheet.create({
  listStyle: {
    paddingHorizontal: wp(4),
    paddingBottom: 30,
    gap: 2,
  },
});
