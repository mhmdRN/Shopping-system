function catchErrors(error,displayError){
    let errMsg;
    if(error.response){
        errMsg=error.response.data;
        console.log("Error response",errMsg)
        if(error.response.data.error){
            errMsg=error.response.data.error.message;
        }
    }else if(error.request){
        errMsg=error.request;
        console.log("Error request",errMsg)
    }else{
        errMsg=error.message;
        console.log("Error message",errMsg);
    }
    displayError(errMsg)
}
export default catchErrors;