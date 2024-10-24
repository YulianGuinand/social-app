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
import { hp } from "../helpers/common";
import { useRouter } from "expo-router";

const ProfileFeed = ({ dataList }) => {
  const router = useRouter();
  return (
    <View
      style={{
        width: "100%",
        height: hp(14),
        flexDirection: "row",
        gap: 2,
      }}
    >
      {dataList?.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              router.push({
                pathname: "postDetails",
                params: { postId: item?.id },
              });
            }}
            style={{
              width: "33%",
              height: "100%",
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
