import config from "../config";
import AppError from "../Error/AppError";
import { TUserRole } from "../modules/user/user.interface";
import catchAsync from "../util/catchAsync";
import httpStatus from "http-status";
import Jwt, { JwtPayload } from "jsonwebtoken";

const authCheck = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const header = req.headers.authorization;

    if (!header) {
      return next(
        new AppError(
          httpStatus.UNAUTHORIZED,
          "Authorization header missing or malformed"
        )
      );
    }

    const token = header.split(" ")[1];

    let decoded: JwtPayload;
    try {
      decoded = Jwt.verify(token, config.jwt_secret as string) as JwtPayload;
    } catch (error) {
      return next(
        new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token")
      );
    }

    const { userRole } = decoded;

    if (requiredRoles.length && !requiredRoles.includes(userRole)) {
      return next(
        new AppError(
          httpStatus.UNAUTHORIZED,
          "You have no access to this route"
        )
      );
    }

    req.user = decoded;
    next();
  });
};

export default authCheck;
