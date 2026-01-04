export interface SeederBundle {
    [category: string]: any[];
}

export class Seeder {
    private seed: number;
    private registry: SeederBundle = {};

    constructor(seed?: number | string) {
        if (seed === undefined) {
            this.seed = Date.now();
        } else if (typeof seed === "string") {
            this.seed = this.hashString(seed);
        } else {
            this.seed = seed;
        }
    }

    private hashString(str: string): number {
        let hash = 1779033703 ^ str.length;
        for (let i = 0; i < str.length; i++) {
            hash = Math.imul(hash ^ str.charCodeAt(i), 3432918353);
            hash = hash << 13 | hash >>> 19;
        }
        return function () {
            hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
            hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
            return (hash ^= hash >>> 16) >>> 0;
        }();
    }

    private next(): number {
        this.seed |= 0;
        this.seed = (this.seed + 0x6D2B79F5) | 0;
        let t = Math.imul(this.seed ^ (this.seed >>> 15), 1 | this.seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    float(min: number = 0, max: number = 1): number {
        return min + (this.next() * (max - min));
    }

    int(min: number, max: number): number {
        return Math.floor(this.float(min, max + 1));
    }

    bool(probability: number = 0.5): boolean {
        return this.next() < probability;
    }

    pick<T>(array: T[]): T {
        if (array.length === 0) throw new Error("Cannot pick from an empty array");
        return array[this.int(0, array.length - 1)] as T;
    }

    sample<T>(array: T[], count: number): T[] {
        if (count > array.length) throw new Error("Sample count larger than array size");
        const shuffled = this.shuffle([...array]);
        return shuffled.slice(0, count);
    }

    shuffle<T>(array: T[]): T[] {
        const copy = [...array];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = this.int(0, i);
            [copy[i], copy[j]] = [copy[j]!, copy[i]!];
        }
        return copy;
    }

    uuid(): string {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = this.int(0, 15);
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    id(length: number = 21): string {
        const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let id = "";
        for (let i = 0; i < length; i++) {
            id += this.pick(alphabet.split(""));
        }
        return id;
    }

    use(dataset: SeederBundle) {
        Object.assign(this.registry, dataset);
    }

    get data(): SeederBundle {
        return this.registry;
    }
}
