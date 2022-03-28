const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects", async () => {
    const result = await request(app).get("/api/topics").expect(200);
    expect(result.body.topics).toBeInstanceOf(Array);
    result.body.topics.forEach((topic) => {
      expect(topic).toMatchObject({
        description: expect.any(String),
        slug: expect.any(String),
      });
    });
  });
  test("404: responds not found for invalid path", async () => {
    const result = await request(app).get("/api/notTopics").expect(404);
    expect(result.body.msg).toBe("Path not found");
  });
});

describe("GET api/articles/articleID", () => {
  test("200: responds with object containing correct properties", async () => {
    const result = await request(app).get("/api/articles/1").expect(200);
    expect(result.body.article).toMatchObject({
      author: expect.any(String),
      title: expect.any(String),
      article_id: expect.any(Number),
      body: expect.any(String),
      topic: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
    });
  });
  test("404: wrong article id", async () => {
    const result = await request(app).get("/api/articles/99995").expect(404);
    expect(result.body.msg).toBe("Path not found");
  });
});
