import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import Icon from "../../assets/icons";
import Button from "../../components/shared/Button";
import Header from "../../components/shared/Header";
import Input from "../../components/shared/Input";
import ScreenWrapper from "../../components/shared/ScreenWrapper";
import { theme } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";
import { hp, wp } from "../../helpers/common";
import { getUserImageSrc, uploadFile } from "../../services/imageService";
import { updateUser } from "../../services/userService";

const EditProfile = () => {
  const router = useRouter();

  const [selected, setSelected] = useState("");

  const { user: currentUser, setUserData } = useAuth();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    username: "",
    image: null,
    bio: "",
    email: "",
    status: "",
  });

  useEffect(() => {
    if (currentUser) {
      setUser({
        firstname: currentUser.firstname || "",
        lastname: currentUser.lastname || "",
        username: currentUser.username || "",
        image: currentUser.image || null,
        bio: currentUser.bio || "",
        email: currentUser.email || "",
        status: currentUser.status || "",
      });
      setSelected(
        currentUser.status.charAt(0).toUpperCase() + currentUser.status.slice(1)
      );
    }
  }, [currentUser]);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUser({ ...user, image: result.assets[0] });
    }
  };

  const onSubmit = async () => {
    let userData = { ...user };
    let { firstname, lastname, username, image, bio, status } = userData;
    if (!username || !firstname || !lastname || !status) {
      Alert.alert("Profile", "Please fill all the fields");
    }
    setLoading(true);

    if (typeof image == "object") {
      let imageRes = await uploadFile("profiles", image?.uri, true);
      if (imageRes.success) userData.image = imageRes.data;
      else userData.image = null;
    }

    const res = await updateUser(currentUser?.id, userData);
    setLoading(false);

    if (res.success) {
      setUserData({ ...currentUser, ...userData });
      router.back();
    }
  };

  let imageSource =
    user.image && typeof user.image == "object"
      ? user.image.uri
      : getUserImageSrc(user.image);

  const statusData = [
    { key: 1, value: "Privé" },
    { key: 2, value: "Public" },
  ];
  return (
    <ScreenWrapper bg="white">
      <KeyboardAvoidingView
        behavior={"height"}
        style={{ justifyContent: "flex-end", flex: 1 }}
      >
        <View style={styles.container}>
          <ScrollView style={{ flex: 1 }}>
            <Header title="Edit Profile" />

            {/* FORM */}
            <View style={styles.form}>
              <View style={styles.avatarContainer}>
                <Image
                  source={imageSource}
                  transition={100}
                  style={styles.avatar}
                />
                <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                  <Icon name="camera" size={20} strokeWidth={2.5} />
                </Pressable>
              </View>
              <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
                Please fill your profile details
              </Text>

              {/* FIRSTNAME & LASTNAME */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  justifyContent: "space-between",
                }}
              >
                <Input
                  icon={<Icon name="user" />}
                  placeholder="Enter your firstname"
                  onChangeText={(value) =>
                    setUser({ ...user, firstname: value })
                  }
                  value={user.firstname}
                  containerStyle={{ flex: 1 }}
                />
                <Input
                  icon={<Icon name="user" />}
                  placeholder="Enter your lastname"
                  onChangeText={(value) =>
                    setUser({ ...user, lastname: value })
                  }
                  value={user.lastname}
                  containerStyle={{ flex: 1 }}
                />
              </View>

              {/* USERNAME */}
              <Input
                icon={<Icon name="user" />}
                placeholder="Enter your username"
                onChangeText={(value) => setUser({ ...user, username: value })}
                value={user.username}
              />

              {/* EMAIL */}
              <Input
                icon={<Icon name="mail" />}
                placeholder="Enter your email"
                onChangeText={(value) => setUser({ ...user, email: value })}
                value={user.email}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderWidth: 0.4,
                  borderColor: theme.colors.text,
                  borderRadius: theme.radius.xxl,
                  borderCurve: "continuous",
                }}
              >
                <View
                  style={{
                    width: hp(7.2),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name={selected === "Public" ? "unlock" : "lock"} />
                </View>
                <View style={{ flex: 1 }}>
                  <SelectList
                    setSelected={(val) => {
                      setSelected(val);
                      setUser({ ...user, status: val });
                    }}
                    data={statusData}
                    save="value"
                    placeholder={selected}
                    boxStyles={{
                      height: hp(7.2),
                      alignItems: "center",
                      borderWidth: 0,
                      paddingLeft: 0,
                    }}
                    dropdownStyles={{
                      borderWidth: 0,
                    }}
                  />
                </View>
              </View>

              {/* BIO */}
              <Input
                placeholder="Enter your bio"
                multiline={true}
                containerStyle={styles.bio}
                onChangeText={(value) => setUser({ ...user, bio: value })}
                value={user.bio}
              />

              <Button title="Update" loading={loading} onPress={onSubmit} />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  avatarContainer: {
    height: hp(14),
    width: hp(14),
    alignSelf: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.xxl * 1.8,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: theme.colors.darkLight,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: -10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: "white",
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  form: {
    gap: 18,
    marginTop: 20,
  },
  input: {
    flexDirection: "row",
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
    padding: 17,
    paddingHorizontal: 20,
    gap: 15,
  },
  bio: {
    flexDirection: "row",
    height: hp(15),
    alignItems: "flex-start",
    paddingVertical: 15,
  },
});
