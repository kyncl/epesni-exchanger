import * as z from "zod";
import { Rate } from "./Rate";

export const CurrencyStamp = z.object({
    unixStamp: z.number(),
    rates: z.array(Rate)
});
export type CurrencyStamp = z.infer<typeof CurrencyStamp>;
