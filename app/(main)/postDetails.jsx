import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  createComment,
  fetchPostDetails,
  removeComment,
} from "../../services/postService";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import PostCard from "../../components/PostCard";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import Input from "../../components/Input";
import { TouchableOpacity } from "react-native";
import Icon from "../../assets/icons";
import ScreenWrapper from "../../components/ScreenWrapper";
import CommentItem from "../../components/CommentItem";
import { supabase } from "../../lib/supabase";
import { getUserData } from "../../services/userService";

const postDetails = () => {
  const { postId } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [startLoading, setStartLoading] = useState(true);
  const inputRef = useRef(null);
  const commentRef = useRef("");
  const [loading, setLoading] = useState(false);

  const [post, setPost] = useState(null);

  const handleNewComment = async (payload) => {
    if (payload.new) {
      let newComment = { ...payload };
      let res = await getUserData(newComment.userId);
      newComment.user = res.success ? res.data : {};
      setPost((prevPost) => {
        return {
          ...prevPost,
          comments: [newComment, ...prevPost.comments],
        };
      });
    }
  };

  useEffect(() => {
    getPostDetails();
    // let commentChannel = supabase
    // .channel("comments")
    //   .on(
    //     "postgres_changes",
    //     { event: "INSERT",
    //       schema: "public",
    //       table: "comments",
    //       filter: `postId=eq.${postId}`
    //     },
    //     handleNewComment
    //   )
    //   .subscribe();


    //   return () => {
    //   supabase.removeChannel(commentChannel);

    // };
  }, []);

  const getPostDetails = async () => {
    // FETCH POST DETAILS HERE
    let res = await fetchPostDetails(postId);
    if (res.success) setPost(res.data);
    setStartLoading(false);
  };

  if (startLoading) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    );
  }

  if (!post) {
    return (
      <View
        style={[
          styles.center,
          { justifyContent: "flex-start", marginTop: 100 },
        ]}
      >
        <Text style={styles.notFound}>Post not found!</Text>
      </View>
    );
  }

  const onNewComment = async () => {
    if (!commentRef.current) return null;
    let data = {
      userId: user?.id,
      postId: post?.id,
      text: commentRef.current,
    };

    // CREATE COMMENT
    setLoading(true);
    let res = await createComment(data);
    setLoading(false);
    if (res.success) {
      inputRef?.current?.clear();
      commentRef.current = "";
      getPostDetails();
    } else {
      Alert.alert("Comment", res.msg);
    }
  };

  const onDelete = async (comment) => {
    let res = await removeComment(comment?.id);
    if (res.success) {
      setPost((prevPost) => {
        let updatedPost = { ...prevPost };
        updatedPost.comments = updatedPost.comments.filter(
          (c) => c.id != comment.id
        );
        return updatedPost;
      });
    } else {
      Alert.alert("Comment", res.msg);
    }
  };

  return (
    <ScreenWrapper bg="white" style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        <PostCard
          item={{ ...post, comments: [{ count: post.comments.length }] }}
          currentUser={user}
          router={router}
          hasShadow={false}
          showMoreIcon={false}
        />

        {/* COMMENT INPUT */}
        <View style={styles.inputContainer}>
          <Input
            inputRef={inputRef}
            placeholder="Type comment..."
            placeholderTextcolor={theme.colors.text}
            onChangeText={(value) => (commentRef.current = value)}
            containerStyle={{
              flex: 1,
              height: hp(6.2),
              borderRadius: theme.radius.xl,
              borderCurve: "continuous",
            }}
          />

          {loading ? (
            <View style={styles.loading}>
              <Loading size="small" />
            </View>
          ) : (
            <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
              <Icon name="send" color={theme.colors.primaryDark} />
            </TouchableOpacity>
          )}
        </View>

        {/* COMMENT LIST */}
        <View style={{ marginVertical: 15, gap: 17 }}>
          {post?.comments?.map((comment) => (
            <CommentItem
              key={comment?.id?.toString()}
              item={comment}
              canDelete={user.id == comment.userId || user.id == post.userId}
              onDelete={onDelete}
            />
          ))}

          {post?.comments?.length == 0 && (
            <Text style={{ color: theme.colors.text, marginLeft: 5 }}>
              Be first to comment!
            </Text>
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default postDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: wp(7),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  list: {
    paddingHorizontal: wp(4),
  },
  sendIcon: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
    height: hp(5.8),
    width: hp(5.8),
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFound: {
    fontSize: hp(2.5),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
  },
  loading: {
    height: hp(5.8),
    width: hp(5.8),
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 1.3 }],
  },
});