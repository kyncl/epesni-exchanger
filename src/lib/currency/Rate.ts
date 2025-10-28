import * as z from "zod";

export const Rate = z.object({
    currencyName: z.string(),
    amount: z.number(),
});
export type Rate = z.infer<typeof Rate>;
