import React from "react";
import {Image, View, Alert, StyleSheet, Text } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import { supabase } from "../../lib/supabase";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Button from "../../components/Button";

const Home = () => {
  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Sign out", "Error signing out!");
    }
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* WELCOME IMAGE */}
        <Image
          style={styles.welcomeImage}
          resizeMode="contain"
          source={require("../../assets/images/welcome.png")}
        />
        {/* TITLE */}
        <View style={{ gap: 20 }}>
          <Text style={styles.title}>Sorry!</Text>
          <Text style={styles.punchline}>
            Something went wrong...
          </Text>
        </View>

        <View style={styles.footer}>
          <Button
            title="Logout"
            buttonStyle={{ marginHorizontal: wp(3) }}
            onPress={onLogout}
          />
          </View>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",
    marginHorizontal: wp(4),
  },
  welcomeImage: {
    height: hp(30),
    width: wp(100),
    alignSelf: "center",
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: "center",
    fontWeight: theme.fonts.extraBold,
  },
  punchline: {
    textAlign: "center",
    paddingHorizontal: wp(10),
    fontSize: hp(1.7),
    color: theme.colors.text,
  },
  footer: {
    gap: 30,
    width: "100%",
  },
});

