import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { theme } from "../../../../constants/theme";
import { hp } from "../../../../helpers/common";
import Avatar from "../../../shared/Avatar";
import Icon from "../../../../assets/icons";
import { Alert } from "react-native";
import moment from "moment";

const UserInfo = ({
  item,
  showMoreIcon,
  openPostDetails,
  showDelete,
  currentUser,
  onDelete,
  router,
  onEdit,
}) => {
  const handleOnDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this post ?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => onDelete(item),
        style: "destructive",
      },
    ]);
  };

  const openProfile = (userId) => {
    router.push({
      pathname: "profile",
      params: { userId: userId },
    });
  };

  const createdAt = moment(item?.created_at).format("MMM D");
  return (
    <View style={styles.header}>
      {/* USER INFO AND POST TIME */}
      <TouchableOpacity onPress={() => openProfile(item?.user?.id)}>
        <View style={styles.userInfo}>
          <Avatar
            size={hp(4.5)}
            uri={item?.user?.image}
            rounded={theme.radius.md}
          />
          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{item?.user?.name}</Text>
            <Text style={styles.postTime}>{createdAt}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {showMoreIcon && (
        <TouchableOpacity onPress={openPostDetails}>
          <Icon
            name="threeDotsHorizontal"
            size={hp(3.4)}
            strokeWidth={3}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      )}

      {showDelete && currentUser.id == item?.userId && (
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onEdit(item)}>
            <Icon name="edit" size={hp(2.5)} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOnDelete}>
            <Icon name="delete" size={hp(2.5)} color={theme.colors.rose} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  username: {
    fontSize: hp(1.7),
    color: theme.colors.textDark,
    fontWeight: theme.fonts.medium,
  },
  postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
});
