import  {Router} from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";
import { commentIdParamsSchema } from "../validators/commentValidator.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {  removeComment } from "../controllers/commentController.js";


const router=Router();

router.delete(
    "/:commentId",
    authenticate,
    validate(
        commentIdParamsSchema,
        "params"
    ),
    asyncHandler(
        removeComment
    )
)






export default router;