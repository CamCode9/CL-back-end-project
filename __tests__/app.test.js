const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

afterAll(() => db.end());
beforeEach(() => {
  return seed(testData);
});

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
    const result = await request(app).get("/api/notTopics").expect(400);
    expect(result.body.msg).toBe("Bad request");
  });
});

describe("GET api/articles/articleID", () => {
  test("200: responds with object containing correct properties", async () => {
    const result = await request(app).get("/api/articles/1").expect(200);
    expect(result.body.article).toMatchObject({
      author: expect.any(String),
      title: expect.any(String),
      article_id: 1,
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
  test("400: responds bad request for article ID not an integer", async () => {
    const result = await request(app)
      .get("/api/articles/anArticle")
      .expect(400);
    expect(result.body.msg).toBe("Bad request");
  });
});
