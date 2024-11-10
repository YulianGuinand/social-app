import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "../../../../assets/icons";
import { theme } from "../../../../constants/theme";
import { hp } from "../../../../helpers/common";
import BackButton from "../../../shared/BackButton";

const Header = ({ title, showBackButton = true, mb = 10, data }) => {
  const router = useRouter();

  return (
    <View style={[styles.container, { marginBottom: mb }]}>
      {showBackButton && (
        <View style={styles.backButton}>
          <BackButton router={router} />
        </View>
      )}
      <Text style={styles.title}>{title || ""}</Text>
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() =>
          router.push({
            pathname: "/groups/info/info",
            params: { data: JSON.stringify(data) },
          })
        }
      >
        <Icon name="threeDotsHorizontal" color={theme.colors.dark} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    gap: 10,
  },
  title: {
    fontSize: hp(2.7),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.textDark,
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
  moreButton: {
    position: "absolute",
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: "rgba(0,0,0,0.07)",
  },
});
