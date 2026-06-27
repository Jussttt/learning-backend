import { z } from "zod";

export const signupSchema= z.object({
    profile_name: z
        .string()
        .min(3,"Profile name must be atleast 3 characters")
        .max(50,"Profile name connot exceed 50 characters")
        .regex(
            /^[a-zA-Z0-9_.]+$/,
            "Profile name contains invalid characters"
        )
        .trim(),

    email: z
        .email("Invalid email address")
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .min(8,"Password must be atleast 8 characters")
        .max(72,"Password cannot exceed 72 characters"),
    
    first_name: z
        .string()
        .trim()
        .max(50)
        .optional(),

    last_name: z
        .string()
        .trim()
        .max(50)
        .optional(),
    
});

export const loginschema =z.object({
    email: z
        .email("Invalid Email Address")
        .trim()
        .toLowerCase(),
    
    password: z
        .string()
        .min(1,"Password is required"),

});