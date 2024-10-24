import {
  Alert,
  FlatList,
  FlatListComponent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { useAuth } from "../contexts/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../components/Header";
import { hp, wp } from "../helpers/common";
import { TouchableOpacity } from "react-native";
import Icon from "../assets/icons";
import { theme } from "../constants/theme";
import { supabase } from "../lib/supabase";
import Avatar from "../components/Avatar";
import { fetchPosts, fetchPostsProfile } from "../services/postService";
import PostCard from "../components/PostCard";
import Loading from "../components/Loading";
import { getUserData } from "../services/userService";
import ProfileFeed from "../components/ProfileFeed";

var limit = 0;
const Profile = () => {
  const { userId } = useLocalSearchParams();
  const { user: currentUser, setAuth } = useAuth();
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

    console.log("POSTS IMAGE : ", posts);
    console.log("POSTS TEXT : ", postsText);
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

  return (
    <ScreenWrapper bg="white">
      {withImage ? (
        <FlatList
          data={posts}
          ListHeaderComponent={
            <UserHeader
              user={user}
              router={router}
              handleLogOut={handleLogOut}
              setWithImage={setWithImage}
              withImage={withImage}
            />
          }
          ListHeaderComponentStyle={{ marginBottom: 10 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => (
            <ProfileFeed dataList={item} />
            // <PostCard
            //   setPosts={setPosts}
            //   item={item}
            //   currentUser={user}
            //   router={router}
            // />
          )}
          onEndReached={() => {
            setWithImage(true);
            getPosts();
          }}
          onEndReachedThreshold={0}
          // ListFooterComponent={
          // hasMore ? (
          //   <View style={{ marginVertical: posts.length == 0 ? 100 : 30 }}>
          //     <Loading />
          //   </View>
          // ) : null
          // <View style={{ marginVertical: posts.length == 0 ? 200 : 30 }}>
          //   <Text style={styles.noPosts}>No more posts</Text>
          // </View>
          // }
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      ) : (
        <FlatList
          data={postsText}
          ListHeaderComponent={
            <UserHeader
              user={user}
              router={router}
              handleLogOut={handleLogOut}
              setWithImage={setWithImage}
              withImage={withImage}
            />
          }
          ListHeaderComponentStyle={{ marginBottom: 10 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => (
            // <ProfileFeed dataList={item} />
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
          // ListFooterComponent={
          //   hasMore ? (
          //     <View style={{ marginVertical: posts.length == 0 ? 100 : 30 }}>
          //       <Loading />
          //     </View>
          //   ) : (
          //     <View style={{ marginVertical: posts.length == 0 ? 200 : 30 }}>
          //       <Text style={styles.noPosts}>No more posts</Text>
          //     </View>
          //   )
          // }
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </ScreenWrapper>
  );
};

const UserHeader = ({
  user,
  router,
  handleLogOut,
  nbPosts = 0,
  setWithImage = () => {},
  withImage,
}) => {
  const { user: currentUser, setAuth } = useAuth();
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ justifyContent: "center", marginBottom: 30 }}>
        <Header title="Profile" />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
          <Icon name="logout" color={theme.colors.textDark} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <View>
            <Avatar
              uri={user?.image}
              size={hp(9)}
              rounded={theme.radius.xxl * 1.4}
            />
            {currentUser.id == user.id ? (
              <Pressable
                style={styles.editIcon}
                onPress={() => router.push("editProfile")}
              >
                <Icon name="edit" strokeWidth={2.5} size={20} />
              </Pressable>
            ) : null}
          </View>

          <View style={{ width: "50%", alignItems: "center" }}>
            <View
              style={{
                width: "100%",
                height: hp(4),
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: hp(1.6) }}>{nbPosts}</Text>
              <Text>publications</Text>
            </View>
          </View>
        </View>

        {/* USERNAME */}
        <View
          style={{
            alignItems: "start",
            flexDirection: "column",
          }}
        >
          <Text style={styles.userName}>{user && user.name}</Text>
        </View>

        {/* BIO */}
        <View style={{ gap: 10 }}>
          {user && user.bio && <Text style={styles.infoText}>{user.bio}</Text>}
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: 30,
          marginTop: 15,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            width: "50%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: withImage ? theme.colors.primary : "white",
            borderWidth: !withImage ? 1 : 0,
            borderColor: !withImage && theme.colors.darkLight,
          }}
          onPress={() => setWithImage(true)}
        >
          <Text style={{ color: withImage ? "white" : "black" }}>Image</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "50%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: !withImage ? theme.colors.primary : "white",
            borderWidth: withImage ? 1 : 0,
            borderColor: withImage && theme.colors.darkLight,
          }}
          onPress={() => setWithImage(false)}
        >
          <Text style={{ color: !withImage ? "white" : "black" }}>Text</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginHorizontal: wp(4),
    // marginBottom: 20,
  },
  headerShape: {
    width: wp(100),
    height: hp(20),
  },
  avatarContainer: {
    // flex: 1,
    height: hp(9),
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "start",
    marginBottom: 9,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: "white",
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  userName: {
    fontSize: hp(2),
    fontWeight: "500",
    color: theme.colors.textDark,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: "500",
    color: theme.colors.textLight,
  },
  logoutButton: {
    position: "absolute",
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: "transparent",
  },
  listStyle: {
    paddingHorizontal: wp(4),
    paddingBottom: 30,
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text,
  },
});
