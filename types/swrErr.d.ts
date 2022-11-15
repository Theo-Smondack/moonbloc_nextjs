class SwrErr extends Error{
    info:Promise<any>;
    status:number;

    constructor(message:string) {
        super(message);
    }

    getErrorMessage(){
        return 'Something went wrong ' + this.message
    }

}