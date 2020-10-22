
export class Region {

    population: number;
    growthRate: Number;
    leavingRate: Number;
    cost: Number;

    constructor(population: number, growthRate: Number, leavingRate: Number, cost: Number) {
        this.population = population;
        this.growthRate = growthRate;
        this.leavingRate = leavingRate;
    }
}
