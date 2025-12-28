export class Product {
  constructor(
    public readonly artNr: string,
    public readonly shortText?: string,
    public readonly longText?: string,
    public readonly status?: string,
    public readonly manufacturerNr?: string,
    public readonly quantity?: {
      value: number;
      iso?: string;
      unit?: string;
    },
    public readonly price?: {
      type?: string;
      value?: number;
    },
    public readonly imageUrl?: string
  ) {}
}
