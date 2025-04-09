import request from "supertest";
import app from "../app";
import User, { IUser } from "../models/User";
import mongoose from "mongoose";
import { log } from "console";

let testUser: IUser;

beforeAll(async () => {
  await mongoose.connect(
    process.env.MONGO_URI_TEST || "mongodb://localhost:27017/test-db"
  );
  await mongoose.connection.db.dropDatabase(); // Clear the database before each test
  testUser = new User({
    name: "Test User",
    email: "testuser@example.com",
    password: "User1234",
    scripts: [],
  });
});
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Auth API", () => {
  test("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send({
      name: testUser.name,
      email: testUser.email,
      password: testUser.password,
      confirmPassword: testUser.password,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", "testuser@example.com");
    expect(res.body.user).toHaveProperty("name", "Test User");
  });

  test("should not register a user with an existing email", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Another User",
      email: testUser.email, // Use the same email as the test user
      password: "12345678",
      confirmPassword: "12345678",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "User already exists");
  });

  test("should not register a user with invalid email", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Invalid User",
      email: "invalid-email",
      password: "User1234",
      confirmPassword: "User1234",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid email address");
  });

  test("should not register a user with short password", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Short Password User",
      email: "testuser2@gmail.com",
      password: "123",
      confirmPassword: "123",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "Password must be at least 6 characters"
    );
  });

  test("should not register a user with non-matching passwords", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Non-matching Password User",
      email: "testuser2@gmail.com",
      password: "User1234",
      confirmPassword: "User4321",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Passwords do not match");
  });
  test("login user", async () => {
    const res = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", testUser.email);
  });
  test("should not login with incorrect password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "Email or password is incorrect"
    );
  });
  test("should not login with unregistered email", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "unregistered@gmail.com",
      password: testUser.password,
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Email not found");
  });
  test("should not login with empty fields", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "",
      password: "",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Please fill all fields");
  });
  test("should refresh access token with valid refresh token cookie", async () => {
    const loginRes = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty("accessToken");
    expect(loginRes.body).toHaveProperty("refreshToken");

    const refreshToken = loginRes.body.refreshToken;
    const cookie = `refreshToken=${refreshToken}`;

    const refreshRes = await request(app)
      .post("/auth/refresh")
      .set("Cookie", cookie);

    expect(refreshRes.statusCode).toBe(200);
    expect(refreshRes.body).toHaveProperty("accessToken");
    expect(refreshRes.body.accessToken).not.toBeNull();
  });

  test("should not refresh token when no cookie is sent", async () => {
    const res = await request(app).post("/auth/refresh"); 

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Refresh token is not valid");
  });

  test("should not refresh token with invalid token", async () => {
    const res = await request(app)
      .post("/auth/refresh")
      .set("Cookie", ["refreshToken=invalidtoken"])
      .send({
        email: testUser.email,
      });
    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("message", "Invalid refresh token");
  });
  test("logout user", async () => {
    const res = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", testUser.email);
    expect(res.body).toHaveProperty("refreshToken");

    const logoutRes = await request(app)
      .post("/auth/logout")
      .set("Cookie", [`refreshToken=${res.body.refreshToken}`])
      .send({});
    expect(logoutRes.statusCode).toBe(200);
    expect(logoutRes.body).toHaveProperty("message", "Logged out successfully");
  });
  test("should not logout without refresh token", async () => {
    const res = await request(app).post("/auth/logout").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "Please provide a refresh token"
    );
  });
  test("should not logout with invalid refresh token", async () => {
    const res = await request(app)
      .post("/auth/logout")
      .set("Cookie", ["refreshToken=invalidtoken"])
      .send({});
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid refresh token");
  });
});
