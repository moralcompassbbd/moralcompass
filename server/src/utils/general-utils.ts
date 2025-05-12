export function safeParseInt(input: string, fallback = 0): number{
    const number = parseInt(input);
    return Number.isNaN(number) ? fallback : number;
  };