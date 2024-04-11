class Lecturer_Card {
    constructor(
        public uuid: string, 
        public title_before: string, 
        public first_name: string, 
        public last_name: string, 
        public title_after: string, 
        public picture_url: string,
        public location: string,
        public claim: string,
        public tags: tag[],
        public price_per_hour: number
    ) {}

    public get fullName() {
        return `${this.title_before} ${this.first_name} ${this.last_name} ${this.title_after}`;
    }
    
}
class tag {
    constructor(
        public uuid: string,
        public name: string
    ) {}
}
class Lecturer_Full {
    constructor (
        public uuid: string,
        public first_name: string,
        public last_name: string,
        public title_before: string,
        public title_after: string,
        public location: string,
        public picture_url: string,
        public price_per_hour: number,
        public claim: string,
        public tags: tag[],
        public bio: string,
        public contact: contact,
        public reservations: reservation[]
    ) {

    }
    public get fullName() {
        return `${this.title_before} ${this.first_name} ${this.last_name} ${this.title_after}`;
    }
}


class contact {
    constructor(
        public telephone_numbers: string[],
        public emails: string[]
    ) {}
}
class reservation {
    constructor(
        public uuid: string,
        public start_time: Date,
        public end_time: Date,
        public first_name_student: string,
        public last_name_student: string,
        public email_student: string,
        public number_student: string,
        public location: location_reservation,
        public status: status,
        public description: string,
        public subject: tag[]
    ) {}
}
enum status {
    reserved = 'reserved',
    unavailable = 'unavailable'
}
enum location_reservation {
    online = 'online',
    offline = 'offline'
}

export { Lecturer_Card, Lecturer_Full, contact, reservation, tag };
