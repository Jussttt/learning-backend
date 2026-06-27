import {Router} from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";
import { createPostSchema, postIdParamsSchema } from "../validators/postValidator.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createPost, getPost, removePost } from "../controllers/postController.js";
import { getLikeCount,like,unlike } from "../controllers/likeController.js";
import { createComment,getComments,getCommentCount } from "../controllers/commentController.js";
import { commentIdParamsSchema, createCommentSchema } from "../validators/commentValidator.js";
import { searchPostsSchema } from "../validators/postValidator.js";
import { searchPosts } from "../controllers/postController.js";

const router=Router();

router.post(
    "/",
    authenticate,
    validate(createPostSchema),
    asyncHandler(createPost)
);
router.get(
    "/search",
    validate(
        searchPostsSchema,
        "query"
    ),
    asyncHandler(
        searchPosts
    )
);
router.get(
    "/:postId",
    validate(
        postIdParamsSchema,
        "params"
    ),
    asyncHandler(getPost)
);

router.delete(
    "/:postId",
    authenticate,
    validate(
        postIdParamsSchema,
        "params"
    ),
    asyncHandler(removePost)
);

router.post(
    "/:postId/like",
    authenticate,
    validate(
        postIdParamsSchema,
        "params"
    ),
    asyncHandler(like)
);
router.delete(
    "/:postId/like",
    authenticate,
    validate(
        postIdParamsSchema,
        "params"
    ),
    asyncHandler(unlike)
);


router.get(
    "/:postId/like-count",
    validate(
        postIdParamsSchema,
        "params"
    ),
    asyncHandler(getLikeCount)
);
router.post(
    "/:postId/comments",
    authenticate,
    validate(postIdParamsSchema,"params"),
    validate(
        createCommentSchema
    ),
    asyncHandler(createComment)
);

router.get(
    "/:postId/comments",
    validate(postIdParamsSchema,"params"),
    asyncHandler(getComments)
);

router.get(
    "/:postId/comment-count",
    validate(
        postIdParamsSchema,
        "params"
    ),
    asyncHandler(
        getCommentCount
    )
);



export default router;