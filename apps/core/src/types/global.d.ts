declare module 'long' {
  export class Long {
    constructor(low?: number, high?: number, unsigned?: boolean);
    static fromNumber(value: number, unsigned?: boolean): Long;
    static fromString(str: string, unsigned?: boolean, radix?: number): Long;
    toNumber(): number;
    toString(radix?: number): string;
    equals(other: Long): boolean;
    add(other: Long): Long;
    subtract(other: Long): Long;
    multiply(other: Long): Long;
    divide(other: Long): Long;
  }
  export default Long;
} 