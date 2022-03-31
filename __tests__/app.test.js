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

//updated test to reflect comment count
describe("GET api/articles/articleID with COMMENT COUNT", () => {
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
      comment_count: expect.any(Number),
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

//updated test to reflect additional query info
describe("GET /api/users", () => {
  test("200: responds with array of users", async () => {
    const result = await request(app).get("/api/users").expect(200);
    expect(result.body.users).toBeInstanceOf(Array);
    expect(result.body.users.length).toBe(4);
    result.body.users.forEach((user) => {
      expect(user).toMatchObject({ username: expect.any(String) });
    });
  });
  test("400: responds bad request for invalid path", async () => {
    const result = await request(app).get("/api/notUsers").expect(400);
    expect(result.body.msg).toBe("Bad request");
  });
});

describe("GET /api/articles", () => {
  test("200: returns array of objects including comment count", async () => {
    const result = await request(app).get("/api/articles").expect(200);
    expect(result.body.articles).toBeInstanceOf(Array);
    result.body.articles.forEach((article) => {
      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        comment_count: expect.any(Number),
      });
    });
    expect(result.body.articles).toBeSortedBy("created_at", {
      descending: true,
    });
  });
  test("400: responds bad request for invalid path", async () => {
    const result = await request(app).get("/api/notArticles").expect(400);
    expect(result.body.msg).toBe("Bad request");
  });
  //new tests below
  test("200: returns array sorted by valid column", async () => {
    const result = await request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200);
    expect(result.body.articles).toBeSortedBy("votes", { descending: true });
  });
  test("400: invalid sort_by returns bad req", async () => {
    const result = await request(app)
      .get("/api/articles?sort_by=darts")
      .expect(400);
    expect(result.body.msg).toBe("Invalid query");
  });
  test("200: returns array sorted by valid column in order", async () => {
    const result = await request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200);
    expect(result.body.articles).toBeSortedBy("votes");
  });
  test("400: invalid order returns bad req", async () => {
    const result = await request(app).get("/api/articles?order=up").expect(400);
    expect(result.body.msg).toBe("Invalid query");
  });
  test("200: returns array of one topic query", async () => {
    const result = await request(app)
      .get("/api/articles?topic=cats")
      .expect(200);
    expect(result.body.articles[0].topic).toBe("cats");
  });
  test("400: returns bad request for invalid topic", async () => {
    const result = await request(app)
      .get("/api/articles?topic=flaps")
      .expect(400);
  });
  test("200: returns array of objects with all correct queries", async () => {
    const result = await request(app)
      .get("/api/articles?sort_by=votes&order=asc&topic=mitch")
      .expect(200);
    expect(result.body.articles).toBeInstanceOf(Array);
    result.body.articles.forEach((article) => {
      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        body: expect.any(String),
        topic: "mitch",
        created_at: expect.any(String),
        votes: expect.any(Number),
        comment_count: expect.any(Number),
      });
    });
    expect(result.body.articles).toBeSortedBy("votes");
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with array of all comments", async () => {
    const result = await request(app)
      .get("/api/articles/1/comments")
      .expect(200);
    expect(result.body.comments).toBeInstanceOf(Array);
    result.body.comments.forEach((comment) => {
      expect(comment).toMatchObject({
        comment_id: expect.any(Number),
        votes: expect.any(Number),
        created_at: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
      });
    });
  });
  test("404: wrong article id", async () => {
    const result = await request(app)
      .get("/api/articles/99995/comments")
      .expect(404);
    expect(result.body.msg).toBe("Resource not found");
  });
  test("400: responds bad request for article ID not an integer", async () => {
    const result = await request(app)
      .get("/api/articles/anArticle/comments")
      .expect(400);
    expect(result.body.msg).toBe("Bad request");
  });
  test("200: responds with empty array for valid article w no comments", async () => {
    const result = await request(app)
      .get("/api/articles/2/comments")
      .expect(200);
    expect(result.body.comments).toBeInstanceOf(Array);
    expect(result.body.comments).toEqual([]);
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: succeessfully posts comment and responds w comment", async () => {
    const result = await request(app)
      .post("/api/articles/2/comments")
      .send({ username: "butter_bridge", body: "Up the blues" })
      .expect(201);
    expect(result.body.new_comment).toEqual({
      article_id: 2,
      author: "butter_bridge",
      body: "Up the blues",
      comment_id: expect.any(Number),
      created_at: expect.any(String),
      votes: 0,
    });
  });
  test("400: invalid article id", async () => {
    const result = await request(app)
      .post("/api/articles/NOTNUMBER/comments")
      .send({ username: "butter_bridge", body: "Up the blues" })
      .expect(400);
    expect(result.body.msg).toBe("Bad request");
  });
  test("404: article id not found", async () => {
    const result = await request(app)
      .post("/api/articles/8080/comments")
      .send({ username: "butter_bridge", body: "Up the blues" })
      .expect(404);
    expect(result.body.msg).toBe("Resource not found");
  });
  test("404: user not found", async () => {
    const result = await request(app)
      .post("/api/articles/2/comments")
      .send({ username: "Phil the power Taylor", body: "Up the blues" })
      .expect(404);
    expect(result.body.msg).toBe("Resource not found");
  });
  test("400: invalid username type (user not found)", async () => {
    const result = await request(app)
      .post("/api/articles/2/comments")
      .send({ username: ["secret"], body: "Up the blues" })
      .expect(400);
    expect(result.body.msg).toBe("Invalid data type");
  });
  test("400: invalid body type", async () => {
    const result = await request(app)
      .post("/api/articles/2/comments")
      .send({ username: "butter_bridge", body: 55939 })
      .expect(400);
    expect(result.body.msg).toBe("Invalid data type");
  });
});

describe("DELETE /api/comments/comment_id", () => {
  test("204: response with no content - successful delete", async () => {
    const result = await request(app).delete("/api/comments/1").expect(204);
  });
  test("404: not found for valid non existent comment", async () => {
    const result = await request(app)
      .delete("/api/comments/100000")
      .expect(404);
    expect(result.body.msg).toBe("Resource not found");
  });
  test("400: bad request for non valid commment id", async () => {
    const result = await request(app)
      .delete("/api/comments/notNumber")
      .expect(400);
    expect(result.body.msg).toBe("Bad request");
  });
});
