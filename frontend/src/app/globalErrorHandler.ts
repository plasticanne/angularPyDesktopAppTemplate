import { ErrorHandler, Injectable } from '@angular/core';
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
constructor() { }
handleError(error) {
    let check=error.message.split(':')[0]
    if (check==='ExpressionChangedAfterItHasBeenCheckedError'){

    }else{
        console.error(error);
    }


  }

}
