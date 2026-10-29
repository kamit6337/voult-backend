import { AppError } from "@/shared/errors/app-error.js";
import { SecretModel } from "./secret.model.js";
import {
  CreateSecretType,
  Secret,
  SecretDocument,
  UpdateSecretRepoType,
} from "./secret.types.js";
import { decryptSecretValue } from "@/shared/utils/decryptSecretValue.js";
import mongoose from "mongoose";
import { toSecretResponse } from "./secret.mapper.js";
import { GetSecretByUserIdResponseType } from "./secret.response.js";
import { CursorZodSchemaType, SecretZodSchemaType } from "./secret.zod.js";

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
  ): Promise<GetSecretByUserIdResponseType> {
    if (!mongoose.isValidObjectId(userId)) {
      throw new AppError(404, "Invalid userId");
    }

    const query: mongoose.QueryFilter<Secret> = {
      userId,
    };

    if (cursor) {
      const date = new Date(cursor.createdAt);

      if (
        Number.isNaN(date.getTime()) ||
        !mongoose.isValidObjectId(cursor._id)
      ) {
        throw new AppError(404, "Invalid cursor");
      }

      query.$or = [
        {
          createdAt: { $lt: date },
        },
        {
          createdAt: date,
          _id: {
            $lt: new mongoose.Types.ObjectId(cursor._id),
          },
        },
      ];
    }

    const secrets = await SecretModel.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1);

    const hasNextPage = secrets.length > limit;

    const data = secrets.slice(0, limit);

    const lastProject = data.at(-1);

    const nextCursor =
      hasNextPage && lastProject
        ? {
            createdAt: lastProject.createdAt.toISOString(),
            _id: lastProject._id.toString(),
          }
        : null;

    // return decryptSecretValue(result);

    return {
      data: decryptSecretValue(data).map((i) => toSecretResponse(i)),
      nextCursor,
      hasNextPage,
    };
  }

  async getFavouriteByUserId(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const result = await SecretModel.find({
      userId,
      favourite: true,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return decryptSecretValue(result);
  }

  async getByProjectId(projectId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const result = await SecretModel.find({
      projectId,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return decryptSecretValue(result);
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
