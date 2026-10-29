import { toSecretResponse } from "./secret.mapper.js";
import { secretRepository } from "./secret.repository.js";
import { GetSecretByUserIdResponseType } from "./secret.response.js";
import { CreateSecretType, UpdateSecretRepoType } from "./secret.types.js";
import { CursorZodSchemaType, SecretZodSchemaType } from "./secret.zod.js";

class SecretService {
  async getByUserId(
    userId: string,
    cursor: CursorZodSchemaType | null,
  ): Promise<GetSecretByUserIdResponseType> {
    const results = await secretRepository.getByUserId(userId, cursor);
    return results;
  }

  async getByProjectId(projectId: string) {
    const results = await secretRepository.getByProjectId(projectId);
    return results.map((i) => toSecretResponse(i));
  }

  async create(data: CreateSecretType): Promise<SecretZodSchemaType> {
    const result = await secretRepository.create(data);
    return result;
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

    console.log("result", result);

    if (!result) throw new Error("Issue in deleting. Please try later");

    return "Successfully Deleted";
  }
}

export const secretService = new SecretService();
