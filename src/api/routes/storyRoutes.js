import {Router} from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";
import { createStorySchema,storyIdParamsSchema } from "../validators/storyValidator.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createStory,getStoryFeed,getStoryViewers,viewStory } from "../controllers/storyController.js";

const router=Router();

router.post(
    "/",
    authenticate,
    validate(createStorySchema),
    asyncHandler(createStory)
);

router.get(
    "/feed",
    authenticate,
    asyncHandler(
        getStoryFeed
    )
);

router.post(
    "/:storyId/view",
    authenticate,
    validate(
        storyIdParamsSchema,
        "params"
    ),
    asyncHandler(
        viewStory
    )
);

router.get(
    "/:storyId/viewers",
    authenticate,
    validate(
        storyIdParamsSchema,
        "params"
    ),
    asyncHandler(getStoryViewers)
);
export default router;