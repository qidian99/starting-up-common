import { Region } from "./region";

export class Terrian {

    width: number;
    height: number;
    regions: Array<Region>;
    name: string;

    constructor(name: string, width: number, height: number) {
        this.name = name;
        this.width = width;
        this.height = height;
    }

    log(): void {
        console.log(`Terrian name: ${this.name}. Terrian width: ${this.width}. Terrian height: ${this.height}`);
    }
}
