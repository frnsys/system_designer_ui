import React from 'react';
import NumberField from './fields/Number';
import { VictoryChart, VictoryAxis, VictoryLine } from 'victory';

class Chart extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      domain: props.domain,
      range: props.range,
      show: true
    };
  }

  onChange(update) {
    var domain = this.state.domain,
        range = this.state.range;
    Object.keys(update).forEach(name => {
      switch(name) {
          case 'domain_l':
            domain[0] = update[name];
            break;
          case 'domain_u':
            domain[1] = update[name];
            break;
          case 'range_l':
            range[0] = update[name];
            break;
          case 'range_u':
            range[1] = update[name];
            break;
      }
    });
    this.setState({
      domain: domain,
      range: range
    });
  }

  toggleControls(show) {
    this.refs.controls.style.display = show ? 'block' : 'none';
  }

  render() {
    if (this.state.show) {
      const axisStyle = {
        tickLabels: {
          fontFamily: 'Cousine',
          fontSize:'18px',
          fill: '#777'
        },
        axis: {
          strokeWidth: 4,
          stroke: '#ddd'
        }
      };
      const lineStyle = {
        data:{
          strokeWidth: 8,
          stroke:'#a72ee6'
        }
      };
      return <div
        onMouseEnter={this.toggleControls.bind(this, true)}
        onMouseLeave={this.toggleControls.bind(this, false)}
        className="module-chart">
        <div className="chart-toggle" onClick={() => this.setState({show:false})}>
          <img src="/assets/icons/eye_closed.svg" className="icon"/></div>
        <ul className="module-chart-controls" ref="controls">
          <li>
            <label>domain: </label>
            <NumberField
              value={this.state.domain[0]}
              name="domain_l"
              onChange={this.onChange.bind(this)}
              onFinish={this.onChange.bind(this)}
              validate={v => v < this.state.domain[1]}
            />
            <span> to </span>
            <NumberField
              value={this.state.domain[1]}
              name="domain_u"
              onChange={this.onChange.bind(this)}
              onFinish={this.onChange.bind(this)}
              validate={v => v > this.state.domain[0]}
            />
          </li>
          <li>
            <label>range: </label>
            <NumberField
              value={this.state.range[0]}
              name="range_l"
              onChange={this.onChange.bind(this)}
              onFinish={this.onChange.bind(this)}
              validate={v => v < this.state.range[1]}
            />
            <span> to </span>
            <NumberField
              value={this.state.range[1]}
              name="range_u"
              onChange={this.onChange.bind(this)}
              onFinish={this.onChange.bind(this)}
              validate={v => v > this.state.range[0]}
            />
          </li>
        </ul>
        <VictoryChart domain={{x: this.state.domain, y: this.state.range}}>
          <VictoryAxis style={axisStyle}/>
          <VictoryAxis dependentAxis style={axisStyle}/>
          <VictoryLine y={this.props.func} style={lineStyle}/>
        </VictoryChart>
      </div>
    } else {
      return <div className="chart-toggle" onClick={() => this.setState({show: true})}>
        <img src="/assets/icons/eye.svg" className="icon"/></div>;
    }
  }
}

Chart.propTypes = {
  func: React.PropTypes.func.isRequired,
  domain: React.PropTypes.array,
  range: React.PropTypes.array
};
Chart.defaultProps = {
  domain: [-2,2],
  range: [0,0.5]
}

export default Chart;
