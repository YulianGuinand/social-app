import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { createOrUpdateMessage } from "../../services/messageService";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/Header";
import { getUserData } from "../../services/userService";
import Messages from "../../components/Messages";
import { hp, wp } from "../../helpers/common";
import Input from "../../components/Input";
import Loading from "../../components/Loading";
import { supabase } from "../../lib/supabase";
import Icon from "../../assets/icons";
import { theme } from "../../constants/theme";
import { updateLastMessage } from "../../services/threadService";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { getSupabaseFileUrl } from "../../services/imageService";
import { Video } from "expo-av";

const ThreadScreen = () => {
  const { id, user2Id } = useLocalSearchParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [file, setFile] = useState(file);

  const getUser = async () => {
    let res = await getUserData(user2Id);

    if (res.success) {
      setUser(res.data);
    }
  };

  const onPick = async () => {
    let mediaConfig = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.7,
    };

    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const onSubmit = async () => {
    if (body === "" && !file) {
      return null;
    }

    let data = {
      file,
      body: body,
      senderId: currentUser.id,
      receiverId: user2Id,
      threadId: id,
    };

    // CREATE MESSAGE
    setLoading(true);
    let res = await createOrUpdateMessage(data);
    setLoading(false);
    if (res.success) {
      setFile(null);
      setBody("");
      await updateLastMessage(id, res.data.id, currentUser.id);
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

  const getFileType = (file) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.type;
    }

    if (file.includes("postImages")) {
      return "image";
    }
    return "video";
  };

  const isLocalFile = (file) => {
    if (!file) return null;
    if (typeof file == "object") return true;
    return false;
  };

  const getFileUri = (file) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.uri;
    }

    return getSupabaseFileUrl(file)?.uri;
  };
  return (
    <ScreenWrapper>
      <View style={{ paddingHorizontal: wp(4), flex: 1 }}>
        <Header title={user?.name} />
        <Messages
          user2={user}
          id={id}
          refresh={refresh}
          setRefresh={setRefresh}
        />
        {file && (
          <View
            style={{ width: "100%", alignItems: "flex-end", marginBottom: 10 }}
          >
            <View
              style={{
                width: 200,
                height: 300,
              }}
            >
              {getFileType(file) == "video" ? (
                <Video
                  style={{ flex: 1 }}
                  source={{ uri: getFileUri(file) }}
                  useNativeControls
                  resizeMode="cover"
                  isLooping
                />
              ) : (
                <Image
                  source={{ uri: getFileUri(file) }}
                  contentFit="cover"
                  style={{
                    flex: 1,
                    borderRadius: theme.radius.xl,
                    overflow: "hidden",
                  }}
                />
              )}

              <Pressable
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  padding: 7,
                  borderRadius: 50,
                  backgroundColor: "rgba(255,0,0,0.6)",
                }}
                onPress={() => setFile(null)}
              >
                <Icon name="delete" size={20} color="white" />
              </Pressable>
            </View>
          </View>
        )}
        <KeyboardAvoidingView
          behavior={"height"}
          style={{ paddingBottom: 10, flexDirection: "row", gap: 5 }}
        >
          <Input
            value={body}
            onChangeText={(value) => setBody(value)}
            containerStyle={{ paddingHorizontal: 18, width: "80%" }}
            icon={
              <Pressable onPress={() => onPick()}>
                <Icon
                  name="image"
                  size={hp(3.2)}
                  strokeWidth={2}
                  color={theme.colors.text}
                />
              </Pressable>
            }
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