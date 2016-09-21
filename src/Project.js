import Graph from './Graph';

class Project {
  constructor() {
    this.graph = new Graph();
  }

  addModule(mod) {
    this.graph.addModule(mod);
  }
}

export default Project;
