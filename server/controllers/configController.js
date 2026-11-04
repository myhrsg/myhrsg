import Config from "../models/Config.js";

// Read Config (Key)
export const getConfig = async (req, res) => {
  try {
    const { key } = req.params;
    const config = await Config.findOne({ key });
    if (!config) {
      return res.status(404).json({ message: "Config not found" });
    }
    res.status(200).json({ key: config.key, value: config.value });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upsert Config
export const updateConfig = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    const config = await Config.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );
    res.status(200).json({ key: config.key, value: config.value });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
