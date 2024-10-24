import { supabase } from "../lib/supabase";

export const fetchMessages = async (userId, user2Id) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select(`*`)
      .or(`senderId.eq.${userId},receiverId.eq.${userId}`)
      .or(`senderId.eq.${user2Id},receiverId.eq.${user2Id}`)
      .order("created_at", { ascending: false });
    if (error) {
      console.log("fetchMessages error: ", error);
      return { success: false, msg: "Could not fetch the Messages" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("fetchMessages error: ", error);
    return { success: false, msg: "Could not fetch the Messages" };
  }
};
