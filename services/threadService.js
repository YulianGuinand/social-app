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
