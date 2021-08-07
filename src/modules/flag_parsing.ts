var str = require("./string_functions");

module.exports = (args: string): Array<string|object> => {
    if (args === "" || args === undefined) return [args, undefined];

    let flags: object = {};
    let _flags: Array<string>;
    
    [args, ..._flags] = args.split(/\s*--/);
    
    for (var flag of _flags) {
        let [key, value] = str.splitOnce(flag, /\s+|:=/);

        if (value === "") {
            flags[key] = true;
            continue;
        }
        try {
            flags[key] = JSON.parse(value);
        } catch (e) {
            flags[key] = value;
        }
    }
    
    return [args, flags];
}