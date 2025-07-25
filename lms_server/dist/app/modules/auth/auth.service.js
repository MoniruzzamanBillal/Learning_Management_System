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
const user_model_1 = require("../user/user.model");
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
    const result = yield user_model_1.userModel.create(Object.assign({}, payload));
    return result;
});
// ! for creating an instructor
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
    const result = yield user_model_1.userModel.create(Object.assign({}, payload));
    return result;
});
// ! for login
const signInFromDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userData = yield user_model_1.userModel.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User dont exist with this email !!!");
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.password, userData === null || userData === void 0 ? void 0 : userData.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Password don't match !!");
    }
    const userId = (_a = userData === null || userData === void 0 ? void 0 : userData._id) === null || _a === void 0 ? void 0 : _a.toHexString();
    const userRole = userData === null || userData === void 0 ? void 0 : userData.userRole;
    const jwtPayload = {
        userId,
        userRole,
        profileImage: userData === null || userData === void 0 ? void 0 : userData.profilePicture,
    };
    const token = (0, auth_util_1.createToken)(jwtPayload, config_1.default.jwt_secret);
    return { userData, token };
});
//
exports.authServices = {
    createUserIntoDB,
    signInFromDb,
    createInstructor,
};
