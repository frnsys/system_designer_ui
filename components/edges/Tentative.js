import React from 'react';

class TentativeEdge extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: false,
      startX: 0,
      startY: 0,
      drawToX: 0,
      drawToY: 0
    };
  }

  render() {
    const style = {
      visibility: this.state.visible ? 'visible' : 'hidden',
      strokeWidth: 3,
      stroke: 'url(#linear)'
    };

    let sceneOffset = this.props.scene.state.offset;
    return (
      <line
        x1={this.state.startX + sceneOffset.x}
        y1={this.state.startY + sceneOffset.y}
        x2={this.state.drawToX + sceneOffset.x}
        y2={this.state.drawToY + sceneOffset.y}
        style={style} />
    );
  }
}

TentativeEdge.propTypes = {
  scene: React.PropTypes.object.isRequired
};
export default TentativeEdge;
