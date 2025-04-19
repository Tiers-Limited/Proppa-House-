const Blog = require("../../../models/Blog");
const UserProfile = require("../../../models/UserProfile");

// Create blog
exports.createBlog = async (req, res) => {
  try {
    const newBlog = new Blog({
      ...req.body,
    });
    const blog = await newBlog.save();
    res.status(201).json({ message: "Blog created", blog });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating blog", error: err.message });
  }
};

// Get all blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("category")
      .populate("likes")
      .populate("comments.user");
    res.status(200).json(blogs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error getting blogs", error: err.message });
  }
};

// Get single blog
exports.getBlogById = async (req, res) => {
  try {
    const blogDoc = await Blog.findById(req.params.id)
      .populate("category")
      .populate({ path: "likes", model: "User", select: "name email" })
      .populate({ path: "comments.user", model: "User", select: "name email" });

    if (!blogDoc) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const blog = blogDoc.toObject();

    const likeUserIds = blog.likes.map((u) => u._id);
    const commentUserIds = blog.comments
      .map((c) => c.user?._id)
      .filter(Boolean);

    const profiles = await UserProfile.find({
      userId: { $in: [...likeUserIds, ...commentUserIds] },
    }).select("userId profilePicture");

    const getPic = (userId) => {
      const p = profiles.find((x) => x.userId.toString() === userId.toString());
      return p ? p.profilePicture : null;
    };

    const likes = blog.likes.map((u) => ({
      ...u,
      profilePicture: getPic(u._id),
    }));

    const comments = blog.comments.map((c) => ({
      ...c,
      user: {
        ...c.user,
        profilePicture: getPic(c.user._id),
      },
    }));

    const categoryIds = Array.isArray(blog.category)
      ? blog.category.map((cat) => cat._id)
      : [];

    // Fetch related blogs only if we have at least one category
    let relatedBlogs = [];
    if (categoryIds.length) {
      relatedBlogs = await Blog.find({
        _id: { $ne: blog._id },
        category: { $in: categoryIds },
        postStatus: "Published",
      })
        .limit(5)
        .select("title thumbnails createdAt category slug")
        .populate("category");
    }

    res.status(200).json({
      blog: {
        ...blog,
        likes,
        comments,
      },
      relatedBlogs,
    });
  } catch (err) {
    console.error("Error in getBlogById:", err);
    res
      .status(500)
      .json({ message: "Error fetching blog", error: err.message });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ message: "Blog updated", blog: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating blog", error: err.message });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ message: "Blog deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting blog", error: err.message });
  }
};

// Scheduled Publishing (cron job will call this or run via script)
exports.publishScheduledBlogs = async () => {
  const now = new Date();
  await Blog.updateMany(
    { postStatus: "Scheduled", scheduledAt: { $lte: now } },
    { postStatus: "Published" }
  );
};
