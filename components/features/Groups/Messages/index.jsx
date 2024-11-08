import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { fetchGroupMessages } from "../../../../services/messageService";

const GroupMessage = ({ id }) => {
  const [messages, setMessages] = useState();

  const getMessages = async () => {
    if (!id) return null;
    let res = await fetchGroupMessages(id);

    if (res.success) {
      setMessages(res.data);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  return <Text></Text>;
};

export default GroupMessage;

const styles = StyleSheet.create({});
