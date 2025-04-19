const Blog = require("../../../models/Blog");

exports.getRecentBlogs = async (req, res) => {
  try {
    const recentBlogs = await Blog.find({ postStatus: "Published" })
      .populate("category")
      .populate("likes")
      .populate("comments.user")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const blogsWithCounts = recentBlogs.map((blog) => ({
      ...blog,
      likeCount: blog.likes?.length || 0,
      commentCount: blog.comments?.length || 0,
      viewCount: blog.views || 0,
    }));

    res.status(200).json(blogsWithCounts);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching recent blogs",
      error: err.message,
    });
  }
};

exports.getScheduledBlogs = async (req, res) => {
  try {
    const now = new Date();

    const scheduledBlogs = await Blog.find({
      scheduledAt: { $gt: now },
      postStatus: "Scheduled",
    })
      .populate("category")
      .populate("likes")
      .populate("comments.user")
      .sort({ scheduledAt: 1 });

    res.status(200).json(scheduledBlogs);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching scheduled blogs",
      error: err.message,
    });
  }
};
