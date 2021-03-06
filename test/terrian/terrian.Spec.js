import { Greeter } from '../../src/greeter';

describe('Greeter', () => {
  it('should greet', () => {
    const greeter = new Greeter('Juri');
    spyOn(console, 'log');

    greeter.greet();

    expect(console.log).toHaveBeenCalled();
  });
});
