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
exports.authServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const SendImageCloudinary_1 = require("../../util/SendImageCloudinary");
const prisma_1 = __importDefault(require("../../util/prisma"));
const auth_util_1 = require("./auth.util");
// ! crate user
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createUserIntoDB = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    if (file) {
        const name = (payload === null || payload === void 0 ? void 0 : payload.name).trim();
        const path = (file === null || file === void 0 ? void 0 : file.path).trim();
        const cloudinaryResponse = yield (0, SendImageCloudinary_1.SendImageCloudinary)(path, name);
        const profilePicture = cloudinaryResponse === null || cloudinaryResponse === void 0 ? void 0 : cloudinaryResponse.secure_url;
        payload.profilePicture = profilePicture;
    }
    // No Mongoose pre("save") hook in Prisma — hash explicitly.
    const hashedPassword = yield bcrypt_1.default.hash(payload === null || payload === void 0 ? void 0 : payload.password, Number(config_1.default.bcrypt_salt_rounds));
    const result = yield prisma_1.default.user.create({
        data: Object.assign(Object.assign({}, payload), { password: hashedPassword }),
    });
    return result;
});
// ! for creating an instructor
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createInstructor = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    if (file) {
        const name = (payload === null || payload === void 0 ? void 0 : payload.name).trim();
        const path = (file === null || file === void 0 ? void 0 : file.path).trim();
        const cloudinaryResponse = yield (0, SendImageCloudinary_1.SendImageCloudinary)(path, name);
        const profilePicture = cloudinaryResponse === null || cloudinaryResponse === void 0 ? void 0 : cloudinaryResponse.secure_url;
        payload.profilePicture = profilePicture;
    }
    payload.password = "123456";
    payload.needsPasswordChange = true;
    // No Mongoose pre("save") hook in Prisma — hash explicitly (preserves
    // existing behavior exactly: the hardcoded default password is still
    // stored hashed, same as the old pre-save hook did).
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, Number(config_1.default.bcrypt_salt_rounds));
    const result = yield prisma_1.default.user.create({
        data: Object.assign(Object.assign({}, payload), { password: hashedPassword }),
    });
    return result;
});
// ! for login
const signInFromDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // findFirst, not findUnique: combining the unique `email` lookup with
    // `isDeleted: false` isn't allowed on findUnique.
    const userData = yield prisma_1.default.user.findFirst({
        where: { email: payload === null || payload === void 0 ? void 0 : payload.email, isDeleted: false },
    });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User dont exist with this email !!!");
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.password, userData === null || userData === void 0 ? void 0 : userData.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Password don't match !!");
    }
    const userId = userData.id;
    const userRole = userData.userRole;
    const jwtPayload = {
        userId,
        userRole,
        profileImage: userData === null || userData === void 0 ? void 0 : userData.profilePicture,
    };
    const token = (0, auth_util_1.createToken)(jwtPayload, config_1.default.jwt_secret);
    return { userData, token };
});
// ! for update password
const updatePassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findFirst({
        where: { email: payload === null || payload === void 0 ? void 0 : payload.email, isDeleted: false },
    });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User dont exist with this email !!!");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload === null || payload === void 0 ? void 0 : payload.password, Number(config_1.default.bcrypt_salt_rounds));
    yield prisma_1.default.user.update({
        where: { id: userData.id },
        data: { password: hashedPassword },
    });
});
//
exports.authServices = {
    createUserIntoDB,
    signInFromDb,
    createInstructor,
    updatePassword,
};
