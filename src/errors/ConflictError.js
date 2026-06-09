import { AppError } from "./AppError";

export class ConflictError extends AppError {
    constructor(message){
        super(message,409);
    }
}