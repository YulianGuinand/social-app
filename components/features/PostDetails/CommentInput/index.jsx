import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "../../../../assets/icons";
import { theme } from "../../../../constants/theme";
import { hp } from "../../../../helpers/common";
import Input from "../../../shared/Input";
import Loading from "../../../shared/Loading";

const CommentInput = ({ inputRef, commentRef, loading, onNewComment }) => {
  return (
    <View style={styles.inputContainer}>
      <Input
        inputRef={inputRef}
        placeholder="Type comment..."
        placeholderTextcolor={theme.colors.text}
        onChangeText={(value) => (commentRef.current = value)}
        containerStyle={{
          flex: 1,
          height: hp(6.2),
          borderRadius: theme.radius.xl,
          borderCurve: "continuous",
        }}
      />

      {loading ? (
        <View style={styles.loading}>
          <Loading size="small" />
        </View>
      ) : (
        <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
          <Icon name="send" color={theme.colors.primaryDark} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CommentInput;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loading: {
    height: hp(5.8),
    width: hp(5.8),
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 1.3 }],
  },
  sendIcon: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
    height: hp(5.8),
    width: hp(5.8),
  },
});
