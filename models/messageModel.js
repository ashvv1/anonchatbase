export class Message {
    constructor(sender, text) {
        this.sender = sender,
        this.timestamp = new Date(),
        this.text = text;
    }
}
