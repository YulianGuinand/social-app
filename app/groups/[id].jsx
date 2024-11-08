import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import ChatFile from "../../components/features/Chat/Files";
import ChatInput from "../../components/features/Chat/Input";
import GroupMessage from "../../components/features/Groups/Messages";
import ReplyPreview from "../../components/features/Groups/Messages/Message/ReplyPreview";
import ReactionGroupModal from "../../components/features/Groups/Messages/Reactions";
import Header from "../../components/shared/Header";
import ScreenWrapper from "../../components/shared/ScreenWrapper";
import { useAuth } from "../../contexts/AuthContext";
import { wp } from "../../helpers/common";
import { supabase } from "../../lib/supabase";
import { getSupabaseFileUrl } from "../../services/imageService";
import {
  createOrUpdateGroupMessage,
  fetchMessagesByGroupId,
  removeMessageG,
} from "../../services/messageService";

const GroupScreen = () => {
  const { id, data } = useLocalSearchParams();
  const group = JSON.parse(data).group_id;

  // INPUT
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(file);

  const onSubmit = async () => {
    if (body === "" && !file) {
      return null;
    }

    let data = {
      file,
      body: body,
      user_id: user.id,
      group_id: id,
      messageReplyId: reply?.isReplying ? reply?.messageId : null,
      data: JSON.stringify({ views: [user] }),
    };

    // CREATE MESSAGE
    setLoading(true);
    let res = await createOrUpdateGroupMessage(data);
    setLoading(false);
    if (res.success) {
      setFile(null);
      setBody("");
      // await updateLastMessage(id, res.data.id, currentUser.id);
    } else {
      Alert.alert("Message", res.msg);
    }

    setReply({ isReplying: false, messageId: null });
  };

  // REFRESH
  const [refresh, setRefresh] = useState(false);

  // MODAL
  const [isVisible, setIsVisible] = useState(false);
  const [messageId, setMessageId] = useState(null);

  // REPLY
  const [reply, setReply] = useState({
    isReplying: false,
    messageId: 40,
  });

  // FILE PICK
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
    let res = await removeMessageG(messageId);
    if (res.success) {
      setRefresh(true);

      res = await fetchMessagesByGroupId(id);

      if (res.success) {
        // await updateLastMessage(
        //   res.data[0].threadId,
        //   res.data[0].id,
        //   res.data[0].senderId
        // );
      }
    } else {
      Alert.alert("Message", res.msg);
    }
    setIsVisible(false);

    setTimeout(() => {
      setRefresh(false);
    }, 1000);
  };

  const { user } = useAuth();

  // FILE PREVIEW
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

  const handleMessages = () => {
    setRefresh(!refresh);
  };

  // CHANNEL

  useEffect(() => {
    let messagesChannel = supabase
      .channel("group_messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "group_messages",
          filter: `group_id=eq.${id}`,
        },
        () => handleMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, []);

  return (
    <ScreenWrapper bg="white">
      <View style={{ paddingHorizontal: wp(4), flex: 1 }}>
        <Header title={group.name} />
        <GroupMessage
          id={id}
          setIsVisible={setIsVisible}
          setMessageId={setMessageId}
          refresh={refresh}
          setRefresh={setRefresh}
        />

        {/* FILE PREVIEW */}
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

        {/* INPUT */}
        <ChatInput
          body={body}
          setBody={setBody}
          onPick={onPick}
          loading={loading}
          onSubmit={onSubmit}
        />
      </View>
      {/* REACTIONS MODAL */}
      <ReactionGroupModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        setReply={setReply}
        onDelete={onDelete}
        user={user}
        messageId={messageId}
        id={parseInt(id)}
      />
    </ScreenWrapper>
  );
};

export default GroupScreen;

const styles = StyleSheet.create({});
