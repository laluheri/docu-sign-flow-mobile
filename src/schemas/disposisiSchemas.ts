
import { z } from "zod";

export const forwardFormSchema = z.object({
  recipients: z.array(z.number()).min(1, "Select at least one recipient"),
  instruction: z.string().min(1, "Instruction is required"),
  passphrase: z.string().min(1, "Passphrase is required"),
});

export type ForwardFormValues = z.infer<typeof forwardFormSchema>;
