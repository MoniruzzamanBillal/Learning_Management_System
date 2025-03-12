import JwtPayload from "jsonwebtoken";

export const createToken = (
  payload: { userId: string; userRole: string },
  secret: string,
  expire: string
) => {
  return JwtPayload.sign(payload, secret, { expiresIn: expire });
};
