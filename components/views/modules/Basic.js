import React from 'react';
import { DragSource } from 'react-dnd';

const dragSource = {
  beginDrag(props) {
    props.scene.setState({
      draggingModuleId: props.module.id
    });
    return {id: props.module.id};
  },

  endDrag(props) {
    props.scene.setState({
      draggingModuleId:undefined
    });
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class BasicModuleComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {disableDrag: false};
  }

  render() {
    // hide while dragging
    if (this.props.isDragging) {
      return null;
    }
    const pos = this.props.project.positions[this.props.module.id];
    const style = {
      position: 'absolute',
      top: pos.y,
      left: pos.x,
      opacity: this.props.isDragging ? 0.5 : 1
    };
    const element = <div className="module-basic"
        data-module-id={this.props.module.id}
        style={style}>
        <div className="inputs">
          {
            this.props.module.ins.map((input, i) =>
              <span className="input" data-input-index={i} key={i}></span>)
          }
        </div>
        <div className="outputs">
          {
            this.props.module.outs.map((output, i) =>
              (<span className="output" data-output-index={i}
                onMouseDown={this.onOutputMouseDown.bind(this, i)}
                onMouseEnter={() => this.setState({ disableDrag: true })}
                onMouseLeave={() => this.setState({ disableDrag: false })}
                key={i}
              />)
            , this)
          }
        </div>
      </div>;
    if (this.state.disableDrag) {
      return element;
    } else {
      return this.props.connectDragSource(element);
    }
  }

  onOutputMouseDown(outputNum, ev) {
    this.props.scene.drawTentativeEdge(
      this.props.module,
      outputNum,
      ev.clientX,
      ev.clientY);
    ev.stopPropagation();
  }
};


BasicModuleComponent.propTypes = {
  project: React.PropTypes.object.isRequired,
  module: React.PropTypes.object.isRequired,
  scene: React.PropTypes.object.isRequired,
  disableDrag: React.PropTypes.bool.isRequired,

  // required by react-dnd
  isDragging: React.PropTypes.bool.isRequired,
  connectDragSource: React.PropTypes.func.isRequired
};
BasicModuleComponent.defaultProps = {disableDrag: false};

export default DragSource(
  'module',
  dragSource,
  collect
)(BasicModuleComponent);
