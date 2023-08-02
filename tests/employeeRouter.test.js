const supertest = require("supertest");
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const employeeRouter = require("../routes/employees");
const Employee = require("../models/employee");

const app = express();
const request = supertest(app);

app.use(cookieParser());
app.use(express.json());

app.use("/employees", employeeRouter);

let mockEmployee = {};

describe("Employee Router", () => {
  let server;
  beforeAll(async () => {
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/testDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Test database connected");
      server = app.listen(3000);

      mongoose.connection.collection("employees").deleteMany({});

      const mockEmployeeData = {
        _id: new mongoose.Types.ObjectId("64ca17e9a4eef8664e9ba5e5"),
        firstName: "Brian",
        lastName: "McKenna",
        dob: "1992-12-05T00:00:00.000Z",
        email: "hahaha@hotmail.com",
        isActive: true,
        skillLevels: [new mongoose.Types.ObjectId("64c92d9c78e47fb0c24d348b")],
        createdAt: "2023-08-02T08:46:33.496Z",
        updatedAt: "2023-08-02T09:57:06.061Z",
        age: 30,
      };

      mockEmployee = new Employee(mockEmployeeData);

      await mockEmployee.save();
    } catch (err) {
      console.error("Error connecting to test database:", err);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  describe("GET /employees", () => {
    it("should return a list of employees when requested", async () => {
      const response = await request.get("/employees").send({}).expect(200);

      expect(response.body).toBeDefined();
      expect(response.body).toEqual([mockEmployee.toJSON()]);
    });
  });

  describe("GET /employees/:id", () => {
    it("should return an employee when requested", async () => {
      const response = await request
        .get(`/employees/${mockEmployee.id}`)
        .send({})
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body).toEqual(mockEmployee.toJSON());
    });
  });

  describe("GET /employees/:id", () => {
    it("should return bad request 400 when getting an employee with invalid id", async () => {
      const response = await request
        .get(`/employees/${"lol"}`)
        .send({})
        .expect(400);

      expect(response.body.message).toEqual("Invalid employee ID");
    });
  });

  describe("GET /employees/:id", () => {
    it("should return bad request 404 when getting an employee with valid id format, but not a valid id (non-existing)", async () => {
      const response = await request
        .get(`/employees/${"64ca6ec95965e37b5871edc4"}`)
        .send({})
        .expect(404);

      expect(response.body.message).toEqual("Can't find employee");
    });
  });

  describe("DELETE /employees/:id", () => {
    it("should return OK when employee deleted", async () => {
      const response = await request
        .delete(`/employees/${mockEmployee.id}`)
        .send({})
        .expect(200);

      expect(response.body.message).toEqual("Deleted employee");
    });
  });

  describe("DELETE /employees/:id", () => {
    it("should return bad request 400 when employee deleted with invalid id", async () => {
      const response = await request
        .delete(`/employees/${"lol"}`)
        .send({})
        .expect(400);

      expect(response.body.message).toEqual("Invalid employee ID");
    });
  });

  describe("DELETE /employees/:id", () => {
    it("should return bad request 404 when deleting an employee with valid id format, but not a valid id (non-existing)", async () => {
      const response = await request
        .delete(`/employees/${"64ca6ec95965e37b5871edc4"}`)
        .send({})
        .expect(404);

      expect(response.body.message).toEqual("Can't find employee");
    });
  });
});
