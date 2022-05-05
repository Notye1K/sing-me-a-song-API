import { prisma } from "../../src/database";

export async function create() {
  const result = await prisma.recommendation.upsert({
    where: { name: "Falamansa - Xote dos Milagres" },
    update: {},
    create: {
      name: "Falamansa - Xote dos Milagres",
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    },
    select: { id: true },
  });

  return result.id;
}
