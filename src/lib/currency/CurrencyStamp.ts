import * as z from "zod";

export const CurrencyStamp = z.object({
    unixStamp: z.number(),
    rates: z.record(z.string(), z.number()).transform((rates) =>
        Object.entries(rates).map(([currencyName, amount]) => ({
            currencyName,
            amount
        }))
    )
});
export type CurrencyStamp = z.infer<typeof CurrencyStamp>;
