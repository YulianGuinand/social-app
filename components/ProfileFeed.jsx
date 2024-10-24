import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getSupabaseFileUrl } from "../services/imageService";

const ProfileFeed = ({ dataList }) => {
  return (
    <View
      style={{
        width: 375,
        height: 125,
        flexDirection: "row",
        gap: 2,
      }}
    >
      {dataList?.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => console.log("PRESS")}
            style={{
              width: 125,
              height: 125,
            }}
          >
            <Image
              source={getSupabaseFileUrl(item.file)}
              transition={100}
              style={{
                height: "100%",
                width: "100%",
              }}
              contentFit="cover"
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ProfileFeed;

const styles = StyleSheet.create({});
