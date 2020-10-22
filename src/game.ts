import { Funding } from "./funding";
import { Startup } from "./startup";
import { Terrian } from "./terrian";

export class Game {

    numCycles: number;
    fundings: [Funding]
    terrian: Terrian;
    users: [Startup];
    

    constructor(numCycles: number) {
        this.numCycles = numCycles;
    }
}
