
export enum BooleanString {
    false="false",
    true="true"
}
export enum BooleanNumberString {
    false="0",
    true="1"
}
export enum GenderString {
    female="0",
    male="1"
}


export class birthDate {
    year: number
    month: number
    day: number
    iso: string
    slash: string

}
export class ErrorResponse{
    body:any
    status:number
    headers:any
}
export interface iResponseBody{
    succeed:boolean
    body:any
    error_msg:string,
    err_code:string,
}



