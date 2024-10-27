import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  createOrUpdateMessage,
  fetchMessagesByThreadId,
} from "../../services/messageService";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/Header";
import { getUserData } from "../../services/userService";
import Messages from "../../components/Messages";
import { hp, wp } from "../../helpers/common";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import { supabase } from "../../lib/supabase";
import Icon from "../../assets/icons";
import { theme } from "../../constants/theme";
import { updateLastMessage } from "../../services/threadService";

const ThreadScreen = () => {
  const { id, user2Id } = useLocalSearchParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState("");
  const [refresh, setRefresh] = useState(false);

  const getUser = async () => {
    let res = await getUserData(user2Id);

    if (res.success) {
      setUser(res.data);
    }
  };

  const onSubmit = async () => {
    // if (!bodyRef.current && !file) {
    //   Alert.alert("Post", "Please choose an image or add post body!");
    //   return;
    // }

    if (body === "") {
      return null;
    }

    let data = {
      // file,
      body: body,
      senderId: currentUser.id,
      receiverId: user2Id,
      threadId: id,
    };

    // if (post && post.id) {
    //   data.id = post.id;
    // }

    // CREATE MESSAGE
    setLoading(true);
    let res = await createOrUpdateMessage(data);
    setLoading(false);
    if (res.success) {
      // setFile(null);
      setBody("");
      await updateLastMessage(id, res.data.id, currentUser.id);
      // editorRef.current?.setContentHTML("");
      // router.back();
    } else {
      Alert.alert("Message", res.msg);
    }
  };

  const handleMessages = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    getUser();

    let messagesChannel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => handleMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, []);

  return (
    <ScreenWrapper>
      <View style={{ paddingHorizontal: wp(4), flex: 1 }}>
        <Header title={user?.name} />
        <Messages user2={user} id={id} refresh={refresh} />
        <KeyboardAvoidingView
          behavior={"height"}
          style={{ paddingBottom: 10, flexDirection: "row", gap: 5 }}
        >
          <Input
            value={body}
            onChangeText={(value) => setBody(value)}
            containerStyle={{ paddingHorizontal: 18, width: "80%" }}
          />
          {loading ? (
            <Loading />
          ) : (
            <Pressable
              onPress={onSubmit}
              style={{
                width: "20%",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: theme.colors.primary,
                borderCurve: "continuous",
                borderRadius: theme.radius.xl,
              }}
            >
              <Icon
                name="send"
                size={hp(3.2)}
                strokeWidth={2}
                style={{ marginRight: 3 }}
                color={theme.colors.primary}
              />
            </Pressable>
          )}
        </KeyboardAvoidingView>
      </View>
    </ScreenWrapper>
  );
};

export default ThreadScreen;

const styles = StyleSheet.create({});
