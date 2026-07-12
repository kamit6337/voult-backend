import { toSecretResponse } from "./secret.mapper.js";
import { secretRepository } from "./secret.repository.js";
import { CreateSecretType } from "./secret.types.js";

class SecretService {
  async getByUserId(userId: string) {
    const results = await secretRepository.getByUserId(userId);
    return results;
  }

  async create(data: CreateSecretType) {
    const result = await secretRepository.create(data);
    return toSecretResponse(result);
  }
}

export const secretService = new SecretService();
