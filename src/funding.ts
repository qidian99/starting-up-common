export interface FundingInterface {
  id: String;
  name: String;
  amount: number;
  cycle: number;
  threshold: number;
}

export class Funding {
  id: String;
  name: String;
  amount: number;
  cycle: number;
  threshold: number;

  constructor(funding: FundingInterface) {
    const { id, name , amount, cycle, threshold} = funding;

    this.id = id;
    this.name = name;
    this.amount = amount;
    this.cycle = cycle;
    this.threshold = threshold;
  }
}
