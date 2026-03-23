"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainRouter = void 0;
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const course_routes_1 = require("../modules/course/course.routes");
const CourseEnrollment_routes_1 = require("../modules/CourseEnrollment/CourseEnrollment.routes");
const module_routes_1 = require("../modules/courseModule/module.routes");
const payment_routes_1 = require("../modules/payment/payment.routes");
const review_route_1 = require("../modules/review/review.route");
const user_route_1 = require("../modules/user/user.route");
const video_routes_1 = require("../modules/VideoModule/video.routes");
const router = (0, express_1.Router)();
const routeArray = [
    {
        path: "/user",
        route: user_route_1.userRouter,
    },
    {
        path: "/auth",
        route: auth_route_1.authRouter,
    },
    {
        path: "/course",
        route: course_routes_1.courseRouter,
    },
    {
        path: "/module",
        route: module_routes_1.moduleRouter,
    },
    {
        path: "/video",
        route: video_routes_1.videoRouter,
    },
    {
        path: "/enroll",
        route: CourseEnrollment_routes_1.courseEnrollmentRouter,
    },
    {
        path: "/payment",
        route: payment_routes_1.paymentRoute,
    },
    {
        path: "/review",
        route: review_route_1.reviewRouter,
    },
];
routeArray.forEach((item) => {
    router.use(item.path, item.route);
});
exports.MainRouter = router;
