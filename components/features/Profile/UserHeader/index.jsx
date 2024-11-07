import React, { useEffect } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "../../../../assets/icons";
import { theme } from "../../../../constants/theme";
import { useAuth } from "../../../../contexts/AuthContext";
import { hp } from "../../../../helpers/common";
import { supabase } from "../../../../lib/supabase";
import {
  createOrUpdateChat,
  fetchThreadByUsers,
} from "../../../../services/threadService";
import Avatar from "../../../shared/Avatar";
import Header from "../../../shared/Header";
import {
  createOrUpdateFriendShip,
  deleteFriendShip,
  updateFriendShip,
} from "../../../../services/FriendshipService";

const UserHeader = ({
  user,
  router,
  handleLogOut,
  nbPosts = 0,
  setWithImage = () => {},
  withImage,
  relation,
  setRelation,
}) => {
  const { user: currentUser } = useAuth();

  // CREATE CHAT
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

  // CREATE FRIEND REQUEST
  const createFriendShip = async (status = "waiting") => {
    const friendShip = {
      user1: currentUser.id,
      user2: user.id,
      status,
    };

    let res = await createOrUpdateFriendShip(friendShip);
    if (res.success) {
      setRelation(res.data);

      // TODO : Create notification
    }
  };

  // SUPPRESSION & REFUS
  const onRemove = async (id) => {
    let res = await deleteFriendShip(id);

    if (res.success) {
      setRelation(null);
    }
  };
  const handleRemoveFriend = () => {
    Alert.alert("Confirm", "Are you sure you want to refuse ?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Refus",
        onPress: () => onRemove(relation.id),
        style: "destructive",
      },
    ]);
  };

  // ACCEPTATION
  const onAccept = async (status = "permit") => {
    if (!relation) return null;
    await updateFriendShip(relation.id, status);
  };

  useEffect(() => {
    let friendShipChannel;
    if (relation && relation.user1 === currentUser.id) {
      friendShipChannel = supabase
        .channel("friendship")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "friendship",
            filter: `user1=eq.${currentUser.id}`,
          },
          (payload) => {
            console.log("NEW: ", payload);
            if (payload.eventType === "UPDATE" && payload.new) {
              setRelation({ ...relation, status: payload.new.status });
            }
          }
        )
        .subscribe();
    } else {
      friendShipChannel = supabase
        .channel("friendship")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "friendship",
            filter: `user2=eq.${currentUser.id}`,
          },
          (payload) => {
            console.log("NEW: ", payload);
            if (payload.eventType === "UPDATE" && payload.new) {
              setRelation({ ...relation, status: payload.new.status });
            }
          }
        )
        .subscribe();
    }

    return () => {
      supabase.removeChannel(friendShipChannel);
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ justifyContent: "center", marginBottom: 30 }}>
        <Header title={user.username} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
          <Icon name="logout" color={theme.colors.textDark} />
        </TouchableOpacity>
      </View>

      {/* INFO */}
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <View>
            <Avatar
              uri={user?.image}
              size={hp(9)}
              rounded={theme.radius.xxl * 1.4}
            />
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
            alignItems: "flex-start",
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

      {/* ACTIONS */}
      <View style={{ width: "100%", marginTop: 10 }}>
        {currentUser.id !== user.id ? (
          // PAS MON COMPTE
          relation ? (
            // RELATION EXISTANTE
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "space-between",
              }}
            >
              {/* PERMISSION */}
              {relation.status === "permit" ? (
                // PERMIS
                <>
                  {/* REFUSER */}
                  <TouchableOpacity
                    onPress={() => handleRemoveFriend()}
                    style={styles.containerBtnGauche}
                  >
                    <Text style={styles.textBtnGauche}>Ne plus suivre</Text>
                  </TouchableOpacity>

                  {/* ACCEPTER */}
                  <TouchableOpacity
                    onPress={() => handleCreateChat()}
                    style={styles.containerBtnDroit}
                  >
                    <Text style={styles.textBtnDroit}>Ecrire</Text>
                  </TouchableOpacity>
                </>
              ) : // WAITING
              // IS MINE OR NOT ?
              relation.user1 === currentUser.id ? (
                <>
                  <TouchableOpacity
                    onPress={() => console.log("WAITING")}
                    style={styles.containerBtnGauche}
                  >
                    <Text style={styles.textBtnGauche}>WAITING</Text>
                  </TouchableOpacity>

                  {user.status === "Public" && (
                    <TouchableOpacity
                      onPress={() => handleCreateChat()}
                      style={styles.containerBtnDroit}
                    >
                      <Text style={styles.textBtnDroit}>Ecrire</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <>
                  {/* REFUSER */}
                  <TouchableOpacity
                    onPress={() => handleRemoveFriend()}
                    style={styles.containerBtnGauche}
                  >
                    <Text style={styles.textBtnGauche}>REFUSER</Text>
                  </TouchableOpacity>

                  {/* ACCEPTER */}
                  <TouchableOpacity
                    onPress={() => onAccept("permit")}
                    style={styles.containerBtnDroit}
                  >
                    <Text style={styles.textBtnDroit}>ACCEPTER</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : (
            // RELATION INEXISTANTE
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => createFriendShip("waiting")}
                style={styles.containerBtnGauche}
              >
                <Text style={styles.textBtnGauche}>SUIVRE</Text>
              </TouchableOpacity>

              {user.status === "Public" && (
                <TouchableOpacity
                  onPress={() => handleCreateChat()}
                  style={styles.containerBtnDroit}
                >
                  <Text style={styles.textBtnDroit}>Ecrire</Text>
                </TouchableOpacity>
              )}
            </View>
          )
        ) : (
          // MON PROFILE
          <TouchableOpacity
            onPress={() => router.push("editProfile")}
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
              Modifier le profile
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* MODE TOGGLE */}
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

  containerBtnGauche: {
    backgroundColor: "white",
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderCurve: "continuous",
    flex: 1,
    paddingVertical: 5,
    borderRadius: theme.radius.xs,
  },
  textBtnGauche: {
    textAlign: "center",
    color: theme.colors.primary,
    fontWeight: theme.fonts.bold,
  },
  containerBtnDroit: {
    backgroundColor: theme.colors.primary,
    flex: 1,
    paddingVertical: 5,
    borderRadius: theme.radius.xs,
  },
  textBtnDroit: {
    textAlign: "center",
    color: "white",
    fontWeight: theme.fonts.bold,
  },
});
