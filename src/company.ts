import { User } from './user';

/*
'id': '5f9459e03fc9d9952b2bcc0f',
'name': 'Simple Company',
'fund': 10,
'user': {
  'id': '5f9459c73fc9d9952b2bcc0e',
  'email': 'diqi+botb@ucsd.edu'
},
'strategy': {
  'id': '5f9459e03fc9d9952b2bcc10',
  'preseed': 0.3,
  'seed': 0.3,
  'seriesA': 0.3,
  'seriesB': 0.3,
  'seriesC': 0.3
},
*/

interface StrategyInterface {
  id: String;
  preseed: number;
  seed: number;
  seriesA: number;
  seriesB: number;
  seriesC: number;
}

interface CompanyInterface {
  id: String;
  name: String;
  fund: Number;
  user: User;
  strategy: StrategyInterface;
  numUsers: Number;
  numRegions: Number;
}
export class Company {
  id: String;
  name: String;
  fund: Number;
  user: User;
  strategy: StrategyInterface;
  revenue: Number;
  numUsers: Number;
  numRegions: Number;

  constructor(company: CompanyInterface) {
    const { id, name, fund, user, strategy } = company;
    this.id = id;
    this.name = name;
    this.fund = fund;
    this.revenue = fund;
    this.user = user;
    this.strategy = strategy;
    this.numUsers = 0;
    this.numRegions = 0;
  }
}

export const noCompanyResult = {
  name: 'No company',
  revenue: 'N/A',
  numUsers: 'N/A',
  numRegions: 'N/A',
};
