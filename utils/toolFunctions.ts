import {StatusState} from "../types/status";
import {ModalState, ModalType} from "../types/usersAuthentication";

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

export function showAuthModal(callback: ({show, type}: ModalState) => void, show: boolean, type: ModalType|undefined):void {
    callback({show,type})
    show ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto';
}

export async function handleStatus(callback:({success,message}:StatusState)=>void,success:boolean,message:string) {
    await callback({success,message})
    const popup = document.querySelector('.popUpContainer') as HTMLElement
    popup.style.transform = 'translate(-50%) scaleY(1)'
    setTimeout(()=> {
        popup.style.transform = 'translate(-50%) scaleY(0)'
    },3000)
}