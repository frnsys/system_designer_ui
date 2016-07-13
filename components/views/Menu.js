import React from 'react';
import Module from '../Module';
import Events from '../Events';


class Menu extends React.Component {
  render() {
    return (
      <ul className="menu">
        <li onClick={this.addModule.bind(this)}>+ add module</li>
      </ul>
    );
  }

  addModule() {
    // TODO temp arbitrary
    var mod = new Module('new module');
    this.props.project.addModule(mod, 100, 100);
    Events.emit('module_added', mod);
  }
}

Menu.propTypes = {
  project: React.PropTypes.object.isRequired
}

export default Menu;

