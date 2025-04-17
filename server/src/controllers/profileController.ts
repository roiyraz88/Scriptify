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
    executionTime,
    weeklyDay,
  } = req.body;

  if (!query || !frequencyType || !executionTime) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    const updateData: any = {
      query,
      resultLimit,
      frequencyType,
      executionTime,
    };

    if (frequencyType === "Every week") {
      updateData.weeklyDay = weeklyDay;
    } else {
      updateData.weeklyDay = undefined;
    }

    const script = await Script.findOneAndUpdate(
      { _id: scriptId, owner: userId },
      updateData,
      { new: true }
    );

    if (!script) {
      res.status(404).json({ message: "Script not found" });
      return;
    }

    res.status(200).json({ message: "Script updated", script });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update script" });
  }
};
