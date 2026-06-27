import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";
import { notificationQuerySchema } from "../validators/notificationValidator.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getNotifications, markNotificationRead } from "../controllers/notificationController.js";
import { notificationParamsSchema } from "../validators/notificationValidator.js";
import { markNotificationRead as markNotificationReadController } from "../controllers/notificationController.js";
import { getUnreadCount as getUnreadCountController } from "../controllers/notificationController.js";


const router=Router();

router.get(
    "/",
    authenticate,
    validate(
        notificationQuerySchema,
        "query"
    ),
    asyncHandler(
        getNotifications
    )
);

router.get(
    "/unread-count",
    authenticate,
    asyncHandler(
        getUnreadCountController
    )
);
router.patch(
    "/:notificationId/read",
    authenticate,
    validate(
        notificationParamsSchema,
        "params"
    ),
    asyncHandler(
        markNotificationReadController
    )
);
export default router;