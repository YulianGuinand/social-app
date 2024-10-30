import React from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import Header from "../../../shared/Header";
import { theme } from "../../../../constants/theme";
import Avatar from "../../../shared/Avatar";
import { hp } from "../../../../helpers/common";
import Icon from "../../../../assets/icons";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Pressable } from "react-native";

const UserHeader = ({
  user,
  router,
  handleLogOut,
  nbPosts = 0,
  setWithImage = () => {},
  withImage,
}) => {
  const { user: currentUser } = useAuth();
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
