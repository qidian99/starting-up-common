import {
  Funding,
  FundingInterface
} from './funding';
import {
  Company,
  CompanyInterface
} from './company';
import {
  Terrian
} from './terrian';
import {
  Region
} from './region';
import _ from 'lodash';

interface GameInterface {
  id: string;
  name: string;
  width: number;
  height: number;
  companies: Company[];
  fundings: Funding[];
  numCompanies: number;
  numCycles: number;
  cycle: number;
  regions: Array < any > ;
  started: Boolean;
  status: Array < any > ;
  update: Array < any > ;
  logs: Array < string > ;
}

interface GameInfoInterface {
  message: string;
  cycle: number;
}

// interface CompanyInterface {
//   id: string;
//   name: string;
// }

interface RegionInterface {
  id: string;
  index: number;
}

interface GameRegionUserUpdateInterface {
  company: CompanyInterface;
  count: number;
}


interface GameRegionUpdateInterface {
  cycle: number;
  region: RegionInterface;
  RegionUserUpdate: GameRegionUserUpdateInterface[];
}

interface GameCompanyUserUpdateInterface {
  cycle: number;
  company: CompanyInterface;
  revenue: number;
  bankrupt: Boolean;
}

interface GameCompanyUpdateInterface {
  CompanyUserUpdate: GameCompanyUserUpdateInterface[];
}

interface GameStatusInterface {
  company: CompanyInterface;
  revenue: number;
  bankrupt: Boolean;
  connected: Boolean;
  numRegions: number;
  numUsers: number;
}

interface GameFundingUserUpdateInterface {
  company: CompanyInterface;
  funding: FundingInterface;
}
interface GameFundingUpdateInterface {
  cycle: number;
  FundingUserUpdate: GameFundingUserUpdateInterface[];
}

export class Game {
  id: string;
  name: string;
  width: number;
  height: number;
  started: Boolean;
  cycle: number;
  numCycles: number;
  fundings: Funding[];
  regions: Region[];
  numCompanies: number;
  companies: Company[];
  status: GameStatusInterface[];
  update: any[];
  logs: Array < string > ;

  constructor(game: GameInterface) {
    if (!game) {
      return;
    }
    // console.log(game);
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
    this.status = [...status];
    this.update = update;
    this.logs = [];
  }

  updateGameInfo(gameInfoUpdate: GameInfoInterface) {
    // console.log('gameInfoUpdate', gameInfoUpdate);
    const {
      cycle,
      message,
    } = gameInfoUpdate;
    // Update game logs
    this.logs.push(`Cycle ${cycle}: ${message}`);
  }
  updateGameRegion(gameRegionUpdate: GameRegionUpdateInterface) {
    // console.log('gameInfoUpdate', gameRegionUpdate);
    const {
      RegionUserUpdate,
      region: {
        index: regionIndex,
      }
    } = gameRegionUpdate;

    const region = _.find(this.regions, ((region: Region) => region.index === regionIndex));
    // console.log({region, regions: this.regions});

    const users = region.users;

    RegionUserUpdate.forEach(({
      company,
      count
    }) => {
      const companyId = typeof company === 'string' ? company : company.id.toString();
      users[companyId] = count;
      this.logs.push(`${company.name} reached ${count} users in Region ${regionIndex}`);
    });

    // console.log('Updated region', region);
  }
  updateGameCompany(gameCompanyUpdate: GameCompanyUpdateInterface) {
    const {
      CompanyUserUpdate
    } = gameCompanyUpdate;

    try {
      CompanyUserUpdate.forEach(({
        cycle,
        company,
        revenue,
        bankrupt,
      }) => {
        const companyId = company.id;

        let targetCompany = _.find(this.companies, (c) => c.id === companyId);

        // console.log({
        //   targetCompany,
        // });
        // console.log({
        //   targetCompany,
        //   companies: this.companies,
        //   companyId
        // });

        if (!targetCompany) {
          // IN DEV
          this.companies.push(new Company(company));
          targetCompany = company;
          // return;
        }

        targetCompany.revenue = revenue;
        targetCompany.bankrupt = bankrupt;

        // Update game status
        let currentStatus = _.find(this.status, {
          company: {
            id: companyId
          }
        });

        console.log({
          gameCompanyUpdate,
          companies: this.companies,
          status: this.status,
        });

        // Get num regions
        let numRegions = 0;
        let numUsers = 0;

        this.regions.forEach(({
          users
        }) => {
          if (users[companyId] && users[companyId] > 0) {
            numRegions += 1;
            numUsers += users[companyId];
          }
        });

        if (!currentStatus) {
          currentStatus = {
            company,
            revenue,
            bankrupt,
            connected: true,
            numRegions,
            numUsers,
          };
          this.logs.push(`${company.name} scaled its business to ${numRegions} Regions`);
          if (bankrupt) {
            this.logs.push(`${company.name} went bankrupt`);
          }

          console.log(1111, typeof this.status);
          this.status.push(currentStatus);
          console.log(2222);

        } else {

          if (numRegions !== currentStatus.numRegions) {
            this.logs.push(`${company.name} scaled its business to ${numRegions} Regions`);
          }
          if (bankrupt !== currentStatus.bankrupt) {
            this.logs.push(`${company.name} went bankrupt`);
          }
          currentStatus.numUsers = numUsers;
          currentStatus.numRegions = numRegions;
          currentStatus.revenue = revenue;
          currentStatus.bankrupt = bankrupt;
        }

        this.logs.push(`${company.name} accumulated ${numUsers} users across all Regions`);
        this.logs.push(`${company.name} accumulated ${revenue}`);

        console.log({
          currentStatus,
        });
      });
    } catch (e) {
      console.log(e);
    }
  }
  updateGameFunding(gameFundingUdpate: GameFundingUpdateInterface) {
    const {
      cycle,
      FundingUserUpdate: updates,
    } = gameFundingUdpate;
    // console.log('updateGameFunding', {
    //   updates
    // });
    updates.forEach(({
      company,
      funding,
    }) => {

      const companyId = company.id;
      let companyStatus = _.find(this.status, {
        company: {
          id: companyId
        }
      });
      // console.log('companyStatus.revenue', companyStatus, companyStatus.revenue);
      // companyStatus.revenue += funding.amount;
      // console.log('companyStatus.revenue', companyStatus, companyStatus.revenue);
      // console.log('updateGameFunding', {
      //   companyStatus,
      //   status: this.status,
      // });
    });

  }
}

export const simpleGameFundings = [{
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
