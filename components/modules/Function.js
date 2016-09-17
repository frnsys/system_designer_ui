import React from 'react';
import BaseModule from './Base';
import Draggable from './Draggable';
import Chart from '../Chart';
import math from 'mathjs';

class FunctionModule extends BaseModule {
  constructor(props, context) {
    super(props, context);
    this.state = Object.assign(this.state, {
      name: '2x' // name is the function
    });
  }

  func(data) {
    Object.keys(this.state.vars).forEach(k => data[k] = this.state.vars[k]);

    // TODO not being used yet, but this will give us all the user-defined vars in the expression
    let vars = math.parse(this.state.name).args.filter(arg => arg.isSymbolNode).map(arg => arg.name);

    return math.eval(this.state.name, data);
  }

  renderDisplay() {
    return <Chart
      func={this.func.bind(this)}
      domain={[-5,5]}
      range={[-5,5]}/>;
  }
}

export default Draggable(FunctionModule);
