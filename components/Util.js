import _ from 'underscore';

function s4() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

function guid() {
  return (s4() + s4() + "-" + s4() + "-4" + s4().substr(0,3) + "-" + s4() + "-" + s4() + s4() + s4()).toLowerCase();
}

// hacky way to bind handlers
function bindHandlers(obj, handlers) {
  _.each(handlers, n => obj[n] = obj[n].bind(obj));
}

export { guid, bindHandlers };
