import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";
// import { paginationQuerySchema } from "../validators/userValidator.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getUserFeed } from "../controllers/feedController.js";
import { feedQuerySchema } from "../validators/feedValidator.js";


const router=Router();


// router.get(
//     "/",
//     authenticate,
//     validate(paginationQuerySchema,"query"),
//     asyncHandler(getUserFeed)
// );

router.get(
    "/",
    authenticate,
    validate(feedQuerySchema,"query"),
    asyncHandler(getUserFeed)
);

export default router;