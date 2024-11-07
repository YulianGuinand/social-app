import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "../../../../assets/icons";
import { theme } from "../../../../constants/theme";
import { useAuth } from "../../../../contexts/AuthContext";
import { hp } from "../../../../helpers/common";
import {
  createOrUpdateChat,
  fetchThreadByUsers,
} from "../../../../services/threadService";
import Avatar from "../../../shared/Avatar";
import Header from "../../../shared/Header";

const UserHeader = ({
  user,
  router,
  handleLogOut,
  nbPosts = 0,
  setWithImage = () => {},
  withImage,
}) => {
  const { user: currentUser } = useAuth();

  const handleCreateChat = async () => {
    if (user.id === currentUser.id) return null;

    const chat = {
      user1_id: currentUser.id,
      user2_id: user.id,
    };

    let res = await createOrUpdateChat(chat);

    if (res.success) {
      router.push({
        pathname: `/threads/${res.data.id}`,
        params: {
          user2Id:
            res.data.user1_id === currentUser.id
              ? res.data.user2_id
              : res.data.user1_id,
        },
      });
    } else if (res.msg === "23505") {
      res = await fetchThreadByUsers(chat.user1_id, chat.user2_id);

      if (res.success) {
        router.push({
          pathname: `/threads/${res.data.id}`,
          params: {
            user2Id:
              res.data.user1_id === currentUser.id
                ? res.data.user2_id
                : res.data.user1_id,
          },
        });
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ justifyContent: "center", marginBottom: 30 }}>
        <Header title={user.username} />
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
          <Text style={styles.userName}>{user && user.firstname}</Text>
        </View>

        {/* BIO */}
        <View style={{ gap: 10 }}>
          {user && user.bio && <Text style={styles.infoText}>{user.bio}</Text>}
        </View>
      </View>

      <View
        style={{ width: "100%", flexDirection: "row", gap: 5, marginTop: 10 }}
      >
        <TouchableOpacity
          onPress={() => {}}
          style={{
            backgroundColor: "white",
            borderColor: theme.colors.primary,
            borderWidth: 1,
            borderCurve: "continuous",
            flex: 1,
            paddingVertical: 5,
            borderRadius: theme.radius.xs,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: theme.colors.primary,
              fontWeight: theme.fonts.bold,
            }}
          >
            Suivre
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCreateChat}
          style={{
            backgroundColor: theme.colors.primary,
            flex: 1,
            paddingVertical: 5,
            borderRadius: theme.radius.xs,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontWeight: theme.fonts.bold,
            }}
          >
            Écrire
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: 50,
          marginTop: 15,
          justifyContent: "space-around",
        }}
      >
        <TouchableOpacity
          style={{
            width: 70,
            alignItems: "center",
            justifyContent: "center",
            borderBottomWidth: withImage ? 2 : 0,
            borderBottomColor: theme.colors.primary,
          }}
          onPress={() => setWithImage(true)}
        >
          <Icon
            name="image"
            color={withImage ? theme.colors.primary : theme.colors.text}
            size={hp(2.4)}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: 70,
            alignItems: "center",
            justifyContent: "center",
            borderBottomWidth: !withImage ? 2 : 0,
            borderBottomColor: theme.colors.primary,
          }}
          onPress={() => setWithImage(false)}
        >
          <Icon
            name="edit"
            color={!withImage ? theme.colors.primary : theme.colors.text}
            size={hp(2.4)}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  logoutButton: {
    position: "absolute",
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: "transparent",
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
});
