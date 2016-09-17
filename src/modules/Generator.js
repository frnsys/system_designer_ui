import React from 'react';
import BaseModule from './Base';
import { jStat } from 'jstat'; // TEMP TODO
import GeneratorComponent from 'components/modules/Generator';

class GeneratorModule extends BaseModule {
  constructor(name) {
    super(name);

    // TODO make these distinct
    this.ins = {
      mean: {
        default: 0
      },
      std: {
        default: 1,
        validate: v => v > 0
      }
    };

    // TODO
    this.outs = ['b'];

    // TODO
    this.func = (data) => jStat.normal.pdf(data.x, data.vars.mean, data.vars.std);
  }

  component(scene) {
    return <GeneratorComponent module={this}
            scene={scene} key={this.id}
            ref={scene.registerModule.bind(scene, this.id)}
            project={scene.props.project} />;
  }
}

export default GeneratorModule;
