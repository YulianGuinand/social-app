import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { fetchMessagesByThreadId } from "../../services/messageService";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/Header";
import { getUserData } from "../../services/userService";
import Messages from "../../components/Messages";
import { hp, wp } from "../../helpers/common";

const ThreadScreen = () => {
  const { id, user2Id } = useLocalSearchParams();
  const [user, setUser] = useState();

  const getUser = async () => {
    let res = await getUserData(user2Id);

    if (res.success) {
      setUser(res.data);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <ScreenWrapper>
      <View
        style={{
          position: "absolute",
          width: "100%",
          paddingHorizontal: wp(4),
          backgroundColor: "white",
          zIndex: 99,
          top: hp(3),
        }}
      >
        <Header title={user?.name} />
      </View>
      <View
        style={
          {
            // height: "100%",
            // justifyContent: "flex-end",
          }
        }
      >
        <Messages user2={user} id={id} />
      </View>
    </ScreenWrapper>
  );
};

export default ThreadScreen;

const styles = StyleSheet.create({});
