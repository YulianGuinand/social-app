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
import { fetchPosts } from "../services/postService";
import PostCard from "../components/PostCard";
import Loading from "../components/Loading";
import { getUserData } from "../services/userService";

var limit = 0;
const Profile = () => {
  const { userId } = useLocalSearchParams();
  const { user: currentUser, setAuth } = useAuth();
  const [user, setUser] = useState({});

  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getPosts = async () => {
    if (!hasMore) return null;
    limit += 2;

    let res = await fetchPosts(limit, userId ? userId : user.id);

    if (res.success) {
      if (posts.length == res.data.length) setHasMore(false);
      setPosts(res.data);
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

  return (
    <ScreenWrapper bg="white">
      <FlatList
        data={posts}
        ListHeaderComponent={
          <UserHeader user={user} router={router} handleLogOut={handleLogOut} />
        }
        ListHeaderComponentStyle={{ marginBottom: 30 }}
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
            <View style={{ marginVertical: posts.length == 0 ? 100 : 30 }}>
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
    </ScreenWrapper>
  );
};

const UserHeader = ({ user, router, handleLogOut }) => {
  const { user: currentUser, setAuth } = useAuth();
  return (
    <View
      style={{ flex: 1, backgroundColor: "white", paddingHorizontal: hp(4) }}
    >
      <View>
        <Header title="Profile" mb={30} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
          <Icon name="logout" color={theme.colors.textDark} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={{ gap: 15 }}>
          <View style={styles.avataContainer}>
            <Avatar
              uri={user?.image}
              size={hp(12)}
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

          {/* USERNAME AND ADRESS */}
          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={styles.userName}>{user && user.name}</Text>
          </View>

          {/* EMAIL, PHONE, BIO */}
          <View style={{ gap: 10 }}>
            {user && user.bio && (
              <Text style={styles.infoText}>{user.bio}</Text>
            )}
          </View>
        </View>
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
    marginBottom: 20,
  },
  headerShape: {
    width: wp(100),
    height: hp(20),
  },
  avataContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: "center",
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
    fontSize: hp(3),
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
    backgroundColor: "#fee2e2",
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
