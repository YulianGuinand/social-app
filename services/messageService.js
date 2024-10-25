import { supabase } from "../lib/supabase";

export const fetchMessages = async (userId, user2Id, limit = null) => {
  try {
    let res = supabase
      .from("messages")
      .select(`*`)
      .or(`senderId.eq.${userId},receiverId.eq.${userId}`)
      .or(`senderId.eq.${user2Id},receiverId.eq.${user2Id}`)
      .order("created_at", { ascending: false });

    if (limit) res = res.limit(limit);

    const { data, error } = await res;

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
