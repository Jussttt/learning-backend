import { Router } from "express";

import { login, signup } from "../controllers/authController.js";

import { validate } from "../../middleware/validate.js";

import { loginschema, signupSchema } from "../validators/authValidators.js"; 
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middleware/authenticate.js";
import { me } from "../controllers/authController.js";
import { loadCurrentUser } from "../../middleware/loadCurrentUser.js";
import { rateLimit } from "../../middleware/rateLimit.js";
import { RateLimits } from "../../constants/rateLimitKeys.js";

const router=Router();

router.post(
    "/signup",
    validate(signupSchema),
    asyncHandler(signup)

);

router.post(
    "/login",
    rateLimit(
        RateLimits.LOGIN
    ),
    validate(loginschema),
    asyncHandler(login)
);


router.get(
    "/me",
    authenticate,
    loadCurrentUser,
    asyncHandler(me)
);

export default router;