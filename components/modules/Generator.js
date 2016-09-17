import React from 'react';
import BaseModule from './Base';
import Draggable from './Draggable';
import Chart from '../Chart';

class GeneratorModule extends BaseModule {
  constructor(props, context) {
    super(props, context);
    this.moduleType = 'generator';
  }

  func(data) {
    data.vars = this.state.vars;
    return this.props.module.func(data);
  }

  renderDisplay() {
    return this.state.showDisplay ? <Chart func={this.func.bind(this)} /> : '';
  }
}

export default Draggable(GeneratorModule);
