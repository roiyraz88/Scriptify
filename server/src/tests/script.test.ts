import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import User from "../models/User";
import Script from "../models/Script";
import jwt from "jsonwebtoken";

describe("POST /api/scripts/run-script", () => {
  let server: any;
  let token: string;
  let userId: string;

  beforeAll(async () => {
    server = app.listen(0);
    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "hashedpassword123",
    });
    userId = user._id.toString();

    token = jwt.sign({ userId: userId }, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: "1h",
    });
  });

  afterAll(async () => {
    await Script.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
    server.close();
  });

  it("should create a script and send email when valid data is provided", async () => {
    const res = await request(server)
      .post("/api/scripts/run-script")
      .set("Authorization", `Bearer ${token}`)
      .send({
        emailRecipient: "recipient@example.com",
        query: "Software Engineer jobs site:linkedin.com",
        resultLimit: 5,
        frequencyType: "Every day",
        dailyTime: "09:00",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Sent job alert email/);
    expect(res.body.schedule).toMatch(/Runs every day at/);

    const savedScripts = await Script.find({ owner: userId });
    expect(savedScripts.length).toBe(1);
    expect(savedScripts[0].query).toBe("Software Engineer jobs site:linkedin.com");
  });

  it("should return 400 if required fields are missing", async () => {
    const res = await request(server)
      .post("/api/scripts/run-script")
      .set("Authorization", `Bearer ${token}`)
      .send({
        emailRecipient: "",
        query: "",
        frequencyType: "",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Missing required fields");
  });

  it("should return 401 if token is missing", async () => {
    const res = await request(server)
      .post("/api/scripts/run-script")
      .send({
        emailRecipient: "recipient@example.com",
        query: "Developer jobs",
        frequencyType: "Every day",
        dailyTime: "10:00",
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized - No token");
  });
});
