export function isNegative(num:number|string):boolean {
    return typeof num === 'number' && num < 0;
}

export function isEmail(email:string):boolean {
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return expression.test(email)
}

export function isEmptyFields(fields:string[]):boolean {
    const res = fields.map(field => Boolean(field && field.trim()))
    return res.includes(false)
}
