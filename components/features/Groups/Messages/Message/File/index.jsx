import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../../../../../constants/theme";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { getUserData } from "../../../../../../services/userService";
import ReactionsG from "../Reactions";
import MessageImage from "./Image";
import MessageVideo from "./Video";

const MessageFile = ({
  isVideo,
  setMessageId,
  setIsVisible,
  message,
  imageUrl,
  setState,
  state,
  reply,
  deleteReaction = () => {},
}) => {
  const [userReply, setUserReply] = useState();
  const getReplyData = async () => {
    let res = await getUserData(reply?.senderId);
    if (res.success) setUserReply(res.data);
  };

  useEffect(() => {
    if (reply) getReplyData();
  }, []);

  const { user } = useAuth();

  return (
    <View style={{ gap: 5 }}>
      {isVideo ? (
        <MessageVideo
          message={message}
          setMessageId={setMessageId}
          setIsVisible={setIsVisible}
          imageUrl={imageUrl}
        />
      ) : (
        <MessageImage
          message={message}
          setMessageId={setMessageId}
          setIsVisible={setIsVisible}
          setState={setState}
          imageUrl={imageUrl}
          state={state}
        />
      )}

      {message.body && (
        <TouchableOpacity
          onLongPress={() => {
            setMessageId(message.id);
            setIsVisible((prev) => !prev);
          }}
          style={{
            backgroundColor: message.user_id
              ? message.user_id.id === user.id
                ? theme.colors.primary
                : "#EEEEEE"
              : "white",
            borderRadius: theme.radius.md,
          }}
        >
          <Text
            style={{
              padding: 8,
              alignSelf: "flex-start",
              color: message.user_id
                ? message.user_id.id === user.id
                  ? "white"
                  : theme.colors.text
                : theme.colors.text,
            }}
          >
            {message.body}
          </Text>
          <ReactionsG deleteReaction={deleteReaction} message={message} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MessageFile;
