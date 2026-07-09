"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
// One-off backfill: repairs Video.videoOrder values that were corrupted by the
// countDocuments-based assignment bug (see context/specs/01-fix-sequential-video-unlock-order.md).
// Run once via `ts-node src/scripts/fixVideoOrder.ts`, then delete this file.
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../app/config"));
const video_model_1 = require("../app/modules/VideoModule/video.model");
function fixVideoOrder() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(config_1.default.database_url);
        const moduleIds = yield video_model_1.videoModel.distinct("module", {
            isDeleted: false,
        });
        let modulesFixed = 0;
        let videosUpdated = 0;
        for (const moduleId of moduleIds) {
            const videos = yield video_model_1.videoModel
                .find({ module: moduleId, isDeleted: false })
                .sort({ createdAt: 1 });
            let changed = false;
            for (let i = 0; i < videos.length; i++) {
                if (videos[i].videoOrder !== i) {
                    videos[i].videoOrder = i;
                    yield videos[i].save();
                    videosUpdated++;
                    changed = true;
                }
            }
            if (changed) {
                modulesFixed++;
            }
        }
        console.log(`Done. ${modulesFixed} module(s) had out-of-order videos; ${videosUpdated} video(s) updated.`);
        yield mongoose_1.default.disconnect();
    });
}
fixVideoOrder().catch((error) => {
    console.error(error);
    process.exit(1);
});
