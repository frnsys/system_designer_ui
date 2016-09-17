import React from 'react';
import BaseModule from './Base';
import Draggable from './Draggable';
import Chart from '../Chart';

class GeneratorModule extends BaseModule {
  func(data) {
    data.vars = this.state.vars;
    return this.props.func(data);
  }

  renderDisplay() {
    return <Chart func={this.func.bind(this)} />;
  }
}

GeneratorModule.propTypes = Object.assign({
  func: React.PropTypes.func.isRequired
}, BaseModule.propTypes);

export default Draggable(GeneratorModule);
