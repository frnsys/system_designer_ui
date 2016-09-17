import { guid } from './Util';

class Graph {
  // directed graph connecting
  // module outputs to module inputs

  constructor() {
    // map module.id -> [outgoing connections]
    this.outEdges = {};

    // map module.id -> [incoming connections]
    this.inEdges = {};

    // map module.id -> module
    this.modules = {};

    this.allEdges = [];
  }

  addModule(mod) {
    this.modules[mod.id] = mod;
  }

  removeModule(mod) {
    // delete outgoing edges
    for (let edge in this.outEdges[mod.id]) {
      delete this.inEdges[edge.to.id][edge.input];
    }

    // delete incoming edges
    for (let edge in this.inEdges[mod.id]) {
      const outs = this.outEdges[edge.from.id][edge.output];
      outs.splice(outs.indexOf(edge), 1);
    }

    delete this.outEdges[mod.id];
    delete this.inEdges[mod.id];
    delete this.modules[mod.id];
  }

  addEdge(fromModule, outputNum, toModule, inputNum) {
    const edge = {
      id: guid(),
      from: fromModule,
      output: outputNum,
      to: toModule,
      input: inputNum
    };
    const added = this._addIncomingEdge(edge);
    if (added) {
      this._addOutgoingEdge(edge);
      this.allEdges.push(edge);
    }
    return added;
  }

  _addOutgoingEdge(edge) {
    if (!(edge.from.id in this.outEdges)) {
      this.outEdges[edge.from.id] = {};
    }
    if (!this.outEdges[edge.from.id][edge.output]) {
      this.outEdges[edge.from.id][edge.output] = [];
    }
    this.outEdges[edge.from.id][edge.output].push(edge);
  }

  _addIncomingEdge(edge) {
    if (!(edge.to.id in this.inEdges)) {
      this.inEdges[edge.to.id] = {};
    }

    // only one edge per input
    if (this.inEdges[edge.to.id][edge.input]) {
      return false;
    } else {
      this.inEdges[edge.to.id][edge.input] = edge;
      return true;
    }
  }

  removeEdge(edge) {
    const outEdges = this.outEdges[edge.from.id][edge.output];
    outEdges.splice(outEdges.indexOf(edge), 1);
    this.allEdges.splice(this.allEdges.indexOf(edge), 1);
    delete this.inEdges[edge.to.id][edge.input];
  }
}

class Edge {
  constructor(fromModule, outputNum, toModule, inputNum) {
    this.from = fromModule;
    this.output = outputNum;
    this.to = toModule;
    this.input = inputNum;
  }
}

export default Graph;