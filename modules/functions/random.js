// defined for internal use
isInteger = number => number == Math.floor(number);

// returns a list of integers given (optionally) a start value, stop value, and (optionally) a step value
// start value defaults to 0; step value defaults to 1 or -1
// examples:
//  range(0) = []
//  range(5) = [ 0, 1, 2, 3, 4 ]
//  range(5, -5, step=-2) = [ 5, 3, 1, -1, -3 ]
range = (start = 0, stop = null, step = null) => {
    if (stop == null) {
        stop = start;
        start = 0;
    }; if (step == null) {
        if (start < stop) step = 1;
        else step = -1;
    }

    if (!isInteger(start) || !isInteger(stop)) throw Error('Range values must be integers');
    if (!isInteger(step) || step == 0) throw Error('Step value must be an integer other than 0');

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

// identical to Math.random Lol
random = () => Math.random();

// Returns one item from a list
choice = (list = [], returnIndex = false) => {
    if (!list.length) throw Error('List cannot be empty');
    index = Math.floor(random() * list.length);
    if (returnIndex) return index;
    else return list[index];
}

// Returns k items from a list 
choices = (list = [], k = 1) => {
    if (!isInteger(k)) throw Error('k must be an integer');
    if (!list.length) throw Error('List cannot be empty');
    var list_ = []
    for (i = 0; i < k; i++) {
        list_.push(choice(list))
    }
    return list_
}

// Returns k unique items from a list
sample = (list = [], k = 1) => {
    if (typeof list != 'object' || !list) throw error('ValueError', `list must be array`)
    else {
        if (!list.map) throw error('ValueError', `list must be array`);
    }
    if (!list.length) throw Error('List cannot be empty');
    else if (list.length < k) throw Error('List values must be longer than or equal to k')
    else if (k < 0 || !isInteger(k)) throw Error('k must be a whole number')

    // prevent naming issues
    var list_ = [];
    var list__ = list.map(item => item);

    // obtain unique samples
    for (i = 0; i < k; i++) {
        index = choice(list__, returnIndex = true);
        value = list__.splice(index, 1)[0];
        list_.push(value)
    }

    // return samples
    return list_;
};

// Return a shuffled array
// Unlike its python equivalent, it does not touch the variable directly
shuffle = (list = []) => {
    if (!list.length) return [];
    return sample(list, list.length);;
}

// Returns a random value from a range
randRange = (start = 0, stop = null) => {
    values = range(start, stop)
    if (!values.length && stop == null) throw Error('Stop value cannot equal 0');
    else if (!values.length) throw Error('Stop value cannot equal start value');
    return choice(values)
};

// Return a random integer N such that a <= N <= b.
randInt = (a, b) => randRange(a, b + 1);

module.exports = {
    random: random,
    choice: choice,
    choices: choices,
    shuffle: shuffle,
    randInt: randInt,
    randRange: randRange
}