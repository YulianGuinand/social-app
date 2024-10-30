import { Video } from "expo-av";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";
import RenderHTML from "react-native-render-html";
import { theme } from "../../../../constants/theme";
import { hp, wp } from "../../../../helpers/common";
import { getSupabaseFileUrl } from "../../../../services/imageService";

const textStyle = {
  color: theme.colors.dark,
  fontSize: hp(1.75),
};

const tagsStyles = {
  div: textStyle,
  p: textStyle,
  ol: textStyle,
  h1: {
    color: theme.colors.dark,
  },
  h4: {
    color: theme.colors.dark,
  },
};

const PostMedia = ({ item }) => {
  return (
    <>
      <View style={styles.postBody}>
        {item?.body && (
          <RenderHTML
            contentWidth={wp(100)}
            source={{ html: item?.body }}
            tagsStyles={tagsStyles}
          />
        )}
      </View>
      {/* POST IMAGE */}
      {item?.file && item?.file?.includes("postImages") && (
        <Image
          source={getSupabaseFileUrl(item?.file)}
          transition={100}
          style={styles.postMedia}
          contentFit="cover"
        />
      )}

      {/* POST VIDEO */}
      {item?.file && item?.file?.includes("postVideos") && (
        <Video
          style={[styles.postMedia, { height: hp(30) }]}
          source={getSupabaseFileUrl(item?.file)}
          useNativeControls
          resizeMode="cover"
          isLooping
        />
      )}
    </>
  );
};

export default PostMedia;

const styles = StyleSheet.create({
  postMedia: {
    height: hp(40),
    width: "100%",
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  postBody: {
    marginLeft: 5,
  },
});
