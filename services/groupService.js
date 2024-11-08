import { supabase } from "../lib/supabase";

export const fetchGroups = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("group_members")
      .select(
        `*, 
        group_id (*)
        `
      )
      .eq("user_id", userId);

    if (error) {
      console.log("fetchGroup error: ", error);
      return { success: false, msg: "Could not fetch the Group" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("fetchGroup error: ", error);
    return { success: false, msg: "Could not fetch the Group" };
  }
};

export const fetchMembers = async (groupId) => {
  try {
    const { data, error } = await supabase
      .from("group_members")
      .select(
        `*, 
        user_id (id, username, firstname, image)
        `
      )
      .eq("group_id", groupId);

    if (error) {
      console.log("fetchMembers error: ", error);
      return { success: false, msg: "Could not fetch the Members" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("fetchMembers error: ", error);
    return { success: false, msg: "Could not fetch the Members" };
  }
};
