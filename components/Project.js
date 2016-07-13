import Graph from './Graph';

class Project {
  constructor() {
    this.graph = new Graph();
    this.positions = {};
  }

  addModule(mod, x, y) {
    this.positions[mod.id] = {x, y};
    this.graph.addModule(mod);
  }

  placeModule(modId, x, y) {
    this.positions[modId] = {x, y};
  }
}

export default Project;
