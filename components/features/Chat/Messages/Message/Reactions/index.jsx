import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../../../../../constants/theme";

const Reactions = ({ message, deleteReaction }) => {
  return message.reactions.length > 0 ? (
    <View style={styles.reactionsContainer}>
      <View style={[styles.reactions, { alignSelf: "flex-start" }]}>
        {message.reactions.map((reaction) => {
          return (
            <TouchableOpacity
              key={reaction.id}
              onPress={() => deleteReaction(reaction.id)}
              style={{
                backgroundColor: "#EEEEEE",
                padding: 5,
                borderRadius: theme.radius.md,
              }}
            >
              <Text style={{ fontSize: 20 }}>{reaction.body}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  ) : null;
};

export default Reactions;

const styles = StyleSheet.create({
  reactionsContainer: {
    width: "100%",
    minWidth: 150,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderCurve: "continuous",
    borderBottomLeftRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,
  },
  reactions: {
    padding: 2,
    flexDirection: "row",
    gap: 3,
    flexWrap: "wrap",
  },
});
