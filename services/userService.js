import { supabase } from "../lib/supabase";

export const getUserData = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();

    if (error) {
      return { success: false, msg: error?.message };
    }

    return { success: true, data };
  } catch (error) {
    console.log("Got error : ", error);
    return { success: false, msg: error.message };
  }
};

export const searchUserByName = async (name) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .ilike("username", `%${name}%`); // Utilise ilike pour une recherche insensible à la casse

    if (error) {
      console.error("Got error :", error);
      return { success: false, msg: error?.message };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("Got error : ", error);
    return { success: false, msg: error.message };
  }
};

export const updateUser = async (userId, data) => {
  try {
    const { error } = await supabase
      .from("users")
      .update(data)
      .eq("id", userId);

    if (error) {
      return { success: false, msg: error?.message };
    }

    return { success: true, data };
  } catch (error) {
    console.log("Got error : ", error);
    return { success: false, msg: error.message };
  }
};
