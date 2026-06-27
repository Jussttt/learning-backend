import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getReadUrl } from "../controllers/uploadController.js";
import { validate } from "../../middleware/validate.js";
import { generateUploadUrlSchema } from "../validators/s3Validation.js";
import { createPresignedUrl } from "../controllers/uploadController.js";
const router=Router();

router.post(
    "/presigned-url",
    authenticate,
    validate(
        generateUploadUrlSchema
    ),
    asyncHandler(
        createPresignedUrl
    )
);

router.get(
    "/read-url",
    authenticate,
    asyncHandler(
        getReadUrl
    )
);

export default router;