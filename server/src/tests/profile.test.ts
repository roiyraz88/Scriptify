import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import User from "../models/User";
import Script from "../models/Script";
import jwt from "jsonwebtoken";

let token: string;
let scriptId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL!);

  const user = await User.create({
    name: "Test User",
    email: "test@example.com",
    password: "hashed-password",
  });

  token = jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "1h",
  });

  const script = await Script.create({
    owner: user._id,
    query: "developer jobs",
    resultLimit: 10,
    frequencyType: "Every day",
    dailyTime: "09:00",
  });

  scriptId = script._id.toString();
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("Profile API", () => {
  it("should fetch user's scripts", async () => {
    const res = await request(app)
      .get("/api/profile/my-scripts")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.scripts).toHaveLength(1);
    expect(res.body.scripts[0]).toHaveProperty("query", "developer jobs");
  });

  it("should update a script", async () => {
    const res = await request(app)
      .put(`/api/profile/my-scripts/${scriptId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: "updated job",
        resultLimit: 5,
        frequencyType: "Every day",
        dailyTime: "10:00",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.script.query).toBe("updated job");
  });

  it("should delete a script", async () => {
    const res = await request(app)
      .delete(`/api/profile/my-scripts/${scriptId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Script deleted successfully");
  });
});
