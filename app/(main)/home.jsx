import React from "react";
import { Alert, StyleSheet, Text } from "react-native";
import Button from "../../components/Button";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

const Home = () => {
  const { user, setAuth } = useAuth();

  // console.log("user : ", user);

  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Sign out", "Error signing out!");
    }
  };

  return (
    <ScreenWrapper>
      <Text>Home</Text>
      <Button title="Logout" onPress={onLogout} />
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({});
