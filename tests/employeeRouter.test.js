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
  let createdEmployeeId;
  beforeAll(async () => {
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/testDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Test database connected");
      server = app.listen(4000);

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

  afterEach(async () => {
    if (createdEmployeeId) {
      await Employee.findByIdAndDelete(createdEmployeeId).then(() =>
        console.log(`deleted - ${createdEmployeeId}`)
      );
    }
  });
  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  describe("GET /employees", () => {
    it("should return a list of employees when requested", async () => {
      const response = await request.get("/employees").send({}).expect(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body).not.toBeNull();
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
      expect(response.body).not.toBeNull();
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

  describe("POST /employees", () => {
    it("should create a new employee and return 201 created with newly created employee", async () => {
      const newEmployeeData = {
        firstName: "John",
        lastName: "Doe",
        dob: "1991-05-12",
        email: "john.doe@example.com",
        isActive: true,
        skillLevels: [],
      };

      const response = await request
        .post("/employees")
        .send(newEmployeeData)
        .expect(201);

      // Verify the response contains the created employee data
      expect(response.body).toBeDefined();
      expect(response.body.firstName).toEqual(newEmployeeData.firstName);
      expect(response.body.lastName).toEqual(newEmployeeData.lastName);
      expect(response.body.email).toEqual(newEmployeeData.email);
      expect(response.body.isActive).toEqual(newEmployeeData.isActive);
      expect(response.body.skillLevels).toEqual(newEmployeeData.skillLevels);
      expect(new Date(response.body.dob).toUTCString).toEqual(
        new Date(newEmployeeData.dob).toUTCString
      );

      createdEmployeeId = response.body._id;

      // // Verify that the employee was actually added to the database
      const createdEmployee = await Employee.findById(response.body._id);
      expect(createdEmployee).toBeDefined();
      expect(createdEmployee.firstName).toEqual(newEmployeeData.firstName);
      expect(createdEmployee.lastName).toEqual(newEmployeeData.lastName);
      expect(createdEmployee.email).toEqual(newEmployeeData.email);
      expect(createdEmployee.isActive).toEqual(newEmployeeData.isActive);
      expect(createdEmployee.skillLevels).toEqual(newEmployeeData.skillLevels);
      expect(new Date(createdEmployee.dob).toUTCString).toEqual(
        new Date(newEmployeeData.dob).toUTCString
      );
    });
  });

  describe("POST /employees", () => {
    it("should return 400 when invalid data is in payload - firstName", async () => {
      const invalidEmployeeData = {
        firstName: "J", // <--- Invalid
        lastName: "Doe",
        dob: "1991-05-12",
        email: "john.doe@example.com",
        isActive: true,
        skillLevels: [],
      };

      const response = await request
        .post("/employees")
        .send(invalidEmployeeData)
        .expect(400);

      expect(response.body).toBeDefined();
      expect(response.body.message).toEqual(
        "firstName length must be at least 2 characters long"
      );

      const nonExistentEmployee = await Employee.findById(response.body._id);
      expect(nonExistentEmployee).toBeNull();
    });
  });

  describe("POST /employees", () => {
    it("should return 500 when skill level doesnt exist", async () => {
      const invalidEmployeeData = {
        firstName: "Johnas",
        lastName: "Doe",
        dob: "1991-05-12",
        email: "john.doae@example.com",
        isActive: true,
        skillLevels: ["64cb725bf584df718a37f6ee"], // <--- doesnt exist in skill levels collection
      };

      const response = await request
        .post("/employees")
        .send(invalidEmployeeData)
        .expect(500);

      expect(response.body).toBeDefined();
      expect(response.body.message).toEqual("One or more skills do not exist");

      const nonExistentEmployee = await Employee.findById(response.body._id);
      expect(nonExistentEmployee).toBeNull();
    });
  });

  describe("POST /employees", () => {
    it("should return 409 when user already exists - email", async () => {
      const firstRecord = {
        firstName: "John",
        lastName: "Doe",
        dob: "1991-05-12",
        email: "john.doe@example.com",
        isActive: true,
        skillLevels: [],
      };

      await request.post("/employees").send(firstRecord);

      const secondRecord = {
        firstName: "Johnas",
        lastName: "Doe",
        dob: "1991-05-12",
        email: "john.doe@example.com", // <--- already exists
        isActive: true,
        skillLevels: [],
      };

      const response = await request
        .post("/employees")
        .send(secondRecord)
        .expect(409);

      expect(response.body).toBeDefined();
      expect(response.body.message).toEqual("User already exists");
    });
  });

  describe("PUT /employees/:id", () => {
    it("should update an employee and return 200 with updated employee", async () => {
      const updatedEmployeeData = {
        firstName: "John",
        lastName: "Doe",
        dob: "1991-05-12",
        email: "johnn.doe@example.com", // <--- updated value
        isActive: true,
        skillLevels: [],
      };

      const response = await request
        .put(`/employees/${mockEmployee.id}`)
        .send(updatedEmployeeData)
        .expect(200);

      // Verify the response contains the created employee data
      expect(response.body).toBeDefined();
      expect(response.body.firstName).toEqual(updatedEmployeeData.firstName);
      expect(response.body.lastName).toEqual(updatedEmployeeData.lastName);
      expect(response.body.email).toEqual(updatedEmployeeData.email);
      expect(response.body.isActive).toEqual(updatedEmployeeData.isActive);
      expect(response.body.skillLevels).toEqual(
        updatedEmployeeData.skillLevels
      );
      expect(new Date(response.body.dob).toUTCString).toEqual(
        new Date(updatedEmployeeData.dob).toUTCString
      );

      // // Verify that the employee was actually added to the database
      const updatedEmployee = await Employee.findById(response.body._id);
      expect(updatedEmployee).toBeDefined();
      expect(updatedEmployee.firstName).toEqual(updatedEmployeeData.firstName);
      expect(updatedEmployee.lastName).toEqual(updatedEmployeeData.lastName);
      expect(updatedEmployee.email).toEqual(updatedEmployeeData.email);
      expect(updatedEmployee.isActive).toEqual(updatedEmployeeData.isActive);
      expect(updatedEmployee.skillLevels).toEqual(
        updatedEmployeeData.skillLevels
      );
      expect(new Date(updatedEmployee.dob).toUTCString).toEqual(
        new Date(updatedEmployeeData.dob).toUTCString
      );
    });
  });

  describe("PUT /employees/:id", () => {
    it("should return 400 when invalid data is in payload - firstName", async () => {
      const invalidEmployeeData = {
        firstName: "J", // <--- Invalid
        lastName: "Doe",
        dob: "1991-05-12",
        email: "john.doe@example.com",
        isActive: true,
        skillLevels: [],
      };

      const response = await request
        .put(`/employees/${mockEmployee.id}`)
        .send(invalidEmployeeData)
        .expect(400);

      expect(response.body).toBeDefined();
      expect(response.body.message).toEqual(
        "firstName length must be at least 2 characters long"
      );

      const nonExistentEmployee = await Employee.findById(response.body._id);
      expect(nonExistentEmployee).toBeNull();
    });
  });

  describe("POST /employees/:id", () => {
    it("should return 500 when skill level doesnt exist", async () => {
      const invalidEmployeeData = {
        firstName: "Johnas",
        lastName: "Doe",
        dob: "1991-05-12",
        email: "john.doae@example.com",
        isActive: true,
        skillLevels: ["64cb725bf584df718a37f6ee"], // <--- doesnt exist in skill levels collection
      };

      const response = await request
        .put(`/employees/${mockEmployee.id}`)
        .send(invalidEmployeeData)
        .expect(500);

      expect(response.body).toBeDefined();
      expect(response.body.message).toEqual("One or more skills do not exist");

      const nonExistentEmployee = await Employee.findById(response.body._id);
      expect(nonExistentEmployee).toBeNull();
    });
  });

  describe("POST /employees/:id", () => {
    it("should return 409 when user already exists - email", async () => {
      const firstRecord = {
        firstName: "John",
        lastName: "Doe",
        dob: "1991-05-12",
        email: "john.doe@example.com",
        isActive: true,
        skillLevels: [],
      };

      await request.post("/employees").send(firstRecord);

      const secondRecord = {
        firstName: "Johnas",
        lastName: "Doe",
        dob: "1991-05-12",
        email: "john.doe@example.com", // <--- already exists
        isActive: true,
        skillLevels: [],
      };

      const response = await request
        .put(`/employees/${mockEmployee.id}`)
        .send(secondRecord)
        .expect(409);

      expect(response.body).toBeDefined();
      expect(response.body.message).toEqual(
        "Employee with this email already exists"
      );
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
