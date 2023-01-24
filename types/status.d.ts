export type StatusState = {
    success:boolean,
    message:string
}

export type StatusContextType = {
    statusState:StatusState,
    setStatus : (state:StatusState) => void
}