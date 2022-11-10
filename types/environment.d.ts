declare global{
    namespace NodeJS{
        //Types declaration for environment variables
        interface ProcessEnv {
            CMC_API_KEY:string
        }
    }
}

export {}