import { supabase } from "../lib/supabase";

export const fetchReactions = async (messageId) => {
  try {
    const { data, error } = await supabase
      .from("reactions")
      .select(`*`)
      .order("created_at", { ascending: false })
      .eq("messageId", messageId);
    if (error) {
      console.log("fetchReactions error: ", error);
      return { success: false, msg: "Could not fetch Reactions" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("fetchReactions error: ", error);
    return { success: false, msg: "Could not fetch Reactions" };
  }
};

export const createOrUpdateReaction = async (reaction) => {
  try {
    const { data, error } = await supabase
      .from("reactions")
      .upsert(reaction)
      .select()
      .single();

    if (error) {
      console.log("CreateReaction Error: ", error);
      return { success: false, msg: "Could not create your Reaction" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("CreateReaction error: ", error);
    return { success: false, msg: "Could not create your Reaction" };
  }
};

export const removeReaction = async (reactionId) => {
  try {
    const { error } = await supabase
      .from("reactions")
      .delete()
      .eq("id", reactionId);

    if (error) {
      console.log("removeReaction error: ", error);
      return { success: false, msg: "Could not remove the Reaction" };
    }

    return { success: true, data: { reactionId } };
  } catch (error) {
    console.log("removeReaction error: ", error);
    return { success: false, msg: "Could not remove the Reaction" };
  }
};
