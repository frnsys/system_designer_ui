import './css/index.sass';

import React from 'react';
import ReactDOM from 'react-dom';
import Project from './components/Project';
import Workspace from './components/views/Workspace';

ReactDOM.render(
  <Workspace project={new Project()} />,
  document.getElementById('root'));
