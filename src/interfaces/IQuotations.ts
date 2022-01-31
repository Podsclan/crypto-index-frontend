interface IQuotationTime {
    updated: string;
    updatedISO: string;
    updateduk: string;
}

interface ICurrency {
    code: string;
    rate: string;
    description: string;
    rate_float: number;
}

export interface IQuotations {
    time: IQuotationTime;
    disclaimer: string;
    bpi: {
        USD: ICurrency,
        BTC: ICurrency,
        BRL: ICurrency,
        EUR: ICurrency,
        CAD: ICurrency,
    };
}