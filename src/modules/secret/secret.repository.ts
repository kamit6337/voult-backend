import { AppError } from "@/shared/errors/app-error.js";
import { SecretModel } from "./secret.model.js";
import { CreateSecretType, UpdateSecretRepoType } from "./secret.types.js";
import { decryptSecretValue } from "@/shared/utils/decryptSecretValue.js";

class SecretRepository {
  async create(data: CreateSecretType) {
    const secret = await SecretModel.create({
      userId: data.userId,
      projectId: data.projectId,
      name: data.name,
      value: data.value,
      favourite: data.favourite,
    });

    return decryptSecretValue(secret);
  }

  async getByUserId(userId: string, page = 1, limit = 30) {
    const skip = (page - 1) * limit;

    const result = await SecretModel.find({
      userId,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return decryptSecretValue(result);
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
}

export const secretRepository = new SecretRepository();
