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

export const fetchMessageById = async (messageId) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("id", messageId);

    if (error) {
      console.log("FetchMessageById error : ", error);
      return { success: false, msg: "Could not fetch the Message" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("FetchMessageById error : ", error);
    return { success: false, msg: "Could not fetch the Message" };
  }
};

export const fetchMessagesByThreadId = async (threadId) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select(`*`)
      .eq("threadId", threadId)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("fetchMessagesByThreadId error: ", error);
      return { success: false, msg: "Could not fetch the Messages" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("fetchMessagesByThreadId error: ", error);
    return { success: false, msg: "Could not fetch the Messages" };
  }
};
