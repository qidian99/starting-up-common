import { Funding } from "./funding";
import { Startup } from "./startup";
import { Terrian } from "./terrian";

export class Game {
    id: String;
    name: String;
    width: Number;
    height: Number;
    started: Boolean;

    cycle: Number;
    numCycles: Number;
    fundings: [Funding]
    regions: Terrian;
    numCompanies: Number;
    companies: [Startup];

    status: [any]
    update: [any]
    

    constructor(game: any) {
    }
}

export const simpleGameFundings = [{
  name: "Seed Round Funding",
  amount: 125,
  cycle: 12,
  threshold: 20,
}, {
  name: "Series A Funding",
  amount: 300,
  cycle: 36,
  threshold: 200,
}, {
  name: "Series B Funding",
  amount: 500,
  cycle: 60,
  threshold: 800,
}, {
  name: "Series C Funding",
  amount: 1000,
  cycle: 120,
  threshold: 2000,
}];

export const simpleGameName = 'Simple Game';
export const simpleGameNumCompanies = 1;
export const simpleGameWidth = 3;
export const simpleGameHeight = 3;
export const simpleGameNumCycles = 240;
export const simpleGameRegion = {
  population: 100,
  conversionRate: 0.01,
  leavingRate: 0.0125,
  revenue: 1,
  cost: 10,
  growth: 2,
}
