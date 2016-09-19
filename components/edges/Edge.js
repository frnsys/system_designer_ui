import React from 'react';

const yOffset = 10;
const xOffset = 5;

class Edge extends React.Component {
  constructor(props, context) {
    super(props, context);

    // when an edge is created,
    // the modules aren't moving or changing shape,
    // so even though the latest position is a little stale, it's up-to-date
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

  render() {
    let sceneOffset = this.props.scene.state.offset;
    return (
      <line className="edge"
        x1={this.state.tail.x + xOffset + sceneOffset.x}
        y1={this.state.tail.y + yOffset + sceneOffset.y}
        x2={this.state.head.x + xOffset + sceneOffset.x}
        y2={this.state.head.y + yOffset + sceneOffset.y}
        onClick={this.props.onClick} />
    );
  }
}


Edge.propTypes = {
  edge: React.PropTypes.object.isRequired,
  scene: React.PropTypes.object.isRequired,
  onClick: React.PropTypes.func.isRequired,
  toModule: React.PropTypes.object.isRequired,
  fromModule: React.PropTypes.object.isRequired
}

export default Edge;
