import { guid } from '../Util';

class BaseModule {
  constructor(name) {
    this.id = guid();
    this.name = name;
    this.ins = {}
    this.outs = [];
  }
}

export default BaseModule;
