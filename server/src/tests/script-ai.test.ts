import { parsePromptController } from "../controllers/scriptAiController";
import { generatePythonScriptFromPrompt } from "../services/gemini";
import GeneratedScript from "../models/GeneratedScript";

jest.mock("../services/gemini");
jest.mock("../models/GeneratedScript");

describe("parsePromptController", () => {
  const mockRequest = (prompt: string, userId = "user123") =>
    ({
      body: { prompt },
      user: { id: userId },
    } as any);

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return 400 if prompt is missing or too short", async () => {
    const req = mockRequest("abc");
    const res = mockResponse();

    await parsePromptController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Prompt is too short." });
  });

  test("should generate script and save it", async () => {
    const req = mockRequest("Send an email every day");
    const res = mockResponse();

    (generatePythonScriptFromPrompt as jest.Mock).mockResolvedValue(
      "print('hello')"
    );
    (GeneratedScript as any).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(true),
    }));

    await parsePromptController(req, res);

    expect(generatePythonScriptFromPrompt).toHaveBeenCalledWith(
      "Send an email every day"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ script: "print('hello')" });
  });

  test("should handle errors from Gemini", async () => {
    const req = mockRequest("This is a valid prompt"); 
    const res = mockResponse();

    (generatePythonScriptFromPrompt as jest.Mock).mockRejectedValue(
      new Error("Gemini failed")
    );

    await parsePromptController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Failed to generate script from AI",
    });
  });
});
