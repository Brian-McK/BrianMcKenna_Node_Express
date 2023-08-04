const supertest = require("supertest");
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRouter = require("../routes/auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const app = express();
const request = supertest(app);

app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter);

let mockUser = {};

describe("Auth Router", () => {
  let server;
  let createdSkillLevelId;
  beforeAll(async () => {
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/testDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Test database connected");
      server = app.listen(4000);

      mongoose.connection.collection("users").deleteMany({});

      const saltRounds = 10;

      const mockUserData = {
        _id: new mongoose.Types.ObjectId("64ca17e9a4eef8664e9ba5e5"),
        username: "Admin123",
        passwordHashed: bcrypt.hashSync("Admin123!", saltRounds),
        createdAt: "2023-08-02T08:46:33.496Z",
        updatedAt: "2023-08-02T09:57:06.061Z",
      };

      mockUser = new User(mockUserData);

      await mockUser.save();
    } catch (err) {
      console.error("Error connecting to test database:", err);
    }
  });
  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  describe("POST /auth/login", () => {
    it("should return authenticated with tokens", async () => {
      const loginReq = {
        username: mockUser.username,
        password: "Admin123!",
      };

      const response = await request
        .post("/auth/login")
        .send(loginReq)
        .expect(200);

      expect(response.body.message).toEqual("User authenticated successfully");
      expect(response.body.authenticated).toBeDefined();
      expect(response.body.authenticated.jwtToken).toBeDefined();

      const refreshTokenCookie = response.headers["set-cookie"]
        .map((cookie) => cookie.split(";")[0])
        .find((cookie) => cookie.startsWith("refreshToken="));

      expect(refreshTokenCookie).toBeDefined();
    });
  });

  describe("POST /auth/login", () => {
    it("should return 400 when invalid data is in payload - username", async () => {
      const invalidLoginReq = {
        username: "a",
        password: "Admin123!",
      };

      const response = await request
        .post("/auth/login")
        .send(invalidLoginReq)
        .expect(400);

      expect(response.body.message).toEqual(
        "username length must be at least 3 characters long"
      );

      const nonExistentUser = await User.findById(response.body._id);
      expect(nonExistentUser).toBeNull();
    });
  });

  describe("POST /auth/login", () => {
    it("should return 404 when user cant be found", async () => {
      const invalidLoginReq = {
        username: "aaaaa",
        password: "Admin123!",
      };

      const response = await request
        .post("/auth/login")
        .send(invalidLoginReq)
        .expect(404);

      expect(response.body.message).toEqual("User not found");

      const nonExistentUser = await User.findById(response.body._id);
      expect(nonExistentUser).toBeNull();
    });
  });

  describe("POST /auth/login", () => {
    it("should return 401 when password not valid", async () => {
      const invalidLoginReq = {
        username: mockUser.username,
        password: "Notvalid123!",
      };

      const response = await request
        .post("/auth/login")
        .send(invalidLoginReq)
        .expect(401);

      expect(response.body.message).toEqual("Invalid password");
    });
  });

  describe("POST /auth/logout", () => {
    it("should return HTTP-only cookie removed when log out called and cookie removed", async () => {
      const loginReq = {
        username: mockUser.username,
        password: "Admin123!",
      };

      const response = await request
        .post("/auth/logout")
        .send(loginReq)
        .expect(200);

      const cookies = response.headers["set-cookie"];

      if (!cookies || cookies.length === 0) {
        expect(response.body.message).toEqual("HTTP-only cookie removed");
      }
    });
  });

  describe("POST /auth/refresh-token", () => {
    it("should return 401 if no refresh token is provided", async () => {
      const loginReq = {
        username: mockUser.username,
        password: "Admin123!",
      };

      const response = await request
        .post("/auth/refresh-token")
        .send(loginReq.username)
        .expect(401);

      expect(response.body.message).toBe(
        "No refresh token, Unauthorized access"
      );
    });
  });

  describe("POST /auth/refresh-token", () => {
    it("should return 401if the user is unauthorized", async () => {
      const loginReq = {
        username: "Jimmy",
        password: "Admin123!",
      };

      const response = await request
        .post("/auth/refresh-token")
        .send(loginReq.username)
        .set("Cookie", ["refreshToken=DummyToken"])
        .expect(401);

      expect(response.body.message).toBe("Unauthorized User");
    });
  });
});
