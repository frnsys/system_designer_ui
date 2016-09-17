import React from 'react';
import BaseModule from './Base';
import FunctionComponent from 'components/modules/Function';

class FunctionModule extends BaseModule {
  constructor(name) {
    super(name);

    // TODO make these distinct
    this.ins = {
      _x: { // temp calling it '_x' so it doesn't interfere with the chart
        default: 0
      }
    };

    // TODO
    this.outs = ['y'];
  }

  component(scene) {
    return <FunctionComponent module={this}
            scene={scene} key={this.id}
            ref={scene.registerModule.bind(scene, this.id)}
            project={scene.props.project} />;
  }
}

export default FunctionModule;
