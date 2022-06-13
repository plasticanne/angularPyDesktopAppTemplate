import { GenderString, birthDate } from "./interface";

export const socialInfo = {
    "google": {
        "clientId":"",
        "apiKey":""
    },
    /*"linkedin": {
        "clientId": "LINKEDIN_CLIENT_ID"
    },*/
"facebook": {

    "clientId": "",
    "apiVersion": "v2.7"
}
}
export const RecaptchaSitekey:string = ""
export const IsOnServerMode=false
export const IsTurnOnCache=true
export const IsPostEncode=false
export function HaveChinese(s) {
    return s.search(RegExp("[一-" + String.fromCharCode(40869) + "]")) > -1;
}
export function gender2number(gender: 'male' | 'female'): GenderString {

    if (gender == "male") {
        return GenderString.male
    } else {
        return GenderString.female
    }
}
export function gender2name( gender: GenderString): 'male' | 'female' {

    if (gender == GenderString.male) {
        return 'male'
    } else {
        return 'female'
    }
}

export function string2birth(bir: string): birthDate {
    let res = new birthDate()
        let date = new Date(bir)

        res.year = date.getFullYear()
        res.month = date.getMonth()+1
        res.day = date.getDate()
        res.iso = date.toISOString()
        res.slash = res.year + '/' + res.month + '/' + res.day
        return res

}
export function primitiveToBoolean(value: string | number | boolean | null | undefined): boolean {
    if (value === 'true') {
      return true;
    }

    return typeof value === 'string'
      ? !!+value   // we parse string to integer first
      : !!value;
  }
export function relative_time_text(m:number):string{
    let text;
    if(m <= 1)
        text = '小於1分鐘';
    else if(m > 1 && m <= 45)
        text = Math.round(m) + '分鐘前';
    else if(m > 45 && m <= 90)
        text = '1小時前';
    else if(m > 90 && m <= 1440)
        text = Math.round(m/60) + '小時前';
    else if(m > 1440 && m <= 2880)
        text = '1天前';
    else if(m > 2880 && m <= 43200)
        text = Math.round(m/1440)+ '天前';
    else if(m > 43200 && m <= 86400)
        text = '1個月前';
    else if(m > 86400 && m <= 525600)
        text = Math.round(m/43200) + '個月前';
    else if(m > 525600 && m <= 1051200)
        text = '1年前';
    else
        text = Math.round(m/525600) + '年前';

    return text;
}
export function scrollTo(offset, callback) {
    const fixedOffset = offset.toFixed(),
        onScroll = function () {
            if (window.pageYOffset.toFixed() === fixedOffset) {
                window.removeEventListener('scroll', onScroll)
                callback()
            }
        }

    window.addEventListener('scroll', onScroll)
    onScroll()
    window.scroll({
        top: offset,
        behavior: 'auto'
    })

}
