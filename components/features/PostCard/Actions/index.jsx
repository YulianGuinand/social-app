import { Alert, Share, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { theme } from "../../../../constants/theme";
import { hp, stripHtmlTags } from "../../../../helpers/common";
import {
  createPostLike,
  removePostLike,
} from "../../../../services/postService";
import {
  downloadFile,
  getSupabaseFileUrl,
} from "../../../../services/imageService";
import Icon from "../../../../assets/icons";
import Loading from "../../../shared/Loading";

const PostActions = ({ item, currentUser, openPostDetails }) => {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLikes(item?.postLikes);
  }, [item.postLikes]);

  const onLike = async () => {
    if (liked) {
      // remove like
      let updateLikes = likes.filter((like) => like.userId != currentUser?.id);
      setLikes([...updateLikes]);
      let res = await removePostLike(item?.id, currentUser?.id);
      if (!res.success) {
        Alert.alert("Post", "Something went wrong!");
      }
    } else {
      // create like
      let data = {
        userId: currentUser?.id,
        postId: item?.id,
      };
      setLikes([...likes, data]);
      let res = await createPostLike(data);
      if (!res.success) {
        Alert.alert("Post", "Something went wrong!");
      }
    }
  };

  const onShare = async () => {
    let content = { message: stripHtmlTags(item?.body) };
    if (item?.file) {
      // download the file then share the local uri
      setLoading(true);
      let url = await downloadFile(getSupabaseFileUrl(item?.file).uri);
      setLoading(false);
      content.url = url;
    }
    Share.share(content);
  };

  const liked = likes?.filter((like) => like.userId == currentUser?.id)[0]
    ? true
    : false;

  return (
    <View style={styles.footer}>
      <View style={styles.footerButton}>
        <TouchableOpacity onPress={onLike}>
          <Icon
            name="heart"
            size={24}
            fill={liked ? theme.colors.rose : "transparent"}
            color={liked ? theme.colors.rose : theme.colors.textLight}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.count,
            { color: liked ? theme.colors.rose : theme.colors.textLight },
          ]}
        >
          {likes.length}
        </Text>
      </View>
      <View style={styles.footerButton}>
        <TouchableOpacity onPress={openPostDetails}>
          <Icon name="comment" size={24} color={theme.colors.textLight} />
        </TouchableOpacity>
        <Text style={styles.count}>{item?.comments[0]?.count}</Text>
      </View>
      <View style={styles.footerButton}>
        {loading ? (
          <Loading size="small" />
        ) : (
          <TouchableOpacity onPress={onShare}>
            <Icon name="share" size={24} color={theme.colors.textLight} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default PostActions;

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8),
  },
});
