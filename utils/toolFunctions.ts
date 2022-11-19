export function isNegative(num:number|string):boolean {
    return typeof num === 'number' && num < 0;
}