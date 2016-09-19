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

    return (
      <line
        x1={this.state.startX}
        y1={this.state.startY}
        x2={this.state.drawToX}
        y2={this.state.drawToY}
        style={style} />
    );
  }
}

export default TentativeEdge;
