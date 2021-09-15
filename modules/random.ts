// export function random(rng: Function = Math.random) rng();
export function rand_int(min: number, max: number, rng: Function = Math.random): number {
    return Math.floor((max - min) * rng()) + min
}
export function choice(arr: Array<any>, rng: Function = Math.random): any | undefined {
    return arr[Math.floor(arr.length * rng())];
}
