const mongoose = require("mongodb");
const connectDb = require("./mongo");
const userController = require("../src/controllers/userController");

describe("insert", () => {
  let mongoClient = typeof mongoose;

  beforeAll(async () => {
    mongoClient = await connectDb();
  });

  afterAll(async () => {
    await mongoClient.connection.close();
  });

  afterEach(async () => {
    await mongoClient.connection.db.dropDatabase();
  });

  test("Get all users", async () => {
    const users = await userController.getUsers();

    expect(users.length).toBe(0);
  });
});
