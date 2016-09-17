import './css/index.sass';

import React from 'react';
import ReactDOM from 'react-dom';
import Project from 'src/Project';
import Workspace from 'components/Workspace';

ReactDOM.render(
  <Workspace project={new Project()} />,
  document.getElementById('root'));
