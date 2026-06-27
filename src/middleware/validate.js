import { ValidationError }
from "../errors/ValidationError.js";

export function validate(
    schema,
    target = "body"
){

    return (
        req,
        res,
        next
    ) => {
        
        const result =
            schema.safeParse(
                req[target]
            );

        if (!result.success) {

            req.log.warn(
                {
                    validationErrors:
                        result.error
                            .flatten()
                            .fieldErrors,
                },
                "Request validation failed"
            );

            return next(
                new ValidationError(
                    "Validation failed",
                    result.error
                        .flatten()
                        .fieldErrors
                )
            );
        }

        req[`validated${capitalize(target)}`] =
            result.data;
        

        next();
    };
}

function capitalize(str){
    return (
        str.charAt(0)
            .toUpperCase()
        + str.slice(1)
    );
}