import { Funding } from './funding';
import { Company } from './company';
import { Terrian } from './terrian';
import { Region } from './region';

interface GameInterface {
  id: String;
  name: String;
  width: number;
  height: number;
  companies: Company[];
  fundings: Funding[];
  numCompanies: number;
  numCycles: number;
  cycle: number;
  regions: Array<any>;
  started: Boolean;
  status: Array<any>;
  update: Array<any>;
}

interface GameInfoInterface {
  message: String;
  cycle: number;
}
export class Game {
  id: String;
  name: String;
  width: number;
  height: number;
  started: Boolean;
  cycle: number;
  numCycles: number;
  fundings: Funding[];
  regions: Region[];
  numCompanies: number;
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

  updateGameInfo(update: GameInfoInterface) {}
  updateGameRegion(update: GameInfoInterface) {}
  updateGameCompany(update: GameInfoInterface) {}
  updateGameFunding(update: GameInfoInterface) {}
}

export const simpleGameFundings = [
  {
    name: 'Seed Round Funding',
    amount: 125,
    cycle: 12,
    threshold: 20,
  },
  {
    name: 'Series A Funding',
    amount: 300,
    cycle: 36,
    threshold: 200,
  },
  {
    name: 'Series B Funding',
    amount: 500,
    cycle: 60,
    threshold: 800,
  },
  {
    name: 'Series C Funding',
    amount: 1000,
    cycle: 120,
    threshold: 2000,
  },
];

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
};

/* Types in subscription */
export const TYPE_GAME_INFO_UPDATE = 'ComponentGameInfoUpdate';
export const TYPE_GAME_COMPANY_UPDATE = 'ComponentGameCompanyUpdate';
export const TYPE_GAME_FUNDING_UPDATE = 'ComponentGameFundingUpdate';
export const TYPE_GAME_STATUS_UPDATE = 'ComponentGameGameStatus';
export const TYPE_GAME_REGION_UPDATE = 'ComponentGameRegionUpdate';
