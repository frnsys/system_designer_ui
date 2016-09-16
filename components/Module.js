import { guid } from './Util';

class Module {
  constructor(name) {
    this.id = guid();
    this.name = name;
    this.ins = ['mean', 'std'];
    this.outs = ['b'];
  }
}

export default Module;
