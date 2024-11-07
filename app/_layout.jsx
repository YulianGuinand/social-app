import { Stack, useRouter } from "expo-router";
import React, { createContext, useEffect, useState } from "react";
import { LogBox } from "react-native";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { getUserDataToUpdate } from "../services/userService";

export const Context = createContext(null);

LogBox.ignoreLogs([
  "Warning: TNodeChildrenRenderer:",
  "Warning: MemoizedTNodeRenderer",
  "Warning: TRenderEngineProvider",
  "[AuthApiError: Invalid Refresh Token",
]);
const _layout = () => {
  const [rerender, setRerender] = useState(false);
  return (
    <AuthProvider>
      <Context.Provider value={{ rerender, setRerender }}>
        <MainLayout />
      </Context.Provider>
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();

  const updateUserData = async (user) => {
    let res = await getUserDataToUpdate(user?.id);

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
