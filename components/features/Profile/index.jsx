import { Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../../../contexts/AuthContext";
import { fetchPostsProfile } from "../../../services/postService";
import { supabase } from "../../../lib/supabase";
import { getUserData } from "../../../services/userService";
import ScreenWrapper from "../../shared/ScreenWrapper";
import PostImage from "./PostList/Image";
import PostText from "./PostList/Text";

var limit = 0;
const ProfileScreen = () => {
  const { userId } = useLocalSearchParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState({});

  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [withImage, setWithImage] = useState(true);
  const [postsText, setPostsText] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const arrayToMatrix = (arr, chunkSize) => {
    const matrix = [];

    for (let i = 0; i < arr.length; i += chunkSize) {
      matrix.push(arr.slice(i, i + chunkSize));
    }

    return matrix;
  };

  const getPosts = async () => {
    if (!hasMore) return null;
    limit += 2;

    let res = await fetchPostsProfile(
      limit,
      userId ? userId : user.id,
      withImage
    );

    if (res.success) {
      if (withImage) {
        setPosts(arrayToMatrix(res.data, 3));
      } else {
        setPostsText(res.data);
      }
    }
  };

  const handleLogOut = async () => {
    Alert.alert("Confirm", "Are you sure you want to log out ?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => onLogout(),
        style: "destructive",
      },
    ]);
  };

  const onLogout = async () => {
    router.back();
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Sign out", "Error signing out!");
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    updateUser();
    getPosts();
    setRefreshing(false);
  };

  const updateUser = () => {
    if (userId) {
      const getUser = async (userId) => await getUserData(userId);

      getUser(userId).then((response) => {
        setUser(response.data);
      });
    } else {
      setUser(currentUser);
    }
  };
  useEffect(() => {
    updateUser();
  }, []);

  useEffect(() => {
    if (withImage) {
      if (posts.length === 0) {
        getPosts();
      }
    } else {
      if (postsText.length === 0) {
        getPosts();
      }
    }
  }, [withImage]);

  let len = 0;
  posts.forEach((item) => {
    item.forEach((post) => {
      len += 1;
    });
  });
  postsText.forEach(() => {
    len += 1;
  });

  return (
    <ScreenWrapper bg="white">
      {withImage ? (
        <PostImage
          posts={posts}
          user={user}
          router={router}
          handleLogOut={handleLogOut}
          setWithImage={setWithImage}
          withImage={withImage}
          len={len}
          refreshing={refreshing}
          handleRefresh={handleRefresh}
          getPosts={getPosts}
        />
      ) : (
        <PostText
          postsText={postsText}
          user={user}
          router={router}
          handleLogOut={handleLogOut}
          setWithImage={setWithImage}
          withImage={withImage}
          len={len}
          setPostsText={setPostsText}
          refreshing={refreshing}
          handleRefresh={handleRefresh}
          getPosts={getPosts}
        />
      )}
    </ScreenWrapper>
  );
};

export default ProfileScreen;
