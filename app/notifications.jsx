import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import NotificationItem from "../components/features/Notifications/NotificationItem";
import Header from "../components/shared/Header";
import Loading from "../components/shared/Loading";
import ScreenWrapper from "../components/shared/ScreenWrapper";
import { theme } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { hp, wp } from "../helpers/common";
import {
  fetchNotifications,
  updateNewNotification,
} from "../services/notificationService";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const getNotifications = async () => {
    setLoading(true);
    let res = await fetchNotifications(user.id);
    setLoading(false);
    if (res.success) {
      setNotifications(res.data);
    }
  };

  const viewedNotification = () => {
    if (!user) return null;
    updateNewNotification(user.id);
  };

  useEffect(() => {
    getNotifications();
    viewedNotification();
  }, []);

  if (loading) {
    return (
      <ScreenWrapper bg="white">
        <View style={{ marginTop: 50 }}>
          <Loading />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Notifications" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
        >
          {notifications.length == 0 && (
            <Text style={styles.noData}>No notifications yet</Text>
          )}
          {notifications.map((item) => {
            return (
              <NotificationItem item={item} key={item?.id} router={router} />
            );
          })}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  listStyle: {
    paddingVertical: 20,
    gap: 10,
  },
  noData: {
    fontSize: hp(1.8),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    textAlign: "center",
  },
});
