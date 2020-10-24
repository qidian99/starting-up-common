interface RegionInterface {
  conversionRate: number;
  cost: Number;
  growth: Number;
  id: String;
  leavingRate: number;
  population: number;
  revenue: Number;
}

export class Region {
  conversionRate: number;
  cost: Number;
  growth: Number;
  id: String;
  leavingRate: number;
  population: number;
  revenue: Number;

  constructor(region: RegionInterface) {
    const {
      conversionRate,
      cost,
      growth,
      id,
      leavingRate,
      population,
      revenue,
    } = region;

    this.conversionRate = conversionRate;
    this.cost = cost;
    this.growth = growth;
    this.id = id;
    this.leavingRate = leavingRate;
    this.population = population;
    this.revenue = revenue;
  }
}
