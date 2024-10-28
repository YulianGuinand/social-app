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
