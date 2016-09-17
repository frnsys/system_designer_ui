import React from 'react';
import Menu from './Menu';
import Scene from './Scene';

class Workspace extends React.Component {
  render() {
    return (
      <main>
        <Menu project={this.props.project} />
        <Scene project={this.props.project} />
      </main>
    );
  }
}

Workspace.propTypes = {
  project: React.PropTypes.object.isRequired
}

export default Workspace;
