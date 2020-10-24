interface FundingInterface {
  id: String;
  amount: Number;
  cycle: Number;
  threshold: Number;
}

export class Funding {
  id: String;
  amount: Number;
  cycle: Number;
  threshold: Number;

  constructor(funding: FundingInterface) {
    const { id, amount, cycle, threshold } = funding;

    this.id = id;
    this.amount = amount;
    this.cycle = cycle;
    this.threshold = threshold;
  }
}
