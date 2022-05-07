import { jest } from "@jest/globals";

import { recommendationService } from "../../src/services/recommendationsService";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { deleteAll } from "../../src/services/testService";
import testRepository from "../../src/repositories/testRepository";

describe("insert", () => {
  it("when findByName return something should cause a throw", async () => {
    jest.spyOn(recommendationRepository, "findByName").mockResolvedValueOnce({
      id: 1,
      name: "11",
      youtubeLink: "55",
      score: 0,
    });

    const create = jest.spyOn(recommendationRepository, "create");

    const func = async () =>
      await recommendationService.insert({ name: "11", youtubeLink: "55" });

    await expect(func()).rejects.toThrowErrorMatchingSnapshot();
    expect(create).toBeCalledTimes(0);
  });
});

describe("downvote", () => {
  it("when score < -5 should remove recommentation", async () => {
    jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce({
      id: 1,
      name: "11",
      youtubeLink: "55",
      score: -6,
    });
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce({
      id: 1,
      name: "11",
      youtubeLink: "55",
      score: -6,
    });

    const remove = jest
      .spyOn(recommendationRepository, "remove")
      .mockResolvedValueOnce(null);
    await recommendationService.downvote(1);

    expect(remove).toBeCalledTimes(1);
    expect(remove).toBeCalledWith(1);
  });
});

describe("random", () => {
  it("when getByScore return empty array should cause a throw", async () => {
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([]);

    const func = async () => await recommendationService.getRandom();

    await expect(func()).rejects.toThrowErrorMatchingSnapshot();
  });

  it("lte", async () => {
    const find = jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce([
        { id: 1, name: "bla", score: 1, youtubeLink: "bla" },
      ]);
    jest.spyOn(Math, "random").mockReturnValue(0.8);
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce([
        { id: 1, name: "bla", score: 1, youtubeLink: "bla" },
      ]);
    const floor = jest.spyOn(Math, "floor");

    await recommendationService.getRandom();

    expect(floor).toBeCalledWith(0.8 * 1);
    expect(find).toBeCalledWith({
      score: 10,
      scoreFilter: "lte",
    });
  });

  it("gt", async () => {
    const find = jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce([
        { id: 1, name: "bla", score: 1, youtubeLink: "bla" },
      ]);
    jest.spyOn(Math, "random").mockReturnValue(0.8);
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce([
        { id: 1, name: "bla", score: 1, youtubeLink: "bla" },
      ]);
    const floor = jest.spyOn(Math, "floor");

    await recommendationService.getRandom();

    expect(floor).toBeCalledWith(0.8 * 1);
    expect(find).toBeCalledWith({
      score: 10,
      scoreFilter: "gt",
    });
  });
});

describe("testService", () => {
  it("testService", async () => {
    const truncate = jest
      .spyOn(testRepository, "truncate")
      .mockResolvedValueOnce(null);

    await deleteAll();

    expect(truncate).toBeCalledTimes(1);
  });
});
