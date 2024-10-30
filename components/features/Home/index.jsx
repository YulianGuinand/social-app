import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import { supabase } from "../../../lib/supabase";
import { fetchPosts } from "../../../services/postService";
import { getUserData } from "../../../services/userService";
import ScreenWrapper from "../../shared/ScreenWrapper";
import HeaderPost from "./Header";
import PostList from "./PostList";

var limit = 0;

const HomeScreen = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const getPosts = async () => {
    if (!hasMore) return null;

    limit += 2;

    let res = await fetchPosts(limit);

    if (res.success) {
      if (posts.length == res.data.length) setHasMore(false);

      const likesData = [];
      res.data.forEach((post) => {
        post.postLikes.forEach((like) => {
          likesData.push(like);
        });
      });

      if (likesData.length != 0) {
        likesData.forEach((like) => {
          res.data.forEach((post) => {
            if (like.postId == post.id && like.userId == user.id) {
              post.isLiked = true;
            } else {
              post.isLiked = false;
            }
          });
        });
      } else {
        res.data.forEach((post) => {
          post.isLiked = false;
        });
      }
      setPosts(res.data);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getPosts();
    setRefreshing(false);
  };

  const handlePostEvent = async (payload) => {
    if (payload.eventType == "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new, comments: [{ count: 0 }], postLikes: [] };

      let res = await getUserData(newPost.userId);

      newPost.user = res.success ? res.data : {};
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }

    if (payload.eventType == "DELETE" && payload.old.id) {
      setPosts((prevPosts) => {
        let updatedPosts = prevPosts.filter(
          (post) => post.id != payload.old.id
        );
        return updatedPosts;
      });
    }

    if (payload.eventType == "UPDATE" && payload?.new?.id) {
      setPosts((prevPosts) => {
        let updatedPosts = prevPosts.map((post) => {
          if (post.id == payload.new.id) {
            post.body = payload.new.body;
            post.file = payload.new.file;
          }
          return post;
        });

        return updatedPosts;
      });
    }
  };

  const handleNewNotification = async (payload) => {
    if (payload.eventType === "INSERT" && payload.new.id) {
      setNotificationCount((prev) => prev + 1);
    }
  };

  useEffect(() => {
    let postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvent
      )
      .subscribe();

    let likeChannel = supabase
      .channel("postLikes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "postLikes" },
        getPosts
      )
      .subscribe();

    let commentChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        (payload) => {
          const newComment = payload.new;

          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === newComment.postId
                ? { ...post, comments: [{ count: post.comments[0].count + 1 }] }
                : post
            )
          );
        }
      )
      .subscribe();

    let notificationChannel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `receiverId=eq.${user?.id}`,
        },
        handleNewNotification
      )
      .subscribe();

    return () => {
      supabase.removeChannel(commentChannel);
      supabase.removeChannel(postChannel);
      supabase.removeChannel(likeChannel);
      supabase.removeChannel(notificationChannel);
    };
  }, []);
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        {/* HEADER */}
        <HeaderPost
          router={router}
          notificationCount={notificationCount}
          setNotificationCount={setNotificationCount}
          user={user}
        />

        {/* POSTS */}
        <PostList
          posts={posts}
          user={user}
          router={router}
          hasMore={hasMore}
          refreshing={refreshing}
          handleRefresh={handleRefresh}
          getPosts={getPosts}
        />
      </View>
    </ScreenWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
