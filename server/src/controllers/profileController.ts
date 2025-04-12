import { Request, Response } from "express";
import Script from "../models/Script";

export const getMyScripts = async (req: Request, res: Response) => {
  try {
    const scripts = await Script.find({ owner: (req as any).userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ scripts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch scripts" });
  }
};

export const deleteScript = async (req: Request, res: Response) => {
  const scriptId = req.params.id;
  const userId = (req as any).userId;

  try {
    const script = await Script.findOneAndDelete({
      _id: scriptId,
      owner: userId,
    });

    if (!script) {
      res.status(404).json({ message: "Script not found" });
      return;
    }

    res.status(200).json({ message: "Script deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete script" });
  }
};

export const updateScript = async (req: Request, res: Response) => {
  const scriptId = req.params.id;
  const userId = (req as any).userId;
  const {
    query,
    resultLimit,
    frequencyType,
    dailyTime,
    weeklyDay,
    weeklyTime,
  } = req.body;

  try {
    const script = await Script.findOneAndUpdate(
      { _id: scriptId, owner: userId },
      {
        query,
        resultLimit,
        frequencyType,
        dailyTime,
        weeklyDay,
        weeklyTime,
      },
      { new: true } 
    );

    if (!script) {
      res.status(404).json({ message: "Script not found" });
      return;
    }

    res.status(200).json({ message: "Script updated", script });
  } catch (error) {
    res.status(500).json({ message: "Failed to update script" });
  }
};
