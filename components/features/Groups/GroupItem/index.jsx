import { useRouter } from "expo-router";
import moment from "moment";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../../../constants/theme";
import Avatar from "../../../shared/Avatar";

const GroupItem = ({ item }) => {
  const group = item.group_id;
  const router = useRouter();

  const onClick = () => {
    router.push({
      pathname: `/groups/${group.id}`,
      params: { data: JSON.stringify(item) },
    });
  };

  const createdAt = moment(group.created_at).fromNow();
  return (
    <TouchableOpacity onPress={onClick} style={styles.container}>
      <View
        style={{
          width: "50%",
          flexDirection: "row",
          alignItems: "center",
          gap: 15,
        }}
      >
        <Avatar uri={item.image} size={45} />
        <View>
          <Text>{group.name}</Text>
          <Text style={{ fontSize: 12 }}>{group.description}</Text>
        </View>
      </View>

      <View
        style={{
          width: "50%",
          alignItems: "flex-end",
        }}
      >
        <Text style={{ color: theme.colors.textLight }}>{createdAt}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default GroupItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 15,
    borderRadius: theme.radius.md,
  },
});
