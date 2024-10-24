import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Button from "../components/Button";
import ScreenWrapper from "../components/ScreenWrapper";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Icon from "../assets/icons";
import { useRouter } from "expo-router";
import Avatar from "../components/Avatar";
import { fetchPosts } from "../services/postService";
import PostCard from "../components/PostCard";
import Loading from "../components/Loading";
import { getUserData } from "../services/userService";
import { Context } from "../app/_layout";

var limit = 0;
const Home = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const getPosts = async () => {
    // if (!hasMore) return null;

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

  const handleNewNotification = async (payload) => {
    if (payload.eventType === "INSERT" && payload.new.id) {
      setNotificationCount((prev) => prev + 1);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>WeBDE</Text>
          <View style={styles.icons}>
            <Pressable
              onPress={() => {
                setNotificationCount(0);
                router.push("notifications");
              }}
            >
              <Icon
                name="heart"
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
              {notificationCount > 0 && (
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{notificationCount}</Text>
                </View>
              )}
            </Pressable>
            <Pressable onPress={() => router.push("newPost")}>
              <Icon
                name="plus"
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={() => router.push("profile")}>
              <Avatar
                uri={user?.image}
                size={hp(4.3)}
                rounded={theme.radius.sm}
                style={{ borderWidth: 2 }}
              />
            </Pressable>
          </View>
        </View>

        {/* POSTS */}
        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostCard
              setPosts={setPosts}
              item={item}
              currentUser={user}
              router={router}
            />
          )}
          onEndReached={() => {
            getPosts();
          }}
          onEndReachedThreshold={0}
          ListFooterComponent={
            hasMore ? (
              <View style={{ marginVertical: posts.length == 0 ? 200 : 30 }}>
                <Loading />
              </View>
            ) : (
              <View style={{ marginVertical: posts.length == 0 ? 200 : 30 }}>
                <Text style={styles.noPosts}>No more posts</Text>
              </View>
            )
          }
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: wp(4)
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold,
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
    borderWidth: 3,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text,
  },
  pill: {
    position: "absolute",
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight,
  },
  pillText: {
    color: "white",
    fontSize: hp(1.2),
    fontWeight: theme.fonts.bold,
  },
});
