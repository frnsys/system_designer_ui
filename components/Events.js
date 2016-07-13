var Events = {
  registry: {},

  on: function(name, callback) {
    if (this.registry[name] === undefined) {
      this.registry[name] = [];
    }
    this.registry[name].push(callback);
  },

  off: function(name, callback) {
    if (this.registry[name] !== undefined) {
      let idx = this.registry[name].indexOf(callback);
      if (idx > -1) {
        this.registry[name].splice(idx, 1);
      }
    }
  },

  emit: function(name, data) {
    if (this.registry[name] !== undefined) {
      this.registry[name].forEach(cb => cb(data));
    }
  }
}

export default Events;
