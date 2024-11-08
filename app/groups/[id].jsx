import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const GroupScreen = () => {
  const { id, data } = useLocalSearchParams();

  console.log(id, data);
  return (
    <View>
      <Text>GroupScreen</Text>
    </View>
  );
};

export default GroupScreen;

const styles = StyleSheet.create({});
