// Generated by CoffeeScript 1.6.2
var AutoReloader, WebSocketServer, isCss, sysPath,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

sysPath = require('path');

WebSocketServer = (require('ws')).Server;

isCss = function(file) {
  return sysPath.extname(file.path) === '.css';
};

module.exports = AutoReloader = (function() {
  AutoReloader.prototype.brunchPlugin = true;

  function AutoReloader(config) {
    var cfg, port, _ref, _ref1, _ref2, _ref3,
      _this = this;

    this.config = config;
    this.onCompile = __bind(this.onCompile, this);
    if (this.config.autoReload) {
      console.warn('Warning: config.autoReload is deprecated, please move it to config.plugins.autoReload');
    }
    this.enabled = this.config.persistent && !this.config.optimize;
    this.connections = [];
    if (this.enabled) {
      cfg = (_ref = (_ref1 = (_ref2 = this.config.plugins) != null ? _ref2.autoReload : void 0) != null ? _ref1 : this.config.autoReload) != null ? _ref : {};
      port = (_ref3 = cfg.port) != null ? _ref3 : 9485;
      this.server = new WebSocketServer({
        host: '0.0.0.0',
        port: port
      });
      this.server.on('connection', function(connection) {
        _this.connections.push(connection);
        return connection.on('close', function() {
          return _this.connections.splice(connection, 1);
        });
      });
    }
  }

  AutoReloader.prototype.onCompile = function(changedFiles) {
    var allCss, message,
      _this = this;

    if (!this.enabled) {
      return;
    }
    allCss = (changedFiles.length > 0) && changedFiles.every(isCss);
    message = allCss ? 'stylesheet' : 'page';
    return this.connections.filter(function(connection) {
      return connection.readyState === 1;
    }).forEach(function(connection) {
      return connection.send(message);
    });
  };

  AutoReloader.prototype.include = function() {
    if (this.enabled) {
      return [sysPath.join(__dirname, '..', 'vendor', 'auto-reload.js')];
    } else {
      return [];
    }
  };

  AutoReloader.prototype.teardown = function() {
    var _ref;

    return (_ref = this.server) != null ? _ref.close() : void 0;
  };

  return AutoReloader;

})();
