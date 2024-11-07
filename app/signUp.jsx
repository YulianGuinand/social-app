import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Icon from "../assets/icons";
import BackButton from "../components/shared/BackButton";
import Button from "../components/shared/Button";
import Input from "../components/shared/Input";
import ScreenWrapper from "../components/shared/ScreenWrapper";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import { supabase } from "../lib/supabase";

const signUp = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const firstnameRef = useRef("");
  const lastnameRef = useRef("");
  const usernameRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (
      !emailRef.current ||
      !passwordRef.current ||
      !firstnameRef.current ||
      !lastnameRef.current
    ) {
      Alert.alert("Sign up", "please fill all the fields!");
      return;
    }

    let firstname = firstnameRef.current.trim();
    let lastname = lastnameRef.current.trim();
    let username = usernameRef.current.trim();
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    setLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          firstname,
          lastname,
        },
      },
    });
    setLoading(false);

    if (error) {
      Alert.alert("Sign up", error.message);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <KeyboardAvoidingView behavior={"height"} style={styles.container}>
        <BackButton router={router} />

        {/* WELCOME TEXT */}
        <View>
          <Text style={styles.welcomeText}>Let's</Text>
          <Text style={styles.welcomeText}>Get Started</Text>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Please fill the details to create an account
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <Input
              containerStyle={{ width: "45%" }}
              icon={<Icon name="user" size={26} strokeWidth={1.6} />}
              placeholder="Firstname"
              onChangeText={(value) => (firstnameRef.current = value)}
            />
            <Input
              containerStyle={{ width: "45%" }}
              icon={<Icon name="user" size={26} strokeWidth={1.6} />}
              placeholder="Lastname"
              onChangeText={(value) => (lastnameRef.current = value)}
            />
          </View>
          <Input
            icon={<Icon name="user" size={26} strokeWidth={1.6} />}
            placeholder="Username"
            onChangeText={(value) => (usernameRef.current = value)}
          />
          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder="Email"
            onChangeText={(value) => (emailRef.current = value)}
          />
          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Password"
            secureTextEntry
            onChangeText={(value) => (passwordRef.current = value)}
          />

          {/* BUTTON */}
          <Button title={"Login"} loading={loading} onPress={onSubmit} />
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account ?</Text>
          <Pressable onPress={() => router.push("login")}>
            <Text
              style={[
                styles.footerText,
                {
                  color: theme.colors.primary,
                  fontWeight: theme.fonts.semibold,
                },
              ]}
            >
              Login
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default signUp;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
    justifyContent: "flex-end",
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  form: {
    gap: 25,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});
