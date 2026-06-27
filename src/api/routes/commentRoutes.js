import  {Router} from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";
import { commentIdParamsSchema, createCommentSchema } from "../validators/commentValidator.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createComment, getComments, removeComment } from "../controllers/commentController.js";
import { postIdParamsSchema } from "../validators/postValidator.js";


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