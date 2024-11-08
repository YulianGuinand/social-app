import { supabase } from "../lib/supabase";

export const createOrUpdateFriendShip = async (friendship) => {
  try {
    const { data, error } = await supabase
      .from("friendship")
      .upsert(friendship)
      .select()
      .single();

    if (error) {
      console.log("CreateFriendShip Error: ", error);
      return { success: false, msg: "Could not create your FriendShip" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("CreateFriendShip error: ", error);
    return { success: false, msg: "Could not create your FriendShip" };
  }
};

export const updateFriendShip = async (id, status) => {
  try {
    const { data, error } = await supabase
      .from("friendship")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.log("UpdateFriendShip Error: ", error);
      return { success: false, msg: "Could not create your FriendShip" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("UpdateFriendShip error: ", error);
    return { success: false, msg: "Could not create your FriendShip" };
  }
};

export const deleteFriendShip = async (id) => {
  try {
    const { data, error } = await supabase
      .from("friendship")
      .delete()
      .eq("id", id);

    if (error) {
      console.log("DeleteFriendShip Error: ", error);
      return { success: false, msg: "Could not create your FriendShip" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("DeleteFriendShip error: ", error);
    return { success: false, msg: "Could not create your FriendShip" };
  }
};

export const fetchFriendShip = async (user1, user2) => {
  if (!user1 || !user2) return { success: false, msg: { user1, user2 } };
  try {
    const { data, error } = await supabase
      .from("friendship")
      .select(`*`)
      .or(`user1.eq.${user1},user2.eq.${user1}`)
      .or(`user1.eq.${user2},user2.eq.${user2}`);

    if (error) {
      console.log("fetchFriendShip error: ", error);
      return { success: false, msg: "Could not fetch the FriendShip" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("fetchFriendShip error: ", error);
    return { success: false, msg: "Could not fetch the FriendShip" };
  }
};
