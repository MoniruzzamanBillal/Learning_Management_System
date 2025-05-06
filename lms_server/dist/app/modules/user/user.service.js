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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
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
//
exports.userServices = {
    getAllInstructor,
};
