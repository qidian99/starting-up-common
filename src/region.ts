interface RegionInterface {
  conversionRate: Number;
  cost: number;
  growth: number;
  id: String;
  leavingRate: Number;
  population: number;
  revenue: number;
  index: number;
}

interface RegionUserInterface {
  [key: string]: number;
}

export class Region {
  conversionRate: Number;
  cost: number;
  growth: number;
  id: String;
  leavingRate: Number;
  population: number;
  revenue: number;
  index: number;
  users: RegionUserInterface;

  constructor(region: RegionInterface) {
    const {
      conversionRate,
      cost,
      growth,
      id,
      leavingRate,
      population,
      revenue,
      index,
    } = region;

    this.conversionRate = conversionRate;
    this.cost = cost;
    this.growth = growth;
    this.id = id;
    this.leavingRate = leavingRate;
    this.population = population;
    this.revenue = revenue;
    this.index = index;
    this.users = {};
  }
}
