import { AppError } from "@/shared/errors/app-error.js";
import { SecretModel } from "./secret.model.js";
import {
  CreateSecretType,
  Secret,
  UpdateSecretRepoType,
} from "./secret.types.js";
import { decryptSecretValue } from "@/shared/utils/decryptSecretValue.js";
import mongoose from "mongoose";
import { toSecretResponse } from "./secret.mapper.js";
import { GetSecretByPaginationResponseType } from "./secret.response.js";
import { CursorZodSchemaType, SecretZodSchemaType } from "./secret.zod.js";
import { secretPaginatedQuery } from "./secret.function.js";

class SecretRepository {
  async create(data: CreateSecretType): Promise<SecretZodSchemaType> {
    const secret = await SecretModel.create({
      userId: data.userId,
      projectId: data.projectId,
      name: data.name,
      value: data.value,
      favourite: data.favourite,
    });

    const decryptValue = decryptSecretValue(secret);
    return toSecretResponse(decryptValue);
  }

  async getByUserId(
    userId: string,
    cursor: CursorZodSchemaType | null,
    limit = 5,
  ): Promise<GetSecretByPaginationResponseType> {
    if (!mongoose.isValidObjectId(userId)) {
      throw new AppError(404, "Invalid userId");
    }

    const query: mongoose.QueryFilter<Secret> = {
      userId,
    };

    const result = await secretPaginatedQuery(query, cursor, limit);
    return result;
  }

  async getFavouriteByUserId(
    userId: string,
    cursor: CursorZodSchemaType | null,
    limit = 5,
  ): Promise<GetSecretByPaginationResponseType> {
    if (!mongoose.isValidObjectId(userId)) {
      throw new AppError(404, "Invalid userId");
    }

    const query: mongoose.QueryFilter<Secret> = {
      userId,
      favourite: true,
    };

    const result = await secretPaginatedQuery(query, cursor, limit);
    return result;
  }

  async getByProjectId(
    projectId: string,
    cursor: CursorZodSchemaType | null,
    limit = 5,
  ): Promise<GetSecretByPaginationResponseType> {
    if (!mongoose.isValidObjectId(projectId)) {
      throw new AppError(404, "Invalid projectId");
    }

    const query: mongoose.QueryFilter<Secret> = {
      projectId,
    };

    const result = await secretPaginatedQuery(query, cursor, limit);
    return result;
  }

  async updateSingle(data: UpdateSecretRepoType) {
    const secret = await SecretModel.findOne({
      _id: data._id,
    });

    if (!secret) {
      throw new AppError(500, "Wrong UserId is provided");
    }

    secret.name = data.name;
    secret.value = data.value;
    secret.favourite = data.favourite;
    secret.projectId = data.projectId;

    await secret.save();

    return decryptSecretValue(secret);
  }

  async updateFavourite(secretId: string, bool: boolean) {
    const secret = await SecretModel.findOneAndUpdate(
      {
        _id: secretId,
      },
      {
        favourite: bool,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!secret) {
      throw new AppError(500, "Wrong UserId is provided");
    }

    return decryptSecretValue(secret);
  }

  async updateSecretsProjectId(secretIds: string[], projectId: string) {
    return SecretModel.updateMany(
      {
        _id: { $in: { secretIds } },
      },
      {
        projectId,
      },
    );
  }

  async deleteSecret(secretId: string) {
    console.log("secretId", secretId);

    if (!secretId) throw new Error("SecretId is missing");

    return SecretModel.findOneAndDelete({
      _id: secretId,
    });
  }
}

export const secretRepository = new SecretRepository();
