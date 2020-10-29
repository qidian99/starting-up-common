import { Funding } from "./funding";
import { Company } from "./company";
import { Terrian } from "./terrian";
import { Region } from "./region";

interface GameInterface {
  id: String;
  name: String;
  width: Number;
  height: Number;
  companies: Company[];
  fundings: Funding[];
  numCompanies: Number;
  numCycles: Number;
  cycle: Number;
  regions: Array<any>;
  started: Boolean;
  status: Array<any>;
  update: Array<any>;
}
export class Game {
  id: String;
  name: String;
  width: Number;
  height: Number;
  started: Boolean;
  cycle: Number;
  numCycles: Number;
  fundings: Funding[];
  regions: Region[];
  numCompanies: Number;
  companies: Company[];
  status: any[];
  update: any[];

  constructor(game: GameInterface) {
    console.log(game);
    const {
      companies,
      cycle,
      fundings,
      height,
      id,
      name,
      numCompanies,
      numCycles,
      regions,
      started,
      status,
      update,
      width,
    } = game;

    this.id = id;
    this.name = name;
    this.width = width;
    this.height = height;
    this.cycle = cycle;
    this.started = started;
    this.numCompanies = numCompanies;
    this.numCycles = numCycles;

    // Create nested Funding and Region objects
    this.fundings = fundings.map((funding) => new Funding(funding));
    this.regions = regions.map((region) => new Region(region));

    // Create companies
    this.companies = companies.map((company) => new Company(company));

    // Set logs
    this.status = status;
    this.update = update;
  }
}

export const simpleGameFundings = [
  {
    name: "Seed Round Funding",
    amount: 125,
    cycle: 12,
    threshold: 20,
  },
  {
    name: "Series A Funding",
    amount: 300,
    cycle: 36,
    threshold: 200,
  },
  {
    name: "Series B Funding",
    amount: 500,
    cycle: 60,
    threshold: 800,
  },
  {
    name: "Series C Funding",
    amount: 1000,
    cycle: 120,
    threshold: 2000,
  },
];

export const simpleGameName = "Simple Game";
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
};
