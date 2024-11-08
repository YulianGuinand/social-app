import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import ChatFile from "../../components/features/Chat/Files";
import ChatInput from "../../components/features/Chat/Input";
import Messages from "../../components/features/Chat/Messages";
import ReactionModal from "../../components/features/Chat/Reaction";
import ReplyPreview from "../../components/features/Groups/Messages/Message/ReplyPreview";
import Header from "../../components/shared/Header";
import ScreenWrapper from "../../components/shared/ScreenWrapper";
import { useAuth } from "../../contexts/AuthContext";
import { wp } from "../../helpers/common";
import { supabase } from "../../lib/supabase";
import { getSupabaseFileUrl } from "../../services/imageService";
import {
  createOrUpdateMessage,
  fetchMessagesByThreadId,
  removeMessage,
} from "../../services/messageService";
import { updateLastMessage } from "../../services/threadService";
import { getUserData } from "../../services/userService";

const ThreadScreen = () => {
  const { id, user2Id } = useLocalSearchParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [file, setFile] = useState(file);

  const [reply, setReply] = useState({
    isReplying: false,
    messageId: 40,
  });

  // EMOJI
  const [isVisible, setIsVisible] = useState(false);
  const [messageId, setMessageId] = useState(null);

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

  const onDelete = async (messageId) => {
    let res = await removeMessage(messageId);
    if (res.success) {
      setRefresh(true);

      res = await fetchMessagesByThreadId(id);

      if (res.success) {
        await updateLastMessage(
          res.data[0].threadId,
          res.data[0].id,
          res.data[0].senderId
        );
      }
    } else {
      Alert.alert("Message", res.msg);
    }
    setIsVisible(false);

    setTimeout(() => {
      setRefresh(false);
    }, 1000);
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
      messageReplyId: reply?.isReplying ? reply?.messageId : null,
      data: JSON.stringify({ views: [currentUser] }),
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

    setReply({ isReplying: false, messageId: null });
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
    <ScreenWrapper bg="white">
      <View style={{ paddingHorizontal: wp(4), flex: 1 }}>
        <Header title={user?.username} />
        <Messages
          user2={user}
          id={id}
          refresh={refresh}
          setRefresh={setRefresh}
          setIsVisible={setIsVisible}
          setMessageId={setMessageId}
        />
        {file && (
          <ChatFile
            getFileType={getFileType}
            getFileUri={getFileUri}
            setFile={setFile}
            file={file}
          />
        )}

        {/* REPLYING */}
        {reply?.isReplying && (
          <ReplyPreview setReply={setReply} reply={reply} />
        )}

        <ChatInput
          body={body}
          setBody={setBody}
          onPick={onPick}
          loading={loading}
          onSubmit={onSubmit}
        />
      </View>

      {/* REACTIONS MODAL */}
      <ReactionModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        user={user}
        messageId={messageId}
        id={id}
        setReply={setReply}
        onDelete={onDelete}
        currentUser={currentUser}
      />
    </ScreenWrapper>
  );
};

export default ThreadScreen;
