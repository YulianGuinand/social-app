import moment from "moment";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "../../../../../assets/icons";
import { theme } from "../../../../../constants/theme";
import { hp } from "../../../../../helpers/common";
import Avatar from "../../../../shared/Avatar";

const CommentItem = ({
  item,
  canDelete = false,
  onDelete = () => {},
  commentId = undefined,
}) => {
  const createdAt = moment(item?.created_at).format("MMM d H:mm");
  const handleDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this comment ?", [
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
  let hightlight = commentId == item.id;

  return (
    <View style={styles.container}>
      <Avatar uri={item?.user?.image} />
      <View style={[styles.content, hightlight && styles.hightlight]}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={styles.nameContainer}>
            <Text style={styles.text}>{item?.user?.username}</Text>
            <Text>·</Text>
            <Text style={[styles.text, { color: theme.colors.textLight }]}>
              {createdAt}
            </Text>
          </View>
          {canDelete && (
            <TouchableOpacity onPress={handleDelete}>
              <Icon name="delete" size={20} color={theme.colors.rose} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.text, { fontWeight: "normal" }]}>
          {item?.text}
        </Text>
      </View>
    </View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    gap: 7,
  },
  content: {
    backgroundColor: "rgba(0,0,0,0.06)",
    flex: 1,
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    borderColor: "continuous",
  },
  hightlight: {
    backgroundColor: "white",
    // borderColor: theme.colors.dark,
    // borderWidth: 0.2,
    // backgroundColor: 'white',
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  text: {
    fontSize: hp(1.6),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textDark,
  },
});
