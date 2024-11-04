import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

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

export const fetchRepliedMessageById = async (messageId) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*, senderId (*)")
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

export const fetchMessagesByThreadId = async (threadId, limit = 5) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `*,
        messageReplyId (*),
        reactions (*)
        `
      )
      .eq("threadId", threadId)
      .order("created_at", { ascending: false })
      .limit(limit);

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

export const createOrUpdateMessage = async (message) => {
  try {
    // upload image
    if (message.file && typeof message.file == "object") {
      let isImage = message?.file?.type == "image";
      let folderName = isImage ? "postImages" : "postVideos";

      let fileResult = await uploadFile(
        folderName,
        message?.file?.uri,
        isImage
      );

      if (fileResult.success) message.file = fileResult.data;
      else {
        return fileResult;
      }
    }

    const { data, error } = await supabase
      .from("messages")
      .upsert(message)
      .select()
      .single();

    if (error) {
      console.log("CreateMessage Error: ", error);
      return { success: false, msg: "Could not create your message" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("CreateMessage error: ", error);
    return { success: false, msg: "Could not create your message" };
  }
};
