import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "../../../../assets/icons";
import { theme } from "../../../../constants/theme";
import { hp, wp } from "../../../../helpers/common";
import Avatar from "../../../shared/Avatar";

const HeaderPost = ({
  router,
  notificationCount,
  setNotificationCount,
  user,
}) => {
  return (
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

        <Pressable
          onPress={() => {
            router.push("threads");
          }}
        >
          <Icon
            name="message"
            size={hp(4)}
            strokeWidth={1.5}
            color={theme.colors.text}
          />
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
  );
};

export default HeaderPost;

const styles = StyleSheet.create({
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
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
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
