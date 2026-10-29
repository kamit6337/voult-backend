import mongoose from "mongoose";
import { Secret } from "./secret.types.js";
import { CursorZodSchemaType } from "./secret.zod.js";
import { AppError } from "@/shared/errors/app-error.js";
import { SecretModel } from "./secret.model.js";
import { decryptSecretValue } from "@/shared/utils/decryptSecretValue.js";
import { toSecretResponse } from "./secret.mapper.js";
import { GetSecretByUserIdResponseType } from "./secret.response.js";

export const secretPaginatedQuery = async (
  query: mongoose.QueryFilter<Secret>,
  cursor: CursorZodSchemaType | null,
  limit = 5,
): Promise<GetSecretByUserIdResponseType> => {
  //  const query: mongoose.QueryFilter<Secret> = {
  //       userId,
  //     };

  if (cursor) {
    const date = new Date(cursor.createdAt);

    if (Number.isNaN(date.getTime()) || !mongoose.isValidObjectId(cursor._id)) {
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

  return {
    data: decryptSecretValue(data).map((i) => toSecretResponse(i)),
    nextCursor,
    hasNextPage,
  };
};
