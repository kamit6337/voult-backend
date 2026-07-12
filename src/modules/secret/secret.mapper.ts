import { SecretDocument } from "./secret.types.js";
import { SecretZodSchemaType } from "./secret.zod.js";

export const toSecretResponse = (
  secret: SecretDocument,
): SecretZodSchemaType => ({
  _id: secret._id.toString(),
  userId: secret.userId.toString(),
  name: secret.name,
  value: secret.value,
  favourite: secret.favourite,
  projectId: secret.projectId ? secret.projectId.toString() : undefined,
  createdAt: secret.createdAt,
  updatedAt: secret.updatedAt,
});
