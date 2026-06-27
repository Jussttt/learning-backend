import { Router }
from "express";

import {
    getUserProfile,
    searchUsers,
    updateMyProfile
}
from "../controllers/userController.js";

import {
    authenticate
}
from "../../middleware/authenticate.js";

import {
    validate
}
from "../../middleware/validate.js";

import {
    asyncHandler
}
from "../../utils/asyncHandler.js";

import {
    paginationQuerySchema,
    searchUsersSchema,
    updateProfileSchema
}
from "../validators/userValidator.js";

import {
    follow,
    getFollowStats,
    unfollow
} from "../controllers/followController.js";

import {
    followParamsSchema
} from "../validators/followValidator.js";
import { getUserPosts, searchPosts } from "../controllers/postController.js";

import { userIdParamsSchema } from "../validators/userValidator.js";
import { searchPostsSchema } from "../validators/postValidator.js";


const router = Router();


router.patch(
    "/me",
    authenticate,
    validate(updateProfileSchema),
    asyncHandler(
        updateMyProfile
    )
);
router.get(
    "/search",
    validate(searchUsersSchema,"query"),
    asyncHandler(searchUsers)
);

router.post(
    "/:userId/follow",
    authenticate,
    validate(
        followParamsSchema,
        "params"
    ),
    asyncHandler(follow)
);

router.delete(
    "/:userId/follow",
    authenticate,
    validate(
        followParamsSchema,
        "params"
    ),
    asyncHandler(unfollow)

);



router.get(
    "/:userId/follow-stats",
    validate(
        followParamsSchema,
        "params"
    ),
    asyncHandler(getFollowStats)

);

router.get(
    "/:userId/posts",
    validate(
        userIdParamsSchema,
        "params"
    ),
    validate(
        paginationQuerySchema,
        "query"
    ),
    asyncHandler(getUserPosts)
);



router.get(
    "/:userId",
    validate(userIdParamsSchema,"params"),
    asyncHandler(
        getUserProfile
    )

);







export default router;