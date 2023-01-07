export class Thread {
    constructor(subject, creator) {
        this.subject = subject,
        this.recipients = [creator]
        this.messages = [];
    }
}