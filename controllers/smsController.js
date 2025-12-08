import SmsApi from "../models/smsApiModel.js";

export const createSmsApi = async (req, res) => {
  try {
    const data = req.body;
    const created = await SmsApi.create(data);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllSmsApis = async (req, res) => {
  try {
    const allConfigs = await SmsApi.findAll({ where: { isDeleted: false } });
    res.json({ success: true, data: allConfigs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getActiveSmsApi = async (req, res) => {
  try {
    const config = await SmsApi.findOne({
      where: { active: true, isDeleted: false },
    });
    if (!config)
      return res
        .status(404)
        .json({ success: false, message: "No active config found" });
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSmsApi = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await SmsApi.update(req.body, {
      where: { id },
    });
    res.json({ success: true, message: "Updated successfully", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const softDeleteSmsApi = async (req, res) => {
  try {
    const { id } = req.params;
    await SmsApi.update({ isDeleted: true }, { where: { id } });
    res.json({ success: true, message: "Deleted (soft) successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
