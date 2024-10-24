import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

export const createOrUpdatePost = async (post) => {
  try {
    // upload image
    if (post.file && typeof post.file == "object") {
      let isImage = post?.file?.type == "image";
      let folderName = isImage ? "postImages" : "postVideos";

      let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);

      if (fileResult.success) post.file = fileResult.data;
      else {
        return fileResult;
      }
    }

    const { data, error } = await supabase
      .from("posts")
      .upsert(post)
      .select()
      .single();

    if (error) {
      console.log("CreatePost Error: ", error);
      return { success: false, msg: "Could not create your post" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("CreatePost error: ", error);
    return { success: false, msg: "Could not create your post" };
  }
};

export const fetchPosts = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        user: users (id, name, image),
        postLikes (*),
        comments (count)
      `
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.log("fetchPosts error: ", error);
      return { success: false, msg: "Could not fetch the posts" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("fetchPosts error: ", error);
    return { success: false, msg: "Could not fetch the posts" };
  }
};

export const fetchPostsProfile = async (limit = 10, userId, withImage) => {
  try {
    let query = supabase
      .from("posts")
      .select(
        `
        *,
        user: users (id, name, image),
        postLikes (*),
        comments (count)
      `
      )
      .order("created_at", { ascending: false })
      .eq("userId", userId);

    if (withImage) {
      query = query.neq("file", null);
    } else {
      query = query.is("file", null);
    }

    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      console.log("fetchPosts error: ", error);
      return { success: false, msg: "Could not fetch the posts" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("fetchPosts error: ", error);
    return { success: false, msg: "Could not fetch the posts" };
  }
};

export const createPostLike = async (postLike) => {
  try {
    const { data, error } = await supabase
      .from("postLikes")
      .insert(postLike)
      .select()
      .single();

    if (error) {
      console.log("postLike error: ", error);
      return { success: false, msg: "Could not like the post" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("postLike error: ", error);
    return { success: false, msg: "Could not like the post" };
  }
};

export const removePostLike = async (postId, userId) => {
  try {
    const { error } = await supabase
      .from("postLikes")
      .delete()
      .eq("userId", userId)
      .eq("postId", postId);

    if (error) {
      console.log("postLike error: ", error);
      return { success: false, msg: "Could not remove the post like" };
    }

    return { success: true };
  } catch (error) {
    console.log("postLike error: ", error);
    return { success: false, msg: "Could not remove the post like" };
  }
};

export const fetchPostDetails = async (postId) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
          *,
          user: users (id, name, image),
          postLikes (*),
          comments (*, user: users(id, name, image))
        `
      )
      .eq("id", postId)
      .order("created_at", { ascending: false, foreignTable: "comments" })
      .single();

    if (error) {
      console.log("fetchDetails error 1: ", error);
      return { success: false, msg: "Could not fetch the post details" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("fetchDetails error 2: ", error);
    return { success: false, msg: "Could not fetch the posts details" };
  }
};

export const createComment = async (comment) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert(comment)
      .select()
      .single();

    if (error) {
      console.log("comment error: ", error);
      return { success: false, msg: "Could not create your comment" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("comment error: ", error);
    return { success: false, msg: "Could not create your comment" };
  }
};

export const removeComment = async (commentId) => {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.log("removeComment error: ", error);
      return { success: false, msg: "Could not remove the comment" };
    }

    return { success: true, data: { commentId } };
  } catch (error) {
    console.log("removeComment error: ", error);
    return { success: false, msg: "Could not remove the comment" };
  }
};

export const removePost = async (postId) => {
  try {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      console.log("removePost error: ", error);
      return { success: false, msg: "Could not remove the post" };
    }

    return { success: true, data: { postId } };
  } catch (error) {
    console.log("removePost error: ", error);
    return { success: false, msg: "Could not remove the post" };
  }
};
