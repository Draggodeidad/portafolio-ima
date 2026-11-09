import { z } from "zod";

const contactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "required")
      .max(100, "tooLong")
      .regex(/^[^\r\n]*$/, "required"),
    email: z
      .string()
      .trim()
      .min(1, "required")
      .max(254, "tooLong")
      .pipe(z.email("email")),
    message: z
      .string()
      .trim()
      .min(1, "required")
      .min(10, "tooShort")
      .max(5000, "tooLong"),
  })
  .strict();

export function validateContact(input: unknown) {
  return contactSchema.safeParse(input);
}
