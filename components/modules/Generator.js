import React from 'react';
import BaseModule from './Base';
import Draggable from './Draggable';
import Chart from '../Chart';

class GeneratorModule extends BaseModule {
  constructor(props, context) {
    super(props, context);
    this.moduleType = 'generator';
    this.state = Object.assign(this.state, {
      showDisplay: true
    });
  }

  func(data) {
    data.vars = this.state.vars;
    return this.props.module.func(data);
  }

  renderControls() {
    return <ul className="controls" ref="controls" style={{display: 'none'}}>
      <li onClick={() => this.setState({showDisplay: !this.state.showDisplay})}>
        <img src={`/assets/icons/${this.state.showDisplay ? 'eye_closed' : 'eye'}.svg`} className="icon"/>
      </li>
    </ul>
  }

  renderDisplay() {
    return this.state.showDisplay ? <Chart func={this.func.bind(this)} /> : '';
  }
}

export default Draggable(GeneratorModule);
