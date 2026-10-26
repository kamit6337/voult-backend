import { toSecretResponse } from "./secret.mapper.js";
import { secretRepository } from "./secret.repository.js";
import { CreateSecretType, UpdateSecretRepoType } from "./secret.types.js";

class SecretService {
  async getByUserId(userId: string) {
    const results = await secretRepository.getByUserId(userId);
    return results;
  }

  async create(data: CreateSecretType) {
    const result = await secretRepository.create(data);
    return toSecretResponse(result);
  }

  async updateValue(data: UpdateSecretRepoType) {
    const result = await secretRepository.updateSingle(data);
    return toSecretResponse(result);
  }

  async updateFavourite(secretId: string, bool: boolean) {
    const result = await secretRepository.updateFavourite(secretId, bool);

    return toSecretResponse(result);
  }

  async deleteSecret(secretId: string) {
    const result = await secretRepository.deleteSecret(secretId);

    return "Successfully Deleted";
  }
}

export const secretService = new SecretService();
