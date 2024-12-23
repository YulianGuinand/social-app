import React from "react";
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { theme } from "../../../../../constants/theme";

const ReactionsPicker = ({ isVisible, children, onClose }) => {
  return (
    <Modal transparent={true} animationType="slide" visible={isVisible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContent}>{children}</View>
    </Modal>
  );
};

export default ReactionsPicker;

const styles = StyleSheet.create({
  modalContent: {
    height: "40%",
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    position: "absolute",
    bottom: 0,
  },
  overlay: {
    width: "100%",
    height: "60%",
    backgroundColor: "transparent",
  },
});
