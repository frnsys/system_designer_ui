import _ from 'underscore';
import React from 'react';

const yOffset = 10;
const xOffset = 5;

class Edge extends React.Component {
  constructor(props, context) {
    super(props, context);

    let edge = this.props.edge,
        inputBox = this.props.toModule.inputBoxes[edge.input],
        outputBox = this.props.fromModule.outputBoxes[edge.output],
        tail = {
          x: outputBox.left,
          y: outputBox.top
        },
        head = {
          x: inputBox.left,
          y: inputBox.top
        };

    this.state = {
      tail: tail,
      head: head
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // TODO not sure why I have to make this explicit if nothing is changing the state/props?
    // but only update if the props or state actually change
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  render() {
    let head = {
      x: this.state.head.x + xOffset,
      y: this.state.head.y + yOffset
    };
    let tail = {
      x: this.state.tail.x + xOffset,
      y: this.state.tail.y + yOffset
    };
    let midpoint = (head.x + tail.x)/2
    let path = [
      'M', tail.x, tail.y,
      'C', midpoint, tail.y, midpoint, head.y, head.x, head.y
    ].join(' ');

    return (
      <path className="edge"
        d={path}
        onClick={() => this.props.onClick(this.props.edge)} />
    );
  }
}


Edge.propTypes = {
  edge: React.PropTypes.object.isRequired,
  scene: React.PropTypes.object.isRequired,
  onClick: React.PropTypes.func.isRequired,
  toModule: React.PropTypes.object.isRequired,
  fromModule: React.PropTypes.object.isRequired
};
export default Edge;
