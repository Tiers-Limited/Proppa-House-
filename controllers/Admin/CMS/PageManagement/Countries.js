const Country = require("../../../../models/Country");

exports.addCountry = async (req, res) => {
  try {
    const { countryName, flagIcon, status, description } = req.body;

    const newCountry = new Country({
      countryName,
      flagIcon,
      status,
      description,
    });
    await newCountry.save();

    res
      .status(201)
      .json({ message: "Country added successfully", country: newCountry });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding country", error: err.message });
  }
};

exports.getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find().sort({ createdAt: -1 });
    res.status(200).json(countries);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching countries", error: err.message });
  }
};

exports.updateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const { countryName, flagIcon, status, description } = req.body;

    const updated = await Country.findByIdAndUpdate(
      id,
      { countryName, flagIcon, status, description },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Country not found" });

    res.status(200).json({ message: "Country updated", country: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating country", error: err.message });
  }
};

exports.deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Country.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Country not found" });

    res.status(200).json({ message: "Country deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting country", error: err.message });
  }
};
