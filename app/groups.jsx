import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import GroupsList from "../components/features/Groups";
import Header from "../components/shared/Header";
import ScreenWrapper from "../components/shared/ScreenWrapper";
import { useAuth } from "../contexts/AuthContext";
import { wp } from "../helpers/common";
import { fetchGroups } from "../services/groupService";

const groups = () => {
  const { user: currentUser } = useAuth();
  const [groups, setGroups] = useState();

  const getGroups = async () => {
    if (!currentUser) return null;
    let res = await fetchGroups(currentUser.id);

    if (res.success) {
      setGroups(res.data);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <ScreenWrapper>
      <View style={{ paddingHorizontal: wp(4) }}>
        <Header title="Groups" />
        <GroupsList groups={groups} />
      </View>
    </ScreenWrapper>
  );
};

export default groups;

const styles = StyleSheet.create({});

("test@test.com");
