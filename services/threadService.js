import { supabase } from "../lib/supabase";

export const fetchThreads = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("threads")
      .select(`*`)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
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

export const createOrUpdateChat = async (chat) => {
  try {
    const { data, error } = await supabase
      .from("threads")
      .upsert(chat)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") return { success: false, msg: error.code };
      console.log("CreateChat Error: ", error);
      return { success: false, msg: "Could not create your Chat" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("CreateChat error: ", error);
    return { success: false, msg: "Could not create your Chat" };
  }
};

export const fetchThreadByUsers = async (user1, user2) => {
  try {
    const { data, error } = await supabase
      .from("threads")
      .select(`*`)
      .or(`user1_id.eq.${user1},user2_id.eq.${user1}`)
      .or(`user1_id.eq.${user2},user2_id.eq.${user2}`)
      .single();

    if (error) {
      console.log("fetchThread error: ", error);
      return { success: false, msg: "Could not fetch the Thread" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("fetchThread error: ", error);
    return { success: false, msg: "Could not fetch the Thread" };
  }
};

export const removeThread = async (threadId) => {
  try {
    const { error } = await supabase
      .from("threads")
      .delete()
      .eq("id", threadId);

    if (error) {
      console.log("Removing Thread error: ", error);
      return { success: false, msg: "Could not remove the Thread" };
    }

    return { success: true };
  } catch (error) {
    console.log("Removing Thread error: ", error);
    return { success: false, msg: "Could not remove the Thread" };
  }
};
