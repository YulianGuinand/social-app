import { Alert, FlatList, FlatListComponent, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import { hp, wp } from '../helpers/common';
import { TouchableOpacity } from 'react-native';
import Icon from '../assets/icons';
import { theme } from '../constants/theme';
import { supabase } from '../lib/supabase';
import Avatar from '../components/Avatar';
import { fetchPosts } from '../services/postService';
import PostCard from '../components/PostCard';
import Loading from '../components/Loading';
import { getUserData } from '../services/userService';

var limit = 0;
const Profile = () => {
  const {user, setAuth} = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const getPosts = async () => {
    if (!hasMore) return null;
    limit += 2;
    console.log("Fetching post: ", limit);
    let res = await fetchPosts(limit, user.id);

    if (res.success) {
      if (posts.length == res.data.length) setHasMore(false);
      setPosts(res.data);
    }
  };

  // const handlePostEvent = async (payload) => {
  //   if (payload.eventType == "INSERT" && payload?.new?.id) {
  //     let newPost = { ...payload.new, comments: [{ count: 0 }], postLikes: [] };

  //     let res = await getUserData(newPost.userId);

  //     newPost.user = res.success ? res.data : {};
  //     setPosts((prevPosts) => [newPost, ...prevPosts]);
  //   }

  //   if(payload.eventType == 'DELETE' && payload.old.id){
  //     setPosts(prevPosts => {
  //       let updatedPosts = prevPosts.filter(post => post.id != payload.old.id);
  //       return updatedPosts;
  //     })
  //   }

  //   if(payload.eventType == 'UPDATE' && payload?.new?.id){
  //     setPosts(prevPosts => {
  //       let updatedPosts = prevPosts.map(post => {
  //         if(post.id == payload.new.id) {
  //           post.body = payload.new.body;
  //           post.file = payload.new.file;
  //         }
  //         return post;
  //       });

  //       return updatedPosts;
  //     })
  //   }
  // };

  // useEffect(() => {
  //   let postChannel = supabase
  //     .channel("posts")
  //     .on(
  //       "postgres_changes",
  //       { event: "*", schema: "public", table: "posts" },
  //       handlePostEvent
  //     )
  //     .subscribe();

  //   let commentChannel = supabase
  //     .channel("comments")
  //     .on(
  //       "postgres_changes",
  //       { event: "INSERT", schema: "public", table: "comments" },
  //       (payload) => {
  //         const newComment = payload.new;

  //         setPosts((prevPosts) =>
  //           prevPosts.map((post) =>
  //             post.id === newComment.postId
  //               ? { ...post, comments: [{ count: post.comments[0].count + 1 }] }
  //               : post
  //           )
  //         );
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(commentChannel);
  //     supabase.removeChannel(postChannel);
  //   };
  // }, []);

  const handleLogOut = async () => {
    Alert.alert("Confirm", "Are you sure you want to log out ?", [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Logout',
        onPress: () => onLogout(),
        style: 'destructive',
      }
    ])
  }

  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Sign out", "Error signing out!");
    }
  };

  return (
    <ScreenWrapper bg="white">
      <FlatList
          data={posts}
          ListHeaderComponent={<UserHeader user={user} router={router} handleLogOut={handleLogOut}/>
          }
          ListHeaderComponentStyle={{marginBottom: 30}}
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
        />
    </ScreenWrapper>
  )
}

const UserHeader = ({user, router, handleLogOut}) => {
  return(
    <View style={{flex: 1, backgroundColor: 'white', paddingHorizontal: hp(4) }}>
      <View>
        <Header title="Profile" mb={30}/>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
          <Icon name="logout" color={theme.colors.textDark}/>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={{gap: 15}}>
          <View style={styles.avataContainer}>
            <Avatar uri={user?.image} size={hp(12)} rounded={theme.radius.xxl*1.4}/>
            <Pressable style={styles.editIcon} onPress={() => router.push('editProfile')}>
              <Icon name="edit" strokeWidth={2.5} size={20} />
            </Pressable>
          </View>

          {/* USERNAME AND ADRESS */}
          <View style={{alignItems: 'center', gap: 4}}>
            <Text style={styles.userName}>{user && user.name}</Text>
            <Text style={styles.infoText}>{user && user.adress}</Text>
          </View>

          {/* EMAIL, PHONE, BIO */}
          <View style={{gap: 10}}>
            <View style={styles.info}>
              <Icon name="mail" size={20} color={theme.colors.textLight}/>
              <Text style={styles.infoText}>
                {user && user.email}
              </Text>
            </View>
            {
              user && user.phoneNumber && (
                <View style={styles.info}>
                  <Icon name="call" size={20} color={theme.colors.textLight}/>
                  <Text style={styles.infoText}>
                    {user && user.phoneNumber}
                  </Text>
                </View>
              )
            }

            {
              user && user.bio && (
                <Text style={styles.infoText}>
                  {user.bio}
                </Text>
              )
            }
          </View>
        </View>
      </View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginHorizontal: wp(4),
    marginBottom: 20
  },
  headerShape: {
    width: wp(100),
    height: hp(20),
  },
  avataContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: 'center'
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: theme.colors.textLight,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7
  },
  userName: {
    fontSize: hp(3),
    fontWeight: '500',
    color: theme.colors.textDark
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: '500',
    color: theme.colors.textLight,
  },
  logoutButton: {
    position: 'absolute',
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: '#fee2e2'
  },
  listStyle: {
    paddingHorizontal: wp(4),
    paddingBottom: 30,
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.text,
  }
})