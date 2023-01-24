import {UserInput} from "../models/User";

export enum ModalType {
    Login = "login",
    Signup = "signup"
}

export type ModalState = {
    show: boolean,
    type?: ModalType
}

export type AuthModalContextType = {
    modalState: ModalState,
    setModalState: (state: ModalState) => void;
}

export type SignUpData = {
    data: UserInput,
    candidatePassword : string
}