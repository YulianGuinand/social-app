import React from "react";
import { Text, View } from "react-native";
import { theme } from "../../../../constants/theme";
import CommentItem from "./Item/CommentItem";

const CommentList = ({ post, user, commentId, onDelete }) => {
  return (
    <View style={{ marginVertical: 15, gap: 17 }}>
      {post?.comments?.map((comment, index) => (
        <CommentItem
          key={comment?.id?.toString()}
          item={comment}
          canDelete={user.id == comment.userId || user.id == post.userId}
          commentId={commentId}
          onDelete={onDelete}
        />
      ))}

      {post?.comments?.length == 0 && (
        <Text style={{ color: theme.colors.text, marginLeft: 5 }}>
          Be first to comment!
        </Text>
      )}
    </View>
  );
};

export default CommentList;
