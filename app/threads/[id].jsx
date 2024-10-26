import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { fetchMessagesByThreadId } from "../../services/messageService";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/Header";
import { getUserData } from "../../services/userService";
import Messages from "../../components/Messages";
import { hp, wp } from "../../helpers/common";
import Input from "../../components/Input";

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

  const onFocus = () => {
    console.log("FOCUS");
  };

  return (
    <ScreenWrapper>
      <View style={{ paddingHorizontal: wp(4) }}>
        <Header title={user?.name} />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={100}
        >
          <View
            style={{
              marginTop: 20,
              height: hp(80),
              justifyContent: "flex-start",
            }}
          >
            <Messages user2={user} id={id} />
          </View>
          <Input />
        </KeyboardAvoidingView>
      </View>
    </ScreenWrapper>
  );
};

export default ThreadScreen;

const styles = StyleSheet.create({});
