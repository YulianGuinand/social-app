import { Stack, useRouter } from "expo-router";
import React, { createContext, useEffect, useState } from "react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { getUserData } from "../services/userService";
import { LogBox } from "react-native";
import { StreamChat } from "stream-chat";
import { GestureHandlerRootView } from "react-native-gesture-handler";

LogBox.ignoreLogs([
  "Warning: TNodeChildrenRenderer:",
  "Warning: MemoizedTNodeRenderer",
  "Warning: TRenderEngineProvider",
  "[AuthApiError: Invalid Refresh Token",
]);
const _layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();

  const updateUserData = async (user) => {
    let res = await getUserData(user?.id);

    if (res.success) setUserData({ ...res.data });
  };

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session?.user);
        updateUserData(session?.user);
        router.replace("/home");
      } else {
        setAuth(null);
        router.replace("/welcome");
      }
    });
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="(main)/postDetails"
        options={{ presentation: "modal" }}
      />
    </Stack>
  );
};

export default _layout;
