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
  test("400: responds bad request for invalid path", async () => {
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
    expect(result.body.msg).toBe("Article not found");
  });
  test("400: responds bad request for article ID not an integer", async () => {
    const result = await request(app)
      .get("/api/articles/anArticle")
      .expect(400);
    expect(result.body.msg).toBe("Bad request");
  });
});

describe("GET /api/users", () => {
  test("200: responds with array of users", async () => {
    const result = await request(app).get("/api/users").expect(200);
    expect(result.body.users).toBeInstanceOf(Array);
    result.body.users.forEach((user) => {
      expect(user).toMatchObject({ username: expect.any(String) });
    });
  });
  test("400: responds bad request for invalid path", async () => {
    const result = await request(app).get("/api/notUsers").expect(400);
    expect(result.body.msg).toBe("Bad request");
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: updates article votes and returns updated obj", async () => {
    const result = await request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: 5 })
      .expect(200);
    expect(result.body).toEqual({
      updatedArticle: {
        article_id: 2,
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: "2020-10-16T05:03:00.000Z",
        votes: 5,
      },
    });
  });
  test("400: empty patch object returns bad request", async () => {
    const result = await request(app)
      .patch("/api/articles/2")
      .send({})
      .expect(400);
    expect(result.body.msg).toEqual("Bad request: missing vote increment");
  });
  test("404: incorrect valid article id", async () => {
    const result = await request(app)
      .patch("/api/articles/99995")
      .send({ inc_votes: 7 })
      .expect(404);
    expect(result.body.msg).toBe("Resource not found");
  });
  test("400: wrong article id type", async () => {
    const result = await request(app)
      .patch("/api/articles/notNumber")
      .send({ inc_votes: 2 })
      .expect(400);
    expect(result.body.msg).toBe("Bad request");
  });
  test("400: invalid vote_inc type", async () => {
    const result = await request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "cheese" })
      .expect(400);

    expect(result.body.msg).toBe("Bad request");
  });
});
