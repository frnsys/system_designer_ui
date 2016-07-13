import React from 'react';

const outputXPadding = 30;
const outputXLeftMargin = 28;
const inputXPadding = 30;
const inputXLeftMargin = 28;
const moduleHeight = 20; // TODO this should not be hardcoded

class Edge extends React.Component {
  render() {
    var fromModPos = this.props.project.positions[this.props.edge.from.id],
      toModPos  = this.props.project.positions[this.props.edge.to.id],
      tailPos = {
        x: fromModPos.x + outputXLeftMargin +
          this.props.edge.output * outputXPadding,
        y: fromModPos.y + moduleHeight
      },
      headPos = {
        x: toModPos.x + inputXLeftMargin +
          this.props.edge.input * inputXPadding,
        y: toModPos.y
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
