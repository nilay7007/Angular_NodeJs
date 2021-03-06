import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";
//mime validtor to check if selected file is a jpg or png
//[key: string] key is a generic type
//mimeType is an asynchromous
export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (typeof (control.value) === 'string') {
    return of(null);
    //of is an easy way to create an observable
    //if observable is null->no error
    //if error then msg is passed
  }
  const file = control.value as File;
  //extracting a file and telling js that its a fileS
  const fileReader = new FileReader();
  //fileReader.onloadend will return a synchronous tihng so we use .create prvided by angular
  //observer is a tool that is use  to control when this observable emits data
  const frObs = Observable.create(
    (observer: Observer<{ [key: string]: any }>) => {
      //fileReader.addEventListener("loadend" is same as fileReader.onload ,differnece is onloadend will have few more  information
      fileReader.addEventListener("loadend", () => {
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
        //Conerting to new  array of 8-bit unsigned integers to infer what file type it is(png,jpg or others)
        let header = "";
        let isValid = false;
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
          //cpnverte d to hexadecimal string
        }
        switch (header) {
          //cases -> infer what file type it is(png,jpg or others)
          case "89504e47":
            isValid = true;
            break;
          case "ffd8ffe0":
          case "ffd8ffe1":
          case "ffd8ffe2":
          case "ffd8ffe3":
          case "ffd8ffe8":
            isValid = true;
            break;
          default:
            isValid = false; // Or you can use the blob.type as fallback
            break;
        }
        if (isValid) {
          observer.next(null);
        } else {
          observer.next({ invalidMimeType: true });
        }
        observer.complete();
      });
      fileReader.readAsArrayBuffer(file);
      //reading file as arraybuffer not as dataurl so to capture the mime type
      //when its done addEventListener will call loloadend function
    }
  );
  return frObs;
};
