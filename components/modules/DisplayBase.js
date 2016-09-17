import React from 'react';
import BaseModule from './Base';
import Chart from '../Chart';
import math from 'mathjs';

class BaseDisplayModule extends BaseModule {
  constructor(props, context) {
    super(props, context);
    this.state = Object.assign(this.state, {
      showDisplay: true,
    });
  }

  renderControls() {
    return <ul className="controls" ref="controls" style={{display: 'none'}}>
      <li onClick={() => this.setState({showDisplay: !this.state.showDisplay})}>
        <img src={`/assets/icons/${this.state.showDisplay ? 'eye_closed' : 'eye'}.svg`} className="icon"/>
      </li>
    </ul>
  }

  renderDisplay() {
    return this.state.showDisplay ? <Chart
      func={this.func.bind(this)}
      domain={[-5,5]}
      range={[-5,5]}/> : '';
  }
}

export default Draggable(FunctionModule);

