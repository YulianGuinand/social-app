import { supabase } from "../lib/supabase";

export const fetchThreads = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("threads")
      .select(`*`)
      .or(`user1_Id.eq.${userId},user2_Id.eq.${userId}`)
      .order("created_at", { ascending: false });
    if (error) {
      console.log("fetchThreads error: ", error);
      return { success: false, msg: "Could not fetch the threads" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("fetchThreads error: ", error);
    return { success: false, msg: "Could not fetch the threads" };
  }
};

export const updateLastMessage = async (threadId, messageId, lastSenderId) => {
  try {
    const updateRes = await supabase
      .from("threads")
      .update({ lastMessage: messageId, lastSender: lastSenderId })
      .eq("id", threadId);

    if (updateRes.error) {
      console.error(
        "Erreur lors de la mise à jour du thread:",
        updateRes.error
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur de mise à jour du dernier message:", error);
  }
};
