const startsWithAny = (str: string, array: Array<string>): Boolean => {
    for (var i of array) {
        if (str.startsWith(i)) return true;
    }
    return false;
};

const removePrefix = (str: string, prefix: string): string | undefined => {
    if (str.startsWith(prefix)) return str.slice(prefix.length);
    else return undefined;
};

const removeAnyPrefix = (str: string, prefixes: Array<string>): string => {
    var value: string;
    for (var prefix of prefixes) {
        value = removePrefix(str, prefix)
        if (value !== undefined) return value;
    }
    return str
}

const join = (join_string: string = " ", arguments: Array<string>): string => {
    let resp = arguments.shift();
    for (var argument of arguments) resp += (join_string + String(argument));
    return resp;
}

const splitOnce = (str: string, separator: string | RegExp): Array<string> => {
    let match = str.match(separator);
    if (match === null) return [str, ""];

    let resp = [];
    resp.push(str.substr(0, match.index));
    resp.push(str.substr(match.index + match[0].length));
    return resp;
}

module.exports = { startsWithAny, removeAnyPrefix, join, splitOnce }