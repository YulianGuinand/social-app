import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import Header from "../../components/shared/Header";
import ScreenWrapper from "../../components/shared/ScreenWrapper";
import { wp } from "../../helpers/common";

const GroupScreen = () => {
  const { id, data } = useLocalSearchParams();
  const group = JSON.parse(data).group_id;

  return (
    <ScreenWrapper>
      <View style={{ paddingHorizontal: wp(4) }}>
        <Header title={group.name} />
      </View>
    </ScreenWrapper>
  );
};

export default GroupScreen;

const styles = StyleSheet.create({});
