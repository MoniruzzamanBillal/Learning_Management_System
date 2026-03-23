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
const SendImageCloudinary_1 = require("../../util/SendImageCloudinary");
const user_constants_1 = require("./user.constants");
const user_model_1 = require("./user.model");
// ! for getting all instructor
const getAllInstructor = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.userModel
        .find({
        userRole: user_constants_1.UserRole === null || user_constants_1.UserRole === void 0 ? void 0 : user_constants_1.UserRole.instructor,
        isDeleted: false,
    })
        .select(" _id name email profilePicture  ");
    return result;
});
// ! for changing password
const changePassword = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield user_model_1.userModel.findById(userId);
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User dont exist!!!");
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.oldPassword, userData === null || userData === void 0 ? void 0 : userData.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Password don't match !!");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload === null || payload === void 0 ? void 0 : payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const result = yield user_model_1.userModel.findByIdAndUpdate(userId, { password: hashedPassword, needsPasswordChange: false }, { new: true });
    return result;
    //
});
// ! for getting logged in user data
const getLoggedInUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.userModel
        .findById(userId)
        .select(" _id name profilePicture userRole createdAt email ");
    return result;
});
// ! for getting user based on user id
const getSpecificUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.userModel
        .findById(userId)
        .select(" _id name profilePicture userRole createdAt email ");
    return result;
});
// ! for updating a user
const updateUser = (payload, file, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (file) {
        const name = (payload === null || payload === void 0 ? void 0 : payload.name).trim();
        const path = (file === null || file === void 0 ? void 0 : file.path).trim();
        const cloudinaryResponse = yield (0, SendImageCloudinary_1.SendImageCloudinary)(path, name);
        const profilePicture = cloudinaryResponse === null || cloudinaryResponse === void 0 ? void 0 : cloudinaryResponse.secure_url;
        payload.profilePicture = profilePicture;
    }
    const result = yield user_model_1.userModel.findByIdAndUpdate(userId, payload, {
        new: true,
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
