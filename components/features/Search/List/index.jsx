import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { theme } from "../../../../constants/theme";
import { wp } from "../../../../helpers/common";
import Avatar from "../../../shared/Avatar";

const ResultList = (data) => {
  return (
    <FlatList
      data={data.data}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ marginTop: 20 }}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <SearchResult item={item} />}
      onEndReached={() => {}}
      onEndReachedThreshold={0}
    />
  );
};

export default ResultList;

const SearchResult = ({ item }) => {
  const router = useRouter();
  const openProfile = () => {
    router.push({
      pathname: "profile",
      params: { userId: item.id },
    });
  };

  return (
    <TouchableHighlight
      activeOpacity={1}
      underlayColor="#eceded"
      onPress={openProfile}
    >
      <View style={styles.resultContainer}>
        <Avatar uri={item.image} />
        <View style={{ flexDirection: "column" }}>
          <Text style={{ fontSize: 15 }}>@{item.username}</Text>
          <Text style={{ fontSize: 13, color: theme.colors.textLight }}>
            {item.firstname}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  resultContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: wp(4),
    gap: 10,
  },
});
