import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

// ! for getting all instructors
router.get("/get-instructors", userController.getAllInstructor);

//
export const userRouter = router;
