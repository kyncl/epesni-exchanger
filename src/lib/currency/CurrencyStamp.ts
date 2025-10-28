import * as z from "zod";
import { Rate } from "./Rate";

export const CurrencyStamp = z.object({
    unixStamp: z.number(),
    rates: z.union([
        z.array(Rate),
        z.record(z.string(), z.number()).transform((rates) =>
            Object.entries(rates).map(([currencyName, amount]) => ({
                currencyName,
                amount
            }))
        )
    ])
});
export type CurrencyStamp = z.infer<typeof CurrencyStamp>;
