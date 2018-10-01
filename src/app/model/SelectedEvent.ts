
export class SelectedEvent {
    title: string = "";
    description: Description;
    price: Price;
    start: Date;
    end: Date;
    url: string = "";
    website: string = "";
    waitlist: number = 0;
    fbPage: string = "";
    going: number = 0;
    address:Address;
    nearestStation : string = '';
    format : string ='';
    isFree : boolean;
    image : string = '';
    cstart : string ='';
    cend : string ='';
    duration : string = '';
}

export class Price {
    min: string = "";
    max: string = "";
}
export class Address {
    city: string = "";
    country: string = "";
    line1: string = "";
    line2: string = "";
    postal: string = "";
    region: string = "";
    state: string = "";
    name : string = "";
}

export class Description{
    text : string = "";
    html : string = "";
}
