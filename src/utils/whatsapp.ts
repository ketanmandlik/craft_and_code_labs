export const defaultMessage='Hi Craft and Code Labs! I have a project idea and would like to discuss your services.';
export function whatsappUrl(number:string,message=defaultMessage){return /^[1-9]\d{6,14}$/.test(number)?'https://wa.me/'+number+'?text='+encodeURIComponent(message):null}
