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
exports.userServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const prisma_1 = __importDefault(require("../../util/prisma"));
const SendImageCloudinary_1 = require("../../util/SendImageCloudinary");
const enums_1 = require("../../../generated/prisma/enums");
// ! for getting all instructor
const getAllInstructor = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findMany({
        where: {
            userRole: enums_1.UserRole.instructor,
            isDeleted: false,
        },
        select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
        },
    });
    return result;
});
// ! for changing password
const changePassword = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // findFirst, not findUnique: combining the unique `id` lookup with
    // `isDeleted: false` isn't allowed on findUnique.
    const userData = yield prisma_1.default.user.findFirst({
        where: { id: userId, isDeleted: false },
    });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User dont exist!!!");
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.oldPassword, userData === null || userData === void 0 ? void 0 : userData.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Password don't match !!");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload === null || payload === void 0 ? void 0 : payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const result = yield prisma_1.default.user.update({
        where: { id: userId },
        data: { password: hashedPassword, needsPasswordChange: false },
    });
    return result;
    //
});
// ! for getting logged in user data
const getLoggedInUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findFirst({
        where: { id: userId, isDeleted: false },
        select: {
            id: true,
            name: true,
            profilePicture: true,
            userRole: true,
            createdAt: true,
            email: true,
        },
    });
    return result;
});
// ! for getting user based on user id
const getSpecificUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findFirst({
        where: { id: userId, isDeleted: false },
        select: {
            id: true,
            name: true,
            profilePicture: true,
            userRole: true,
            createdAt: true,
            email: true,
        },
    });
    return result;
});
// ! for updating a user
const updateUser = (payload, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
file, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (file) {
        const name = (payload === null || payload === void 0 ? void 0 : payload.name).trim();
        const path = (file === null || file === void 0 ? void 0 : file.path).trim();
        const cloudinaryResponse = yield (0, SendImageCloudinary_1.SendImageCloudinary)(path, name);
        const profilePicture = cloudinaryResponse === null || cloudinaryResponse === void 0 ? void 0 : cloudinaryResponse.secure_url;
        payload.profilePicture = profilePicture;
    }
    const result = yield prisma_1.default.user.update({
        where: { id: userId },
        data: payload,
    });
    return result;
});
//
exports.userServices = {
    getAllInstructor,
    changePassword,
    getLoggedInUser,
    getSpecificUser,
    updateUser,
};
