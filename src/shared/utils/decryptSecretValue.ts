import { decrypt } from "./encrypt.js";

type HasValue = {
  value: string;
};

export function decryptSecretValue<T extends HasValue>(secret: T): T;
export function decryptSecretValue<T extends HasValue>(secrets: T[]): T[];

export function decryptSecretValue<T extends HasValue>(data: T | T[]): T | T[] {
  if (Array.isArray(data)) {
    return data.map((secret) => {
      secret.value = decrypt<string>(secret.value);
      return secret;
    });
  }

  data.value = decrypt<string>(data.value);
  return data;
}
