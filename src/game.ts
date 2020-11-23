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
import {
  MSG_TYPES
} from './constants';

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
  company: CompanyInterface;
  revenue: number;
  bankrupt: Boolean;
}

interface GameCompanyUpdateInterface {
  cycle: number;
  CompanyUserUpdate: GameCompanyUserUpdateInterface[];
}

interface GameStatusInterface {
  cycle ? : number;
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
  // Model
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
  logCycles: Array < number > ;
  // Game control
  end: Boolean;
  // For replay
  currentCycle: number;

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
    this.regions = _.sortBy(regions, 'index').map((region) => new Region(region));

    // Create companies
    this.companies = companies.map((company) => new Company(company));

    // Set logs
    this.status = [...status];
    this.update = update;
    this.logs = [];
    this.logCycles = [];

    // Replay
    this.end = false;
    this.currentCycle = 0;
  }

  updateLogs(log: string, cycle: number) {
    this.logs.push(log);
    this.logCycles.push(cycle);
  }

  updateGameInfo(gameInfoUpdate: GameInfoInterface) {
    // console.log('gameInfoUpdate', gameInfoUpdate);
    const {
      cycle,
      message,
    } = gameInfoUpdate;
    // Update game logs
    switch (message) {
      case MSG_TYPES.GAME_OVER: {
        this.end = true;
        this.updateLogs(`Game over.`, cycle);
        break;
      }
      default:
        this.updateLogs(`Cycle ${cycle}: ${message}`, cycle);
    }
  }
  updateGameRegion(gameRegionUpdate: GameRegionUpdateInterface, reverse = false) {
    // console.log('gameInfoUpdate', gameRegionUpdate);
    const {
      cycle,
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
      if (reverse) {
        users[companyId] -= count;
      } else {
        if (companyId in users) {
          users[companyId] += count;
        } else {
          users[companyId] = count;
        }
        this.updateLogs(`${company.name} reached ${users[companyId]} users in Region ${regionIndex}`, cycle);
      }
    });

    // console.log('Updated region', region);
  }
  updateGameCompany(gameCompanyUpdate: GameCompanyUpdateInterface, reverse = false) {
    const {
      CompanyUserUpdate,
      cycle,
    } = gameCompanyUpdate;

    try {
      CompanyUserUpdate.forEach(({
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
          targetCompany = new Company(company);
          this.companies.push(targetCompany);
          // return;
        }

        if (reverse) {
          targetCompany.revenue -= revenue;
          console.log('reversing', revenue);
        } else {
          targetCompany.revenue += revenue;
        }

        targetCompany.bankrupt = bankrupt;

        // Update game status
        let currentStatus = _.find(this.status, {
          company: {
            id: companyId
          }
        });

        // console.log({
        //   gameCompanyUpdate,
        //   companies: this.companies,
        //   status: this.status,
        // });

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


        if (reverse) return;

        // Update current status for each company
        if (!currentStatus) {
          currentStatus = {
            cycle,
            company,
            revenue,
            bankrupt,
            connected: true,
            numRegions,
            numUsers,
          };
          this.updateLogs(`${company.name} scaled its business to ${numRegions} Regions`, cycle);
          if (bankrupt) {
            this.updateLogs(`${company.name} went bankrupt`, cycle);
          }
          this.status.push(currentStatus);

        } else {
          if (numRegions !== currentStatus.numRegions) {
            this.updateLogs(`${company.name} scaled its business to ${numRegions} Regions`, cycle);
          }
          if (bankrupt !== currentStatus.bankrupt) {
            targetCompany.bankrupt = bankrupt;
            this.updateLogs(`${company.name} went bankrupt`, cycle);
          }
          currentStatus.numUsers = numUsers;
          currentStatus.numRegions = numRegions;
          currentStatus.revenue = targetCompany.revenue;
          currentStatus.bankrupt = targetCompany.bankrupt;
        }

        this.updateLogs(`${company.name} accumulated ${numUsers} users across all Regions`, cycle);
        this.updateLogs(`${company.name} accumulated ${revenue}`, cycle);

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

  goto(cycle: number) {
    try {
      if (cycle > this.currentCycle) {
        const updates = _.filter(this.update, (u) => u.cycle > this.currentCycle && u.cycle <= cycle);
        updates.forEach((update) => {
          switch (update.__typename) {
            case TYPE_GAME_INFO_UPDATE: {
              this.updateGameInfo(update);
              break;
            }
            case TYPE_GAME_REGION_UPDATE: {
              this.updateGameRegion(update);
              break;
            }
            case TYPE_GAME_COMPANY_UPDATE: {
              this.updateGameCompany(update);
              break;
            }
            case TYPE_GAME_FUNDING_UPDATE: {
              this.updateGameFunding(update);
              break;
            }
            default: {}
          }
        });
      } else {
        const updates = _.reverse(_.filter(this.update, (u) => u.cycle <= this.currentCycle && u.cycle > cycle));
        console.log({
          updates
        });
        updates.forEach((update) => {
          switch (update.__typename) {
            case TYPE_GAME_INFO_UPDATE: {
              this.updateGameInfo(update);
              break;
            }
            case TYPE_GAME_REGION_UPDATE: {
              this.updateGameRegion(update, true);
              break;
            }
            case TYPE_GAME_COMPANY_UPDATE: {
              this.updateGameCompany(update, true);
              break;
            }
            case TYPE_GAME_FUNDING_UPDATE: {
              this.updateGameFunding(update);
              break;
            }
            default: {}
          }
        });
        const logIndex = this.logCycles.findIndex((c) => c > cycle);
        if (logIndex !== -1) {
          this.logs.splice(logIndex);
          this.logCycles.splice(logIndex);
        }

        this.companies.forEach((company) => {
          const companyId = company.id;
          // Update game status
          let currentStatus = _.find(this.status, {
            company: {
              id: companyId
            }
          });

          // console.log({
          //   gameCompanyUpdate,
          //   companies: this.companies,
          //   status: this.status,
          // });

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
          currentStatus.numUsers = numUsers;
          currentStatus.numRegions = numRegions;
          currentStatus.revenue = company.revenue;
          currentStatus.bankrupt = company.bankrupt;
        });
      }

      this.currentCycle = cycle;
    } catch (e) {
      console.log(e);
    }

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
export const simpleGameInitialUsers = 10;
export const simpleGameRegion = {
  population: 100,
  conversionRate: 0.01,
  leavingRate: 0.0125,
  revenue: 1,
  cost: 10,
  growth: 2,
};

export const simpleGameStrategies = [
  'preseed',
  'seed',
  'seriesA',
  'seriesB',
  'seriesC',
];

/* Types in subscription */
export const TYPE_GAME_INFO_UPDATE = 'ComponentGameInfoUpdate';
export const TYPE_GAME_COMPANY_UPDATE = 'ComponentGameCompanyUpdate';
export const TYPE_GAME_FUNDING_UPDATE = 'ComponentGameFundingUpdate';
export const TYPE_GAME_STATUS_UPDATE = 'ComponentGameGameStatus';
export const TYPE_GAME_REGION_UPDATE = 'ComponentGameRegionUpdate';

/* Tips */
export const STRATEGY_TIPS = [{
    text: 'It’s become increasingly common for startups to raise several seed rounds, and this has led to a bifurcation in the seed stage between what are known as “pre-seed” (or “genesis”) and institutional seed rounds.',
    link: 'https://nextviewventures.com/blog/what-are-pre-seed-rounds/',
  },
  {
    text: 'Seed funding is the first official equity funding stage. It typically represents the first official money that a business venture or enterprise raises. Some companies never extend beyond seed funding into Series A rounds or beyond',
    link: 'https://www.investopedia.com/articles/personal-finance/102015/series-b-c-funding-what-it-all-means-and-how-it-works.asp',
  },
  {
    text: 'Once a business has developed a track record (an established user base, consistent revenue figures, or some other key performance indicator), that company may opt for Series A funding in order to further optimize its user base and product offerings.',
    link: 'https://www.investopedia.com/articles/personal-finance/102015/series-b-c-funding-what-it-all-means-and-how-it-works.asp',
  },
  {
    text: 'Series B rounds are all about taking businesses to the next level, past the development stage. Investors help startups get there by expanding market reach.',
    link: 'https://www.investopedia.com/articles/personal-finance/102015/series-b-c-funding-what-it-all-means-and-how-it-works.asp',
  },
  {
    text: 'Series C funding is focused on scaling the company, growing as quickly and as successfully as possible.',
    link: 'https://www.investopedia.com/articles/personal-finance/102015/series-b-c-funding-what-it-all-means-and-how-it-works.asp',
  },
];
