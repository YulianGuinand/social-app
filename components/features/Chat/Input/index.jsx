import React from "react";
import { KeyboardAvoidingView, Pressable, StyleSheet } from "react-native";
import Icon from "../../../../assets/icons";
import { theme } from "../../../../constants/theme";
import { hp } from "../../../../helpers/common";
import Input from "../../../shared/Input";
import Loading from "../../../shared/Loading";

const ChatInput = ({ body, setBody, onPick, loading, onSubmit }) => {
  return (
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
              name="plus"
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
  );
};

export default ChatInput;

const styles = StyleSheet.create({});
