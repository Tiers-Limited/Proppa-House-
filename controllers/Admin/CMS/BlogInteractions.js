const Blog = require("../../../models/Blog");

exports.toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const userId = req.body.userId;
    const index = blog.likes.indexOf(userId);
    if (index > -1) {
      blog.likes.splice(index, 1); // Unlike
    } else {
      blog.likes.push(userId); // Like
    }

    await blog.save();
    res
      .status(200)
      .json({ likes: blog.likes, message: index > -1 ? "Unliked" : "Liked" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error toggling like", error: err.message });
  }
};

exports.postComment = async (req, res) => {
  try {
    const { text, parentId } = req.body;
    const blog = await Blog.findById(req.params.id);
    console.log(blog, req.params.id, req.body);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = {
      user: req.body.userId,
      text,
      status: "Draft",
      type: parentId ? "Reply" : "Comment",
      parentId: parentId || null,
    };

    blog.comments.push(comment);
    await blog.save();

    res.status(201).json({ message: "Comment submitted for review" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error posting comment", error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = blog.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    blog.comments.pull(comment._id);
    await blog.save();

    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting comment", error: err.message });
  }
};

exports.flagComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = blog.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.status = "Flagged";
    await blog.save();

    res.status(200).json({ message: "Comment flagged as spam" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error flagging comment", error: err.message });
  }
};
