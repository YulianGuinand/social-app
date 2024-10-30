import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { hp } from "../../../../../helpers/common";
import { getSupabaseFileUrl } from "../../../../../services/imageService";

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
