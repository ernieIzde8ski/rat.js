/* 
returns a list of integers given (optionally) a start value, stop value, and (optionally) a step value
start value defaults to 0; step value defaults to 1 or -1
examples:
  range(0) = []
  range(5) = [ 0, 1, 2, 3, 4 ]
  range(5, -5, step=-2) = [ 5, 3, 1, -1, -3 ]
*/

module.exports = (start = 0, stop = null, step = null) => {
    if (stop == null) {
        stop = start;
        start = 0;
    }; if (step == null) {
        if (start < stop) step = 1;
        else step = -1;
    }

    if (!isInteger(start) || !isInteger(stop)) throw Error("Range values must be integers");
    if (!isInteger(step) || step == 0) throw Error("Step value must be an integer other than 0");

    var list = [];
    if (step > 0) {
        for (i = start; i < stop; i += step) {
            list.push(i);
        };
    } else {
        for (i = start; i > stop; i += step) {
            list.push(i);
        };
    }
    return list;
}