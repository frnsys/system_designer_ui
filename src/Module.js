import { guid } from './Util';

class Module {
  constructor(name) {
    this.id = guid();
    this.name = name;
    // TODO make these distinct
    this.ins = {
      mean: {
        default: 0
      },
      std: {
        default: 1,
        validate: v => v > 0
      }
    };

    // TODO
    this.outs = ['b'];
  }
}

export default Module;
