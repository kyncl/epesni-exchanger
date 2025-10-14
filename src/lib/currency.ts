export interface currencyStamp {
    unixStamp: number,
    rates: Rate[]
};

export interface Rate {
    currencyName: string,
    amount: number,
}
