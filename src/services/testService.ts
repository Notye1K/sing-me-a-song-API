import testRepository from "../repositories/testRepository.js";

export async function deleteAll() {
  await testRepository.truncate();
}
