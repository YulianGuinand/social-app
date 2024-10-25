import { Stack, useRouter } from "expo-router";
import React, { createContext, useEffect, useState } from "react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { getUserData } from "../services/userService";
import { LogBox } from "react-native";
import { StreamChat } from "stream-chat";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Chat, OverlayProvider } from "stream-chat-expo";

LogBox.ignoreLogs([
  "Warning: TNodeChildrenRenderer:",
  "Warning: MemoizedTNodeRenderer",
  "Warning: TRenderEngineProvider",
  "Warning: Maximum update depth exceeded.",
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

const client = StreamChat.getInstance("vaug828w5gvc");
const MainLayout = () => {
  const { user, setAuth, setUserData } = useAuth();
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

    const connect = async () => {
      await client.connectUser(
        {
          id: user?.id,
          name: user?.name,
          image: "https://i.imgur.com/fR9Jz14.png", //getUserImageSrc(user?.image),
        },
        client.devToken(user?.id)
      );

      // const channel = client.channel("messaging", "the_park", {
      //   name: "The Park",
      // });
      // await channel.watch();
    };

    connect();
  }, []);

  return (
    <OverlayProvider>
      <Chat client={client}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="(main)/postDetails"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="(threads)/threads"
            options={{ headerShown: false }}
          />
        </Stack>
      </Chat>
    </OverlayProvider>
  );
};

export default _layout;
