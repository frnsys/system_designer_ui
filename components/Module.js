import { guid } from './Util';

class Module {
  constructor(name) {
    this.id = guid();
    this.name = name;
    this.ins = ['a'];
    this.outs = ['b'];
  }
}

export default Module;
