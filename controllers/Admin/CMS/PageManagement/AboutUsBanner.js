const AboutUsBanner = require("../../../../models/AboutUsBanner");

exports.addBanner = async (req, res) => {
  try {
    const { banner, altText } = req.body;

    if (!banner || !altText) {
      return res
        .status(400)
        .json({ message: "Banner and alt text are required" });
    }

    const newBanner = await AboutUsBanner.create({ banner, altText });
    res.status(201).json(newBanner);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding banner", error: err.message });
  }
};

exports.editBanner = async (req, res) => {
  try {
    const { banner, altText } = req.body;
    const updatedBanner = await AboutUsBanner.findByIdAndUpdate(
      req.params.id,
      { banner, altText },
      { new: true }
    );

    if (!updatedBanner)
      return res.status(404).json({ message: "Banner not found" });

    res.status(200).json(updatedBanner);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating banner", error: err.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const deleted = await AboutUsBanner.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: "Banner not found" });

    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting banner", error: err.message });
  }
};

exports.getBanners = async (req, res) => {
  try {
    const banners = await AboutUsBanner.find().sort({ createdAt: -1 });
    res.status(200).json(banners);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching banners", error: err.message });
  }
};
