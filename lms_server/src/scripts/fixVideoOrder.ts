/* eslint-disable no-console */
// One-off backfill: repairs Video.videoOrder values that were corrupted by the
// countDocuments-based assignment bug (see context/specs/01-fix-sequential-video-unlock-order.md).
// Run once via `ts-node src/scripts/fixVideoOrder.ts`, then delete this file.
import mongoose from "mongoose";
import config from "../app/config";
import { videoModel } from "../app/modules/VideoModule/video.model";

async function fixVideoOrder() {
  await mongoose.connect(config.database_url as string);

  const moduleIds = await videoModel.distinct("module", {
    isDeleted: false,
  });

  let modulesFixed = 0;
  let videosUpdated = 0;

  for (const moduleId of moduleIds) {
    const videos = await videoModel
      .find({ module: moduleId, isDeleted: false })
      .sort({ createdAt: 1 });

    let changed = false;

    for (let i = 0; i < videos.length; i++) {
      if (videos[i].videoOrder !== i) {
        videos[i].videoOrder = i;
        await videos[i].save();
        videosUpdated++;
        changed = true;
      }
    }

    if (changed) {
      modulesFixed++;
    }
  }

  console.log(
    `Done. ${modulesFixed} module(s) had out-of-order videos; ${videosUpdated} video(s) updated.`,
  );

  await mongoose.disconnect();
}

fixVideoOrder().catch((error) => {
  console.error(error);
  process.exit(1);
});
