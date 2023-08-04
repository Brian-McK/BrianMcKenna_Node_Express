const supertest = require("supertest");
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const skillLevelsRouter = require("../routes/skillLevels");
const Employee = require("../models/employee");
const SkillLevel = require("../models/skillLevel");

const app = express();
const request = supertest(app);

app.use(cookieParser());
app.use(express.json());

app.use("/skillLevels", skillLevelsRouter);

let mockSkillLevel = {};

describe("SkillLevel Router", () => {
  let server;
  beforeAll(async () => {
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/testDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Test database connected");
      server = app.listen(4000);

      mongoose.connection.collection("skilllevels").deleteMany({});

      const mockSkillLevelData = {
        _id: new mongoose.Types.ObjectId("64ca17e9a4eef8664e9ba5e5"),
        name: "Test",
        description: "Test",
        createdAt: "2023-08-02T08:46:33.496Z",
        updatedAt: "2023-08-02T09:57:06.061Z",
      };

      mockSkillLevel = new SkillLevel(mockSkillLevelData);

      await mockSkillLevel.save();
    } catch (err) {
      console.error("Error connecting to test database:", err);
    }
  });
  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  describe("GET /skillLevels", () => {
    it("should return a list of skill levels when requested", async () => {
      const response = await request.get("/skillLevels").send({}).expect(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body).not.toBeNull();
      expect(response.body).toBeDefined();
      expect(response.body).toEqual([mockSkillLevel.toJSON()]);
    });
  });

  describe("GET /skilllevels/:id", () => {
    it("should return a skill level when requested", async () => {
      const response = await request
        .get(`/skilllevels/${mockSkillLevel.id}`)
        .send({})
        .expect(200);
      expect(response.body).not.toBeNull();
      expect(response.body).toBeDefined();
      expect(response.body).toEqual(mockSkillLevel.toJSON());
    });
  });

  describe("GET /skilllevels/:id", () => {
    it("should return bad request 400 when getting a skill level with invalid id", async () => {
      const response = await request
        .get(`/skilllevels/${"lol"}`)
        .send({})
        .expect(400);

      expect(response.body.message).toEqual("Invalid Skill Level ID");
    });
  });

  describe("GET /skilllevels/:id", () => {
    it("should return bad request 404 when getting a skill level with valid id format, but not a valid id (non-existing)", async () => {
      const response = await request
        .get(`/skilllevels/${"64ca6ec95965e37b5871edc4"}`)
        .send({})
        .expect(404);

      expect(response.body.message).toEqual("Can't find skill Level");
    });
  });

  describe("POST /skilllevels", () => {
    it("should create a new skill level and return 201 created with newly created skill level", async () => {
      const newSkillLevelData = {
        name: "New",
        description: "Skill level",
      };

      const response = await request
        .post("/skilllevels")
        .send(newSkillLevelData)
        .expect(201);

      // Verify the response contains the created skill level data
      expect(response.body).toBeDefined();
      expect(response.body.name).toEqual(newSkillLevelData.name);
      expect(response.body.description).toEqual(newSkillLevelData.description);

      // // Verify that the skill level was actually added to the database
      const createdSkillLevel = await SkillLevel.findById(response.body._id);
      expect(createdSkillLevel).toBeDefined();
      expect(createdSkillLevel.name).toEqual(newSkillLevelData.name);
      expect(createdSkillLevel.description).toEqual(
        newSkillLevelData.description
      );
    });
  });

  describe("POST /skilllevels", () => {
    it("should return 400 when invalid data is in payload - name", async () => {
      const invalidSkillLevelData = {
        name: "J", // <--- Invalid
        description: "Doe",
      };

      const response = await request
        .post("/skilllevels")
        .send(invalidSkillLevelData)
        .expect(400);

      expect(response.body).toBeDefined();
      expect(response.body.message).toEqual(
        "name length must be at least 3 characters long"
      );

      const nonExistentSkillLevel = await SkillLevel.findById(
        response.body._id
      );
      expect(nonExistentSkillLevel).toBeNull();
    });
  });

  describe("POST /skilllevels", () => {
    it("should return 409 when skill level already exists - name", async () => {
      const firstRecord = {
        name: "hello",
        description: "hello",
      };

      await request.post("/skilllevels").send(firstRecord);

      const secondRecord = {
        name: "hello",
        description: "hello 2",
      };

      const response = await request
        .post("/skilllevels")
        .send(secondRecord)
        .expect(409);

      expect(response.body).toBeDefined();
      expect(response.body.message).toEqual("Skill level already exists");
    });
  });

  describe("PUT /skilllevels/:id", () => {
    it("should update a skill level and return 200 with updated skill level", async () => {
      const updatedSkillLevelData = {
        name: "updated",
        description: "updated",
      };

      const response = await request
        .put(`/skilllevels/${mockSkillLevel.id}`)
        .send(updatedSkillLevelData)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.name).toEqual(updatedSkillLevelData.name);
      expect(response.body.description).toEqual(
        updatedSkillLevelData.description
      );

      const updatedSkillLevel = await SkillLevel.findById(response.body._id);
      expect(updatedSkillLevel).toBeDefined();
      expect(updatedSkillLevel.name).toEqual(updatedSkillLevelData.name);
      expect(updatedSkillLevel.description).toEqual(
        updatedSkillLevelData.description
      );
    });
  });

  describe("PUT /skilllevels", () => {
    it("should return 400 when invalid data is in payload - name", async () => {
      const invalidSkillLevelData = {
        name: "J", // <--- Invalid
        description: "Doe",
      };

      const response = await request
        .put(`/skilllevels/${mockSkillLevel.id}`)
        .send(invalidSkillLevelData)
        .expect(400);

      expect(response.body).toBeDefined();
      expect(response.body.message).toEqual(
        "name length must be at least 3 characters long"
      );

      const nonExistentSkillLevel = await SkillLevel.findById(
        response.body._id
      );
      expect(nonExistentSkillLevel).toBeNull();
    });
  });

  describe("PUT /skilllevels", () => {
    it("should return 409 when skill level already exists - name", async () => {
      const firstRecord = {
        name: "hello",
        description: "hello",
      };

      await request.post("/skilllevels").send(firstRecord);

      const secondRecord = {
        name: "hello",
        description: "hello 2",
      };

      const response = await request
        .put(`/skilllevels/${mockSkillLevel.id}`)
        .send(secondRecord)
        .expect(409);

      expect(response.body).toBeDefined();
      expect(response.body.message).toEqual(
        "Skill level with this name already exists"
      );
    });
  });

  describe("DELETE /skilllevels/:id", () => {
    it("should return OK when a skill level is deleted", async () => {
      const response = await request
        .delete(`/skilllevels/${mockSkillLevel.id}`)
        .send({})
        .expect(200);

      expect(response.body.message).toEqual("Deleted skill level");
    });
  });

  describe("DELETE /skilllevels/:id", () => {
    it("should return bad request 400 when a skill level is deleted with invalid id", async () => {
      const response = await request
        .delete(`/skilllevels/${"lol"}`)
        .send({})
        .expect(400);

      expect(response.body.message).toEqual("Invalid Skill Level ID");
    });
  });

  describe("DELETE /skilllevels/:id", () => {
    it("should return bad request 404 when deleting a skill level with valid id format, but not a valid id (non-existing)", async () => {
      const response = await request
        .delete(`/skilllevels/${"64ca6ec95965e37b5871edc4"}`)
        .send({})
        .expect(404);

      expect(response.body.message).toEqual("Can't find skill Level");
    });
  });
});
