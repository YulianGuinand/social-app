import React from "react";
import { StyleSheet, View } from "react-native";
import { theme } from "../../../constants/theme";
import PostActions from "./Actions";
import PostMedia from "./Media";
import UserInfo from "./UserInfo";

const PostCard = ({
  item,
  currentUser,
  router,
  hasShadow = true,
  showMoreIcon = true,
  showDelete = false,
  onDelete = () => {},
  onEdit = () => {},
}) => {
  const shadowStyles = {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };

  const openPostDetails = () => {
    if (!showMoreIcon) return null;
    router.push({
      pathname: "postDetails",
      params: { postId: item?.id },
    });
  };

  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <UserInfo
        item={item}
        showDelete={showDelete}
        openPostDetails={openPostDetails}
        currentUser={currentUser}
        onDelete={onDelete}
        router={router}
        showMoreIcon={showMoreIcon}
        onEdit={onEdit}
      />

      {/* POST BODY & MEDIA */}

      <View style={styles.content}>
        {/* MEDIA */}
        <PostMedia item={item} />

        {/* LIKE COMMENT & SHARE */}

        <PostActions
          item={item}
          currentUser={currentUser}
          openPostDetails={openPostDetails}
        />
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: "#000",
  },
});
