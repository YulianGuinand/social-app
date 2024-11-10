import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "../../../assets/icons";
import Header from "../../../components/features/Groups/Header";
import Avatar from "../../../components/shared/Avatar";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { hp, wp } from "../../../helpers/common";
import { fetchMembers, removeMember } from "../../../services/groupService";

const InfoGroup = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const { data: groupData } = useLocalSearchParams();
  const data = JSON.parse(groupData);
  const [members, setMembers] = useState();

  const getInfo = async () => {
    if (!data.id) return null;

    let res = await fetchMembers(data.id);

    if (res.success) {
      res.data.forEach((member) => {
        if (member.user_id.id === user.id) {
          setIsAdmin(member.role === "admin");
        }
      });
      setMembers(res.data);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <ScreenWrapper>
      <View style={{ paddingHorizontal: wp(4) }}>
        <Header
          title={data.name}
          data={data}
          user={user}
          showMoreButton={false}
        />
      </View>

      <FlatList
        data={members}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ marginTop: 10, gap: 10 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MemberItem item={item} isAdmin={isAdmin} getInfo={getInfo} />
        )}
        onEndReached={() => {
          // getThreads();
        }}
      />
    </ScreenWrapper>
  );
};

export default InfoGroup;

const MemberItem = ({ item, isAdmin, getInfo }) => {
  const router = useRouter();
  const onClick = () => {
    router.push({
      pathname: "profile",
      params: { userId: item.user_id.id },
    });
  };

  const deleteMember = async () => {
    let res = await removeMember(item.group_id, item.user_id.id);

    if (res.success) {
      getInfo();
    }
  };

  const handleOnDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this member ?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => deleteMember(),
        style: "destructive",
      },
    ]);
  };

  return (
    <>
      <TouchableOpacity style={styles.memberContainer} onPress={onClick}>
        <Avatar uri={item.user_id.image} size={hp(4.5)} />
        <View style={styles.memberInfo}>
          <Text style={{ fontSize: 15 }}>{item.user_id.username}</Text>
          <Text style={{ color: theme.colors.textLight }}>{item.role}</Text>
        </View>
      </TouchableOpacity>
      {isAdmin && item.role !== "admin" && (
        <TouchableOpacity style={styles.delete} onPress={handleOnDelete}>
          <Icon name="delete" size={hp(2.5)} color="white" />
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  memberContainer: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "white",
    paddingVertical: 10,
    marginHorizontal: wp(2),
    paddingHorizontal: wp(2),
    alignItems: "center",
    borderRadius: theme.radius.sm,
  },
  memberInfo: {
    flexDirection: "column",
  },
  delete: {
    position: "absolute",
    right: 0,
    marginTop: 7,
    marginRight: 15,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.roseLight,
    alignItems: "center",
    justifyContent: "center",
  },
});
