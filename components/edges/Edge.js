import React from 'react';

const yOffset = 10;
const xOffset = 5;

class Edge extends React.Component {
  render() {
    let inputPos = this.props.scene.modules[this.props.edge.to.id].inputPositions[this.props.edge.input];
    let outputPos = this.props.scene.modules[this.props.edge.from.id].outputPositions[this.props.edge.output];
    let tailPos = {
      x: outputPos.left + xOffset,
      y: outputPos.top + yOffset
    };
    let headPos = {
      x: inputPos.left + xOffset,
      y: inputPos.top + yOffset
    };

    return (
      <line className="edge"
        x1={tailPos.x}
        y1={tailPos.y}
        x2={headPos.x}
        y2={headPos.y}
        onClick={this.remove.bind(this)} />
    );
  }

  remove() {
    this.props.project.graph.removeEdge(this.props.edge);
    this.props.scene.rerender();
  }
}


Edge.propTypes = {
  edge: React.PropTypes.object.isRequired,
  project: React.PropTypes.object.isRequired,
  scene: React.PropTypes.object.isRequired
}

export default Edge;
