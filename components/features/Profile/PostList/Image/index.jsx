import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { wp } from "../../../../../helpers/common";
import UserHeader from "../../UserHeader";
import ProfileFeed from "../Feed/ProfileFeed";

const PostImage = ({
  posts,
  user,
  router,
  handleLogOut,
  setWithImage,
  withImage,
  len,
  refreshing,
  handleRefresh,
  getPosts,
}) => {
  return (
    <FlatList
      data={posts}
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
      renderItem={({ item }) => <ProfileFeed dataList={item} />}
      onEndReached={() => {
        setWithImage(true);
        getPosts();
      }}
      onEndReachedThreshold={0}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
};

export default PostImage;

const styles = StyleSheet.create({
  listStyle: {
    paddingHorizontal: wp(4),
    paddingBottom: 30,
    gap: 2,
  },
});
