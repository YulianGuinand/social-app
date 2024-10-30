import { Video } from "expo-av";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Icon from "../../../../assets/icons";
import { theme } from "../../../../constants/theme";

const ChatFile = ({ getFileType, getFileUri, setFile }) => {
  return (
    <View style={{ width: "100%", alignItems: "flex-end", marginBottom: 10 }}>
      <View
        style={{
          width: 200,
          height: 300,
        }}
      >
        {getFileType(file) == "video" ? (
          <Video
            style={{ flex: 1 }}
            source={{ uri: getFileUri(file) }}
            useNativeControls
            resizeMode="cover"
            isLooping
          />
        ) : (
          <Image
            source={{ uri: getFileUri(file) }}
            contentFit="cover"
            style={{
              flex: 1,
              borderRadius: theme.radius.xl,
              overflow: "hidden",
            }}
          />
        )}

        <Pressable
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            padding: 7,
            borderRadius: 50,
            backgroundColor: "rgba(255,0,0,0.6)",
          }}
          onPress={() => setFile(null)}
        >
          <Icon name="delete" size={20} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

export default ChatFile;

const styles = StyleSheet.create({});
