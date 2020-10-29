import { getAdjacentRegionIndex } from "./util";

export * from "./greeter";
export * from "./terrian";
export * from "./region";
export * from "./company";
export * from "./user";
export * from "./game";
export * from "./cycle";
export * from "./funding";
export * from "./constants";
export * from "./util";

console.log(getAdjacentRegionIndex(2, 3, 3));

// import { Greeter } from './greeter';
// import { Terrian } from './terrian';

// const g = new Greeter('Juri');
// g.greet();

// const t = new Terrian( "My Terrian", 10, 10);
// t.log();
