
type StrategiesType = [Number, Number, Number, Number, Number]

export class Startup {

    name: Number;
    revenue: Number;
    subscriptionFee: Number;
    strategies: StrategiesType;


    constructor(name: number, revenue: Number, subscriptionFee: Number, strategies: StrategiesType) {
        this.name = name;
        this.revenue = revenue;
        this.subscriptionFee = subscriptionFee;
        this.strategies = strategies;
    }
}
