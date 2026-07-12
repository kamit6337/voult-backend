import jwt from "jsonwebtoken";
import ms from "ms";

type Options = {
  secret: string;
  expiresIn: number | ms.StringValue;
};

class JWT_Encryption {
  sign(payload: string | object, options: Options) {
    return jwt.sign(payload, options.secret, {
      expiresIn: options.expiresIn,
    });
  }

  verify<T>(token: string, options: Pick<Options, "secret">) {
    return jwt.verify(token, options.secret) as T;
  }
}

export const jwtEncrypt = new JWT_Encryption();
