// I went over to StackOverflow, copied a format, and added an extra line. I have no idea how this works.
export class BadCommandError extends Error {
    constructor(msg: string = "No command was passed.") {
        super(msg)
        this.name = "BadCommandError";
        Object.setPrototypeOf(this, BadCommandError.prototype)
    }
}