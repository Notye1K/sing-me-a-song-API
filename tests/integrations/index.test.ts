import app from "../../src/app";
import supertest from "supertest";
import { prisma } from "../../src/database";
import { create } from "../factories/integrationFactory";

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
});

describe("POST /recommendations", () => {
  it("should a valid body should return 201 ", async () => {
    const body = {
      name: "Falamansa - Xote dos Milagres",
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };

    const result = await supertest(app).post("/recommendations").send(body);

    expect(result.statusCode).toEqual(201);

    const reco = await prisma.recommendation.findMany();

    expect(reco.length).toEqual(1);
  });

  it("should a invalid body should return 422", async () => {
    const result = await supertest(app).post("/recommendations").send({});

    expect(result.statusCode).toEqual(422);

    const reco = await prisma.recommendation.findMany();

    expect(reco.length).toEqual(0);
  });
});

describe("POST /:id/upvote", () => {
  it("should a valid id return 200 and inc score", async () => {
    const id = await create();

    const result = await supertest(app)
      .post(`/recommendations/${id}/upvote`)
      .send({});

    const { score } = await prisma.recommendation.findUnique({
      where: { id },
    });

    expect(result.statusCode).toBe(200);
    expect(score).toEqual(1);
  });

  it("should a invalid id return 404", async () => {
    const result = await supertest(app)
      .post(`/recommendations/-1/upvote`)
      .send({});

    expect(result.statusCode).toBe(404);
  });
});

describe("POST /:id/downvote", () => {
  it("should a valid id return 200 and decrement score", async () => {
    const id = await create();

    const result = await supertest(app)
      .post(`/recommendations/${id}/downvote`)
      .send({});

    const { score } = await prisma.recommendation.findUnique({
      where: { id },
    });

    expect(result.statusCode).toBe(200);
    expect(score).toEqual(-1);
  });

  it("should a invalid id return 404", async () => {
    const result = await supertest(app)
      .post(`/recommendations/-1/downvote`)
      .send({});

    expect(result.statusCode).toBe(404);
  });
});

describe("GET /recommendations", () => {
  it("should return 1 array", async () => {
    await create();

    const result = await supertest(app).get("/recommendations");

    expect(result.body.length).toBe(1);
    expect(result.statusCode).toBe(200);
  });
});

describe("GET /:id", () => {
  it("should a valid id return 1 object", async () => {
    const id = await create();

    const result = await supertest(app).get(`/recommendations/${id}`);

    expect(typeof result.body).toBe("object");
    expect(result.statusCode).toBe(200);
  });

  //   it("should a invalid id return 404", async () => {
  //       const result = await supertest(app).get(`/recommendations/-1`);

  //       expect(result.statusCode).toBe(404);
  //   })
});

describe("GET /recommendations/random", () => {
  it("should return 1 object", async () => {
    await create();

    const result = await supertest(app).get("/recommendations/random");

    expect(typeof result.body).toBe("object");
    expect(result.statusCode).toBe(200);
  });
});

describe("GET /recommendations/top/:amount", () => {
  it("should a valid amount return 1 object", async () => {
    await create();

    const result = await supertest(app).get("/recommendations/top/2");

    expect(result.body.length).toBe(1);
    expect(result.statusCode).toBe(200);
  });

  //   it("should a invalid amount return 404", async () => {

  //       const result = await supertest(app).get(`/recommendations/top/aaa`);

  //       expect(result.statusCode).toBe(404);
  //   })
});
