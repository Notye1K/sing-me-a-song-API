import { truncate } from "../repositories/testRepository.js";

export async function deleteAll() {
    await truncate()
}