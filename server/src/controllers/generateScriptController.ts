import { Request, Response } from "express";
import { handleJobAlerts } from "./jobAlertsController";
import { handleEmailAutomation } from "./emailAutomationController";
import { handleApiIntegration } from "./apiIntegrationController";
import { handleWebScraping } from "./webScrapingController";
import { handleFileHandling } from "./fileHandlingController";

export const generateScriptController = async (req: Request, res: Response) => {
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ message: "Category is required" });
  }

  try {
    switch (category) {
      case "job_alerts":
        return await handleJobAlerts(req, res);
      case "email_automation":
        return await handleEmailAutomation(req, res);
      case "api_integration":
        return await handleApiIntegration(req, res);
      case "web_scraping":
        return await handleWebScraping(req, res);
      case "file_handling":
        return await handleFileHandling(req, res);
      default:
        return res.status(400).json({ message: "Invalid category" });
    }
  } catch (error) {
    console.error("Generate Script Error:", error);
    return res.status(500).json({ message: "Failed to generate script" });
  }
};
