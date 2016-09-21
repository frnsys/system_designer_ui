import React from 'react';
import Events from 'src/Events';
import FunctionModule from 'src/modules/Function';
import GeneratorModule from 'src/modules/Generator';


class Menu extends React.Component {
  render() {
    return (
      <ul className="menu">
        <li onClick={this.addModule.bind(this, FunctionModule)}>+ add function</li>
        <li onClick={this.addModule.bind(this, GeneratorModule)}>+ add generator</li>
      </ul>
    );
  }

  addModule(type) {
    var mod = new type('new module');
    this.props.project.addModule(mod);
    Events.emit('module_added', mod);
  }
}

Menu.propTypes = {
  project: React.PropTypes.object.isRequired
}

export default Menu;
