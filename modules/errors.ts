// I went over to StackOverflow, copied a format, and added an extra line. I have no idea how this works.
export class BadCommandError extends Error {
    constructor(msg: string = "No valid command was passed.") {
        super(msg)
        this.name = "BadCommandError";
        Object.setPrototypeOf(this, BadCommandError.prototype)
    }
}

export class ArgumentParsingError extends Error {
    constructor(msg: string = "An error occurred while parsing arguments.") {
        super(msg)
        this.name = "ArgumentParsingError";
        Object.setPrototypeOf(this, ArgumentParsingError.prototype)
    }
}

export class CheckFailure extends Error {
    constructor(command: string, msg: string = "The check functions for command 'COMMAND' failed.") {
        super(msg.replace("COMMAND", command));
        Object.setPrototypeOf(this, CheckFailure.prototype);
    }
}

export class ExtensionError extends Error {
    constructor(extension: string, msg: string = "An error occurred in extension 'EXTENSION'.") {
        super(msg.replace("EXTENSION", extension))
        this.name = "ExtensionError";
        Object.setPrototypeOf(this, ExtensionError.prototype)
    }
}

export class ExtensionAlreadyLoaded extends ExtensionError {
    constructor(extension: string, msg: string = "Extension 'EXTENSION' is already loaded.") {
        super(extension, msg)
        this.name = "ExtensionAlreadyLoaded";
        Object.setPrototypeOf(this, ExtensionAlreadyLoaded.prototype)
    }
}
export class ExtensionNotLoaded extends ExtensionError {
    constructor(extension: string, msg: string = "Extension 'EXTENSION' is not loaded.") {
        super(extension, msg)
        this.name = "ExtensionNotLoaded";
        Object.setPrototypeOf(this, ExtensionNotLoaded.prototype)
    }
}
export class ExtensionLoadError extends ExtensionError {
    constructor(extension: string, error?: Error, msg: string = "An error occurred in extension 'EXTENSION'.") {
        super(extension, msg)
        this.name = "ExtensionLoadError";
        if (this.stack && error) this.stack += `\nThis exception was caused by another:\n${error.stack}`;
        Object.setPrototypeOf(this, ExtensionLoadError.prototype)
    }
}
