type rng_function = () => number;
export function rand_int(min: number, max: number, rng: rng_function = Math.random): number {
    return Math.floor((max - min + 1) * rng()) + min;
}
export function choice(arr: Array<any>, rng: rng_function = Math.random): any | undefined {
    return arr[Math.floor(arr.length * rng())];
}
