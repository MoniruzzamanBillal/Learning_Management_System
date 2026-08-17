import httpStatus from "http-status";
import AppError from "../Error/AppError";
import config from "../config";
import catchAsync from "../util/catchAsync";

// ! verifies Vercel's own cron-invocation auth — the `Authorization: Bearer
// <CRON_SECRET>` header Vercel automatically sends on scheduled cron
// requests (per spec decision #7), not a user JWT / authCheck flow.
const verifyCronSecret = catchAsync(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!config.cron_secret || header !== `Bearer ${config.cron_secret}`) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized cron request");
  }

  next();
});

export default verifyCronSecret;
