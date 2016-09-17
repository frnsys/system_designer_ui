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
      draggingModuleId: undefined
    });
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

function Draggable(module) {
  return DragSource(
    'module',
    dragSource,
    collect
  )(module);
}

export default Draggable;
