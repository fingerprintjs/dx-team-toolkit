"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/.pnpm/universalify@0.1.2/node_modules/universalify/index.js
var require_universalify = __commonJS({
  "node_modules/.pnpm/universalify@0.1.2/node_modules/universalify/index.js"(exports2) {
    "use strict";
    exports2.fromCallback = function(fn) {
      return Object.defineProperty(function() {
        if (typeof arguments[arguments.length - 1] === "function") fn.apply(this, arguments);
        else {
          return new Promise((resolve, reject) => {
            arguments[arguments.length] = (err, res) => {
              if (err) return reject(err);
              resolve(res);
            };
            arguments.length++;
            fn.apply(this, arguments);
          });
        }
      }, "name", { value: fn.name });
    };
    exports2.fromPromise = function(fn) {
      return Object.defineProperty(function() {
        const cb = arguments[arguments.length - 1];
        if (typeof cb !== "function") return fn.apply(this, arguments);
        else fn.apply(this, arguments).then((r) => cb(null, r), cb);
      }, "name", { value: fn.name });
    };
  }
});

// node_modules/.pnpm/graceful-fs@4.2.11/node_modules/graceful-fs/polyfills.js
var require_polyfills = __commonJS({
  "node_modules/.pnpm/graceful-fs@4.2.11/node_modules/graceful-fs/polyfills.js"(exports2, module2) {
    "use strict";
    var constants = require("constants");
    var origCwd = process.cwd;
    var cwd = null;
    var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
    process.cwd = function() {
      if (!cwd)
        cwd = origCwd.call(process);
      return cwd;
    };
    try {
      process.cwd();
    } catch (er) {
    }
    if (typeof process.chdir === "function") {
      chdir = process.chdir;
      process.chdir = function(d) {
        cwd = null;
        chdir.call(process, d);
      };
      if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, chdir);
    }
    var chdir;
    module2.exports = patch;
    function patch(fs5) {
      if (constants.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
        patchLchmod(fs5);
      }
      if (!fs5.lutimes) {
        patchLutimes(fs5);
      }
      fs5.chown = chownFix(fs5.chown);
      fs5.fchown = chownFix(fs5.fchown);
      fs5.lchown = chownFix(fs5.lchown);
      fs5.chmod = chmodFix(fs5.chmod);
      fs5.fchmod = chmodFix(fs5.fchmod);
      fs5.lchmod = chmodFix(fs5.lchmod);
      fs5.chownSync = chownFixSync(fs5.chownSync);
      fs5.fchownSync = chownFixSync(fs5.fchownSync);
      fs5.lchownSync = chownFixSync(fs5.lchownSync);
      fs5.chmodSync = chmodFixSync(fs5.chmodSync);
      fs5.fchmodSync = chmodFixSync(fs5.fchmodSync);
      fs5.lchmodSync = chmodFixSync(fs5.lchmodSync);
      fs5.stat = statFix(fs5.stat);
      fs5.fstat = statFix(fs5.fstat);
      fs5.lstat = statFix(fs5.lstat);
      fs5.statSync = statFixSync(fs5.statSync);
      fs5.fstatSync = statFixSync(fs5.fstatSync);
      fs5.lstatSync = statFixSync(fs5.lstatSync);
      if (fs5.chmod && !fs5.lchmod) {
        fs5.lchmod = function(path6, mode, cb) {
          if (cb) process.nextTick(cb);
        };
        fs5.lchmodSync = function() {
        };
      }
      if (fs5.chown && !fs5.lchown) {
        fs5.lchown = function(path6, uid, gid, cb) {
          if (cb) process.nextTick(cb);
        };
        fs5.lchownSync = function() {
        };
      }
      if (platform === "win32") {
        fs5.rename = typeof fs5.rename !== "function" ? fs5.rename : (function(fs$rename) {
          function rename(from, to, cb) {
            var start = Date.now();
            var backoff = 0;
            fs$rename(from, to, function CB(er) {
              if (er && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY") && Date.now() - start < 6e4) {
                setTimeout(function() {
                  fs5.stat(to, function(stater, st) {
                    if (stater && stater.code === "ENOENT")
                      fs$rename(from, to, CB);
                    else
                      cb(er);
                  });
                }, backoff);
                if (backoff < 100)
                  backoff += 10;
                return;
              }
              if (cb) cb(er);
            });
          }
          if (Object.setPrototypeOf) Object.setPrototypeOf(rename, fs$rename);
          return rename;
        })(fs5.rename);
      }
      fs5.read = typeof fs5.read !== "function" ? fs5.read : (function(fs$read) {
        function read(fd, buffer, offset, length, position, callback_) {
          var callback;
          if (callback_ && typeof callback_ === "function") {
            var eagCounter = 0;
            callback = function(er, _, __) {
              if (er && er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                return fs$read.call(fs5, fd, buffer, offset, length, position, callback);
              }
              callback_.apply(this, arguments);
            };
          }
          return fs$read.call(fs5, fd, buffer, offset, length, position, callback);
        }
        if (Object.setPrototypeOf) Object.setPrototypeOf(read, fs$read);
        return read;
      })(fs5.read);
      fs5.readSync = typeof fs5.readSync !== "function" ? fs5.readSync : /* @__PURE__ */ (function(fs$readSync) {
        return function(fd, buffer, offset, length, position) {
          var eagCounter = 0;
          while (true) {
            try {
              return fs$readSync.call(fs5, fd, buffer, offset, length, position);
            } catch (er) {
              if (er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                continue;
              }
              throw er;
            }
          }
        };
      })(fs5.readSync);
      function patchLchmod(fs6) {
        fs6.lchmod = function(path6, mode, callback) {
          fs6.open(
            path6,
            constants.O_WRONLY | constants.O_SYMLINK,
            mode,
            function(err, fd) {
              if (err) {
                if (callback) callback(err);
                return;
              }
              fs6.fchmod(fd, mode, function(err2) {
                fs6.close(fd, function(err22) {
                  if (callback) callback(err2 || err22);
                });
              });
            }
          );
        };
        fs6.lchmodSync = function(path6, mode) {
          var fd = fs6.openSync(path6, constants.O_WRONLY | constants.O_SYMLINK, mode);
          var threw = true;
          var ret;
          try {
            ret = fs6.fchmodSync(fd, mode);
            threw = false;
          } finally {
            if (threw) {
              try {
                fs6.closeSync(fd);
              } catch (er) {
              }
            } else {
              fs6.closeSync(fd);
            }
          }
          return ret;
        };
      }
      function patchLutimes(fs6) {
        if (constants.hasOwnProperty("O_SYMLINK") && fs6.futimes) {
          fs6.lutimes = function(path6, at, mt, cb) {
            fs6.open(path6, constants.O_SYMLINK, function(er, fd) {
              if (er) {
                if (cb) cb(er);
                return;
              }
              fs6.futimes(fd, at, mt, function(er2) {
                fs6.close(fd, function(er22) {
                  if (cb) cb(er2 || er22);
                });
              });
            });
          };
          fs6.lutimesSync = function(path6, at, mt) {
            var fd = fs6.openSync(path6, constants.O_SYMLINK);
            var ret;
            var threw = true;
            try {
              ret = fs6.futimesSync(fd, at, mt);
              threw = false;
            } finally {
              if (threw) {
                try {
                  fs6.closeSync(fd);
                } catch (er) {
                }
              } else {
                fs6.closeSync(fd);
              }
            }
            return ret;
          };
        } else if (fs6.futimes) {
          fs6.lutimes = function(_a2, _b, _c, cb) {
            if (cb) process.nextTick(cb);
          };
          fs6.lutimesSync = function() {
          };
        }
      }
      function chmodFix(orig) {
        if (!orig) return orig;
        return function(target, mode, cb) {
          return orig.call(fs5, target, mode, function(er) {
            if (chownErOk(er)) er = null;
            if (cb) cb.apply(this, arguments);
          });
        };
      }
      function chmodFixSync(orig) {
        if (!orig) return orig;
        return function(target, mode) {
          try {
            return orig.call(fs5, target, mode);
          } catch (er) {
            if (!chownErOk(er)) throw er;
          }
        };
      }
      function chownFix(orig) {
        if (!orig) return orig;
        return function(target, uid, gid, cb) {
          return orig.call(fs5, target, uid, gid, function(er) {
            if (chownErOk(er)) er = null;
            if (cb) cb.apply(this, arguments);
          });
        };
      }
      function chownFixSync(orig) {
        if (!orig) return orig;
        return function(target, uid, gid) {
          try {
            return orig.call(fs5, target, uid, gid);
          } catch (er) {
            if (!chownErOk(er)) throw er;
          }
        };
      }
      function statFix(orig) {
        if (!orig) return orig;
        return function(target, options, cb) {
          if (typeof options === "function") {
            cb = options;
            options = null;
          }
          function callback(er, stats) {
            if (stats) {
              if (stats.uid < 0) stats.uid += 4294967296;
              if (stats.gid < 0) stats.gid += 4294967296;
            }
            if (cb) cb.apply(this, arguments);
          }
          return options ? orig.call(fs5, target, options, callback) : orig.call(fs5, target, callback);
        };
      }
      function statFixSync(orig) {
        if (!orig) return orig;
        return function(target, options) {
          var stats = options ? orig.call(fs5, target, options) : orig.call(fs5, target);
          if (stats) {
            if (stats.uid < 0) stats.uid += 4294967296;
            if (stats.gid < 0) stats.gid += 4294967296;
          }
          return stats;
        };
      }
      function chownErOk(er) {
        if (!er)
          return true;
        if (er.code === "ENOSYS")
          return true;
        var nonroot = !process.getuid || process.getuid() !== 0;
        if (nonroot) {
          if (er.code === "EINVAL" || er.code === "EPERM")
            return true;
        }
        return false;
      }
    }
  }
});

// node_modules/.pnpm/graceful-fs@4.2.11/node_modules/graceful-fs/legacy-streams.js
var require_legacy_streams = __commonJS({
  "node_modules/.pnpm/graceful-fs@4.2.11/node_modules/graceful-fs/legacy-streams.js"(exports2, module2) {
    "use strict";
    var Stream2 = require("stream").Stream;
    module2.exports = legacy;
    function legacy(fs5) {
      return {
        ReadStream,
        WriteStream
      };
      function ReadStream(path6, options) {
        if (!(this instanceof ReadStream)) return new ReadStream(path6, options);
        Stream2.call(this);
        var self2 = this;
        this.path = path6;
        this.fd = null;
        this.readable = true;
        this.paused = false;
        this.flags = "r";
        this.mode = 438;
        this.bufferSize = 64 * 1024;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (this.encoding) this.setEncoding(this.encoding);
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.end === void 0) {
            this.end = Infinity;
          } else if ("number" !== typeof this.end) {
            throw TypeError("end must be a Number");
          }
          if (this.start > this.end) {
            throw new Error("start must be <= end");
          }
          this.pos = this.start;
        }
        if (this.fd !== null) {
          process.nextTick(function() {
            self2._read();
          });
          return;
        }
        fs5.open(this.path, this.flags, this.mode, function(err, fd) {
          if (err) {
            self2.emit("error", err);
            self2.readable = false;
            return;
          }
          self2.fd = fd;
          self2.emit("open", fd);
          self2._read();
        });
      }
      function WriteStream(path6, options) {
        if (!(this instanceof WriteStream)) return new WriteStream(path6, options);
        Stream2.call(this);
        this.path = path6;
        this.fd = null;
        this.writable = true;
        this.flags = "w";
        this.encoding = "binary";
        this.mode = 438;
        this.bytesWritten = 0;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.start < 0) {
            throw new Error("start must be >= zero");
          }
          this.pos = this.start;
        }
        this.busy = false;
        this._queue = [];
        if (this.fd === null) {
          this._open = fs5.open;
          this._queue.push([this._open, this.path, this.flags, this.mode, void 0]);
          this.flush();
        }
      }
    }
  }
});

// node_modules/.pnpm/graceful-fs@4.2.11/node_modules/graceful-fs/clone.js
var require_clone = __commonJS({
  "node_modules/.pnpm/graceful-fs@4.2.11/node_modules/graceful-fs/clone.js"(exports2, module2) {
    "use strict";
    module2.exports = clone;
    var getPrototypeOf = Object.getPrototypeOf || function(obj) {
      return obj.__proto__;
    };
    function clone(obj) {
      if (obj === null || typeof obj !== "object")
        return obj;
      if (obj instanceof Object)
        var copy = { __proto__: getPrototypeOf(obj) };
      else
        var copy = /* @__PURE__ */ Object.create(null);
      Object.getOwnPropertyNames(obj).forEach(function(key) {
        Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key));
      });
      return copy;
    }
  }
});

// node_modules/.pnpm/graceful-fs@4.2.11/node_modules/graceful-fs/graceful-fs.js
var require_graceful_fs = __commonJS({
  "node_modules/.pnpm/graceful-fs@4.2.11/node_modules/graceful-fs/graceful-fs.js"(exports2, module2) {
    "use strict";
    var fs5 = require("fs");
    var polyfills = require_polyfills();
    var legacy = require_legacy_streams();
    var clone = require_clone();
    var util2 = require("util");
    var gracefulQueue;
    var previousSymbol;
    if (typeof Symbol === "function" && typeof Symbol.for === "function") {
      gracefulQueue = /* @__PURE__ */ Symbol.for("graceful-fs.queue");
      previousSymbol = /* @__PURE__ */ Symbol.for("graceful-fs.previous");
    } else {
      gracefulQueue = "___graceful-fs.queue";
      previousSymbol = "___graceful-fs.previous";
    }
    function noop() {
    }
    function publishQueue(context, queue2) {
      Object.defineProperty(context, gracefulQueue, {
        get: function() {
          return queue2;
        }
      });
    }
    var debug = noop;
    if (util2.debuglog)
      debug = util2.debuglog("gfs4");
    else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ""))
      debug = function() {
        var m = util2.format.apply(util2, arguments);
        m = "GFS4: " + m.split(/\n/).join("\nGFS4: ");
        console.error(m);
      };
    if (!fs5[gracefulQueue]) {
      queue = global[gracefulQueue] || [];
      publishQueue(fs5, queue);
      fs5.close = (function(fs$close) {
        function close(fd, cb) {
          return fs$close.call(fs5, fd, function(err) {
            if (!err) {
              resetQueue();
            }
            if (typeof cb === "function")
              cb.apply(this, arguments);
          });
        }
        Object.defineProperty(close, previousSymbol, {
          value: fs$close
        });
        return close;
      })(fs5.close);
      fs5.closeSync = (function(fs$closeSync) {
        function closeSync(fd) {
          fs$closeSync.apply(fs5, arguments);
          resetQueue();
        }
        Object.defineProperty(closeSync, previousSymbol, {
          value: fs$closeSync
        });
        return closeSync;
      })(fs5.closeSync);
      if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
        process.on("exit", function() {
          debug(fs5[gracefulQueue]);
          require("assert").equal(fs5[gracefulQueue].length, 0);
        });
      }
    }
    var queue;
    if (!global[gracefulQueue]) {
      publishQueue(global, fs5[gracefulQueue]);
    }
    module2.exports = patch(clone(fs5));
    if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs5.__patched) {
      module2.exports = patch(fs5);
      fs5.__patched = true;
    }
    function patch(fs6) {
      polyfills(fs6);
      fs6.gracefulify = patch;
      fs6.createReadStream = createReadStream;
      fs6.createWriteStream = createWriteStream;
      var fs$readFile = fs6.readFile;
      fs6.readFile = readFile2;
      function readFile2(path6, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$readFile(path6, options, cb);
        function go$readFile(path7, options2, cb2, startTime) {
          return fs$readFile(path7, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$readFile, [path7, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$writeFile = fs6.writeFile;
      fs6.writeFile = writeFile;
      function writeFile(path6, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$writeFile(path6, data, options, cb);
        function go$writeFile(path7, data2, options2, cb2, startTime) {
          return fs$writeFile(path7, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$writeFile, [path7, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$appendFile = fs6.appendFile;
      if (fs$appendFile)
        fs6.appendFile = appendFile;
      function appendFile(path6, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$appendFile(path6, data, options, cb);
        function go$appendFile(path7, data2, options2, cb2, startTime) {
          return fs$appendFile(path7, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$appendFile, [path7, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$copyFile = fs6.copyFile;
      if (fs$copyFile)
        fs6.copyFile = copyFile;
      function copyFile(src, dest, flags, cb) {
        if (typeof flags === "function") {
          cb = flags;
          flags = 0;
        }
        return go$copyFile(src, dest, flags, cb);
        function go$copyFile(src2, dest2, flags2, cb2, startTime) {
          return fs$copyFile(src2, dest2, flags2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$copyFile, [src2, dest2, flags2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$readdir = fs6.readdir;
      fs6.readdir = readdir2;
      var noReaddirOptionVersions = /^v[0-5]\./;
      function readdir2(path6, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir2(path7, options2, cb2, startTime) {
          return fs$readdir(path7, fs$readdirCallback(
            path7,
            options2,
            cb2,
            startTime
          ));
        } : function go$readdir2(path7, options2, cb2, startTime) {
          return fs$readdir(path7, options2, fs$readdirCallback(
            path7,
            options2,
            cb2,
            startTime
          ));
        };
        return go$readdir(path6, options, cb);
        function fs$readdirCallback(path7, options2, cb2, startTime) {
          return function(err, files) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([
                go$readdir,
                [path7, options2, cb2],
                err,
                startTime || Date.now(),
                Date.now()
              ]);
            else {
              if (files && files.sort)
                files.sort();
              if (typeof cb2 === "function")
                cb2.call(this, err, files);
            }
          };
        }
      }
      if (process.version.substr(0, 4) === "v0.8") {
        var legStreams = legacy(fs6);
        ReadStream = legStreams.ReadStream;
        WriteStream = legStreams.WriteStream;
      }
      var fs$ReadStream = fs6.ReadStream;
      if (fs$ReadStream) {
        ReadStream.prototype = Object.create(fs$ReadStream.prototype);
        ReadStream.prototype.open = ReadStream$open;
      }
      var fs$WriteStream = fs6.WriteStream;
      if (fs$WriteStream) {
        WriteStream.prototype = Object.create(fs$WriteStream.prototype);
        WriteStream.prototype.open = WriteStream$open;
      }
      Object.defineProperty(fs6, "ReadStream", {
        get: function() {
          return ReadStream;
        },
        set: function(val) {
          ReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(fs6, "WriteStream", {
        get: function() {
          return WriteStream;
        },
        set: function(val) {
          WriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileReadStream = ReadStream;
      Object.defineProperty(fs6, "FileReadStream", {
        get: function() {
          return FileReadStream;
        },
        set: function(val) {
          FileReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileWriteStream = WriteStream;
      Object.defineProperty(fs6, "FileWriteStream", {
        get: function() {
          return FileWriteStream;
        },
        set: function(val) {
          FileWriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      function ReadStream(path6, options) {
        if (this instanceof ReadStream)
          return fs$ReadStream.apply(this, arguments), this;
        else
          return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
      }
      function ReadStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            if (that.autoClose)
              that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
            that.read();
          }
        });
      }
      function WriteStream(path6, options) {
        if (this instanceof WriteStream)
          return fs$WriteStream.apply(this, arguments), this;
        else
          return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
      }
      function WriteStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
          }
        });
      }
      function createReadStream(path6, options) {
        return new fs6.ReadStream(path6, options);
      }
      function createWriteStream(path6, options) {
        return new fs6.WriteStream(path6, options);
      }
      var fs$open = fs6.open;
      fs6.open = open;
      function open(path6, flags, mode, cb) {
        if (typeof mode === "function")
          cb = mode, mode = null;
        return go$open(path6, flags, mode, cb);
        function go$open(path7, flags2, mode2, cb2, startTime) {
          return fs$open(path7, flags2, mode2, function(err, fd) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$open, [path7, flags2, mode2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      return fs6;
    }
    function enqueue(elem) {
      debug("ENQUEUE", elem[0].name, elem[1]);
      fs5[gracefulQueue].push(elem);
      retry();
    }
    var retryTimer;
    function resetQueue() {
      var now = Date.now();
      for (var i = 0; i < fs5[gracefulQueue].length; ++i) {
        if (fs5[gracefulQueue][i].length > 2) {
          fs5[gracefulQueue][i][3] = now;
          fs5[gracefulQueue][i][4] = now;
        }
      }
      retry();
    }
    function retry() {
      clearTimeout(retryTimer);
      retryTimer = void 0;
      if (fs5[gracefulQueue].length === 0)
        return;
      var elem = fs5[gracefulQueue].shift();
      var fn = elem[0];
      var args = elem[1];
      var err = elem[2];
      var startTime = elem[3];
      var lastTime = elem[4];
      if (startTime === void 0) {
        debug("RETRY", fn.name, args);
        fn.apply(null, args);
      } else if (Date.now() - startTime >= 6e4) {
        debug("TIMEOUT", fn.name, args);
        var cb = args.pop();
        if (typeof cb === "function")
          cb.call(null, err);
      } else {
        var sinceAttempt = Date.now() - lastTime;
        var sinceStart = Math.max(lastTime - startTime, 1);
        var desiredDelay = Math.min(sinceStart * 1.2, 100);
        if (sinceAttempt >= desiredDelay) {
          debug("RETRY", fn.name, args);
          fn.apply(null, args.concat([startTime]));
        } else {
          fs5[gracefulQueue].push(elem);
        }
      }
      if (retryTimer === void 0) {
        retryTimer = setTimeout(retry, 0);
      }
    }
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/fs/index.js
var require_fs = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/fs/index.js"(exports2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs5 = require_graceful_fs();
    var api = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "copyFile",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "lchown",
      "lchmod",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "readFile",
      "readdir",
      "readlink",
      "realpath",
      "rename",
      "rmdir",
      "stat",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "writeFile"
    ].filter((key) => {
      return typeof fs5[key] === "function";
    });
    Object.keys(fs5).forEach((key) => {
      if (key === "promises") {
        return;
      }
      exports2[key] = fs5[key];
    });
    api.forEach((method) => {
      exports2[method] = u(fs5[method]);
    });
    exports2.exists = function(filename, callback) {
      if (typeof callback === "function") {
        return fs5.exists(filename, callback);
      }
      return new Promise((resolve) => {
        return fs5.exists(filename, resolve);
      });
    };
    exports2.read = function(fd, buffer, offset, length, position, callback) {
      if (typeof callback === "function") {
        return fs5.read(fd, buffer, offset, length, position, callback);
      }
      return new Promise((resolve, reject) => {
        fs5.read(fd, buffer, offset, length, position, (err, bytesRead, buffer2) => {
          if (err) return reject(err);
          resolve({ bytesRead, buffer: buffer2 });
        });
      });
    };
    exports2.write = function(fd, buffer, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs5.write(fd, buffer, ...args);
      }
      return new Promise((resolve, reject) => {
        fs5.write(fd, buffer, ...args, (err, bytesWritten, buffer2) => {
          if (err) return reject(err);
          resolve({ bytesWritten, buffer: buffer2 });
        });
      });
    };
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/mkdirs/win32.js
var require_win32 = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/mkdirs/win32.js"(exports2, module2) {
    "use strict";
    var path6 = require("path");
    function getRootPath(p) {
      p = path6.normalize(path6.resolve(p)).split(path6.sep);
      if (p.length > 0) return p[0];
      return null;
    }
    var INVALID_PATH_CHARS = /[<>:"|?*]/;
    function invalidWin32Path(p) {
      const rp = getRootPath(p);
      p = p.replace(rp, "");
      return INVALID_PATH_CHARS.test(p);
    }
    module2.exports = {
      getRootPath,
      invalidWin32Path
    };
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/mkdirs/mkdirs.js
var require_mkdirs = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/mkdirs/mkdirs.js"(exports2, module2) {
    "use strict";
    var fs5 = require_graceful_fs();
    var path6 = require("path");
    var invalidWin32Path = require_win32().invalidWin32Path;
    var o777 = parseInt("0777", 8);
    function mkdirs(p, opts, callback, made) {
      if (typeof opts === "function") {
        callback = opts;
        opts = {};
      } else if (!opts || typeof opts !== "object") {
        opts = { mode: opts };
      }
      if (process.platform === "win32" && invalidWin32Path(p)) {
        const errInval = new Error(p + " contains invalid WIN32 path characters.");
        errInval.code = "EINVAL";
        return callback(errInval);
      }
      let mode = opts.mode;
      const xfs = opts.fs || fs5;
      if (mode === void 0) {
        mode = o777 & ~process.umask();
      }
      if (!made) made = null;
      callback = callback || function() {
      };
      p = path6.resolve(p);
      xfs.mkdir(p, mode, (er) => {
        if (!er) {
          made = made || p;
          return callback(null, made);
        }
        switch (er.code) {
          case "ENOENT":
            if (path6.dirname(p) === p) return callback(er);
            mkdirs(path6.dirname(p), opts, (er2, made2) => {
              if (er2) callback(er2, made2);
              else mkdirs(p, opts, callback, made2);
            });
            break;
          // In the case of any other error, just see if there's a dir
          // there already.  If so, then hooray!  If not, then something
          // is borked.
          default:
            xfs.stat(p, (er2, stat) => {
              if (er2 || !stat.isDirectory()) callback(er, made);
              else callback(null, made);
            });
            break;
        }
      });
    }
    module2.exports = mkdirs;
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/mkdirs/mkdirs-sync.js
var require_mkdirs_sync = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/mkdirs/mkdirs-sync.js"(exports2, module2) {
    "use strict";
    var fs5 = require_graceful_fs();
    var path6 = require("path");
    var invalidWin32Path = require_win32().invalidWin32Path;
    var o777 = parseInt("0777", 8);
    function mkdirsSync(p, opts, made) {
      if (!opts || typeof opts !== "object") {
        opts = { mode: opts };
      }
      let mode = opts.mode;
      const xfs = opts.fs || fs5;
      if (process.platform === "win32" && invalidWin32Path(p)) {
        const errInval = new Error(p + " contains invalid WIN32 path characters.");
        errInval.code = "EINVAL";
        throw errInval;
      }
      if (mode === void 0) {
        mode = o777 & ~process.umask();
      }
      if (!made) made = null;
      p = path6.resolve(p);
      try {
        xfs.mkdirSync(p, mode);
        made = made || p;
      } catch (err0) {
        if (err0.code === "ENOENT") {
          if (path6.dirname(p) === p) throw err0;
          made = mkdirsSync(path6.dirname(p), opts, made);
          mkdirsSync(p, opts, made);
        } else {
          let stat;
          try {
            stat = xfs.statSync(p);
          } catch (err1) {
            throw err0;
          }
          if (!stat.isDirectory()) throw err0;
        }
      }
      return made;
    }
    module2.exports = mkdirsSync;
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/mkdirs/index.js
var require_mkdirs2 = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/mkdirs/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var mkdirs = u(require_mkdirs());
    var mkdirsSync = require_mkdirs_sync();
    module2.exports = {
      mkdirs,
      mkdirsSync,
      // alias
      mkdirp: mkdirs,
      mkdirpSync: mkdirsSync,
      ensureDir: mkdirs,
      ensureDirSync: mkdirsSync
    };
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/util/utimes.js
var require_utimes = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/util/utimes.js"(exports2, module2) {
    "use strict";
    var fs5 = require_graceful_fs();
    var os = require("os");
    var path6 = require("path");
    function hasMillisResSync() {
      let tmpfile = path6.join("millis-test-sync" + Date.now().toString() + Math.random().toString().slice(2));
      tmpfile = path6.join(os.tmpdir(), tmpfile);
      const d = /* @__PURE__ */ new Date(1435410243862);
      fs5.writeFileSync(tmpfile, "https://github.com/jprichardson/node-fs-extra/pull/141");
      const fd = fs5.openSync(tmpfile, "r+");
      fs5.futimesSync(fd, d, d);
      fs5.closeSync(fd);
      return fs5.statSync(tmpfile).mtime > 1435410243e3;
    }
    function hasMillisRes(callback) {
      let tmpfile = path6.join("millis-test" + Date.now().toString() + Math.random().toString().slice(2));
      tmpfile = path6.join(os.tmpdir(), tmpfile);
      const d = /* @__PURE__ */ new Date(1435410243862);
      fs5.writeFile(tmpfile, "https://github.com/jprichardson/node-fs-extra/pull/141", (err) => {
        if (err) return callback(err);
        fs5.open(tmpfile, "r+", (err2, fd) => {
          if (err2) return callback(err2);
          fs5.futimes(fd, d, d, (err3) => {
            if (err3) return callback(err3);
            fs5.close(fd, (err4) => {
              if (err4) return callback(err4);
              fs5.stat(tmpfile, (err5, stats) => {
                if (err5) return callback(err5);
                callback(null, stats.mtime > 1435410243e3);
              });
            });
          });
        });
      });
    }
    function timeRemoveMillis(timestamp) {
      if (typeof timestamp === "number") {
        return Math.floor(timestamp / 1e3) * 1e3;
      } else if (timestamp instanceof Date) {
        return new Date(Math.floor(timestamp.getTime() / 1e3) * 1e3);
      } else {
        throw new Error("fs-extra: timeRemoveMillis() unknown parameter type");
      }
    }
    function utimesMillis(path7, atime, mtime, callback) {
      fs5.open(path7, "r+", (err, fd) => {
        if (err) return callback(err);
        fs5.futimes(fd, atime, mtime, (futimesErr) => {
          fs5.close(fd, (closeErr) => {
            if (callback) callback(futimesErr || closeErr);
          });
        });
      });
    }
    function utimesMillisSync(path7, atime, mtime) {
      const fd = fs5.openSync(path7, "r+");
      fs5.futimesSync(fd, atime, mtime);
      return fs5.closeSync(fd);
    }
    module2.exports = {
      hasMillisRes,
      hasMillisResSync,
      timeRemoveMillis,
      utimesMillis,
      utimesMillisSync
    };
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/util/buffer.js
var require_buffer = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/util/buffer.js"(exports2, module2) {
    "use strict";
    module2.exports = function(size) {
      if (typeof Buffer.allocUnsafe === "function") {
        try {
          return Buffer.allocUnsafe(size);
        } catch (e) {
          return new Buffer(size);
        }
      }
      return new Buffer(size);
    };
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/copy-sync/copy-sync.js
var require_copy_sync = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/copy-sync/copy-sync.js"(exports2, module2) {
    "use strict";
    var fs5 = require_graceful_fs();
    var path6 = require("path");
    var mkdirpSync = require_mkdirs2().mkdirsSync;
    var utimesSync = require_utimes().utimesMillisSync;
    var notExist = /* @__PURE__ */ Symbol("notExist");
    function copySync(src, dest, opts) {
      if (typeof opts === "function") {
        opts = { filter: opts };
      }
      opts = opts || {};
      opts.clobber = "clobber" in opts ? !!opts.clobber : true;
      opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
      if (opts.preserveTimestamps && process.arch === "ia32") {
        console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;

    see https://github.com/jprichardson/node-fs-extra/issues/269`);
      }
      const destStat = checkPaths(src, dest);
      if (opts.filter && !opts.filter(src, dest)) return;
      const destParent = path6.dirname(dest);
      if (!fs5.existsSync(destParent)) mkdirpSync(destParent);
      return startCopy(destStat, src, dest, opts);
    }
    function startCopy(destStat, src, dest, opts) {
      if (opts.filter && !opts.filter(src, dest)) return;
      return getStats(destStat, src, dest, opts);
    }
    function getStats(destStat, src, dest, opts) {
      const statSync = opts.dereference ? fs5.statSync : fs5.lstatSync;
      const srcStat = statSync(src);
      if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts);
      else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts);
      else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts);
    }
    function onFile(srcStat, destStat, src, dest, opts) {
      if (destStat === notExist) return copyFile(srcStat, src, dest, opts);
      return mayCopyFile(srcStat, src, dest, opts);
    }
    function mayCopyFile(srcStat, src, dest, opts) {
      if (opts.overwrite) {
        fs5.unlinkSync(dest);
        return copyFile(srcStat, src, dest, opts);
      } else if (opts.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    function copyFile(srcStat, src, dest, opts) {
      if (typeof fs5.copyFileSync === "function") {
        fs5.copyFileSync(src, dest);
        fs5.chmodSync(dest, srcStat.mode);
        if (opts.preserveTimestamps) {
          return utimesSync(dest, srcStat.atime, srcStat.mtime);
        }
        return;
      }
      return copyFileFallback(srcStat, src, dest, opts);
    }
    function copyFileFallback(srcStat, src, dest, opts) {
      const BUF_LENGTH = 64 * 1024;
      const _buff = require_buffer()(BUF_LENGTH);
      const fdr = fs5.openSync(src, "r");
      const fdw = fs5.openSync(dest, "w", srcStat.mode);
      let pos = 0;
      while (pos < srcStat.size) {
        const bytesRead = fs5.readSync(fdr, _buff, 0, BUF_LENGTH, pos);
        fs5.writeSync(fdw, _buff, 0, bytesRead);
        pos += bytesRead;
      }
      if (opts.preserveTimestamps) fs5.futimesSync(fdw, srcStat.atime, srcStat.mtime);
      fs5.closeSync(fdr);
      fs5.closeSync(fdw);
    }
    function onDir(srcStat, destStat, src, dest, opts) {
      if (destStat === notExist) return mkDirAndCopy(srcStat, src, dest, opts);
      if (destStat && !destStat.isDirectory()) {
        throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
      }
      return copyDir(src, dest, opts);
    }
    function mkDirAndCopy(srcStat, src, dest, opts) {
      fs5.mkdirSync(dest);
      copyDir(src, dest, opts);
      return fs5.chmodSync(dest, srcStat.mode);
    }
    function copyDir(src, dest, opts) {
      fs5.readdirSync(src).forEach((item) => copyDirItem(item, src, dest, opts));
    }
    function copyDirItem(item, src, dest, opts) {
      const srcItem = path6.join(src, item);
      const destItem = path6.join(dest, item);
      const destStat = checkPaths(srcItem, destItem);
      return startCopy(destStat, srcItem, destItem, opts);
    }
    function onLink(destStat, src, dest, opts) {
      let resolvedSrc = fs5.readlinkSync(src);
      if (opts.dereference) {
        resolvedSrc = path6.resolve(process.cwd(), resolvedSrc);
      }
      if (destStat === notExist) {
        return fs5.symlinkSync(resolvedSrc, dest);
      } else {
        let resolvedDest;
        try {
          resolvedDest = fs5.readlinkSync(dest);
        } catch (err) {
          if (err.code === "EINVAL" || err.code === "UNKNOWN") return fs5.symlinkSync(resolvedSrc, dest);
          throw err;
        }
        if (opts.dereference) {
          resolvedDest = path6.resolve(process.cwd(), resolvedDest);
        }
        if (isSrcSubdir(resolvedSrc, resolvedDest)) {
          throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
        }
        if (fs5.statSync(dest).isDirectory() && isSrcSubdir(resolvedDest, resolvedSrc)) {
          throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
        }
        return copyLink(resolvedSrc, dest);
      }
    }
    function copyLink(resolvedSrc, dest) {
      fs5.unlinkSync(dest);
      return fs5.symlinkSync(resolvedSrc, dest);
    }
    function isSrcSubdir(src, dest) {
      const srcArray = path6.resolve(src).split(path6.sep);
      const destArray = path6.resolve(dest).split(path6.sep);
      return srcArray.reduce((acc, current, i) => acc && destArray[i] === current, true);
    }
    function checkStats(src, dest) {
      const srcStat = fs5.statSync(src);
      let destStat;
      try {
        destStat = fs5.statSync(dest);
      } catch (err) {
        if (err.code === "ENOENT") return { srcStat, destStat: notExist };
        throw err;
      }
      return { srcStat, destStat };
    }
    function checkPaths(src, dest) {
      const { srcStat, destStat } = checkStats(src, dest);
      if (destStat.ino && destStat.ino === srcStat.ino) {
        throw new Error("Source and destination must not be the same.");
      }
      if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
        throw new Error(`Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`);
      }
      return destStat;
    }
    module2.exports = copySync;
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/copy-sync/index.js
var require_copy_sync2 = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/copy-sync/index.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      copySync: require_copy_sync()
    };
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/path-exists/index.js
var require_path_exists = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/path-exists/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs5 = require_fs();
    function pathExists(path6) {
      return fs5.access(path6).then(() => true).catch(() => false);
    }
    module2.exports = {
      pathExists: u(pathExists),
      pathExistsSync: fs5.existsSync
    };
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/copy/copy.js
var require_copy = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/copy/copy.js"(exports2, module2) {
    "use strict";
    var fs5 = require_graceful_fs();
    var path6 = require("path");
    var mkdirp = require_mkdirs2().mkdirs;
    var pathExists = require_path_exists().pathExists;
    var utimes = require_utimes().utimesMillis;
    var notExist = /* @__PURE__ */ Symbol("notExist");
    function copy(src, dest, opts, cb) {
      if (typeof opts === "function" && !cb) {
        cb = opts;
        opts = {};
      } else if (typeof opts === "function") {
        opts = { filter: opts };
      }
      cb = cb || function() {
      };
      opts = opts || {};
      opts.clobber = "clobber" in opts ? !!opts.clobber : true;
      opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
      if (opts.preserveTimestamps && process.arch === "ia32") {
        console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;

    see https://github.com/jprichardson/node-fs-extra/issues/269`);
      }
      checkPaths(src, dest, (err, destStat) => {
        if (err) return cb(err);
        if (opts.filter) return handleFilter(checkParentDir, destStat, src, dest, opts, cb);
        return checkParentDir(destStat, src, dest, opts, cb);
      });
    }
    function checkParentDir(destStat, src, dest, opts, cb) {
      const destParent = path6.dirname(dest);
      pathExists(destParent, (err, dirExists) => {
        if (err) return cb(err);
        if (dirExists) return startCopy(destStat, src, dest, opts, cb);
        mkdirp(destParent, (err2) => {
          if (err2) return cb(err2);
          return startCopy(destStat, src, dest, opts, cb);
        });
      });
    }
    function handleFilter(onInclude, destStat, src, dest, opts, cb) {
      Promise.resolve(opts.filter(src, dest)).then((include) => {
        if (include) {
          if (destStat) return onInclude(destStat, src, dest, opts, cb);
          return onInclude(src, dest, opts, cb);
        }
        return cb();
      }, (error) => cb(error));
    }
    function startCopy(destStat, src, dest, opts, cb) {
      if (opts.filter) return handleFilter(getStats, destStat, src, dest, opts, cb);
      return getStats(destStat, src, dest, opts, cb);
    }
    function getStats(destStat, src, dest, opts, cb) {
      const stat = opts.dereference ? fs5.stat : fs5.lstat;
      stat(src, (err, srcStat) => {
        if (err) return cb(err);
        if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts, cb);
        else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts, cb);
        else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts, cb);
      });
    }
    function onFile(srcStat, destStat, src, dest, opts, cb) {
      if (destStat === notExist) return copyFile(srcStat, src, dest, opts, cb);
      return mayCopyFile(srcStat, src, dest, opts, cb);
    }
    function mayCopyFile(srcStat, src, dest, opts, cb) {
      if (opts.overwrite) {
        fs5.unlink(dest, (err) => {
          if (err) return cb(err);
          return copyFile(srcStat, src, dest, opts, cb);
        });
      } else if (opts.errorOnExist) {
        return cb(new Error(`'${dest}' already exists`));
      } else return cb();
    }
    function copyFile(srcStat, src, dest, opts, cb) {
      if (typeof fs5.copyFile === "function") {
        return fs5.copyFile(src, dest, (err) => {
          if (err) return cb(err);
          return setDestModeAndTimestamps(srcStat, dest, opts, cb);
        });
      }
      return copyFileFallback(srcStat, src, dest, opts, cb);
    }
    function copyFileFallback(srcStat, src, dest, opts, cb) {
      const rs = fs5.createReadStream(src);
      rs.on("error", (err) => cb(err)).once("open", () => {
        const ws = fs5.createWriteStream(dest, { mode: srcStat.mode });
        ws.on("error", (err) => cb(err)).on("open", () => rs.pipe(ws)).once("close", () => setDestModeAndTimestamps(srcStat, dest, opts, cb));
      });
    }
    function setDestModeAndTimestamps(srcStat, dest, opts, cb) {
      fs5.chmod(dest, srcStat.mode, (err) => {
        if (err) return cb(err);
        if (opts.preserveTimestamps) {
          return utimes(dest, srcStat.atime, srcStat.mtime, cb);
        }
        return cb();
      });
    }
    function onDir(srcStat, destStat, src, dest, opts, cb) {
      if (destStat === notExist) return mkDirAndCopy(srcStat, src, dest, opts, cb);
      if (destStat && !destStat.isDirectory()) {
        return cb(new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`));
      }
      return copyDir(src, dest, opts, cb);
    }
    function mkDirAndCopy(srcStat, src, dest, opts, cb) {
      fs5.mkdir(dest, (err) => {
        if (err) return cb(err);
        copyDir(src, dest, opts, (err2) => {
          if (err2) return cb(err2);
          return fs5.chmod(dest, srcStat.mode, cb);
        });
      });
    }
    function copyDir(src, dest, opts, cb) {
      fs5.readdir(src, (err, items) => {
        if (err) return cb(err);
        return copyDirItems(items, src, dest, opts, cb);
      });
    }
    function copyDirItems(items, src, dest, opts, cb) {
      const item = items.pop();
      if (!item) return cb();
      return copyDirItem(items, item, src, dest, opts, cb);
    }
    function copyDirItem(items, item, src, dest, opts, cb) {
      const srcItem = path6.join(src, item);
      const destItem = path6.join(dest, item);
      checkPaths(srcItem, destItem, (err, destStat) => {
        if (err) return cb(err);
        startCopy(destStat, srcItem, destItem, opts, (err2) => {
          if (err2) return cb(err2);
          return copyDirItems(items, src, dest, opts, cb);
        });
      });
    }
    function onLink(destStat, src, dest, opts, cb) {
      fs5.readlink(src, (err, resolvedSrc) => {
        if (err) return cb(err);
        if (opts.dereference) {
          resolvedSrc = path6.resolve(process.cwd(), resolvedSrc);
        }
        if (destStat === notExist) {
          return fs5.symlink(resolvedSrc, dest, cb);
        } else {
          fs5.readlink(dest, (err2, resolvedDest) => {
            if (err2) {
              if (err2.code === "EINVAL" || err2.code === "UNKNOWN") return fs5.symlink(resolvedSrc, dest, cb);
              return cb(err2);
            }
            if (opts.dereference) {
              resolvedDest = path6.resolve(process.cwd(), resolvedDest);
            }
            if (isSrcSubdir(resolvedSrc, resolvedDest)) {
              return cb(new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`));
            }
            if (destStat.isDirectory() && isSrcSubdir(resolvedDest, resolvedSrc)) {
              return cb(new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`));
            }
            return copyLink(resolvedSrc, dest, cb);
          });
        }
      });
    }
    function copyLink(resolvedSrc, dest, cb) {
      fs5.unlink(dest, (err) => {
        if (err) return cb(err);
        return fs5.symlink(resolvedSrc, dest, cb);
      });
    }
    function isSrcSubdir(src, dest) {
      const srcArray = path6.resolve(src).split(path6.sep);
      const destArray = path6.resolve(dest).split(path6.sep);
      return srcArray.reduce((acc, current, i) => acc && destArray[i] === current, true);
    }
    function checkStats(src, dest, cb) {
      fs5.stat(src, (err, srcStat) => {
        if (err) return cb(err);
        fs5.stat(dest, (err2, destStat) => {
          if (err2) {
            if (err2.code === "ENOENT") return cb(null, { srcStat, destStat: notExist });
            return cb(err2);
          }
          return cb(null, { srcStat, destStat });
        });
      });
    }
    function checkPaths(src, dest, cb) {
      checkStats(src, dest, (err, stats) => {
        if (err) return cb(err);
        const { srcStat, destStat } = stats;
        if (destStat.ino && destStat.ino === srcStat.ino) {
          return cb(new Error("Source and destination must not be the same."));
        }
        if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
          return cb(new Error(`Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`));
        }
        return cb(null, destStat);
      });
    }
    module2.exports = copy;
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/copy/index.js
var require_copy2 = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/copy/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    module2.exports = {
      copy: u(require_copy())
    };
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/remove/rimraf.js
var require_rimraf = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/remove/rimraf.js"(exports2, module2) {
    "use strict";
    var fs5 = require_graceful_fs();
    var path6 = require("path");
    var assert = require("assert");
    var isWindows = process.platform === "win32";
    function defaults2(options) {
      const methods = [
        "unlink",
        "chmod",
        "stat",
        "lstat",
        "rmdir",
        "readdir"
      ];
      methods.forEach((m) => {
        options[m] = options[m] || fs5[m];
        m = m + "Sync";
        options[m] = options[m] || fs5[m];
      });
      options.maxBusyTries = options.maxBusyTries || 3;
    }
    function rimraf(p, options, cb) {
      let busyTries = 0;
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      assert(p, "rimraf: missing path");
      assert.strictEqual(typeof p, "string", "rimraf: path should be a string");
      assert.strictEqual(typeof cb, "function", "rimraf: callback function required");
      assert(options, "rimraf: invalid options argument provided");
      assert.strictEqual(typeof options, "object", "rimraf: options should be object");
      defaults2(options);
      rimraf_(p, options, function CB(er) {
        if (er) {
          if ((er.code === "EBUSY" || er.code === "ENOTEMPTY" || er.code === "EPERM") && busyTries < options.maxBusyTries) {
            busyTries++;
            const time = busyTries * 100;
            return setTimeout(() => rimraf_(p, options, CB), time);
          }
          if (er.code === "ENOENT") er = null;
        }
        cb(er);
      });
    }
    function rimraf_(p, options, cb) {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.lstat(p, (er, st) => {
        if (er && er.code === "ENOENT") {
          return cb(null);
        }
        if (er && er.code === "EPERM" && isWindows) {
          return fixWinEPERM(p, options, er, cb);
        }
        if (st && st.isDirectory()) {
          return rmdir(p, options, er, cb);
        }
        options.unlink(p, (er2) => {
          if (er2) {
            if (er2.code === "ENOENT") {
              return cb(null);
            }
            if (er2.code === "EPERM") {
              return isWindows ? fixWinEPERM(p, options, er2, cb) : rmdir(p, options, er2, cb);
            }
            if (er2.code === "EISDIR") {
              return rmdir(p, options, er2, cb);
            }
          }
          return cb(er2);
        });
      });
    }
    function fixWinEPERM(p, options, er, cb) {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      if (er) {
        assert(er instanceof Error);
      }
      options.chmod(p, 438, (er2) => {
        if (er2) {
          cb(er2.code === "ENOENT" ? null : er);
        } else {
          options.stat(p, (er3, stats) => {
            if (er3) {
              cb(er3.code === "ENOENT" ? null : er);
            } else if (stats.isDirectory()) {
              rmdir(p, options, er, cb);
            } else {
              options.unlink(p, cb);
            }
          });
        }
      });
    }
    function fixWinEPERMSync(p, options, er) {
      let stats;
      assert(p);
      assert(options);
      if (er) {
        assert(er instanceof Error);
      }
      try {
        options.chmodSync(p, 438);
      } catch (er2) {
        if (er2.code === "ENOENT") {
          return;
        } else {
          throw er;
        }
      }
      try {
        stats = options.statSync(p);
      } catch (er3) {
        if (er3.code === "ENOENT") {
          return;
        } else {
          throw er;
        }
      }
      if (stats.isDirectory()) {
        rmdirSync(p, options, er);
      } else {
        options.unlinkSync(p);
      }
    }
    function rmdir(p, options, originalEr, cb) {
      assert(p);
      assert(options);
      if (originalEr) {
        assert(originalEr instanceof Error);
      }
      assert(typeof cb === "function");
      options.rmdir(p, (er) => {
        if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")) {
          rmkids(p, options, cb);
        } else if (er && er.code === "ENOTDIR") {
          cb(originalEr);
        } else {
          cb(er);
        }
      });
    }
    function rmkids(p, options, cb) {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.readdir(p, (er, files) => {
        if (er) return cb(er);
        let n = files.length;
        let errState;
        if (n === 0) return options.rmdir(p, cb);
        files.forEach((f) => {
          rimraf(path6.join(p, f), options, (er2) => {
            if (errState) {
              return;
            }
            if (er2) return cb(errState = er2);
            if (--n === 0) {
              options.rmdir(p, cb);
            }
          });
        });
      });
    }
    function rimrafSync(p, options) {
      let st;
      options = options || {};
      defaults2(options);
      assert(p, "rimraf: missing path");
      assert.strictEqual(typeof p, "string", "rimraf: path should be a string");
      assert(options, "rimraf: missing options");
      assert.strictEqual(typeof options, "object", "rimraf: options should be object");
      try {
        st = options.lstatSync(p);
      } catch (er) {
        if (er.code === "ENOENT") {
          return;
        }
        if (er.code === "EPERM" && isWindows) {
          fixWinEPERMSync(p, options, er);
        }
      }
      try {
        if (st && st.isDirectory()) {
          rmdirSync(p, options, null);
        } else {
          options.unlinkSync(p);
        }
      } catch (er) {
        if (er.code === "ENOENT") {
          return;
        } else if (er.code === "EPERM") {
          return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er);
        } else if (er.code !== "EISDIR") {
          throw er;
        }
        rmdirSync(p, options, er);
      }
    }
    function rmdirSync(p, options, originalEr) {
      assert(p);
      assert(options);
      if (originalEr) {
        assert(originalEr instanceof Error);
      }
      try {
        options.rmdirSync(p);
      } catch (er) {
        if (er.code === "ENOTDIR") {
          throw originalEr;
        } else if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM") {
          rmkidsSync(p, options);
        } else if (er.code !== "ENOENT") {
          throw er;
        }
      }
    }
    function rmkidsSync(p, options) {
      assert(p);
      assert(options);
      options.readdirSync(p).forEach((f) => rimrafSync(path6.join(p, f), options));
      if (isWindows) {
        const startTime = Date.now();
        do {
          try {
            const ret = options.rmdirSync(p, options);
            return ret;
          } catch (er) {
          }
        } while (Date.now() - startTime < 500);
      } else {
        const ret = options.rmdirSync(p, options);
        return ret;
      }
    }
    module2.exports = rimraf;
    rimraf.sync = rimrafSync;
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/remove/index.js
var require_remove = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/remove/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var rimraf = require_rimraf();
    module2.exports = {
      remove: u(rimraf),
      removeSync: rimraf.sync
    };
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/empty/index.js
var require_empty = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/empty/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs5 = require("fs");
    var path6 = require("path");
    var mkdir = require_mkdirs2();
    var remove = require_remove();
    var emptyDir = u(function emptyDir2(dir, callback) {
      callback = callback || function() {
      };
      fs5.readdir(dir, (err, items) => {
        if (err) return mkdir.mkdirs(dir, callback);
        items = items.map((item) => path6.join(dir, item));
        deleteItem();
        function deleteItem() {
          const item = items.pop();
          if (!item) return callback();
          remove.remove(item, (err2) => {
            if (err2) return callback(err2);
            deleteItem();
          });
        }
      });
    });
    function emptyDirSync(dir) {
      let items;
      try {
        items = fs5.readdirSync(dir);
      } catch (err) {
        return mkdir.mkdirsSync(dir);
      }
      items.forEach((item) => {
        item = path6.join(dir, item);
        remove.removeSync(item);
      });
    }
    module2.exports = {
      emptyDirSync,
      emptydirSync: emptyDirSync,
      emptyDir,
      emptydir: emptyDir
    };
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/ensure/file.js
var require_file = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/ensure/file.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var path6 = require("path");
    var fs5 = require_graceful_fs();
    var mkdir = require_mkdirs2();
    var pathExists = require_path_exists().pathExists;
    function createFile(file, callback) {
      function makeFile() {
        fs5.writeFile(file, "", (err) => {
          if (err) return callback(err);
          callback();
        });
      }
      fs5.stat(file, (err, stats) => {
        if (!err && stats.isFile()) return callback();
        const dir = path6.dirname(file);
        pathExists(dir, (err2, dirExists) => {
          if (err2) return callback(err2);
          if (dirExists) return makeFile();
          mkdir.mkdirs(dir, (err3) => {
            if (err3) return callback(err3);
            makeFile();
          });
        });
      });
    }
    function createFileSync(file) {
      let stats;
      try {
        stats = fs5.statSync(file);
      } catch (e) {
      }
      if (stats && stats.isFile()) return;
      const dir = path6.dirname(file);
      if (!fs5.existsSync(dir)) {
        mkdir.mkdirsSync(dir);
      }
      fs5.writeFileSync(file, "");
    }
    module2.exports = {
      createFile: u(createFile),
      createFileSync
    };
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/ensure/link.js
var require_link = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/ensure/link.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var path6 = require("path");
    var fs5 = require_graceful_fs();
    var mkdir = require_mkdirs2();
    var pathExists = require_path_exists().pathExists;
    function createLink(srcpath, dstpath, callback) {
      function makeLink(srcpath2, dstpath2) {
        fs5.link(srcpath2, dstpath2, (err) => {
          if (err) return callback(err);
          callback(null);
        });
      }
      pathExists(dstpath, (err, destinationExists) => {
        if (err) return callback(err);
        if (destinationExists) return callback(null);
        fs5.lstat(srcpath, (err2) => {
          if (err2) {
            err2.message = err2.message.replace("lstat", "ensureLink");
            return callback(err2);
          }
          const dir = path6.dirname(dstpath);
          pathExists(dir, (err3, dirExists) => {
            if (err3) return callback(err3);
            if (dirExists) return makeLink(srcpath, dstpath);
            mkdir.mkdirs(dir, (err4) => {
              if (err4) return callback(err4);
              makeLink(srcpath, dstpath);
            });
          });
        });
      });
    }
    function createLinkSync(srcpath, dstpath) {
      const destinationExists = fs5.existsSync(dstpath);
      if (destinationExists) return void 0;
      try {
        fs5.lstatSync(srcpath);
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        throw err;
      }
      const dir = path6.dirname(dstpath);
      const dirExists = fs5.existsSync(dir);
      if (dirExists) return fs5.linkSync(srcpath, dstpath);
      mkdir.mkdirsSync(dir);
      return fs5.linkSync(srcpath, dstpath);
    }
    module2.exports = {
      createLink: u(createLink),
      createLinkSync
    };
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/ensure/symlink-paths.js
var require_symlink_paths = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/ensure/symlink-paths.js"(exports2, module2) {
    "use strict";
    var path6 = require("path");
    var fs5 = require_graceful_fs();
    var pathExists = require_path_exists().pathExists;
    function symlinkPaths(srcpath, dstpath, callback) {
      if (path6.isAbsolute(srcpath)) {
        return fs5.lstat(srcpath, (err) => {
          if (err) {
            err.message = err.message.replace("lstat", "ensureSymlink");
            return callback(err);
          }
          return callback(null, {
            "toCwd": srcpath,
            "toDst": srcpath
          });
        });
      } else {
        const dstdir = path6.dirname(dstpath);
        const relativeToDst = path6.join(dstdir, srcpath);
        return pathExists(relativeToDst, (err, exists) => {
          if (err) return callback(err);
          if (exists) {
            return callback(null, {
              "toCwd": relativeToDst,
              "toDst": srcpath
            });
          } else {
            return fs5.lstat(srcpath, (err2) => {
              if (err2) {
                err2.message = err2.message.replace("lstat", "ensureSymlink");
                return callback(err2);
              }
              return callback(null, {
                "toCwd": srcpath,
                "toDst": path6.relative(dstdir, srcpath)
              });
            });
          }
        });
      }
    }
    function symlinkPathsSync(srcpath, dstpath) {
      let exists;
      if (path6.isAbsolute(srcpath)) {
        exists = fs5.existsSync(srcpath);
        if (!exists) throw new Error("absolute srcpath does not exist");
        return {
          "toCwd": srcpath,
          "toDst": srcpath
        };
      } else {
        const dstdir = path6.dirname(dstpath);
        const relativeToDst = path6.join(dstdir, srcpath);
        exists = fs5.existsSync(relativeToDst);
        if (exists) {
          return {
            "toCwd": relativeToDst,
            "toDst": srcpath
          };
        } else {
          exists = fs5.existsSync(srcpath);
          if (!exists) throw new Error("relative srcpath does not exist");
          return {
            "toCwd": srcpath,
            "toDst": path6.relative(dstdir, srcpath)
          };
        }
      }
    }
    module2.exports = {
      symlinkPaths,
      symlinkPathsSync
    };
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/ensure/symlink-type.js
var require_symlink_type = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/ensure/symlink-type.js"(exports2, module2) {
    "use strict";
    var fs5 = require_graceful_fs();
    function symlinkType(srcpath, type, callback) {
      callback = typeof type === "function" ? type : callback;
      type = typeof type === "function" ? false : type;
      if (type) return callback(null, type);
      fs5.lstat(srcpath, (err, stats) => {
        if (err) return callback(null, "file");
        type = stats && stats.isDirectory() ? "dir" : "file";
        callback(null, type);
      });
    }
    function symlinkTypeSync(srcpath, type) {
      let stats;
      if (type) return type;
      try {
        stats = fs5.lstatSync(srcpath);
      } catch (e) {
        return "file";
      }
      return stats && stats.isDirectory() ? "dir" : "file";
    }
    module2.exports = {
      symlinkType,
      symlinkTypeSync
    };
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/ensure/symlink.js
var require_symlink = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/ensure/symlink.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var path6 = require("path");
    var fs5 = require_graceful_fs();
    var _mkdirs = require_mkdirs2();
    var mkdirs = _mkdirs.mkdirs;
    var mkdirsSync = _mkdirs.mkdirsSync;
    var _symlinkPaths = require_symlink_paths();
    var symlinkPaths = _symlinkPaths.symlinkPaths;
    var symlinkPathsSync = _symlinkPaths.symlinkPathsSync;
    var _symlinkType = require_symlink_type();
    var symlinkType = _symlinkType.symlinkType;
    var symlinkTypeSync = _symlinkType.symlinkTypeSync;
    var pathExists = require_path_exists().pathExists;
    function createSymlink(srcpath, dstpath, type, callback) {
      callback = typeof type === "function" ? type : callback;
      type = typeof type === "function" ? false : type;
      pathExists(dstpath, (err, destinationExists) => {
        if (err) return callback(err);
        if (destinationExists) return callback(null);
        symlinkPaths(srcpath, dstpath, (err2, relative) => {
          if (err2) return callback(err2);
          srcpath = relative.toDst;
          symlinkType(relative.toCwd, type, (err3, type2) => {
            if (err3) return callback(err3);
            const dir = path6.dirname(dstpath);
            pathExists(dir, (err4, dirExists) => {
              if (err4) return callback(err4);
              if (dirExists) return fs5.symlink(srcpath, dstpath, type2, callback);
              mkdirs(dir, (err5) => {
                if (err5) return callback(err5);
                fs5.symlink(srcpath, dstpath, type2, callback);
              });
            });
          });
        });
      });
    }
    function createSymlinkSync(srcpath, dstpath, type) {
      const destinationExists = fs5.existsSync(dstpath);
      if (destinationExists) return void 0;
      const relative = symlinkPathsSync(srcpath, dstpath);
      srcpath = relative.toDst;
      type = symlinkTypeSync(relative.toCwd, type);
      const dir = path6.dirname(dstpath);
      const exists = fs5.existsSync(dir);
      if (exists) return fs5.symlinkSync(srcpath, dstpath, type);
      mkdirsSync(dir);
      return fs5.symlinkSync(srcpath, dstpath, type);
    }
    module2.exports = {
      createSymlink: u(createSymlink),
      createSymlinkSync
    };
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/ensure/index.js
var require_ensure = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/ensure/index.js"(exports2, module2) {
    "use strict";
    var file = require_file();
    var link = require_link();
    var symlink = require_symlink();
    module2.exports = {
      // file
      createFile: file.createFile,
      createFileSync: file.createFileSync,
      ensureFile: file.createFile,
      ensureFileSync: file.createFileSync,
      // link
      createLink: link.createLink,
      createLinkSync: link.createLinkSync,
      ensureLink: link.createLink,
      ensureLinkSync: link.createLinkSync,
      // symlink
      createSymlink: symlink.createSymlink,
      createSymlinkSync: symlink.createSymlinkSync,
      ensureSymlink: symlink.createSymlink,
      ensureSymlinkSync: symlink.createSymlinkSync
    };
  }
});

// node_modules/.pnpm/jsonfile@4.0.0/node_modules/jsonfile/index.js
var require_jsonfile = __commonJS({
  "node_modules/.pnpm/jsonfile@4.0.0/node_modules/jsonfile/index.js"(exports2, module2) {
    "use strict";
    var _fs;
    try {
      _fs = require_graceful_fs();
    } catch (_) {
      _fs = require("fs");
    }
    function readFile2(file, options, callback) {
      if (callback == null) {
        callback = options;
        options = {};
      }
      if (typeof options === "string") {
        options = { encoding: options };
      }
      options = options || {};
      var fs5 = options.fs || _fs;
      var shouldThrow = true;
      if ("throws" in options) {
        shouldThrow = options.throws;
      }
      fs5.readFile(file, options, function(err, data) {
        if (err) return callback(err);
        data = stripBom(data);
        var obj;
        try {
          obj = JSON.parse(data, options ? options.reviver : null);
        } catch (err2) {
          if (shouldThrow) {
            err2.message = file + ": " + err2.message;
            return callback(err2);
          } else {
            return callback(null, null);
          }
        }
        callback(null, obj);
      });
    }
    function readFileSync3(file, options) {
      options = options || {};
      if (typeof options === "string") {
        options = { encoding: options };
      }
      var fs5 = options.fs || _fs;
      var shouldThrow = true;
      if ("throws" in options) {
        shouldThrow = options.throws;
      }
      try {
        var content = fs5.readFileSync(file, options);
        content = stripBom(content);
        return JSON.parse(content, options.reviver);
      } catch (err) {
        if (shouldThrow) {
          err.message = file + ": " + err.message;
          throw err;
        } else {
          return null;
        }
      }
    }
    function stringify(obj, options) {
      var spaces;
      var EOL = "\n";
      if (typeof options === "object" && options !== null) {
        if (options.spaces) {
          spaces = options.spaces;
        }
        if (options.EOL) {
          EOL = options.EOL;
        }
      }
      var str = JSON.stringify(obj, options ? options.replacer : null, spaces);
      return str.replace(/\n/g, EOL) + EOL;
    }
    function writeFile(file, obj, options, callback) {
      if (callback == null) {
        callback = options;
        options = {};
      }
      options = options || {};
      var fs5 = options.fs || _fs;
      var str = "";
      try {
        str = stringify(obj, options);
      } catch (err) {
        if (callback) callback(err, null);
        return;
      }
      fs5.writeFile(file, str, options, callback);
    }
    function writeFileSync(file, obj, options) {
      options = options || {};
      var fs5 = options.fs || _fs;
      var str = stringify(obj, options);
      return fs5.writeFileSync(file, str, options);
    }
    function stripBom(content) {
      if (Buffer.isBuffer(content)) content = content.toString("utf8");
      content = content.replace(/^\uFEFF/, "");
      return content;
    }
    var jsonfile = {
      readFile: readFile2,
      readFileSync: readFileSync3,
      writeFile,
      writeFileSync
    };
    module2.exports = jsonfile;
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/json/jsonfile.js
var require_jsonfile2 = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/json/jsonfile.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var jsonFile = require_jsonfile();
    module2.exports = {
      // jsonfile exports
      readJson: u(jsonFile.readFile),
      readJsonSync: jsonFile.readFileSync,
      writeJson: u(jsonFile.writeFile),
      writeJsonSync: jsonFile.writeFileSync
    };
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/json/output-json.js
var require_output_json = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/json/output-json.js"(exports2, module2) {
    "use strict";
    var path6 = require("path");
    var mkdir = require_mkdirs2();
    var pathExists = require_path_exists().pathExists;
    var jsonFile = require_jsonfile2();
    function outputJson(file, data, options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      const dir = path6.dirname(file);
      pathExists(dir, (err, itDoes) => {
        if (err) return callback(err);
        if (itDoes) return jsonFile.writeJson(file, data, options, callback);
        mkdir.mkdirs(dir, (err2) => {
          if (err2) return callback(err2);
          jsonFile.writeJson(file, data, options, callback);
        });
      });
    }
    module2.exports = outputJson;
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/json/output-json-sync.js
var require_output_json_sync = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/json/output-json-sync.js"(exports2, module2) {
    "use strict";
    var fs5 = require_graceful_fs();
    var path6 = require("path");
    var mkdir = require_mkdirs2();
    var jsonFile = require_jsonfile2();
    function outputJsonSync(file, data, options) {
      const dir = path6.dirname(file);
      if (!fs5.existsSync(dir)) {
        mkdir.mkdirsSync(dir);
      }
      jsonFile.writeJsonSync(file, data, options);
    }
    module2.exports = outputJsonSync;
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/json/index.js
var require_json = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/json/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var jsonFile = require_jsonfile2();
    jsonFile.outputJson = u(require_output_json());
    jsonFile.outputJsonSync = require_output_json_sync();
    jsonFile.outputJSON = jsonFile.outputJson;
    jsonFile.outputJSONSync = jsonFile.outputJsonSync;
    jsonFile.writeJSON = jsonFile.writeJson;
    jsonFile.writeJSONSync = jsonFile.writeJsonSync;
    jsonFile.readJSON = jsonFile.readJson;
    jsonFile.readJSONSync = jsonFile.readJsonSync;
    module2.exports = jsonFile;
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/move-sync/index.js
var require_move_sync = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/move-sync/index.js"(exports2, module2) {
    "use strict";
    var fs5 = require_graceful_fs();
    var path6 = require("path");
    var copySync = require_copy_sync2().copySync;
    var removeSync = require_remove().removeSync;
    var mkdirpSync = require_mkdirs2().mkdirsSync;
    var buffer = require_buffer();
    function moveSync(src, dest, options) {
      options = options || {};
      const overwrite = options.overwrite || options.clobber || false;
      src = path6.resolve(src);
      dest = path6.resolve(dest);
      if (src === dest) return fs5.accessSync(src);
      if (isSrcSubdir(src, dest)) throw new Error(`Cannot move '${src}' into itself '${dest}'.`);
      mkdirpSync(path6.dirname(dest));
      tryRenameSync();
      function tryRenameSync() {
        if (overwrite) {
          try {
            return fs5.renameSync(src, dest);
          } catch (err) {
            if (err.code === "ENOTEMPTY" || err.code === "EEXIST" || err.code === "EPERM") {
              removeSync(dest);
              options.overwrite = false;
              return moveSync(src, dest, options);
            }
            if (err.code !== "EXDEV") throw err;
            return moveSyncAcrossDevice(src, dest, overwrite);
          }
        } else {
          try {
            fs5.linkSync(src, dest);
            return fs5.unlinkSync(src);
          } catch (err) {
            if (err.code === "EXDEV" || err.code === "EISDIR" || err.code === "EPERM" || err.code === "ENOTSUP") {
              return moveSyncAcrossDevice(src, dest, overwrite);
            }
            throw err;
          }
        }
      }
    }
    function moveSyncAcrossDevice(src, dest, overwrite) {
      const stat = fs5.statSync(src);
      if (stat.isDirectory()) {
        return moveDirSyncAcrossDevice(src, dest, overwrite);
      } else {
        return moveFileSyncAcrossDevice(src, dest, overwrite);
      }
    }
    function moveFileSyncAcrossDevice(src, dest, overwrite) {
      const BUF_LENGTH = 64 * 1024;
      const _buff = buffer(BUF_LENGTH);
      const flags = overwrite ? "w" : "wx";
      const fdr = fs5.openSync(src, "r");
      const stat = fs5.fstatSync(fdr);
      const fdw = fs5.openSync(dest, flags, stat.mode);
      let pos = 0;
      while (pos < stat.size) {
        const bytesRead = fs5.readSync(fdr, _buff, 0, BUF_LENGTH, pos);
        fs5.writeSync(fdw, _buff, 0, bytesRead);
        pos += bytesRead;
      }
      fs5.closeSync(fdr);
      fs5.closeSync(fdw);
      return fs5.unlinkSync(src);
    }
    function moveDirSyncAcrossDevice(src, dest, overwrite) {
      const options = {
        overwrite: false
      };
      if (overwrite) {
        removeSync(dest);
        tryCopySync();
      } else {
        tryCopySync();
      }
      function tryCopySync() {
        copySync(src, dest, options);
        return removeSync(src);
      }
    }
    function isSrcSubdir(src, dest) {
      try {
        return fs5.statSync(src).isDirectory() && src !== dest && dest.indexOf(src) > -1 && dest.split(path6.dirname(src) + path6.sep)[1].split(path6.sep)[0] === path6.basename(src);
      } catch (e) {
        return false;
      }
    }
    module2.exports = {
      moveSync
    };
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/move/index.js
var require_move = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/move/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs5 = require_graceful_fs();
    var path6 = require("path");
    var copy = require_copy2().copy;
    var remove = require_remove().remove;
    var mkdirp = require_mkdirs2().mkdirp;
    var pathExists = require_path_exists().pathExists;
    function move(src, dest, opts, cb) {
      if (typeof opts === "function") {
        cb = opts;
        opts = {};
      }
      const overwrite = opts.overwrite || opts.clobber || false;
      src = path6.resolve(src);
      dest = path6.resolve(dest);
      if (src === dest) return fs5.access(src, cb);
      fs5.stat(src, (err, st) => {
        if (err) return cb(err);
        if (st.isDirectory() && isSrcSubdir(src, dest)) {
          return cb(new Error(`Cannot move '${src}' to a subdirectory of itself, '${dest}'.`));
        }
        mkdirp(path6.dirname(dest), (err2) => {
          if (err2) return cb(err2);
          return doRename(src, dest, overwrite, cb);
        });
      });
    }
    function doRename(src, dest, overwrite, cb) {
      if (overwrite) {
        return remove(dest, (err) => {
          if (err) return cb(err);
          return rename(src, dest, overwrite, cb);
        });
      }
      pathExists(dest, (err, destExists) => {
        if (err) return cb(err);
        if (destExists) return cb(new Error("dest already exists."));
        return rename(src, dest, overwrite, cb);
      });
    }
    function rename(src, dest, overwrite, cb) {
      fs5.rename(src, dest, (err) => {
        if (!err) return cb();
        if (err.code !== "EXDEV") return cb(err);
        return moveAcrossDevice(src, dest, overwrite, cb);
      });
    }
    function moveAcrossDevice(src, dest, overwrite, cb) {
      const opts = {
        overwrite,
        errorOnExist: true
      };
      copy(src, dest, opts, (err) => {
        if (err) return cb(err);
        return remove(src, cb);
      });
    }
    function isSrcSubdir(src, dest) {
      const srcArray = src.split(path6.sep);
      const destArray = dest.split(path6.sep);
      return srcArray.reduce((acc, current, i) => {
        return acc && destArray[i] === current;
      }, true);
    }
    module2.exports = {
      move: u(move)
    };
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/output/index.js
var require_output = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/output/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs5 = require_graceful_fs();
    var path6 = require("path");
    var mkdir = require_mkdirs2();
    var pathExists = require_path_exists().pathExists;
    function outputFile(file, data, encoding, callback) {
      if (typeof encoding === "function") {
        callback = encoding;
        encoding = "utf8";
      }
      const dir = path6.dirname(file);
      pathExists(dir, (err, itDoes) => {
        if (err) return callback(err);
        if (itDoes) return fs5.writeFile(file, data, encoding, callback);
        mkdir.mkdirs(dir, (err2) => {
          if (err2) return callback(err2);
          fs5.writeFile(file, data, encoding, callback);
        });
      });
    }
    function outputFileSync(file, ...args) {
      const dir = path6.dirname(file);
      if (fs5.existsSync(dir)) {
        return fs5.writeFileSync(file, ...args);
      }
      mkdir.mkdirsSync(dir);
      fs5.writeFileSync(file, ...args);
    }
    module2.exports = {
      outputFile: u(outputFile),
      outputFileSync
    };
  }
});

// node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/index.js
var require_lib = __commonJS({
  "node_modules/.pnpm/fs-extra@7.0.1/node_modules/fs-extra/lib/index.js"(exports2, module2) {
    "use strict";
    module2.exports = Object.assign(
      {},
      // Export promiseified graceful-fs:
      require_fs(),
      // Export extra methods:
      require_copy_sync2(),
      require_copy2(),
      require_empty(),
      require_ensure(),
      require_json(),
      require_mkdirs2(),
      require_move_sync(),
      require_move(),
      require_output(),
      require_path_exists(),
      require_remove()
    );
    var fs5 = require("fs");
    if (Object.getOwnPropertyDescriptor(fs5, "promises")) {
      Object.defineProperty(module2.exports, "promises", {
        get() {
          return fs5.promises;
        }
      });
    }
  }
});

// node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/windows.js
var require_windows = __commonJS({
  "node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/windows.js"(exports2, module2) {
    "use strict";
    module2.exports = isexe;
    isexe.sync = sync3;
    var fs5 = require("fs");
    function checkPathExt(path6, options) {
      var pathext = options.pathExt !== void 0 ? options.pathExt : process.env.PATHEXT;
      if (!pathext) {
        return true;
      }
      pathext = pathext.split(";");
      if (pathext.indexOf("") !== -1) {
        return true;
      }
      for (var i = 0; i < pathext.length; i++) {
        var p = pathext[i].toLowerCase();
        if (p && path6.substr(-p.length).toLowerCase() === p) {
          return true;
        }
      }
      return false;
    }
    function checkStat(stat, path6, options) {
      if (!stat.isSymbolicLink() && !stat.isFile()) {
        return false;
      }
      return checkPathExt(path6, options);
    }
    function isexe(path6, options, cb) {
      fs5.stat(path6, function(er, stat) {
        cb(er, er ? false : checkStat(stat, path6, options));
      });
    }
    function sync3(path6, options) {
      return checkStat(fs5.statSync(path6), path6, options);
    }
  }
});

// node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/mode.js
var require_mode = __commonJS({
  "node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/mode.js"(exports2, module2) {
    "use strict";
    module2.exports = isexe;
    isexe.sync = sync3;
    var fs5 = require("fs");
    function isexe(path6, options, cb) {
      fs5.stat(path6, function(er, stat) {
        cb(er, er ? false : checkStat(stat, options));
      });
    }
    function sync3(path6, options) {
      return checkStat(fs5.statSync(path6), options);
    }
    function checkStat(stat, options) {
      return stat.isFile() && checkMode(stat, options);
    }
    function checkMode(stat, options) {
      var mod = stat.mode;
      var uid = stat.uid;
      var gid = stat.gid;
      var myUid = options.uid !== void 0 ? options.uid : process.getuid && process.getuid();
      var myGid = options.gid !== void 0 ? options.gid : process.getgid && process.getgid();
      var u = parseInt("100", 8);
      var g = parseInt("010", 8);
      var o = parseInt("001", 8);
      var ug = u | g;
      var ret = mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && myUid === 0;
      return ret;
    }
  }
});

// node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/index.js
var require_isexe = __commonJS({
  "node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/index.js"(exports2, module2) {
    "use strict";
    var fs5 = require("fs");
    var core2;
    if (process.platform === "win32" || global.TESTING_WINDOWS) {
      core2 = require_windows();
    } else {
      core2 = require_mode();
    }
    module2.exports = isexe;
    isexe.sync = sync3;
    function isexe(path6, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      if (!cb) {
        if (typeof Promise !== "function") {
          throw new TypeError("callback not provided");
        }
        return new Promise(function(resolve, reject) {
          isexe(path6, options || {}, function(er, is) {
            if (er) {
              reject(er);
            } else {
              resolve(is);
            }
          });
        });
      }
      core2(path6, options || {}, function(er, is) {
        if (er) {
          if (er.code === "EACCES" || options && options.ignoreErrors) {
            er = null;
            is = false;
          }
        }
        cb(er, is);
      });
    }
    function sync3(path6, options) {
      try {
        return core2.sync(path6, options || {});
      } catch (er) {
        if (options && options.ignoreErrors || er.code === "EACCES") {
          return false;
        } else {
          throw er;
        }
      }
    }
  }
});

// node_modules/.pnpm/which@1.3.1/node_modules/which/which.js
var require_which = __commonJS({
  "node_modules/.pnpm/which@1.3.1/node_modules/which/which.js"(exports2, module2) {
    "use strict";
    module2.exports = which;
    which.sync = whichSync;
    var isWindows = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys";
    var path6 = require("path");
    var COLON = isWindows ? ";" : ":";
    var isexe = require_isexe();
    function getNotFoundError(cmd) {
      var er = new Error("not found: " + cmd);
      er.code = "ENOENT";
      return er;
    }
    function getPathInfo(cmd, opt) {
      var colon = opt.colon || COLON;
      var pathEnv = opt.path || process.env.PATH || "";
      var pathExt = [""];
      pathEnv = pathEnv.split(colon);
      var pathExtExe = "";
      if (isWindows) {
        pathEnv.unshift(process.cwd());
        pathExtExe = opt.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM";
        pathExt = pathExtExe.split(colon);
        if (cmd.indexOf(".") !== -1 && pathExt[0] !== "")
          pathExt.unshift("");
      }
      if (cmd.match(/\//) || isWindows && cmd.match(/\\/))
        pathEnv = [""];
      return {
        env: pathEnv,
        ext: pathExt,
        extExe: pathExtExe
      };
    }
    function which(cmd, opt, cb) {
      if (typeof opt === "function") {
        cb = opt;
        opt = {};
      }
      var info = getPathInfo(cmd, opt);
      var pathEnv = info.env;
      var pathExt = info.ext;
      var pathExtExe = info.extExe;
      var found = [];
      (function F(i, l) {
        if (i === l) {
          if (opt.all && found.length)
            return cb(null, found);
          else
            return cb(getNotFoundError(cmd));
        }
        var pathPart = pathEnv[i];
        if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
          pathPart = pathPart.slice(1, -1);
        var p = path6.join(pathPart, cmd);
        if (!pathPart && /^\.[\\\/]/.test(cmd)) {
          p = cmd.slice(0, 2) + p;
        }
        ;
        (function E(ii, ll) {
          if (ii === ll) return F(i + 1, l);
          var ext2 = pathExt[ii];
          isexe(p + ext2, { pathExt: pathExtExe }, function(er, is) {
            if (!er && is) {
              if (opt.all)
                found.push(p + ext2);
              else
                return cb(null, p + ext2);
            }
            return E(ii + 1, ll);
          });
        })(0, pathExt.length);
      })(0, pathEnv.length);
    }
    function whichSync(cmd, opt) {
      opt = opt || {};
      var info = getPathInfo(cmd, opt);
      var pathEnv = info.env;
      var pathExt = info.ext;
      var pathExtExe = info.extExe;
      var found = [];
      for (var i = 0, l = pathEnv.length; i < l; i++) {
        var pathPart = pathEnv[i];
        if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
          pathPart = pathPart.slice(1, -1);
        var p = path6.join(pathPart, cmd);
        if (!pathPart && /^\.[\\\/]/.test(cmd)) {
          p = cmd.slice(0, 2) + p;
        }
        for (var j = 0, ll = pathExt.length; j < ll; j++) {
          var cur = p + pathExt[j];
          var is;
          try {
            is = isexe.sync(cur, { pathExt: pathExtExe });
            if (is) {
              if (opt.all)
                found.push(cur);
              else
                return cur;
            }
          } catch (ex) {
          }
        }
      }
      if (opt.all && found.length)
        return found;
      if (opt.nothrow)
        return null;
      throw getNotFoundError(cmd);
    }
  }
});

// node_modules/.pnpm/pseudomap@1.0.2/node_modules/pseudomap/pseudomap.js
var require_pseudomap = __commonJS({
  "node_modules/.pnpm/pseudomap@1.0.2/node_modules/pseudomap/pseudomap.js"(exports2, module2) {
    "use strict";
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    module2.exports = PseudoMap;
    function PseudoMap(set2) {
      if (!(this instanceof PseudoMap))
        throw new TypeError("Constructor PseudoMap requires 'new'");
      this.clear();
      if (set2) {
        if (set2 instanceof PseudoMap || typeof Map === "function" && set2 instanceof Map)
          set2.forEach(function(value, key) {
            this.set(key, value);
          }, this);
        else if (Array.isArray(set2))
          set2.forEach(function(kv) {
            this.set(kv[0], kv[1]);
          }, this);
        else
          throw new TypeError("invalid argument");
      }
    }
    PseudoMap.prototype.forEach = function(fn, thisp) {
      thisp = thisp || this;
      Object.keys(this._data).forEach(function(k) {
        if (k !== "size")
          fn.call(thisp, this._data[k].value, this._data[k].key);
      }, this);
    };
    PseudoMap.prototype.has = function(k) {
      return !!find(this._data, k);
    };
    PseudoMap.prototype.get = function(k) {
      var res = find(this._data, k);
      return res && res.value;
    };
    PseudoMap.prototype.set = function(k, v) {
      set(this._data, k, v);
    };
    PseudoMap.prototype.delete = function(k) {
      var res = find(this._data, k);
      if (res) {
        delete this._data[res._index];
        this._data.size--;
      }
    };
    PseudoMap.prototype.clear = function() {
      var data = /* @__PURE__ */ Object.create(null);
      data.size = 0;
      Object.defineProperty(this, "_data", {
        value: data,
        enumerable: false,
        configurable: true,
        writable: false
      });
    };
    Object.defineProperty(PseudoMap.prototype, "size", {
      get: function() {
        return this._data.size;
      },
      set: function(n) {
      },
      enumerable: true,
      configurable: true
    });
    PseudoMap.prototype.values = PseudoMap.prototype.keys = PseudoMap.prototype.entries = function() {
      throw new Error("iterators are not implemented in this version");
    };
    function same(a, b) {
      return a === b || a !== a && b !== b;
    }
    function Entry(k, v, i) {
      this.key = k;
      this.value = v;
      this._index = i;
    }
    function find(data, k) {
      for (var i = 0, s = "_" + k, key = s; hasOwnProperty.call(data, key); key = s + i++) {
        if (same(data[key].key, k))
          return data[key];
      }
    }
    function set(data, k, v) {
      for (var i = 0, s = "_" + k, key = s; hasOwnProperty.call(data, key); key = s + i++) {
        if (same(data[key].key, k)) {
          data[key].value = v;
          return;
        }
      }
      data.size++;
      data[key] = new Entry(k, v, key);
    }
  }
});

// node_modules/.pnpm/pseudomap@1.0.2/node_modules/pseudomap/map.js
var require_map = __commonJS({
  "node_modules/.pnpm/pseudomap@1.0.2/node_modules/pseudomap/map.js"(exports2, module2) {
    "use strict";
    if (process.env.npm_package_name === "pseudomap" && process.env.npm_lifecycle_script === "test")
      process.env.TEST_PSEUDOMAP = "true";
    if (typeof Map === "function" && !process.env.TEST_PSEUDOMAP) {
      module2.exports = Map;
    } else {
      module2.exports = require_pseudomap();
    }
  }
});

// node_modules/.pnpm/yallist@2.1.2/node_modules/yallist/yallist.js
var require_yallist = __commonJS({
  "node_modules/.pnpm/yallist@2.1.2/node_modules/yallist/yallist.js"(exports2, module2) {
    "use strict";
    module2.exports = Yallist;
    Yallist.Node = Node;
    Yallist.create = Yallist;
    function Yallist(list) {
      var self2 = this;
      if (!(self2 instanceof Yallist)) {
        self2 = new Yallist();
      }
      self2.tail = null;
      self2.head = null;
      self2.length = 0;
      if (list && typeof list.forEach === "function") {
        list.forEach(function(item) {
          self2.push(item);
        });
      } else if (arguments.length > 0) {
        for (var i = 0, l = arguments.length; i < l; i++) {
          self2.push(arguments[i]);
        }
      }
      return self2;
    }
    Yallist.prototype.removeNode = function(node) {
      if (node.list !== this) {
        throw new Error("removing node which does not belong to this list");
      }
      var next = node.next;
      var prev = node.prev;
      if (next) {
        next.prev = prev;
      }
      if (prev) {
        prev.next = next;
      }
      if (node === this.head) {
        this.head = next;
      }
      if (node === this.tail) {
        this.tail = prev;
      }
      node.list.length--;
      node.next = null;
      node.prev = null;
      node.list = null;
    };
    Yallist.prototype.unshiftNode = function(node) {
      if (node === this.head) {
        return;
      }
      if (node.list) {
        node.list.removeNode(node);
      }
      var head = this.head;
      node.list = this;
      node.next = head;
      if (head) {
        head.prev = node;
      }
      this.head = node;
      if (!this.tail) {
        this.tail = node;
      }
      this.length++;
    };
    Yallist.prototype.pushNode = function(node) {
      if (node === this.tail) {
        return;
      }
      if (node.list) {
        node.list.removeNode(node);
      }
      var tail = this.tail;
      node.list = this;
      node.prev = tail;
      if (tail) {
        tail.next = node;
      }
      this.tail = node;
      if (!this.head) {
        this.head = node;
      }
      this.length++;
    };
    Yallist.prototype.push = function() {
      for (var i = 0, l = arguments.length; i < l; i++) {
        push(this, arguments[i]);
      }
      return this.length;
    };
    Yallist.prototype.unshift = function() {
      for (var i = 0, l = arguments.length; i < l; i++) {
        unshift(this, arguments[i]);
      }
      return this.length;
    };
    Yallist.prototype.pop = function() {
      if (!this.tail) {
        return void 0;
      }
      var res = this.tail.value;
      this.tail = this.tail.prev;
      if (this.tail) {
        this.tail.next = null;
      } else {
        this.head = null;
      }
      this.length--;
      return res;
    };
    Yallist.prototype.shift = function() {
      if (!this.head) {
        return void 0;
      }
      var res = this.head.value;
      this.head = this.head.next;
      if (this.head) {
        this.head.prev = null;
      } else {
        this.tail = null;
      }
      this.length--;
      return res;
    };
    Yallist.prototype.forEach = function(fn, thisp) {
      thisp = thisp || this;
      for (var walker = this.head, i = 0; walker !== null; i++) {
        fn.call(thisp, walker.value, i, this);
        walker = walker.next;
      }
    };
    Yallist.prototype.forEachReverse = function(fn, thisp) {
      thisp = thisp || this;
      for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
        fn.call(thisp, walker.value, i, this);
        walker = walker.prev;
      }
    };
    Yallist.prototype.get = function(n) {
      for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
        walker = walker.next;
      }
      if (i === n && walker !== null) {
        return walker.value;
      }
    };
    Yallist.prototype.getReverse = function(n) {
      for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
        walker = walker.prev;
      }
      if (i === n && walker !== null) {
        return walker.value;
      }
    };
    Yallist.prototype.map = function(fn, thisp) {
      thisp = thisp || this;
      var res = new Yallist();
      for (var walker = this.head; walker !== null; ) {
        res.push(fn.call(thisp, walker.value, this));
        walker = walker.next;
      }
      return res;
    };
    Yallist.prototype.mapReverse = function(fn, thisp) {
      thisp = thisp || this;
      var res = new Yallist();
      for (var walker = this.tail; walker !== null; ) {
        res.push(fn.call(thisp, walker.value, this));
        walker = walker.prev;
      }
      return res;
    };
    Yallist.prototype.reduce = function(fn, initial) {
      var acc;
      var walker = this.head;
      if (arguments.length > 1) {
        acc = initial;
      } else if (this.head) {
        walker = this.head.next;
        acc = this.head.value;
      } else {
        throw new TypeError("Reduce of empty list with no initial value");
      }
      for (var i = 0; walker !== null; i++) {
        acc = fn(acc, walker.value, i);
        walker = walker.next;
      }
      return acc;
    };
    Yallist.prototype.reduceReverse = function(fn, initial) {
      var acc;
      var walker = this.tail;
      if (arguments.length > 1) {
        acc = initial;
      } else if (this.tail) {
        walker = this.tail.prev;
        acc = this.tail.value;
      } else {
        throw new TypeError("Reduce of empty list with no initial value");
      }
      for (var i = this.length - 1; walker !== null; i--) {
        acc = fn(acc, walker.value, i);
        walker = walker.prev;
      }
      return acc;
    };
    Yallist.prototype.toArray = function() {
      var arr = new Array(this.length);
      for (var i = 0, walker = this.head; walker !== null; i++) {
        arr[i] = walker.value;
        walker = walker.next;
      }
      return arr;
    };
    Yallist.prototype.toArrayReverse = function() {
      var arr = new Array(this.length);
      for (var i = 0, walker = this.tail; walker !== null; i++) {
        arr[i] = walker.value;
        walker = walker.prev;
      }
      return arr;
    };
    Yallist.prototype.slice = function(from, to) {
      to = to || this.length;
      if (to < 0) {
        to += this.length;
      }
      from = from || 0;
      if (from < 0) {
        from += this.length;
      }
      var ret = new Yallist();
      if (to < from || to < 0) {
        return ret;
      }
      if (from < 0) {
        from = 0;
      }
      if (to > this.length) {
        to = this.length;
      }
      for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
        walker = walker.next;
      }
      for (; walker !== null && i < to; i++, walker = walker.next) {
        ret.push(walker.value);
      }
      return ret;
    };
    Yallist.prototype.sliceReverse = function(from, to) {
      to = to || this.length;
      if (to < 0) {
        to += this.length;
      }
      from = from || 0;
      if (from < 0) {
        from += this.length;
      }
      var ret = new Yallist();
      if (to < from || to < 0) {
        return ret;
      }
      if (from < 0) {
        from = 0;
      }
      if (to > this.length) {
        to = this.length;
      }
      for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
        walker = walker.prev;
      }
      for (; walker !== null && i > from; i--, walker = walker.prev) {
        ret.push(walker.value);
      }
      return ret;
    };
    Yallist.prototype.reverse = function() {
      var head = this.head;
      var tail = this.tail;
      for (var walker = head; walker !== null; walker = walker.prev) {
        var p = walker.prev;
        walker.prev = walker.next;
        walker.next = p;
      }
      this.head = tail;
      this.tail = head;
      return this;
    };
    function push(self2, item) {
      self2.tail = new Node(item, self2.tail, null, self2);
      if (!self2.head) {
        self2.head = self2.tail;
      }
      self2.length++;
    }
    function unshift(self2, item) {
      self2.head = new Node(item, null, self2.head, self2);
      if (!self2.tail) {
        self2.tail = self2.head;
      }
      self2.length++;
    }
    function Node(value, prev, next, list) {
      if (!(this instanceof Node)) {
        return new Node(value, prev, next, list);
      }
      this.list = list;
      this.value = value;
      if (prev) {
        prev.next = this;
        this.prev = prev;
      } else {
        this.prev = null;
      }
      if (next) {
        next.prev = this;
        this.next = next;
      } else {
        this.next = null;
      }
    }
  }
});

// node_modules/.pnpm/lru-cache@4.1.5/node_modules/lru-cache/index.js
var require_lru_cache = __commonJS({
  "node_modules/.pnpm/lru-cache@4.1.5/node_modules/lru-cache/index.js"(exports2, module2) {
    "use strict";
    module2.exports = LRUCache2;
    var Map2 = require_map();
    var util2 = require("util");
    var Yallist = require_yallist();
    var hasSymbol = typeof Symbol === "function" && process.env._nodeLRUCacheForceNoSymbol !== "1";
    var makeSymbol;
    if (hasSymbol) {
      makeSymbol = function(key) {
        return Symbol(key);
      };
    } else {
      makeSymbol = function(key) {
        return "_" + key;
      };
    }
    var MAX = makeSymbol("max");
    var LENGTH = makeSymbol("length");
    var LENGTH_CALCULATOR = makeSymbol("lengthCalculator");
    var ALLOW_STALE = makeSymbol("allowStale");
    var MAX_AGE = makeSymbol("maxAge");
    var DISPOSE = makeSymbol("dispose");
    var NO_DISPOSE_ON_SET = makeSymbol("noDisposeOnSet");
    var LRU_LIST = makeSymbol("lruList");
    var CACHE = makeSymbol("cache");
    function naiveLength() {
      return 1;
    }
    function LRUCache2(options) {
      if (!(this instanceof LRUCache2)) {
        return new LRUCache2(options);
      }
      if (typeof options === "number") {
        options = { max: options };
      }
      if (!options) {
        options = {};
      }
      var max = this[MAX] = options.max;
      if (!max || !(typeof max === "number") || max <= 0) {
        this[MAX] = Infinity;
      }
      var lc = options.length || naiveLength;
      if (typeof lc !== "function") {
        lc = naiveLength;
      }
      this[LENGTH_CALCULATOR] = lc;
      this[ALLOW_STALE] = options.stale || false;
      this[MAX_AGE] = options.maxAge || 0;
      this[DISPOSE] = options.dispose;
      this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
      this.reset();
    }
    Object.defineProperty(LRUCache2.prototype, "max", {
      set: function(mL) {
        if (!mL || !(typeof mL === "number") || mL <= 0) {
          mL = Infinity;
        }
        this[MAX] = mL;
        trim(this);
      },
      get: function() {
        return this[MAX];
      },
      enumerable: true
    });
    Object.defineProperty(LRUCache2.prototype, "allowStale", {
      set: function(allowStale) {
        this[ALLOW_STALE] = !!allowStale;
      },
      get: function() {
        return this[ALLOW_STALE];
      },
      enumerable: true
    });
    Object.defineProperty(LRUCache2.prototype, "maxAge", {
      set: function(mA) {
        if (!mA || !(typeof mA === "number") || mA < 0) {
          mA = 0;
        }
        this[MAX_AGE] = mA;
        trim(this);
      },
      get: function() {
        return this[MAX_AGE];
      },
      enumerable: true
    });
    Object.defineProperty(LRUCache2.prototype, "lengthCalculator", {
      set: function(lC) {
        if (typeof lC !== "function") {
          lC = naiveLength;
        }
        if (lC !== this[LENGTH_CALCULATOR]) {
          this[LENGTH_CALCULATOR] = lC;
          this[LENGTH] = 0;
          this[LRU_LIST].forEach(function(hit) {
            hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key);
            this[LENGTH] += hit.length;
          }, this);
        }
        trim(this);
      },
      get: function() {
        return this[LENGTH_CALCULATOR];
      },
      enumerable: true
    });
    Object.defineProperty(LRUCache2.prototype, "length", {
      get: function() {
        return this[LENGTH];
      },
      enumerable: true
    });
    Object.defineProperty(LRUCache2.prototype, "itemCount", {
      get: function() {
        return this[LRU_LIST].length;
      },
      enumerable: true
    });
    LRUCache2.prototype.rforEach = function(fn, thisp) {
      thisp = thisp || this;
      for (var walker = this[LRU_LIST].tail; walker !== null; ) {
        var prev = walker.prev;
        forEachStep(this, fn, walker, thisp);
        walker = prev;
      }
    };
    function forEachStep(self2, fn, node, thisp) {
      var hit = node.value;
      if (isStale(self2, hit)) {
        del(self2, node);
        if (!self2[ALLOW_STALE]) {
          hit = void 0;
        }
      }
      if (hit) {
        fn.call(thisp, hit.value, hit.key, self2);
      }
    }
    LRUCache2.prototype.forEach = function(fn, thisp) {
      thisp = thisp || this;
      for (var walker = this[LRU_LIST].head; walker !== null; ) {
        var next = walker.next;
        forEachStep(this, fn, walker, thisp);
        walker = next;
      }
    };
    LRUCache2.prototype.keys = function() {
      return this[LRU_LIST].toArray().map(function(k) {
        return k.key;
      }, this);
    };
    LRUCache2.prototype.values = function() {
      return this[LRU_LIST].toArray().map(function(k) {
        return k.value;
      }, this);
    };
    LRUCache2.prototype.reset = function() {
      if (this[DISPOSE] && this[LRU_LIST] && this[LRU_LIST].length) {
        this[LRU_LIST].forEach(function(hit) {
          this[DISPOSE](hit.key, hit.value);
        }, this);
      }
      this[CACHE] = new Map2();
      this[LRU_LIST] = new Yallist();
      this[LENGTH] = 0;
    };
    LRUCache2.prototype.dump = function() {
      return this[LRU_LIST].map(function(hit) {
        if (!isStale(this, hit)) {
          return {
            k: hit.key,
            v: hit.value,
            e: hit.now + (hit.maxAge || 0)
          };
        }
      }, this).toArray().filter(function(h) {
        return h;
      });
    };
    LRUCache2.prototype.dumpLru = function() {
      return this[LRU_LIST];
    };
    LRUCache2.prototype.inspect = function(n, opts) {
      var str = "LRUCache {";
      var extras = false;
      var as = this[ALLOW_STALE];
      if (as) {
        str += "\n  allowStale: true";
        extras = true;
      }
      var max = this[MAX];
      if (max && max !== Infinity) {
        if (extras) {
          str += ",";
        }
        str += "\n  max: " + util2.inspect(max, opts);
        extras = true;
      }
      var maxAge = this[MAX_AGE];
      if (maxAge) {
        if (extras) {
          str += ",";
        }
        str += "\n  maxAge: " + util2.inspect(maxAge, opts);
        extras = true;
      }
      var lc = this[LENGTH_CALCULATOR];
      if (lc && lc !== naiveLength) {
        if (extras) {
          str += ",";
        }
        str += "\n  length: " + util2.inspect(this[LENGTH], opts);
        extras = true;
      }
      var didFirst = false;
      this[LRU_LIST].forEach(function(item) {
        if (didFirst) {
          str += ",\n  ";
        } else {
          if (extras) {
            str += ",\n";
          }
          didFirst = true;
          str += "\n  ";
        }
        var key = util2.inspect(item.key).split("\n").join("\n  ");
        var val = { value: item.value };
        if (item.maxAge !== maxAge) {
          val.maxAge = item.maxAge;
        }
        if (lc !== naiveLength) {
          val.length = item.length;
        }
        if (isStale(this, item)) {
          val.stale = true;
        }
        val = util2.inspect(val, opts).split("\n").join("\n  ");
        str += key + " => " + val;
      });
      if (didFirst || extras) {
        str += "\n";
      }
      str += "}";
      return str;
    };
    LRUCache2.prototype.set = function(key, value, maxAge) {
      maxAge = maxAge || this[MAX_AGE];
      var now = maxAge ? Date.now() : 0;
      var len = this[LENGTH_CALCULATOR](value, key);
      if (this[CACHE].has(key)) {
        if (len > this[MAX]) {
          del(this, this[CACHE].get(key));
          return false;
        }
        var node = this[CACHE].get(key);
        var item = node.value;
        if (this[DISPOSE]) {
          if (!this[NO_DISPOSE_ON_SET]) {
            this[DISPOSE](key, item.value);
          }
        }
        item.now = now;
        item.maxAge = maxAge;
        item.value = value;
        this[LENGTH] += len - item.length;
        item.length = len;
        this.get(key);
        trim(this);
        return true;
      }
      var hit = new Entry(key, value, len, now, maxAge);
      if (hit.length > this[MAX]) {
        if (this[DISPOSE]) {
          this[DISPOSE](key, value);
        }
        return false;
      }
      this[LENGTH] += hit.length;
      this[LRU_LIST].unshift(hit);
      this[CACHE].set(key, this[LRU_LIST].head);
      trim(this);
      return true;
    };
    LRUCache2.prototype.has = function(key) {
      if (!this[CACHE].has(key)) return false;
      var hit = this[CACHE].get(key).value;
      if (isStale(this, hit)) {
        return false;
      }
      return true;
    };
    LRUCache2.prototype.get = function(key) {
      return get(this, key, true);
    };
    LRUCache2.prototype.peek = function(key) {
      return get(this, key, false);
    };
    LRUCache2.prototype.pop = function() {
      var node = this[LRU_LIST].tail;
      if (!node) return null;
      del(this, node);
      return node.value;
    };
    LRUCache2.prototype.del = function(key) {
      del(this, this[CACHE].get(key));
    };
    LRUCache2.prototype.load = function(arr) {
      this.reset();
      var now = Date.now();
      for (var l = arr.length - 1; l >= 0; l--) {
        var hit = arr[l];
        var expiresAt = hit.e || 0;
        if (expiresAt === 0) {
          this.set(hit.k, hit.v);
        } else {
          var maxAge = expiresAt - now;
          if (maxAge > 0) {
            this.set(hit.k, hit.v, maxAge);
          }
        }
      }
    };
    LRUCache2.prototype.prune = function() {
      var self2 = this;
      this[CACHE].forEach(function(value, key) {
        get(self2, key, false);
      });
    };
    function get(self2, key, doUse) {
      var node = self2[CACHE].get(key);
      if (node) {
        var hit = node.value;
        if (isStale(self2, hit)) {
          del(self2, node);
          if (!self2[ALLOW_STALE]) hit = void 0;
        } else {
          if (doUse) {
            self2[LRU_LIST].unshiftNode(node);
          }
        }
        if (hit) hit = hit.value;
      }
      return hit;
    }
    function isStale(self2, hit) {
      if (!hit || !hit.maxAge && !self2[MAX_AGE]) {
        return false;
      }
      var stale = false;
      var diff = Date.now() - hit.now;
      if (hit.maxAge) {
        stale = diff > hit.maxAge;
      } else {
        stale = self2[MAX_AGE] && diff > self2[MAX_AGE];
      }
      return stale;
    }
    function trim(self2) {
      if (self2[LENGTH] > self2[MAX]) {
        for (var walker = self2[LRU_LIST].tail; self2[LENGTH] > self2[MAX] && walker !== null; ) {
          var prev = walker.prev;
          del(self2, walker);
          walker = prev;
        }
      }
    }
    function del(self2, node) {
      if (node) {
        var hit = node.value;
        if (self2[DISPOSE]) {
          self2[DISPOSE](hit.key, hit.value);
        }
        self2[LENGTH] -= hit.length;
        self2[CACHE].delete(hit.key);
        self2[LRU_LIST].removeNode(node);
      }
    }
    function Entry(key, value, length, now, maxAge) {
      this.key = key;
      this.value = value;
      this.length = length;
      this.now = now;
      this.maxAge = maxAge || 0;
    }
  }
});

// node_modules/.pnpm/cross-spawn@5.1.0/node_modules/cross-spawn/lib/util/resolveCommand.js
var require_resolveCommand = __commonJS({
  "node_modules/.pnpm/cross-spawn@5.1.0/node_modules/cross-spawn/lib/util/resolveCommand.js"(exports2, module2) {
    "use strict";
    var path6 = require("path");
    var which = require_which();
    var LRU = require_lru_cache();
    var commandCache = new LRU({ max: 50, maxAge: 30 * 1e3 });
    function resolveCommand(command, noExtension) {
      var resolved;
      noExtension = !!noExtension;
      resolved = commandCache.get(command + "!" + noExtension);
      if (commandCache.has(command)) {
        return commandCache.get(command);
      }
      try {
        resolved = !noExtension ? which.sync(command) : which.sync(command, { pathExt: path6.delimiter + (process.env.PATHEXT || "") });
      } catch (e) {
      }
      commandCache.set(command + "!" + noExtension, resolved);
      return resolved;
    }
    module2.exports = resolveCommand;
  }
});

// node_modules/.pnpm/cross-spawn@5.1.0/node_modules/cross-spawn/lib/util/hasEmptyArgumentBug.js
var require_hasEmptyArgumentBug = __commonJS({
  "node_modules/.pnpm/cross-spawn@5.1.0/node_modules/cross-spawn/lib/util/hasEmptyArgumentBug.js"(exports2, module2) {
    "use strict";
    function hasEmptyArgumentBug() {
      var nodeVer;
      if (process.platform !== "win32") {
        return false;
      }
      nodeVer = process.version.substr(1).split(".").map(function(num) {
        return parseInt(num, 10);
      });
      return nodeVer[0] === 0 && nodeVer[1] < 12;
    }
    module2.exports = hasEmptyArgumentBug();
  }
});

// node_modules/.pnpm/cross-spawn@5.1.0/node_modules/cross-spawn/lib/util/escapeArgument.js
var require_escapeArgument = __commonJS({
  "node_modules/.pnpm/cross-spawn@5.1.0/node_modules/cross-spawn/lib/util/escapeArgument.js"(exports2, module2) {
    "use strict";
    function escapeArgument(arg, quote) {
      arg = "" + arg;
      if (!quote) {
        arg = arg.replace(/([()%!^<>&|;,"'\s])/g, "^$1");
      } else {
        arg = arg.replace(/(\\*)"/g, '$1$1\\"');
        arg = arg.replace(/(\\*)$/, "$1$1");
        arg = '"' + arg + '"';
      }
      return arg;
    }
    module2.exports = escapeArgument;
  }
});

// node_modules/.pnpm/cross-spawn@5.1.0/node_modules/cross-spawn/lib/util/escapeCommand.js
var require_escapeCommand = __commonJS({
  "node_modules/.pnpm/cross-spawn@5.1.0/node_modules/cross-spawn/lib/util/escapeCommand.js"(exports2, module2) {
    "use strict";
    var escapeArgument = require_escapeArgument();
    function escapeCommand(command) {
      return /^[a-z0-9_-]+$/i.test(command) ? command : escapeArgument(command, true);
    }
    module2.exports = escapeCommand;
  }
});

// node_modules/.pnpm/shebang-regex@1.0.0/node_modules/shebang-regex/index.js
var require_shebang_regex = __commonJS({
  "node_modules/.pnpm/shebang-regex@1.0.0/node_modules/shebang-regex/index.js"(exports2, module2) {
    "use strict";
    module2.exports = /^#!.*/;
  }
});

// node_modules/.pnpm/shebang-command@1.2.0/node_modules/shebang-command/index.js
var require_shebang_command = __commonJS({
  "node_modules/.pnpm/shebang-command@1.2.0/node_modules/shebang-command/index.js"(exports2, module2) {
    "use strict";
    var shebangRegex = require_shebang_regex();
    module2.exports = function(str) {
      var match2 = str.match(shebangRegex);
      if (!match2) {
        return null;
      }
      var arr = match2[0].replace(/#! ?/, "").split(" ");
      var bin = arr[0].split("/").pop();
      var arg = arr[1];
      return bin === "env" ? arg : bin + (arg ? " " + arg : "");
    };
  }
});

// node_modules/.pnpm/cross-spawn@5.1.0/node_modules/cross-spawn/lib/util/readShebang.js
var require_readShebang = __commonJS({
  "node_modules/.pnpm/cross-spawn@5.1.0/node_modules/cross-spawn/lib/util/readShebang.js"(exports2, module2) {
    "use strict";
    var fs5 = require("fs");
    var LRU = require_lru_cache();
    var shebangCommand = require_shebang_command();
    var shebangCache = new LRU({ max: 50, maxAge: 30 * 1e3 });
    function readShebang(command) {
      var buffer;
      var fd;
      var shebang;
      if (shebangCache.has(command)) {
        return shebangCache.get(command);
      }
      buffer = new Buffer(150);
      try {
        fd = fs5.openSync(command, "r");
        fs5.readSync(fd, buffer, 0, 150, 0);
        fs5.closeSync(fd);
      } catch (e) {
      }
      shebang = shebangCommand(buffer.toString());
      shebangCache.set(command, shebang);
      return shebang;
    }
    module2.exports = readShebang;
  }
});

// node_modules/.pnpm/cross-spawn@5.1.0/node_modules/cross-spawn/lib/parse.js
var require_parse = __commonJS({
  "node_modules/.pnpm/cross-spawn@5.1.0/node_modules/cross-spawn/lib/parse.js"(exports2, module2) {
    "use strict";
    var resolveCommand = require_resolveCommand();
    var hasEmptyArgumentBug = require_hasEmptyArgumentBug();
    var escapeArgument = require_escapeArgument();
    var escapeCommand = require_escapeCommand();
    var readShebang = require_readShebang();
    var isWin = process.platform === "win32";
    var skipShellRegExp = /\.(?:com|exe)$/i;
    var supportsShellOption = parseInt(process.version.substr(1).split(".")[0], 10) >= 6 || parseInt(process.version.substr(1).split(".")[0], 10) === 4 && parseInt(process.version.substr(1).split(".")[1], 10) >= 8;
    function parseNonShell(parsed) {
      var shebang;
      var needsShell;
      var applyQuotes;
      if (!isWin) {
        return parsed;
      }
      parsed.file = resolveCommand(parsed.command);
      parsed.file = parsed.file || resolveCommand(parsed.command, true);
      shebang = parsed.file && readShebang(parsed.file);
      if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;
        needsShell = hasEmptyArgumentBug || !skipShellRegExp.test(resolveCommand(shebang) || resolveCommand(shebang, true));
      } else {
        needsShell = hasEmptyArgumentBug || !skipShellRegExp.test(parsed.file);
      }
      if (needsShell) {
        applyQuotes = parsed.command !== "echo";
        parsed.command = escapeCommand(parsed.command);
        parsed.args = parsed.args.map(function(arg) {
          return escapeArgument(arg, applyQuotes);
        });
        parsed.args = ["/d", "/s", "/c", '"' + parsed.command + (parsed.args.length ? " " + parsed.args.join(" ") : "") + '"'];
        parsed.command = process.env.comspec || "cmd.exe";
        parsed.options.windowsVerbatimArguments = true;
      }
      return parsed;
    }
    function parseShell(parsed) {
      var shellCommand;
      if (supportsShellOption) {
        return parsed;
      }
      shellCommand = [parsed.command].concat(parsed.args).join(" ");
      if (isWin) {
        parsed.command = typeof parsed.options.shell === "string" ? parsed.options.shell : process.env.comspec || "cmd.exe";
        parsed.args = ["/d", "/s", "/c", '"' + shellCommand + '"'];
        parsed.options.windowsVerbatimArguments = true;
      } else {
        if (typeof parsed.options.shell === "string") {
          parsed.command = parsed.options.shell;
        } else if (process.platform === "android") {
          parsed.command = "/system/bin/sh";
        } else {
          parsed.command = "/bin/sh";
        }
        parsed.args = ["-c", shellCommand];
      }
      return parsed;
    }
    function parse(command, args, options) {
      var parsed;
      if (args && !Array.isArray(args)) {
        options = args;
        args = null;
      }
      args = args ? args.slice(0) : [];
      options = options || {};
      parsed = {
        command,
        args,
        options,
        file: void 0,
        original: command
      };
      return options.shell ? parseShell(parsed) : parseNonShell(parsed);
    }
    module2.exports = parse;
  }
});

// node_modules/.pnpm/cross-spawn@5.1.0/node_modules/cross-spawn/lib/enoent.js
var require_enoent = __commonJS({
  "node_modules/.pnpm/cross-spawn@5.1.0/node_modules/cross-spawn/lib/enoent.js"(exports2, module2) {
    "use strict";
    var isWin = process.platform === "win32";
    var resolveCommand = require_resolveCommand();
    var isNode10 = process.version.indexOf("v0.10.") === 0;
    function notFoundError(command, syscall) {
      var err;
      err = new Error(syscall + " " + command + " ENOENT");
      err.code = err.errno = "ENOENT";
      err.syscall = syscall + " " + command;
      return err;
    }
    function hookChildProcess(cp2, parsed) {
      var originalEmit;
      if (!isWin) {
        return;
      }
      originalEmit = cp2.emit;
      cp2.emit = function(name, arg1) {
        var err;
        if (name === "exit") {
          err = verifyENOENT(arg1, parsed, "spawn");
          if (err) {
            return originalEmit.call(cp2, "error", err);
          }
        }
        return originalEmit.apply(cp2, arguments);
      };
    }
    function verifyENOENT(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawn");
      }
      return null;
    }
    function verifyENOENTSync(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawnSync");
      }
      if (isNode10 && status === -1) {
        parsed.file = isWin ? parsed.file : resolveCommand(parsed.original);
        if (!parsed.file) {
          return notFoundError(parsed.original, "spawnSync");
        }
      }
      return null;
    }
    module2.exports.hookChildProcess = hookChildProcess;
    module2.exports.verifyENOENT = verifyENOENT;
    module2.exports.verifyENOENTSync = verifyENOENTSync;
    module2.exports.notFoundError = notFoundError;
  }
});

// node_modules/.pnpm/cross-spawn@5.1.0/node_modules/cross-spawn/index.js
var require_cross_spawn = __commonJS({
  "node_modules/.pnpm/cross-spawn@5.1.0/node_modules/cross-spawn/index.js"(exports2, module2) {
    "use strict";
    var cp2 = require("child_process");
    var parse = require_parse();
    var enoent = require_enoent();
    var cpSpawnSync = cp2.spawnSync;
    function spawn2(command, args, options) {
      var parsed;
      var spawned;
      parsed = parse(command, args, options);
      spawned = cp2.spawn(parsed.command, parsed.args, parsed.options);
      enoent.hookChildProcess(spawned, parsed);
      return spawned;
    }
    function spawnSync(command, args, options) {
      var parsed;
      var result;
      if (!cpSpawnSync) {
        try {
          cpSpawnSync = require("spawn-sync");
        } catch (ex) {
          throw new Error(
            "In order to use spawnSync on node 0.10 or older, you must install spawn-sync:\n\n  npm install spawn-sync --save"
          );
        }
      }
      parsed = parse(command, args, options);
      result = cpSpawnSync(parsed.command, parsed.args, parsed.options);
      result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
      return result;
    }
    module2.exports = spawn2;
    module2.exports.spawn = spawn2;
    module2.exports.sync = spawnSync;
    module2.exports._parse = parse;
    module2.exports._enoent = enoent;
  }
});

// node_modules/.pnpm/signal-exit@3.0.7/node_modules/signal-exit/signals.js
var require_signals = __commonJS({
  "node_modules/.pnpm/signal-exit@3.0.7/node_modules/signal-exit/signals.js"(exports2, module2) {
    "use strict";
    module2.exports = [
      "SIGABRT",
      "SIGALRM",
      "SIGHUP",
      "SIGINT",
      "SIGTERM"
    ];
    if (process.platform !== "win32") {
      module2.exports.push(
        "SIGVTALRM",
        "SIGXCPU",
        "SIGXFSZ",
        "SIGUSR2",
        "SIGTRAP",
        "SIGSYS",
        "SIGQUIT",
        "SIGIOT"
        // should detect profiler and enable/disable accordingly.
        // see #21
        // 'SIGPROF'
      );
    }
    if (process.platform === "linux") {
      module2.exports.push(
        "SIGIO",
        "SIGPOLL",
        "SIGPWR",
        "SIGSTKFLT",
        "SIGUNUSED"
      );
    }
  }
});

// node_modules/.pnpm/signal-exit@3.0.7/node_modules/signal-exit/index.js
var require_signal_exit = __commonJS({
  "node_modules/.pnpm/signal-exit@3.0.7/node_modules/signal-exit/index.js"(exports2, module2) {
    "use strict";
    var process2 = global.process;
    var processOk = function(process3) {
      return process3 && typeof process3 === "object" && typeof process3.removeListener === "function" && typeof process3.emit === "function" && typeof process3.reallyExit === "function" && typeof process3.listeners === "function" && typeof process3.kill === "function" && typeof process3.pid === "number" && typeof process3.on === "function";
    };
    if (!processOk(process2)) {
      module2.exports = function() {
        return function() {
        };
      };
    } else {
      assert = require("assert");
      signals = require_signals();
      isWin = /^win/i.test(process2.platform);
      EE = require("events");
      if (typeof EE !== "function") {
        EE = EE.EventEmitter;
      }
      if (process2.__signal_exit_emitter__) {
        emitter = process2.__signal_exit_emitter__;
      } else {
        emitter = process2.__signal_exit_emitter__ = new EE();
        emitter.count = 0;
        emitter.emitted = {};
      }
      if (!emitter.infinite) {
        emitter.setMaxListeners(Infinity);
        emitter.infinite = true;
      }
      module2.exports = function(cb, opts) {
        if (!processOk(global.process)) {
          return function() {
          };
        }
        assert.equal(typeof cb, "function", "a callback must be provided for exit handler");
        if (loaded === false) {
          load();
        }
        var ev = "exit";
        if (opts && opts.alwaysLast) {
          ev = "afterexit";
        }
        var remove = function() {
          emitter.removeListener(ev, cb);
          if (emitter.listeners("exit").length === 0 && emitter.listeners("afterexit").length === 0) {
            unload();
          }
        };
        emitter.on(ev, cb);
        return remove;
      };
      unload = function unload2() {
        if (!loaded || !processOk(global.process)) {
          return;
        }
        loaded = false;
        signals.forEach(function(sig) {
          try {
            process2.removeListener(sig, sigListeners[sig]);
          } catch (er) {
          }
        });
        process2.emit = originalProcessEmit;
        process2.reallyExit = originalProcessReallyExit;
        emitter.count -= 1;
      };
      module2.exports.unload = unload;
      emit = function emit2(event, code, signal) {
        if (emitter.emitted[event]) {
          return;
        }
        emitter.emitted[event] = true;
        emitter.emit(event, code, signal);
      };
      sigListeners = {};
      signals.forEach(function(sig) {
        sigListeners[sig] = function listener() {
          if (!processOk(global.process)) {
            return;
          }
          var listeners = process2.listeners(sig);
          if (listeners.length === emitter.count) {
            unload();
            emit("exit", null, sig);
            emit("afterexit", null, sig);
            if (isWin && sig === "SIGHUP") {
              sig = "SIGINT";
            }
            process2.kill(process2.pid, sig);
          }
        };
      });
      module2.exports.signals = function() {
        return signals;
      };
      loaded = false;
      load = function load2() {
        if (loaded || !processOk(global.process)) {
          return;
        }
        loaded = true;
        emitter.count += 1;
        signals = signals.filter(function(sig) {
          try {
            process2.on(sig, sigListeners[sig]);
            return true;
          } catch (er) {
            return false;
          }
        });
        process2.emit = processEmit;
        process2.reallyExit = processReallyExit;
      };
      module2.exports.load = load;
      originalProcessReallyExit = process2.reallyExit;
      processReallyExit = function processReallyExit2(code) {
        if (!processOk(global.process)) {
          return;
        }
        process2.exitCode = code || /* istanbul ignore next */
        0;
        emit("exit", process2.exitCode, null);
        emit("afterexit", process2.exitCode, null);
        originalProcessReallyExit.call(process2, process2.exitCode);
      };
      originalProcessEmit = process2.emit;
      processEmit = function processEmit2(ev, arg) {
        if (ev === "exit" && processOk(global.process)) {
          if (arg !== void 0) {
            process2.exitCode = arg;
          }
          var ret = originalProcessEmit.apply(this, arguments);
          emit("exit", process2.exitCode, null);
          emit("afterexit", process2.exitCode, null);
          return ret;
        } else {
          return originalProcessEmit.apply(this, arguments);
        }
      };
    }
    var assert;
    var signals;
    var isWin;
    var EE;
    var emitter;
    var unload;
    var emit;
    var sigListeners;
    var loaded;
    var load;
    var originalProcessReallyExit;
    var processReallyExit;
    var originalProcessEmit;
    var processEmit;
  }
});

// node_modules/.pnpm/spawndamnit@2.0.0/node_modules/spawndamnit/promise.js
var require_promise = __commonJS({
  "node_modules/.pnpm/spawndamnit@2.0.0/node_modules/spawndamnit/promise.js"(exports2, module2) {
    "use strict";
    var EventEmitter2 = require("events");
    var ChildProcessPromise = class extends Promise {
      constructor(executer) {
        let resolve;
        let reject;
        super((res, rej) => {
          resolve = res;
          reject = rej;
        });
        executer(resolve, reject, this);
      }
    };
    Object.assign(ChildProcessPromise.prototype, EventEmitter2.prototype);
    module2.exports = ChildProcessPromise;
  }
});

// node_modules/.pnpm/spawndamnit@2.0.0/node_modules/spawndamnit/index.js
var require_spawndamnit = __commonJS({
  "node_modules/.pnpm/spawndamnit@2.0.0/node_modules/spawndamnit/index.js"(exports2, module2) {
    "use strict";
    var crossSpawn = require_cross_spawn();
    var onExit = require_signal_exit();
    var EventEmitter2 = require("events");
    var ChildProcessPromise = require_promise();
    var activeProcesses = /* @__PURE__ */ new Set();
    onExit(() => {
      for (let child of activeProcesses) {
        child.kill("SIGTERM");
      }
    });
    function spawn2(cmd, args, opts) {
      return new ChildProcessPromise((resolve, reject, events) => {
        let child = crossSpawn(cmd, args, opts);
        let stdout = Buffer.from("");
        let stderr = Buffer.from("");
        activeProcesses.add(child);
        if (child.stdout) {
          child.stdout.on("data", (data) => {
            stdout = Buffer.concat([stdout, data]);
            events.emit("stdout", data);
          });
        }
        if (child.stderr) {
          child.stderr.on("data", (data) => {
            stderr = Buffer.concat([stderr, data]);
            events.emit("stderr", data);
          });
        }
        child.on("error", (err) => {
          activeProcesses.delete(child);
          reject(err);
        });
        child.on("close", (code) => {
          activeProcesses.delete(child);
          resolve({ code, stdout, stderr });
        });
      });
    }
    module2.exports = spawn2;
    module2.exports.ChildProcessPromise = ChildProcessPromise;
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/typeof.js
var require_typeof = __commonJS({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/typeof.js"(exports2, module2) {
    "use strict";
    function _typeof2(o) {
      "@babel/helpers - typeof";
      return module2.exports = _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, module2.exports.__esModule = true, module2.exports["default"] = module2.exports, _typeof2(o);
    }
    module2.exports = _typeof2, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/regeneratorRuntime.js
var require_regeneratorRuntime = __commonJS({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/regeneratorRuntime.js"(exports2, module2) {
    "use strict";
    var _typeof2 = require_typeof()["default"];
    function _regeneratorRuntime2() {
      "use strict";
      module2.exports = _regeneratorRuntime2 = function _regeneratorRuntime3() {
        return e;
      }, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
      var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function(t2, e2, r2) {
        t2[e2] = r2.value;
      }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag";
      function define2(t2, e2, r2) {
        return Object.defineProperty(t2, e2, {
          value: r2,
          enumerable: true,
          configurable: true,
          writable: true
        }), t2[e2];
      }
      try {
        define2({}, "");
      } catch (t2) {
        define2 = function define3(t3, e2, r2) {
          return t3[e2] = r2;
        };
      }
      function wrap(t2, e2, r2, n2) {
        var i2 = e2 && e2.prototype instanceof Generator ? e2 : Generator, a2 = Object.create(i2.prototype), c2 = new Context(n2 || []);
        return o(a2, "_invoke", {
          value: makeInvokeMethod(t2, r2, c2)
        }), a2;
      }
      function tryCatch(t2, e2, r2) {
        try {
          return {
            type: "normal",
            arg: t2.call(e2, r2)
          };
        } catch (t3) {
          return {
            type: "throw",
            arg: t3
          };
        }
      }
      e.wrap = wrap;
      var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {};
      function Generator() {
      }
      function GeneratorFunction() {
      }
      function GeneratorFunctionPrototype() {
      }
      var p = {};
      define2(p, a, function() {
        return this;
      });
      var d = Object.getPrototypeOf, v = d && d(d(values([])));
      v && v !== r && n.call(v, a) && (p = v);
      var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
      function defineIteratorMethods(t2) {
        ["next", "throw", "return"].forEach(function(e2) {
          define2(t2, e2, function(t3) {
            return this._invoke(e2, t3);
          });
        });
      }
      function AsyncIterator(t2, e2) {
        function invoke(r3, o2, i2, a2) {
          var c2 = tryCatch(t2[r3], t2, o2);
          if ("throw" !== c2.type) {
            var u2 = c2.arg, h2 = u2.value;
            return h2 && "object" == _typeof2(h2) && n.call(h2, "__await") ? e2.resolve(h2.__await).then(function(t3) {
              invoke("next", t3, i2, a2);
            }, function(t3) {
              invoke("throw", t3, i2, a2);
            }) : e2.resolve(h2).then(function(t3) {
              u2.value = t3, i2(u2);
            }, function(t3) {
              return invoke("throw", t3, i2, a2);
            });
          }
          a2(c2.arg);
        }
        var r2;
        o(this, "_invoke", {
          value: function value(t3, n2) {
            function callInvokeWithMethodAndArg() {
              return new e2(function(e3, r3) {
                invoke(t3, n2, e3, r3);
              });
            }
            return r2 = r2 ? r2.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
          }
        });
      }
      function makeInvokeMethod(e2, r2, n2) {
        var o2 = h;
        return function(i2, a2) {
          if (o2 === f) throw new Error("Generator is already running");
          if (o2 === s) {
            if ("throw" === i2) throw a2;
            return {
              value: t,
              done: true
            };
          }
          for (n2.method = i2, n2.arg = a2; ; ) {
            var c2 = n2.delegate;
            if (c2) {
              var u2 = maybeInvokeDelegate(c2, n2);
              if (u2) {
                if (u2 === y) continue;
                return u2;
              }
            }
            if ("next" === n2.method) n2.sent = n2._sent = n2.arg;
            else if ("throw" === n2.method) {
              if (o2 === h) throw o2 = s, n2.arg;
              n2.dispatchException(n2.arg);
            } else "return" === n2.method && n2.abrupt("return", n2.arg);
            o2 = f;
            var p2 = tryCatch(e2, r2, n2);
            if ("normal" === p2.type) {
              if (o2 = n2.done ? s : l, p2.arg === y) continue;
              return {
                value: p2.arg,
                done: n2.done
              };
            }
            "throw" === p2.type && (o2 = s, n2.method = "throw", n2.arg = p2.arg);
          }
        };
      }
      function maybeInvokeDelegate(e2, r2) {
        var n2 = r2.method, o2 = e2.iterator[n2];
        if (o2 === t) return r2.delegate = null, "throw" === n2 && e2.iterator["return"] && (r2.method = "return", r2.arg = t, maybeInvokeDelegate(e2, r2), "throw" === r2.method) || "return" !== n2 && (r2.method = "throw", r2.arg = new TypeError("The iterator does not provide a '" + n2 + "' method")), y;
        var i2 = tryCatch(o2, e2.iterator, r2.arg);
        if ("throw" === i2.type) return r2.method = "throw", r2.arg = i2.arg, r2.delegate = null, y;
        var a2 = i2.arg;
        return a2 ? a2.done ? (r2[e2.resultName] = a2.value, r2.next = e2.nextLoc, "return" !== r2.method && (r2.method = "next", r2.arg = t), r2.delegate = null, y) : a2 : (r2.method = "throw", r2.arg = new TypeError("iterator result is not an object"), r2.delegate = null, y);
      }
      function pushTryEntry(t2) {
        var e2 = {
          tryLoc: t2[0]
        };
        1 in t2 && (e2.catchLoc = t2[1]), 2 in t2 && (e2.finallyLoc = t2[2], e2.afterLoc = t2[3]), this.tryEntries.push(e2);
      }
      function resetTryEntry(t2) {
        var e2 = t2.completion || {};
        e2.type = "normal", delete e2.arg, t2.completion = e2;
      }
      function Context(t2) {
        this.tryEntries = [{
          tryLoc: "root"
        }], t2.forEach(pushTryEntry, this), this.reset(true);
      }
      function values(e2) {
        if (e2 || "" === e2) {
          var r2 = e2[a];
          if (r2) return r2.call(e2);
          if ("function" == typeof e2.next) return e2;
          if (!isNaN(e2.length)) {
            var o2 = -1, i2 = function next() {
              for (; ++o2 < e2.length; ) if (n.call(e2, o2)) return next.value = e2[o2], next.done = false, next;
              return next.value = t, next.done = true, next;
            };
            return i2.next = i2;
          }
        }
        throw new TypeError(_typeof2(e2) + " is not iterable");
      }
      return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
        value: GeneratorFunctionPrototype,
        configurable: true
      }), o(GeneratorFunctionPrototype, "constructor", {
        value: GeneratorFunction,
        configurable: true
      }), GeneratorFunction.displayName = define2(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function(t2) {
        var e2 = "function" == typeof t2 && t2.constructor;
        return !!e2 && (e2 === GeneratorFunction || "GeneratorFunction" === (e2.displayName || e2.name));
      }, e.mark = function(t2) {
        return Object.setPrototypeOf ? Object.setPrototypeOf(t2, GeneratorFunctionPrototype) : (t2.__proto__ = GeneratorFunctionPrototype, define2(t2, u, "GeneratorFunction")), t2.prototype = Object.create(g), t2;
      }, e.awrap = function(t2) {
        return {
          __await: t2
        };
      }, defineIteratorMethods(AsyncIterator.prototype), define2(AsyncIterator.prototype, c, function() {
        return this;
      }), e.AsyncIterator = AsyncIterator, e.async = function(t2, r2, n2, o2, i2) {
        void 0 === i2 && (i2 = Promise);
        var a2 = new AsyncIterator(wrap(t2, r2, n2, o2), i2);
        return e.isGeneratorFunction(r2) ? a2 : a2.next().then(function(t3) {
          return t3.done ? t3.value : a2.next();
        });
      }, defineIteratorMethods(g), define2(g, u, "Generator"), define2(g, a, function() {
        return this;
      }), define2(g, "toString", function() {
        return "[object Generator]";
      }), e.keys = function(t2) {
        var e2 = Object(t2), r2 = [];
        for (var n2 in e2) r2.push(n2);
        return r2.reverse(), function next() {
          for (; r2.length; ) {
            var t3 = r2.pop();
            if (t3 in e2) return next.value = t3, next.done = false, next;
          }
          return next.done = true, next;
        };
      }, e.values = values, Context.prototype = {
        constructor: Context,
        reset: function reset(e2) {
          if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = false, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e2) for (var r2 in this) "t" === r2.charAt(0) && n.call(this, r2) && !isNaN(+r2.slice(1)) && (this[r2] = t);
        },
        stop: function stop() {
          this.done = true;
          var t2 = this.tryEntries[0].completion;
          if ("throw" === t2.type) throw t2.arg;
          return this.rval;
        },
        dispatchException: function dispatchException(e2) {
          if (this.done) throw e2;
          var r2 = this;
          function handle(n2, o3) {
            return a2.type = "throw", a2.arg = e2, r2.next = n2, o3 && (r2.method = "next", r2.arg = t), !!o3;
          }
          for (var o2 = this.tryEntries.length - 1; o2 >= 0; --o2) {
            var i2 = this.tryEntries[o2], a2 = i2.completion;
            if ("root" === i2.tryLoc) return handle("end");
            if (i2.tryLoc <= this.prev) {
              var c2 = n.call(i2, "catchLoc"), u2 = n.call(i2, "finallyLoc");
              if (c2 && u2) {
                if (this.prev < i2.catchLoc) return handle(i2.catchLoc, true);
                if (this.prev < i2.finallyLoc) return handle(i2.finallyLoc);
              } else if (c2) {
                if (this.prev < i2.catchLoc) return handle(i2.catchLoc, true);
              } else {
                if (!u2) throw new Error("try statement without catch or finally");
                if (this.prev < i2.finallyLoc) return handle(i2.finallyLoc);
              }
            }
          }
        },
        abrupt: function abrupt(t2, e2) {
          for (var r2 = this.tryEntries.length - 1; r2 >= 0; --r2) {
            var o2 = this.tryEntries[r2];
            if (o2.tryLoc <= this.prev && n.call(o2, "finallyLoc") && this.prev < o2.finallyLoc) {
              var i2 = o2;
              break;
            }
          }
          i2 && ("break" === t2 || "continue" === t2) && i2.tryLoc <= e2 && e2 <= i2.finallyLoc && (i2 = null);
          var a2 = i2 ? i2.completion : {};
          return a2.type = t2, a2.arg = e2, i2 ? (this.method = "next", this.next = i2.finallyLoc, y) : this.complete(a2);
        },
        complete: function complete(t2, e2) {
          if ("throw" === t2.type) throw t2.arg;
          return "break" === t2.type || "continue" === t2.type ? this.next = t2.arg : "return" === t2.type ? (this.rval = this.arg = t2.arg, this.method = "return", this.next = "end") : "normal" === t2.type && e2 && (this.next = e2), y;
        },
        finish: function finish(t2) {
          for (var e2 = this.tryEntries.length - 1; e2 >= 0; --e2) {
            var r2 = this.tryEntries[e2];
            if (r2.finallyLoc === t2) return this.complete(r2.completion, r2.afterLoc), resetTryEntry(r2), y;
          }
        },
        "catch": function _catch(t2) {
          for (var e2 = this.tryEntries.length - 1; e2 >= 0; --e2) {
            var r2 = this.tryEntries[e2];
            if (r2.tryLoc === t2) {
              var n2 = r2.completion;
              if ("throw" === n2.type) {
                var o2 = n2.arg;
                resetTryEntry(r2);
              }
              return o2;
            }
          }
          throw new Error("illegal catch attempt");
        },
        delegateYield: function delegateYield(e2, r2, n2) {
          return this.delegate = {
            iterator: values(e2),
            resultName: r2,
            nextLoc: n2
          }, "next" === this.method && (this.arg = t), y;
        }
      }, e;
    }
    module2.exports = _regeneratorRuntime2, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/regenerator/index.js
var require_regenerator = __commonJS({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/regenerator/index.js"(exports2, module2) {
    "use strict";
    var runtime = require_regeneratorRuntime()();
    module2.exports = runtime;
    try {
      regeneratorRuntime = runtime;
    } catch (accidentalStrictMode) {
      if (typeof globalThis === "object") {
        globalThis.regeneratorRuntime = runtime;
      } else {
        Function("r", "regeneratorRuntime = r")(runtime);
      }
    }
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/asyncToGenerator.js
var require_asyncToGenerator = __commonJS({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/asyncToGenerator.js"(exports2, module2) {
    "use strict";
    function asyncGeneratorStep2(gen, resolve, reject, _next, _throw, key, arg) {
      try {
        var info = gen[key](arg);
        var value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(_next, _throw);
      }
    }
    function _asyncToGenerator2(fn) {
      return function() {
        var self2 = this, args = arguments;
        return new Promise(function(resolve, reject) {
          var gen = fn.apply(self2, args);
          function _next(value) {
            asyncGeneratorStep2(gen, resolve, reject, _next, _throw, "next", value);
          }
          function _throw(err) {
            asyncGeneratorStep2(gen, resolve, reject, _next, _throw, "throw", err);
          }
          _next(void 0);
        });
      };
    }
    module2.exports = _asyncToGenerator2, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/classCallCheck.js
var require_classCallCheck = __commonJS({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/classCallCheck.js"(exports2, module2) {
    "use strict";
    function _classCallCheck2(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    module2.exports = _classCallCheck2, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/assertThisInitialized.js
var require_assertThisInitialized = __commonJS({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/assertThisInitialized.js"(exports2, module2) {
    "use strict";
    function _assertThisInitialized2(self2) {
      if (self2 === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self2;
    }
    module2.exports = _assertThisInitialized2, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/possibleConstructorReturn.js
var require_possibleConstructorReturn = __commonJS({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"(exports2, module2) {
    "use strict";
    var _typeof2 = require_typeof()["default"];
    var assertThisInitialized = require_assertThisInitialized();
    function _possibleConstructorReturn2(self2, call) {
      if (call && (_typeof2(call) === "object" || typeof call === "function")) {
        return call;
      } else if (call !== void 0) {
        throw new TypeError("Derived constructors may only return object or undefined");
      }
      return assertThisInitialized(self2);
    }
    module2.exports = _possibleConstructorReturn2, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/getPrototypeOf.js
var require_getPrototypeOf = __commonJS({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/getPrototypeOf.js"(exports2, module2) {
    "use strict";
    function _getPrototypeOf2(o) {
      module2.exports = _getPrototypeOf2 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf3(o2) {
        return o2.__proto__ || Object.getPrototypeOf(o2);
      }, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
      return _getPrototypeOf2(o);
    }
    module2.exports = _getPrototypeOf2, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/setPrototypeOf.js
var require_setPrototypeOf = __commonJS({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/setPrototypeOf.js"(exports2, module2) {
    "use strict";
    function _setPrototypeOf2(o, p) {
      module2.exports = _setPrototypeOf2 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf3(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      }, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
      return _setPrototypeOf2(o, p);
    }
    module2.exports = _setPrototypeOf2, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/inherits.js
var require_inherits = __commonJS({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/inherits.js"(exports2, module2) {
    "use strict";
    var setPrototypeOf = require_setPrototypeOf();
    function _inherits2(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          writable: true,
          configurable: true
        }
      });
      Object.defineProperty(subClass, "prototype", {
        writable: false
      });
      if (superClass) setPrototypeOf(subClass, superClass);
    }
    module2.exports = _inherits2, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/isNativeFunction.js
var require_isNativeFunction = __commonJS({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/isNativeFunction.js"(exports2, module2) {
    "use strict";
    function _isNativeFunction2(fn) {
      try {
        return Function.toString.call(fn).indexOf("[native code]") !== -1;
      } catch (e) {
        return typeof fn === "function";
      }
    }
    module2.exports = _isNativeFunction2, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/isNativeReflectConstruct.js
var require_isNativeReflectConstruct = __commonJS({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/isNativeReflectConstruct.js"(exports2, module2) {
    "use strict";
    function _isNativeReflectConstruct2() {
      try {
        var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
      } catch (t2) {
      }
      return (module2.exports = _isNativeReflectConstruct2 = function _isNativeReflectConstruct3() {
        return !!t;
      }, module2.exports.__esModule = true, module2.exports["default"] = module2.exports)();
    }
    module2.exports = _isNativeReflectConstruct2, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/construct.js
var require_construct = __commonJS({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/construct.js"(exports2, module2) {
    "use strict";
    var setPrototypeOf = require_setPrototypeOf();
    var isNativeReflectConstruct = require_isNativeReflectConstruct();
    function _construct2(t, e, r) {
      if (isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
      var o = [null];
      o.push.apply(o, e);
      var p = new (t.bind.apply(t, o))();
      return r && setPrototypeOf(p, r.prototype), p;
    }
    module2.exports = _construct2, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/wrapNativeSuper.js
var require_wrapNativeSuper = __commonJS({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/wrapNativeSuper.js"(exports2, module2) {
    "use strict";
    var getPrototypeOf = require_getPrototypeOf();
    var setPrototypeOf = require_setPrototypeOf();
    var isNativeFunction = require_isNativeFunction();
    var construct = require_construct();
    function _wrapNativeSuper2(Class) {
      var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
      module2.exports = _wrapNativeSuper2 = function _wrapNativeSuper3(Class2) {
        if (Class2 === null || !isNativeFunction(Class2)) return Class2;
        if (typeof Class2 !== "function") {
          throw new TypeError("Super expression must either be null or a function");
        }
        if (typeof _cache !== "undefined") {
          if (_cache.has(Class2)) return _cache.get(Class2);
          _cache.set(Class2, Wrapper);
        }
        function Wrapper() {
          return construct(Class2, arguments, getPrototypeOf(this).constructor);
        }
        Wrapper.prototype = Object.create(Class2.prototype, {
          constructor: {
            value: Wrapper,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
        return setPrototypeOf(Wrapper, Class2);
      }, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
      return _wrapNativeSuper2(Class);
    }
    module2.exports = _wrapNativeSuper2, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/fs/index.js
var require_fs2 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/fs/index.js"(exports2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs5 = require_graceful_fs();
    var api = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "copyFile",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "lchown",
      "lchmod",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "readFile",
      "readdir",
      "readlink",
      "realpath",
      "rename",
      "rmdir",
      "stat",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "writeFile"
    ].filter((key) => {
      return typeof fs5[key] === "function";
    });
    Object.keys(fs5).forEach((key) => {
      if (key === "promises") {
        return;
      }
      exports2[key] = fs5[key];
    });
    api.forEach((method) => {
      exports2[method] = u(fs5[method]);
    });
    exports2.exists = function(filename, callback) {
      if (typeof callback === "function") {
        return fs5.exists(filename, callback);
      }
      return new Promise((resolve) => {
        return fs5.exists(filename, resolve);
      });
    };
    exports2.read = function(fd, buffer, offset, length, position, callback) {
      if (typeof callback === "function") {
        return fs5.read(fd, buffer, offset, length, position, callback);
      }
      return new Promise((resolve, reject) => {
        fs5.read(fd, buffer, offset, length, position, (err, bytesRead, buffer2) => {
          if (err) return reject(err);
          resolve({ bytesRead, buffer: buffer2 });
        });
      });
    };
    exports2.write = function(fd, buffer, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs5.write(fd, buffer, ...args);
      }
      return new Promise((resolve, reject) => {
        fs5.write(fd, buffer, ...args, (err, bytesWritten, buffer2) => {
          if (err) return reject(err);
          resolve({ bytesWritten, buffer: buffer2 });
        });
      });
    };
    if (typeof fs5.realpath.native === "function") {
      exports2.realpath.native = u(fs5.realpath.native);
    }
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/mkdirs/win32.js
var require_win322 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/mkdirs/win32.js"(exports2, module2) {
    "use strict";
    var path6 = require("path");
    function getRootPath(p) {
      p = path6.normalize(path6.resolve(p)).split(path6.sep);
      if (p.length > 0) return p[0];
      return null;
    }
    var INVALID_PATH_CHARS = /[<>:"|?*]/;
    function invalidWin32Path(p) {
      const rp = getRootPath(p);
      p = p.replace(rp, "");
      return INVALID_PATH_CHARS.test(p);
    }
    module2.exports = {
      getRootPath,
      invalidWin32Path
    };
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/mkdirs/mkdirs.js
var require_mkdirs3 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/mkdirs/mkdirs.js"(exports2, module2) {
    "use strict";
    var fs5 = require_graceful_fs();
    var path6 = require("path");
    var invalidWin32Path = require_win322().invalidWin32Path;
    var o777 = parseInt("0777", 8);
    function mkdirs(p, opts, callback, made) {
      if (typeof opts === "function") {
        callback = opts;
        opts = {};
      } else if (!opts || typeof opts !== "object") {
        opts = { mode: opts };
      }
      if (process.platform === "win32" && invalidWin32Path(p)) {
        const errInval = new Error(p + " contains invalid WIN32 path characters.");
        errInval.code = "EINVAL";
        return callback(errInval);
      }
      let mode = opts.mode;
      const xfs = opts.fs || fs5;
      if (mode === void 0) {
        mode = o777 & ~process.umask();
      }
      if (!made) made = null;
      callback = callback || function() {
      };
      p = path6.resolve(p);
      xfs.mkdir(p, mode, (er) => {
        if (!er) {
          made = made || p;
          return callback(null, made);
        }
        switch (er.code) {
          case "ENOENT":
            if (path6.dirname(p) === p) return callback(er);
            mkdirs(path6.dirname(p), opts, (er2, made2) => {
              if (er2) callback(er2, made2);
              else mkdirs(p, opts, callback, made2);
            });
            break;
          // In the case of any other error, just see if there's a dir
          // there already.  If so, then hooray!  If not, then something
          // is borked.
          default:
            xfs.stat(p, (er2, stat) => {
              if (er2 || !stat.isDirectory()) callback(er, made);
              else callback(null, made);
            });
            break;
        }
      });
    }
    module2.exports = mkdirs;
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/mkdirs/mkdirs-sync.js
var require_mkdirs_sync2 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/mkdirs/mkdirs-sync.js"(exports2, module2) {
    "use strict";
    var fs5 = require_graceful_fs();
    var path6 = require("path");
    var invalidWin32Path = require_win322().invalidWin32Path;
    var o777 = parseInt("0777", 8);
    function mkdirsSync(p, opts, made) {
      if (!opts || typeof opts !== "object") {
        opts = { mode: opts };
      }
      let mode = opts.mode;
      const xfs = opts.fs || fs5;
      if (process.platform === "win32" && invalidWin32Path(p)) {
        const errInval = new Error(p + " contains invalid WIN32 path characters.");
        errInval.code = "EINVAL";
        throw errInval;
      }
      if (mode === void 0) {
        mode = o777 & ~process.umask();
      }
      if (!made) made = null;
      p = path6.resolve(p);
      try {
        xfs.mkdirSync(p, mode);
        made = made || p;
      } catch (err0) {
        if (err0.code === "ENOENT") {
          if (path6.dirname(p) === p) throw err0;
          made = mkdirsSync(path6.dirname(p), opts, made);
          mkdirsSync(p, opts, made);
        } else {
          let stat;
          try {
            stat = xfs.statSync(p);
          } catch (err1) {
            throw err0;
          }
          if (!stat.isDirectory()) throw err0;
        }
      }
      return made;
    }
    module2.exports = mkdirsSync;
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/mkdirs/index.js
var require_mkdirs4 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/mkdirs/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var mkdirs = u(require_mkdirs3());
    var mkdirsSync = require_mkdirs_sync2();
    module2.exports = {
      mkdirs,
      mkdirsSync,
      // alias
      mkdirp: mkdirs,
      mkdirpSync: mkdirsSync,
      ensureDir: mkdirs,
      ensureDirSync: mkdirsSync
    };
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/util/utimes.js
var require_utimes2 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/util/utimes.js"(exports2, module2) {
    "use strict";
    var fs5 = require_graceful_fs();
    var os = require("os");
    var path6 = require("path");
    function hasMillisResSync() {
      let tmpfile = path6.join("millis-test-sync" + Date.now().toString() + Math.random().toString().slice(2));
      tmpfile = path6.join(os.tmpdir(), tmpfile);
      const d = /* @__PURE__ */ new Date(1435410243862);
      fs5.writeFileSync(tmpfile, "https://github.com/jprichardson/node-fs-extra/pull/141");
      const fd = fs5.openSync(tmpfile, "r+");
      fs5.futimesSync(fd, d, d);
      fs5.closeSync(fd);
      return fs5.statSync(tmpfile).mtime > 1435410243e3;
    }
    function hasMillisRes(callback) {
      let tmpfile = path6.join("millis-test" + Date.now().toString() + Math.random().toString().slice(2));
      tmpfile = path6.join(os.tmpdir(), tmpfile);
      const d = /* @__PURE__ */ new Date(1435410243862);
      fs5.writeFile(tmpfile, "https://github.com/jprichardson/node-fs-extra/pull/141", (err) => {
        if (err) return callback(err);
        fs5.open(tmpfile, "r+", (err2, fd) => {
          if (err2) return callback(err2);
          fs5.futimes(fd, d, d, (err3) => {
            if (err3) return callback(err3);
            fs5.close(fd, (err4) => {
              if (err4) return callback(err4);
              fs5.stat(tmpfile, (err5, stats) => {
                if (err5) return callback(err5);
                callback(null, stats.mtime > 1435410243e3);
              });
            });
          });
        });
      });
    }
    function timeRemoveMillis(timestamp) {
      if (typeof timestamp === "number") {
        return Math.floor(timestamp / 1e3) * 1e3;
      } else if (timestamp instanceof Date) {
        return new Date(Math.floor(timestamp.getTime() / 1e3) * 1e3);
      } else {
        throw new Error("fs-extra: timeRemoveMillis() unknown parameter type");
      }
    }
    function utimesMillis(path7, atime, mtime, callback) {
      fs5.open(path7, "r+", (err, fd) => {
        if (err) return callback(err);
        fs5.futimes(fd, atime, mtime, (futimesErr) => {
          fs5.close(fd, (closeErr) => {
            if (callback) callback(futimesErr || closeErr);
          });
        });
      });
    }
    function utimesMillisSync(path7, atime, mtime) {
      const fd = fs5.openSync(path7, "r+");
      fs5.futimesSync(fd, atime, mtime);
      return fs5.closeSync(fd);
    }
    module2.exports = {
      hasMillisRes,
      hasMillisResSync,
      timeRemoveMillis,
      utimesMillis,
      utimesMillisSync
    };
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/util/stat.js
var require_stat = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/util/stat.js"(exports2, module2) {
    "use strict";
    var fs5 = require_graceful_fs();
    var path6 = require("path");
    var NODE_VERSION_MAJOR_WITH_BIGINT = 10;
    var NODE_VERSION_MINOR_WITH_BIGINT = 5;
    var NODE_VERSION_PATCH_WITH_BIGINT = 0;
    var nodeVersion = process.versions.node.split(".");
    var nodeVersionMajor = Number.parseInt(nodeVersion[0], 10);
    var nodeVersionMinor = Number.parseInt(nodeVersion[1], 10);
    var nodeVersionPatch = Number.parseInt(nodeVersion[2], 10);
    function nodeSupportsBigInt() {
      if (nodeVersionMajor > NODE_VERSION_MAJOR_WITH_BIGINT) {
        return true;
      } else if (nodeVersionMajor === NODE_VERSION_MAJOR_WITH_BIGINT) {
        if (nodeVersionMinor > NODE_VERSION_MINOR_WITH_BIGINT) {
          return true;
        } else if (nodeVersionMinor === NODE_VERSION_MINOR_WITH_BIGINT) {
          if (nodeVersionPatch >= NODE_VERSION_PATCH_WITH_BIGINT) {
            return true;
          }
        }
      }
      return false;
    }
    function getStats(src, dest, cb) {
      if (nodeSupportsBigInt()) {
        fs5.stat(src, { bigint: true }, (err, srcStat) => {
          if (err) return cb(err);
          fs5.stat(dest, { bigint: true }, (err2, destStat) => {
            if (err2) {
              if (err2.code === "ENOENT") return cb(null, { srcStat, destStat: null });
              return cb(err2);
            }
            return cb(null, { srcStat, destStat });
          });
        });
      } else {
        fs5.stat(src, (err, srcStat) => {
          if (err) return cb(err);
          fs5.stat(dest, (err2, destStat) => {
            if (err2) {
              if (err2.code === "ENOENT") return cb(null, { srcStat, destStat: null });
              return cb(err2);
            }
            return cb(null, { srcStat, destStat });
          });
        });
      }
    }
    function getStatsSync(src, dest) {
      let srcStat, destStat;
      if (nodeSupportsBigInt()) {
        srcStat = fs5.statSync(src, { bigint: true });
      } else {
        srcStat = fs5.statSync(src);
      }
      try {
        if (nodeSupportsBigInt()) {
          destStat = fs5.statSync(dest, { bigint: true });
        } else {
          destStat = fs5.statSync(dest);
        }
      } catch (err) {
        if (err.code === "ENOENT") return { srcStat, destStat: null };
        throw err;
      }
      return { srcStat, destStat };
    }
    function checkPaths(src, dest, funcName, cb) {
      getStats(src, dest, (err, stats) => {
        if (err) return cb(err);
        const { srcStat, destStat } = stats;
        if (destStat && destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev) {
          return cb(new Error("Source and destination must not be the same."));
        }
        if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
          return cb(new Error(errMsg(src, dest, funcName)));
        }
        return cb(null, { srcStat, destStat });
      });
    }
    function checkPathsSync(src, dest, funcName) {
      const { srcStat, destStat } = getStatsSync(src, dest);
      if (destStat && destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev) {
        throw new Error("Source and destination must not be the same.");
      }
      if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return { srcStat, destStat };
    }
    function checkParentPaths(src, srcStat, dest, funcName, cb) {
      const srcParent = path6.resolve(path6.dirname(src));
      const destParent = path6.resolve(path6.dirname(dest));
      if (destParent === srcParent || destParent === path6.parse(destParent).root) return cb();
      if (nodeSupportsBigInt()) {
        fs5.stat(destParent, { bigint: true }, (err, destStat) => {
          if (err) {
            if (err.code === "ENOENT") return cb();
            return cb(err);
          }
          if (destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev) {
            return cb(new Error(errMsg(src, dest, funcName)));
          }
          return checkParentPaths(src, srcStat, destParent, funcName, cb);
        });
      } else {
        fs5.stat(destParent, (err, destStat) => {
          if (err) {
            if (err.code === "ENOENT") return cb();
            return cb(err);
          }
          if (destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev) {
            return cb(new Error(errMsg(src, dest, funcName)));
          }
          return checkParentPaths(src, srcStat, destParent, funcName, cb);
        });
      }
    }
    function checkParentPathsSync(src, srcStat, dest, funcName) {
      const srcParent = path6.resolve(path6.dirname(src));
      const destParent = path6.resolve(path6.dirname(dest));
      if (destParent === srcParent || destParent === path6.parse(destParent).root) return;
      let destStat;
      try {
        if (nodeSupportsBigInt()) {
          destStat = fs5.statSync(destParent, { bigint: true });
        } else {
          destStat = fs5.statSync(destParent);
        }
      } catch (err) {
        if (err.code === "ENOENT") return;
        throw err;
      }
      if (destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return checkParentPathsSync(src, srcStat, destParent, funcName);
    }
    function isSrcSubdir(src, dest) {
      const srcArr = path6.resolve(src).split(path6.sep).filter((i) => i);
      const destArr = path6.resolve(dest).split(path6.sep).filter((i) => i);
      return srcArr.reduce((acc, cur, i) => acc && destArr[i] === cur, true);
    }
    function errMsg(src, dest, funcName) {
      return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`;
    }
    module2.exports = {
      checkPaths,
      checkPathsSync,
      checkParentPaths,
      checkParentPathsSync,
      isSrcSubdir
    };
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/util/buffer.js
var require_buffer2 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/util/buffer.js"(exports2, module2) {
    "use strict";
    module2.exports = function(size) {
      if (typeof Buffer.allocUnsafe === "function") {
        try {
          return Buffer.allocUnsafe(size);
        } catch (e) {
          return new Buffer(size);
        }
      }
      return new Buffer(size);
    };
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/copy-sync/copy-sync.js
var require_copy_sync3 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/copy-sync/copy-sync.js"(exports2, module2) {
    "use strict";
    var fs5 = require_graceful_fs();
    var path6 = require("path");
    var mkdirpSync = require_mkdirs4().mkdirsSync;
    var utimesSync = require_utimes2().utimesMillisSync;
    var stat = require_stat();
    function copySync(src, dest, opts) {
      if (typeof opts === "function") {
        opts = { filter: opts };
      }
      opts = opts || {};
      opts.clobber = "clobber" in opts ? !!opts.clobber : true;
      opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
      if (opts.preserveTimestamps && process.arch === "ia32") {
        console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;

    see https://github.com/jprichardson/node-fs-extra/issues/269`);
      }
      const { srcStat, destStat } = stat.checkPathsSync(src, dest, "copy");
      stat.checkParentPathsSync(src, srcStat, dest, "copy");
      return handleFilterAndCopy(destStat, src, dest, opts);
    }
    function handleFilterAndCopy(destStat, src, dest, opts) {
      if (opts.filter && !opts.filter(src, dest)) return;
      const destParent = path6.dirname(dest);
      if (!fs5.existsSync(destParent)) mkdirpSync(destParent);
      return startCopy(destStat, src, dest, opts);
    }
    function startCopy(destStat, src, dest, opts) {
      if (opts.filter && !opts.filter(src, dest)) return;
      return getStats(destStat, src, dest, opts);
    }
    function getStats(destStat, src, dest, opts) {
      const statSync = opts.dereference ? fs5.statSync : fs5.lstatSync;
      const srcStat = statSync(src);
      if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts);
      else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts);
      else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts);
    }
    function onFile(srcStat, destStat, src, dest, opts) {
      if (!destStat) return copyFile(srcStat, src, dest, opts);
      return mayCopyFile(srcStat, src, dest, opts);
    }
    function mayCopyFile(srcStat, src, dest, opts) {
      if (opts.overwrite) {
        fs5.unlinkSync(dest);
        return copyFile(srcStat, src, dest, opts);
      } else if (opts.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    function copyFile(srcStat, src, dest, opts) {
      if (typeof fs5.copyFileSync === "function") {
        fs5.copyFileSync(src, dest);
        fs5.chmodSync(dest, srcStat.mode);
        if (opts.preserveTimestamps) {
          return utimesSync(dest, srcStat.atime, srcStat.mtime);
        }
        return;
      }
      return copyFileFallback(srcStat, src, dest, opts);
    }
    function copyFileFallback(srcStat, src, dest, opts) {
      const BUF_LENGTH = 64 * 1024;
      const _buff = require_buffer2()(BUF_LENGTH);
      const fdr = fs5.openSync(src, "r");
      const fdw = fs5.openSync(dest, "w", srcStat.mode);
      let pos = 0;
      while (pos < srcStat.size) {
        const bytesRead = fs5.readSync(fdr, _buff, 0, BUF_LENGTH, pos);
        fs5.writeSync(fdw, _buff, 0, bytesRead);
        pos += bytesRead;
      }
      if (opts.preserveTimestamps) fs5.futimesSync(fdw, srcStat.atime, srcStat.mtime);
      fs5.closeSync(fdr);
      fs5.closeSync(fdw);
    }
    function onDir(srcStat, destStat, src, dest, opts) {
      if (!destStat) return mkDirAndCopy(srcStat, src, dest, opts);
      if (destStat && !destStat.isDirectory()) {
        throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
      }
      return copyDir(src, dest, opts);
    }
    function mkDirAndCopy(srcStat, src, dest, opts) {
      fs5.mkdirSync(dest);
      copyDir(src, dest, opts);
      return fs5.chmodSync(dest, srcStat.mode);
    }
    function copyDir(src, dest, opts) {
      fs5.readdirSync(src).forEach((item) => copyDirItem(item, src, dest, opts));
    }
    function copyDirItem(item, src, dest, opts) {
      const srcItem = path6.join(src, item);
      const destItem = path6.join(dest, item);
      const { destStat } = stat.checkPathsSync(srcItem, destItem, "copy");
      return startCopy(destStat, srcItem, destItem, opts);
    }
    function onLink(destStat, src, dest, opts) {
      let resolvedSrc = fs5.readlinkSync(src);
      if (opts.dereference) {
        resolvedSrc = path6.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs5.symlinkSync(resolvedSrc, dest);
      } else {
        let resolvedDest;
        try {
          resolvedDest = fs5.readlinkSync(dest);
        } catch (err) {
          if (err.code === "EINVAL" || err.code === "UNKNOWN") return fs5.symlinkSync(resolvedSrc, dest);
          throw err;
        }
        if (opts.dereference) {
          resolvedDest = path6.resolve(process.cwd(), resolvedDest);
        }
        if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
          throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
        }
        if (fs5.statSync(dest).isDirectory() && stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
          throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
        }
        return copyLink(resolvedSrc, dest);
      }
    }
    function copyLink(resolvedSrc, dest) {
      fs5.unlinkSync(dest);
      return fs5.symlinkSync(resolvedSrc, dest);
    }
    module2.exports = copySync;
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/copy-sync/index.js
var require_copy_sync4 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/copy-sync/index.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      copySync: require_copy_sync3()
    };
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/path-exists/index.js
var require_path_exists2 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/path-exists/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs5 = require_fs2();
    function pathExists(path6) {
      return fs5.access(path6).then(() => true).catch(() => false);
    }
    module2.exports = {
      pathExists: u(pathExists),
      pathExistsSync: fs5.existsSync
    };
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/copy/copy.js
var require_copy3 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/copy/copy.js"(exports2, module2) {
    "use strict";
    var fs5 = require_graceful_fs();
    var path6 = require("path");
    var mkdirp = require_mkdirs4().mkdirs;
    var pathExists = require_path_exists2().pathExists;
    var utimes = require_utimes2().utimesMillis;
    var stat = require_stat();
    function copy(src, dest, opts, cb) {
      if (typeof opts === "function" && !cb) {
        cb = opts;
        opts = {};
      } else if (typeof opts === "function") {
        opts = { filter: opts };
      }
      cb = cb || function() {
      };
      opts = opts || {};
      opts.clobber = "clobber" in opts ? !!opts.clobber : true;
      opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
      if (opts.preserveTimestamps && process.arch === "ia32") {
        console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;

    see https://github.com/jprichardson/node-fs-extra/issues/269`);
      }
      stat.checkPaths(src, dest, "copy", (err, stats) => {
        if (err) return cb(err);
        const { srcStat, destStat } = stats;
        stat.checkParentPaths(src, srcStat, dest, "copy", (err2) => {
          if (err2) return cb(err2);
          if (opts.filter) return handleFilter(checkParentDir, destStat, src, dest, opts, cb);
          return checkParentDir(destStat, src, dest, opts, cb);
        });
      });
    }
    function checkParentDir(destStat, src, dest, opts, cb) {
      const destParent = path6.dirname(dest);
      pathExists(destParent, (err, dirExists) => {
        if (err) return cb(err);
        if (dirExists) return startCopy(destStat, src, dest, opts, cb);
        mkdirp(destParent, (err2) => {
          if (err2) return cb(err2);
          return startCopy(destStat, src, dest, opts, cb);
        });
      });
    }
    function handleFilter(onInclude, destStat, src, dest, opts, cb) {
      Promise.resolve(opts.filter(src, dest)).then((include) => {
        if (include) return onInclude(destStat, src, dest, opts, cb);
        return cb();
      }, (error) => cb(error));
    }
    function startCopy(destStat, src, dest, opts, cb) {
      if (opts.filter) return handleFilter(getStats, destStat, src, dest, opts, cb);
      return getStats(destStat, src, dest, opts, cb);
    }
    function getStats(destStat, src, dest, opts, cb) {
      const stat2 = opts.dereference ? fs5.stat : fs5.lstat;
      stat2(src, (err, srcStat) => {
        if (err) return cb(err);
        if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts, cb);
        else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts, cb);
        else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts, cb);
      });
    }
    function onFile(srcStat, destStat, src, dest, opts, cb) {
      if (!destStat) return copyFile(srcStat, src, dest, opts, cb);
      return mayCopyFile(srcStat, src, dest, opts, cb);
    }
    function mayCopyFile(srcStat, src, dest, opts, cb) {
      if (opts.overwrite) {
        fs5.unlink(dest, (err) => {
          if (err) return cb(err);
          return copyFile(srcStat, src, dest, opts, cb);
        });
      } else if (opts.errorOnExist) {
        return cb(new Error(`'${dest}' already exists`));
      } else return cb();
    }
    function copyFile(srcStat, src, dest, opts, cb) {
      if (typeof fs5.copyFile === "function") {
        return fs5.copyFile(src, dest, (err) => {
          if (err) return cb(err);
          return setDestModeAndTimestamps(srcStat, dest, opts, cb);
        });
      }
      return copyFileFallback(srcStat, src, dest, opts, cb);
    }
    function copyFileFallback(srcStat, src, dest, opts, cb) {
      const rs = fs5.createReadStream(src);
      rs.on("error", (err) => cb(err)).once("open", () => {
        const ws = fs5.createWriteStream(dest, { mode: srcStat.mode });
        ws.on("error", (err) => cb(err)).on("open", () => rs.pipe(ws)).once("close", () => setDestModeAndTimestamps(srcStat, dest, opts, cb));
      });
    }
    function setDestModeAndTimestamps(srcStat, dest, opts, cb) {
      fs5.chmod(dest, srcStat.mode, (err) => {
        if (err) return cb(err);
        if (opts.preserveTimestamps) {
          return utimes(dest, srcStat.atime, srcStat.mtime, cb);
        }
        return cb();
      });
    }
    function onDir(srcStat, destStat, src, dest, opts, cb) {
      if (!destStat) return mkDirAndCopy(srcStat, src, dest, opts, cb);
      if (destStat && !destStat.isDirectory()) {
        return cb(new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`));
      }
      return copyDir(src, dest, opts, cb);
    }
    function mkDirAndCopy(srcStat, src, dest, opts, cb) {
      fs5.mkdir(dest, (err) => {
        if (err) return cb(err);
        copyDir(src, dest, opts, (err2) => {
          if (err2) return cb(err2);
          return fs5.chmod(dest, srcStat.mode, cb);
        });
      });
    }
    function copyDir(src, dest, opts, cb) {
      fs5.readdir(src, (err, items) => {
        if (err) return cb(err);
        return copyDirItems(items, src, dest, opts, cb);
      });
    }
    function copyDirItems(items, src, dest, opts, cb) {
      const item = items.pop();
      if (!item) return cb();
      return copyDirItem(items, item, src, dest, opts, cb);
    }
    function copyDirItem(items, item, src, dest, opts, cb) {
      const srcItem = path6.join(src, item);
      const destItem = path6.join(dest, item);
      stat.checkPaths(srcItem, destItem, "copy", (err, stats) => {
        if (err) return cb(err);
        const { destStat } = stats;
        startCopy(destStat, srcItem, destItem, opts, (err2) => {
          if (err2) return cb(err2);
          return copyDirItems(items, src, dest, opts, cb);
        });
      });
    }
    function onLink(destStat, src, dest, opts, cb) {
      fs5.readlink(src, (err, resolvedSrc) => {
        if (err) return cb(err);
        if (opts.dereference) {
          resolvedSrc = path6.resolve(process.cwd(), resolvedSrc);
        }
        if (!destStat) {
          return fs5.symlink(resolvedSrc, dest, cb);
        } else {
          fs5.readlink(dest, (err2, resolvedDest) => {
            if (err2) {
              if (err2.code === "EINVAL" || err2.code === "UNKNOWN") return fs5.symlink(resolvedSrc, dest, cb);
              return cb(err2);
            }
            if (opts.dereference) {
              resolvedDest = path6.resolve(process.cwd(), resolvedDest);
            }
            if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
              return cb(new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`));
            }
            if (destStat.isDirectory() && stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
              return cb(new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`));
            }
            return copyLink(resolvedSrc, dest, cb);
          });
        }
      });
    }
    function copyLink(resolvedSrc, dest, cb) {
      fs5.unlink(dest, (err) => {
        if (err) return cb(err);
        return fs5.symlink(resolvedSrc, dest, cb);
      });
    }
    module2.exports = copy;
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/copy/index.js
var require_copy4 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/copy/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    module2.exports = {
      copy: u(require_copy3())
    };
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/remove/rimraf.js
var require_rimraf2 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/remove/rimraf.js"(exports2, module2) {
    "use strict";
    var fs5 = require_graceful_fs();
    var path6 = require("path");
    var assert = require("assert");
    var isWindows = process.platform === "win32";
    function defaults2(options) {
      const methods = [
        "unlink",
        "chmod",
        "stat",
        "lstat",
        "rmdir",
        "readdir"
      ];
      methods.forEach((m) => {
        options[m] = options[m] || fs5[m];
        m = m + "Sync";
        options[m] = options[m] || fs5[m];
      });
      options.maxBusyTries = options.maxBusyTries || 3;
    }
    function rimraf(p, options, cb) {
      let busyTries = 0;
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      assert(p, "rimraf: missing path");
      assert.strictEqual(typeof p, "string", "rimraf: path should be a string");
      assert.strictEqual(typeof cb, "function", "rimraf: callback function required");
      assert(options, "rimraf: invalid options argument provided");
      assert.strictEqual(typeof options, "object", "rimraf: options should be object");
      defaults2(options);
      rimraf_(p, options, function CB(er) {
        if (er) {
          if ((er.code === "EBUSY" || er.code === "ENOTEMPTY" || er.code === "EPERM") && busyTries < options.maxBusyTries) {
            busyTries++;
            const time = busyTries * 100;
            return setTimeout(() => rimraf_(p, options, CB), time);
          }
          if (er.code === "ENOENT") er = null;
        }
        cb(er);
      });
    }
    function rimraf_(p, options, cb) {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.lstat(p, (er, st) => {
        if (er && er.code === "ENOENT") {
          return cb(null);
        }
        if (er && er.code === "EPERM" && isWindows) {
          return fixWinEPERM(p, options, er, cb);
        }
        if (st && st.isDirectory()) {
          return rmdir(p, options, er, cb);
        }
        options.unlink(p, (er2) => {
          if (er2) {
            if (er2.code === "ENOENT") {
              return cb(null);
            }
            if (er2.code === "EPERM") {
              return isWindows ? fixWinEPERM(p, options, er2, cb) : rmdir(p, options, er2, cb);
            }
            if (er2.code === "EISDIR") {
              return rmdir(p, options, er2, cb);
            }
          }
          return cb(er2);
        });
      });
    }
    function fixWinEPERM(p, options, er, cb) {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      if (er) {
        assert(er instanceof Error);
      }
      options.chmod(p, 438, (er2) => {
        if (er2) {
          cb(er2.code === "ENOENT" ? null : er);
        } else {
          options.stat(p, (er3, stats) => {
            if (er3) {
              cb(er3.code === "ENOENT" ? null : er);
            } else if (stats.isDirectory()) {
              rmdir(p, options, er, cb);
            } else {
              options.unlink(p, cb);
            }
          });
        }
      });
    }
    function fixWinEPERMSync(p, options, er) {
      let stats;
      assert(p);
      assert(options);
      if (er) {
        assert(er instanceof Error);
      }
      try {
        options.chmodSync(p, 438);
      } catch (er2) {
        if (er2.code === "ENOENT") {
          return;
        } else {
          throw er;
        }
      }
      try {
        stats = options.statSync(p);
      } catch (er3) {
        if (er3.code === "ENOENT") {
          return;
        } else {
          throw er;
        }
      }
      if (stats.isDirectory()) {
        rmdirSync(p, options, er);
      } else {
        options.unlinkSync(p);
      }
    }
    function rmdir(p, options, originalEr, cb) {
      assert(p);
      assert(options);
      if (originalEr) {
        assert(originalEr instanceof Error);
      }
      assert(typeof cb === "function");
      options.rmdir(p, (er) => {
        if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")) {
          rmkids(p, options, cb);
        } else if (er && er.code === "ENOTDIR") {
          cb(originalEr);
        } else {
          cb(er);
        }
      });
    }
    function rmkids(p, options, cb) {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.readdir(p, (er, files) => {
        if (er) return cb(er);
        let n = files.length;
        let errState;
        if (n === 0) return options.rmdir(p, cb);
        files.forEach((f) => {
          rimraf(path6.join(p, f), options, (er2) => {
            if (errState) {
              return;
            }
            if (er2) return cb(errState = er2);
            if (--n === 0) {
              options.rmdir(p, cb);
            }
          });
        });
      });
    }
    function rimrafSync(p, options) {
      let st;
      options = options || {};
      defaults2(options);
      assert(p, "rimraf: missing path");
      assert.strictEqual(typeof p, "string", "rimraf: path should be a string");
      assert(options, "rimraf: missing options");
      assert.strictEqual(typeof options, "object", "rimraf: options should be object");
      try {
        st = options.lstatSync(p);
      } catch (er) {
        if (er.code === "ENOENT") {
          return;
        }
        if (er.code === "EPERM" && isWindows) {
          fixWinEPERMSync(p, options, er);
        }
      }
      try {
        if (st && st.isDirectory()) {
          rmdirSync(p, options, null);
        } else {
          options.unlinkSync(p);
        }
      } catch (er) {
        if (er.code === "ENOENT") {
          return;
        } else if (er.code === "EPERM") {
          return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er);
        } else if (er.code !== "EISDIR") {
          throw er;
        }
        rmdirSync(p, options, er);
      }
    }
    function rmdirSync(p, options, originalEr) {
      assert(p);
      assert(options);
      if (originalEr) {
        assert(originalEr instanceof Error);
      }
      try {
        options.rmdirSync(p);
      } catch (er) {
        if (er.code === "ENOTDIR") {
          throw originalEr;
        } else if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM") {
          rmkidsSync(p, options);
        } else if (er.code !== "ENOENT") {
          throw er;
        }
      }
    }
    function rmkidsSync(p, options) {
      assert(p);
      assert(options);
      options.readdirSync(p).forEach((f) => rimrafSync(path6.join(p, f), options));
      if (isWindows) {
        const startTime = Date.now();
        do {
          try {
            const ret = options.rmdirSync(p, options);
            return ret;
          } catch (er) {
          }
        } while (Date.now() - startTime < 500);
      } else {
        const ret = options.rmdirSync(p, options);
        return ret;
      }
    }
    module2.exports = rimraf;
    rimraf.sync = rimrafSync;
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/remove/index.js
var require_remove2 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/remove/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var rimraf = require_rimraf2();
    module2.exports = {
      remove: u(rimraf),
      removeSync: rimraf.sync
    };
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/empty/index.js
var require_empty2 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/empty/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs5 = require_graceful_fs();
    var path6 = require("path");
    var mkdir = require_mkdirs4();
    var remove = require_remove2();
    var emptyDir = u(function emptyDir2(dir, callback) {
      callback = callback || function() {
      };
      fs5.readdir(dir, (err, items) => {
        if (err) return mkdir.mkdirs(dir, callback);
        items = items.map((item) => path6.join(dir, item));
        deleteItem();
        function deleteItem() {
          const item = items.pop();
          if (!item) return callback();
          remove.remove(item, (err2) => {
            if (err2) return callback(err2);
            deleteItem();
          });
        }
      });
    });
    function emptyDirSync(dir) {
      let items;
      try {
        items = fs5.readdirSync(dir);
      } catch (err) {
        return mkdir.mkdirsSync(dir);
      }
      items.forEach((item) => {
        item = path6.join(dir, item);
        remove.removeSync(item);
      });
    }
    module2.exports = {
      emptyDirSync,
      emptydirSync: emptyDirSync,
      emptyDir,
      emptydir: emptyDir
    };
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/ensure/file.js
var require_file2 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/ensure/file.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var path6 = require("path");
    var fs5 = require_graceful_fs();
    var mkdir = require_mkdirs4();
    var pathExists = require_path_exists2().pathExists;
    function createFile(file, callback) {
      function makeFile() {
        fs5.writeFile(file, "", (err) => {
          if (err) return callback(err);
          callback();
        });
      }
      fs5.stat(file, (err, stats) => {
        if (!err && stats.isFile()) return callback();
        const dir = path6.dirname(file);
        pathExists(dir, (err2, dirExists) => {
          if (err2) return callback(err2);
          if (dirExists) return makeFile();
          mkdir.mkdirs(dir, (err3) => {
            if (err3) return callback(err3);
            makeFile();
          });
        });
      });
    }
    function createFileSync(file) {
      let stats;
      try {
        stats = fs5.statSync(file);
      } catch (e) {
      }
      if (stats && stats.isFile()) return;
      const dir = path6.dirname(file);
      if (!fs5.existsSync(dir)) {
        mkdir.mkdirsSync(dir);
      }
      fs5.writeFileSync(file, "");
    }
    module2.exports = {
      createFile: u(createFile),
      createFileSync
    };
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/ensure/link.js
var require_link2 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/ensure/link.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var path6 = require("path");
    var fs5 = require_graceful_fs();
    var mkdir = require_mkdirs4();
    var pathExists = require_path_exists2().pathExists;
    function createLink(srcpath, dstpath, callback) {
      function makeLink(srcpath2, dstpath2) {
        fs5.link(srcpath2, dstpath2, (err) => {
          if (err) return callback(err);
          callback(null);
        });
      }
      pathExists(dstpath, (err, destinationExists) => {
        if (err) return callback(err);
        if (destinationExists) return callback(null);
        fs5.lstat(srcpath, (err2) => {
          if (err2) {
            err2.message = err2.message.replace("lstat", "ensureLink");
            return callback(err2);
          }
          const dir = path6.dirname(dstpath);
          pathExists(dir, (err3, dirExists) => {
            if (err3) return callback(err3);
            if (dirExists) return makeLink(srcpath, dstpath);
            mkdir.mkdirs(dir, (err4) => {
              if (err4) return callback(err4);
              makeLink(srcpath, dstpath);
            });
          });
        });
      });
    }
    function createLinkSync(srcpath, dstpath) {
      const destinationExists = fs5.existsSync(dstpath);
      if (destinationExists) return void 0;
      try {
        fs5.lstatSync(srcpath);
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        throw err;
      }
      const dir = path6.dirname(dstpath);
      const dirExists = fs5.existsSync(dir);
      if (dirExists) return fs5.linkSync(srcpath, dstpath);
      mkdir.mkdirsSync(dir);
      return fs5.linkSync(srcpath, dstpath);
    }
    module2.exports = {
      createLink: u(createLink),
      createLinkSync
    };
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/ensure/symlink-paths.js
var require_symlink_paths2 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/ensure/symlink-paths.js"(exports2, module2) {
    "use strict";
    var path6 = require("path");
    var fs5 = require_graceful_fs();
    var pathExists = require_path_exists2().pathExists;
    function symlinkPaths(srcpath, dstpath, callback) {
      if (path6.isAbsolute(srcpath)) {
        return fs5.lstat(srcpath, (err) => {
          if (err) {
            err.message = err.message.replace("lstat", "ensureSymlink");
            return callback(err);
          }
          return callback(null, {
            "toCwd": srcpath,
            "toDst": srcpath
          });
        });
      } else {
        const dstdir = path6.dirname(dstpath);
        const relativeToDst = path6.join(dstdir, srcpath);
        return pathExists(relativeToDst, (err, exists) => {
          if (err) return callback(err);
          if (exists) {
            return callback(null, {
              "toCwd": relativeToDst,
              "toDst": srcpath
            });
          } else {
            return fs5.lstat(srcpath, (err2) => {
              if (err2) {
                err2.message = err2.message.replace("lstat", "ensureSymlink");
                return callback(err2);
              }
              return callback(null, {
                "toCwd": srcpath,
                "toDst": path6.relative(dstdir, srcpath)
              });
            });
          }
        });
      }
    }
    function symlinkPathsSync(srcpath, dstpath) {
      let exists;
      if (path6.isAbsolute(srcpath)) {
        exists = fs5.existsSync(srcpath);
        if (!exists) throw new Error("absolute srcpath does not exist");
        return {
          "toCwd": srcpath,
          "toDst": srcpath
        };
      } else {
        const dstdir = path6.dirname(dstpath);
        const relativeToDst = path6.join(dstdir, srcpath);
        exists = fs5.existsSync(relativeToDst);
        if (exists) {
          return {
            "toCwd": relativeToDst,
            "toDst": srcpath
          };
        } else {
          exists = fs5.existsSync(srcpath);
          if (!exists) throw new Error("relative srcpath does not exist");
          return {
            "toCwd": srcpath,
            "toDst": path6.relative(dstdir, srcpath)
          };
        }
      }
    }
    module2.exports = {
      symlinkPaths,
      symlinkPathsSync
    };
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/ensure/symlink-type.js
var require_symlink_type2 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/ensure/symlink-type.js"(exports2, module2) {
    "use strict";
    var fs5 = require_graceful_fs();
    function symlinkType(srcpath, type, callback) {
      callback = typeof type === "function" ? type : callback;
      type = typeof type === "function" ? false : type;
      if (type) return callback(null, type);
      fs5.lstat(srcpath, (err, stats) => {
        if (err) return callback(null, "file");
        type = stats && stats.isDirectory() ? "dir" : "file";
        callback(null, type);
      });
    }
    function symlinkTypeSync(srcpath, type) {
      let stats;
      if (type) return type;
      try {
        stats = fs5.lstatSync(srcpath);
      } catch (e) {
        return "file";
      }
      return stats && stats.isDirectory() ? "dir" : "file";
    }
    module2.exports = {
      symlinkType,
      symlinkTypeSync
    };
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/ensure/symlink.js
var require_symlink2 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/ensure/symlink.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var path6 = require("path");
    var fs5 = require_graceful_fs();
    var _mkdirs = require_mkdirs4();
    var mkdirs = _mkdirs.mkdirs;
    var mkdirsSync = _mkdirs.mkdirsSync;
    var _symlinkPaths = require_symlink_paths2();
    var symlinkPaths = _symlinkPaths.symlinkPaths;
    var symlinkPathsSync = _symlinkPaths.symlinkPathsSync;
    var _symlinkType = require_symlink_type2();
    var symlinkType = _symlinkType.symlinkType;
    var symlinkTypeSync = _symlinkType.symlinkTypeSync;
    var pathExists = require_path_exists2().pathExists;
    function createSymlink(srcpath, dstpath, type, callback) {
      callback = typeof type === "function" ? type : callback;
      type = typeof type === "function" ? false : type;
      pathExists(dstpath, (err, destinationExists) => {
        if (err) return callback(err);
        if (destinationExists) return callback(null);
        symlinkPaths(srcpath, dstpath, (err2, relative) => {
          if (err2) return callback(err2);
          srcpath = relative.toDst;
          symlinkType(relative.toCwd, type, (err3, type2) => {
            if (err3) return callback(err3);
            const dir = path6.dirname(dstpath);
            pathExists(dir, (err4, dirExists) => {
              if (err4) return callback(err4);
              if (dirExists) return fs5.symlink(srcpath, dstpath, type2, callback);
              mkdirs(dir, (err5) => {
                if (err5) return callback(err5);
                fs5.symlink(srcpath, dstpath, type2, callback);
              });
            });
          });
        });
      });
    }
    function createSymlinkSync(srcpath, dstpath, type) {
      const destinationExists = fs5.existsSync(dstpath);
      if (destinationExists) return void 0;
      const relative = symlinkPathsSync(srcpath, dstpath);
      srcpath = relative.toDst;
      type = symlinkTypeSync(relative.toCwd, type);
      const dir = path6.dirname(dstpath);
      const exists = fs5.existsSync(dir);
      if (exists) return fs5.symlinkSync(srcpath, dstpath, type);
      mkdirsSync(dir);
      return fs5.symlinkSync(srcpath, dstpath, type);
    }
    module2.exports = {
      createSymlink: u(createSymlink),
      createSymlinkSync
    };
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/ensure/index.js
var require_ensure2 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/ensure/index.js"(exports2, module2) {
    "use strict";
    var file = require_file2();
    var link = require_link2();
    var symlink = require_symlink2();
    module2.exports = {
      // file
      createFile: file.createFile,
      createFileSync: file.createFileSync,
      ensureFile: file.createFile,
      ensureFileSync: file.createFileSync,
      // link
      createLink: link.createLink,
      createLinkSync: link.createLinkSync,
      ensureLink: link.createLink,
      ensureLinkSync: link.createLinkSync,
      // symlink
      createSymlink: symlink.createSymlink,
      createSymlinkSync: symlink.createSymlinkSync,
      ensureSymlink: symlink.createSymlink,
      ensureSymlinkSync: symlink.createSymlinkSync
    };
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/json/jsonfile.js
var require_jsonfile3 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/json/jsonfile.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var jsonFile = require_jsonfile();
    module2.exports = {
      // jsonfile exports
      readJson: u(jsonFile.readFile),
      readJsonSync: jsonFile.readFileSync,
      writeJson: u(jsonFile.writeFile),
      writeJsonSync: jsonFile.writeFileSync
    };
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/json/output-json.js
var require_output_json2 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/json/output-json.js"(exports2, module2) {
    "use strict";
    var path6 = require("path");
    var mkdir = require_mkdirs4();
    var pathExists = require_path_exists2().pathExists;
    var jsonFile = require_jsonfile3();
    function outputJson(file, data, options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      const dir = path6.dirname(file);
      pathExists(dir, (err, itDoes) => {
        if (err) return callback(err);
        if (itDoes) return jsonFile.writeJson(file, data, options, callback);
        mkdir.mkdirs(dir, (err2) => {
          if (err2) return callback(err2);
          jsonFile.writeJson(file, data, options, callback);
        });
      });
    }
    module2.exports = outputJson;
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/json/output-json-sync.js
var require_output_json_sync2 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/json/output-json-sync.js"(exports2, module2) {
    "use strict";
    var fs5 = require_graceful_fs();
    var path6 = require("path");
    var mkdir = require_mkdirs4();
    var jsonFile = require_jsonfile3();
    function outputJsonSync(file, data, options) {
      const dir = path6.dirname(file);
      if (!fs5.existsSync(dir)) {
        mkdir.mkdirsSync(dir);
      }
      jsonFile.writeJsonSync(file, data, options);
    }
    module2.exports = outputJsonSync;
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/json/index.js
var require_json2 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/json/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var jsonFile = require_jsonfile3();
    jsonFile.outputJson = u(require_output_json2());
    jsonFile.outputJsonSync = require_output_json_sync2();
    jsonFile.outputJSON = jsonFile.outputJson;
    jsonFile.outputJSONSync = jsonFile.outputJsonSync;
    jsonFile.writeJSON = jsonFile.writeJson;
    jsonFile.writeJSONSync = jsonFile.writeJsonSync;
    jsonFile.readJSON = jsonFile.readJson;
    jsonFile.readJSONSync = jsonFile.readJsonSync;
    module2.exports = jsonFile;
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/move-sync/move-sync.js
var require_move_sync2 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/move-sync/move-sync.js"(exports2, module2) {
    "use strict";
    var fs5 = require_graceful_fs();
    var path6 = require("path");
    var copySync = require_copy_sync4().copySync;
    var removeSync = require_remove2().removeSync;
    var mkdirpSync = require_mkdirs4().mkdirpSync;
    var stat = require_stat();
    function moveSync(src, dest, opts) {
      opts = opts || {};
      const overwrite = opts.overwrite || opts.clobber || false;
      const { srcStat } = stat.checkPathsSync(src, dest, "move");
      stat.checkParentPathsSync(src, srcStat, dest, "move");
      mkdirpSync(path6.dirname(dest));
      return doRename(src, dest, overwrite);
    }
    function doRename(src, dest, overwrite) {
      if (overwrite) {
        removeSync(dest);
        return rename(src, dest, overwrite);
      }
      if (fs5.existsSync(dest)) throw new Error("dest already exists.");
      return rename(src, dest, overwrite);
    }
    function rename(src, dest, overwrite) {
      try {
        fs5.renameSync(src, dest);
      } catch (err) {
        if (err.code !== "EXDEV") throw err;
        return moveAcrossDevice(src, dest, overwrite);
      }
    }
    function moveAcrossDevice(src, dest, overwrite) {
      const opts = {
        overwrite,
        errorOnExist: true
      };
      copySync(src, dest, opts);
      return removeSync(src);
    }
    module2.exports = moveSync;
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/move-sync/index.js
var require_move_sync3 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/move-sync/index.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      moveSync: require_move_sync2()
    };
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/move/move.js
var require_move2 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/move/move.js"(exports2, module2) {
    "use strict";
    var fs5 = require_graceful_fs();
    var path6 = require("path");
    var copy = require_copy4().copy;
    var remove = require_remove2().remove;
    var mkdirp = require_mkdirs4().mkdirp;
    var pathExists = require_path_exists2().pathExists;
    var stat = require_stat();
    function move(src, dest, opts, cb) {
      if (typeof opts === "function") {
        cb = opts;
        opts = {};
      }
      const overwrite = opts.overwrite || opts.clobber || false;
      stat.checkPaths(src, dest, "move", (err, stats) => {
        if (err) return cb(err);
        const { srcStat } = stats;
        stat.checkParentPaths(src, srcStat, dest, "move", (err2) => {
          if (err2) return cb(err2);
          mkdirp(path6.dirname(dest), (err3) => {
            if (err3) return cb(err3);
            return doRename(src, dest, overwrite, cb);
          });
        });
      });
    }
    function doRename(src, dest, overwrite, cb) {
      if (overwrite) {
        return remove(dest, (err) => {
          if (err) return cb(err);
          return rename(src, dest, overwrite, cb);
        });
      }
      pathExists(dest, (err, destExists) => {
        if (err) return cb(err);
        if (destExists) return cb(new Error("dest already exists."));
        return rename(src, dest, overwrite, cb);
      });
    }
    function rename(src, dest, overwrite, cb) {
      fs5.rename(src, dest, (err) => {
        if (!err) return cb();
        if (err.code !== "EXDEV") return cb(err);
        return moveAcrossDevice(src, dest, overwrite, cb);
      });
    }
    function moveAcrossDevice(src, dest, overwrite, cb) {
      const opts = {
        overwrite,
        errorOnExist: true
      };
      copy(src, dest, opts, (err) => {
        if (err) return cb(err);
        return remove(src, cb);
      });
    }
    module2.exports = move;
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/move/index.js
var require_move3 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/move/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    module2.exports = {
      move: u(require_move2())
    };
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/output/index.js
var require_output2 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/output/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs5 = require_graceful_fs();
    var path6 = require("path");
    var mkdir = require_mkdirs4();
    var pathExists = require_path_exists2().pathExists;
    function outputFile(file, data, encoding, callback) {
      if (typeof encoding === "function") {
        callback = encoding;
        encoding = "utf8";
      }
      const dir = path6.dirname(file);
      pathExists(dir, (err, itDoes) => {
        if (err) return callback(err);
        if (itDoes) return fs5.writeFile(file, data, encoding, callback);
        mkdir.mkdirs(dir, (err2) => {
          if (err2) return callback(err2);
          fs5.writeFile(file, data, encoding, callback);
        });
      });
    }
    function outputFileSync(file, ...args) {
      const dir = path6.dirname(file);
      if (fs5.existsSync(dir)) {
        return fs5.writeFileSync(file, ...args);
      }
      mkdir.mkdirsSync(dir);
      fs5.writeFileSync(file, ...args);
    }
    module2.exports = {
      outputFile: u(outputFile),
      outputFileSync
    };
  }
});

// node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/.pnpm/fs-extra@8.1.0/node_modules/fs-extra/lib/index.js"(exports2, module2) {
    "use strict";
    module2.exports = Object.assign(
      {},
      // Export promiseified graceful-fs:
      require_fs2(),
      // Export extra methods:
      require_copy_sync4(),
      require_copy4(),
      require_empty2(),
      require_ensure2(),
      require_json2(),
      require_mkdirs4(),
      require_move_sync3(),
      require_move3(),
      require_output2(),
      require_path_exists2(),
      require_remove2()
    );
    var fs5 = require("fs");
    if (Object.getOwnPropertyDescriptor(fs5, "promises")) {
      Object.defineProperty(module2.exports, "promises", {
        get() {
          return fs5.promises;
        }
      });
    }
  }
});

// node_modules/.pnpm/array-union@2.1.0/node_modules/array-union/index.js
var require_array_union = __commonJS({
  "node_modules/.pnpm/array-union@2.1.0/node_modules/array-union/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (...arguments_) => {
      return [...new Set([].concat(...arguments_))];
    };
  }
});

// node_modules/.pnpm/merge2@1.4.1/node_modules/merge2/index.js
var require_merge2 = __commonJS({
  "node_modules/.pnpm/merge2@1.4.1/node_modules/merge2/index.js"(exports2, module2) {
    "use strict";
    var Stream2 = require("stream");
    var PassThrough = Stream2.PassThrough;
    var slice = Array.prototype.slice;
    module2.exports = merge2;
    function merge2() {
      const streamsQueue = [];
      const args = slice.call(arguments);
      let merging = false;
      let options = args[args.length - 1];
      if (options && !Array.isArray(options) && options.pipe == null) {
        args.pop();
      } else {
        options = {};
      }
      const doEnd = options.end !== false;
      const doPipeError = options.pipeError === true;
      if (options.objectMode == null) {
        options.objectMode = true;
      }
      if (options.highWaterMark == null) {
        options.highWaterMark = 64 * 1024;
      }
      const mergedStream = PassThrough(options);
      function addStream() {
        for (let i = 0, len = arguments.length; i < len; i++) {
          streamsQueue.push(pauseStreams(arguments[i], options));
        }
        mergeStream();
        return this;
      }
      function mergeStream() {
        if (merging) {
          return;
        }
        merging = true;
        let streams = streamsQueue.shift();
        if (!streams) {
          process.nextTick(endStream);
          return;
        }
        if (!Array.isArray(streams)) {
          streams = [streams];
        }
        let pipesCount = streams.length + 1;
        function next() {
          if (--pipesCount > 0) {
            return;
          }
          merging = false;
          mergeStream();
        }
        function pipe(stream2) {
          function onend() {
            stream2.removeListener("merge2UnpipeEnd", onend);
            stream2.removeListener("end", onend);
            if (doPipeError) {
              stream2.removeListener("error", onerror);
            }
            next();
          }
          function onerror(err) {
            mergedStream.emit("error", err);
          }
          if (stream2._readableState.endEmitted) {
            return next();
          }
          stream2.on("merge2UnpipeEnd", onend);
          stream2.on("end", onend);
          if (doPipeError) {
            stream2.on("error", onerror);
          }
          stream2.pipe(mergedStream, { end: false });
          stream2.resume();
        }
        for (let i = 0; i < streams.length; i++) {
          pipe(streams[i]);
        }
        next();
      }
      function endStream() {
        merging = false;
        mergedStream.emit("queueDrain");
        if (doEnd) {
          mergedStream.end();
        }
      }
      mergedStream.setMaxListeners(0);
      mergedStream.add = addStream;
      mergedStream.on("unpipe", function(stream2) {
        stream2.emit("merge2UnpipeEnd");
      });
      if (args.length) {
        addStream.apply(null, args);
      }
      return mergedStream;
    }
    function pauseStreams(streams, options) {
      if (!Array.isArray(streams)) {
        if (!streams._readableState && streams.pipe) {
          streams = streams.pipe(PassThrough(options));
        }
        if (!streams._readableState || !streams.pause || !streams.pipe) {
          throw new Error("Only readable stream can be merged.");
        }
        streams.pause();
      } else {
        for (let i = 0, len = streams.length; i < len; i++) {
          streams[i] = pauseStreams(streams[i], options);
        }
      }
      return streams;
    }
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/array.js
var require_array = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/array.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.splitWhen = exports2.flatten = void 0;
    function flatten(items) {
      return items.reduce((collection, item) => [].concat(collection, item), []);
    }
    exports2.flatten = flatten;
    function splitWhen(items, predicate) {
      const result = [[]];
      let groupIndex = 0;
      for (const item of items) {
        if (predicate(item)) {
          groupIndex++;
          result[groupIndex] = [];
        } else {
          result[groupIndex].push(item);
        }
      }
      return result;
    }
    exports2.splitWhen = splitWhen;
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/errno.js
var require_errno = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/errno.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isEnoentCodeError = void 0;
    function isEnoentCodeError(error) {
      return error.code === "ENOENT";
    }
    exports2.isEnoentCodeError = isEnoentCodeError;
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/fs.js
var require_fs3 = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/fs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createDirentFromStats = void 0;
    var DirentFromStats = class {
      constructor(name, stats) {
        this.name = name;
        this.isBlockDevice = stats.isBlockDevice.bind(stats);
        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
        this.isDirectory = stats.isDirectory.bind(stats);
        this.isFIFO = stats.isFIFO.bind(stats);
        this.isFile = stats.isFile.bind(stats);
        this.isSocket = stats.isSocket.bind(stats);
        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
      }
    };
    function createDirentFromStats(name, stats) {
      return new DirentFromStats(name, stats);
    }
    exports2.createDirentFromStats = createDirentFromStats;
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/path.js
var require_path = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/path.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.convertPosixPathToPattern = exports2.convertWindowsPathToPattern = exports2.convertPathToPattern = exports2.escapePosixPath = exports2.escapeWindowsPath = exports2.escape = exports2.removeLeadingDotSegment = exports2.makeAbsolute = exports2.unixify = void 0;
    var os = require("os");
    var path6 = require("path");
    var IS_WINDOWS_PLATFORM = os.platform() === "win32";
    var LEADING_DOT_SEGMENT_CHARACTERS_COUNT = 2;
    var POSIX_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\()|\\(?![!()*+?@[\]{|}]))/g;
    var WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()[\]{}]|^!|[!+@](?=\())/g;
    var DOS_DEVICE_PATH_RE = /^\\\\([.?])/;
    var WINDOWS_BACKSLASHES_RE = /\\(?![!()+@[\]{}])/g;
    function unixify(filepath) {
      return filepath.replace(/\\/g, "/");
    }
    exports2.unixify = unixify;
    function makeAbsolute(cwd, filepath) {
      return path6.resolve(cwd, filepath);
    }
    exports2.makeAbsolute = makeAbsolute;
    function removeLeadingDotSegment(entry) {
      if (entry.charAt(0) === ".") {
        const secondCharactery = entry.charAt(1);
        if (secondCharactery === "/" || secondCharactery === "\\") {
          return entry.slice(LEADING_DOT_SEGMENT_CHARACTERS_COUNT);
        }
      }
      return entry;
    }
    exports2.removeLeadingDotSegment = removeLeadingDotSegment;
    exports2.escape = IS_WINDOWS_PLATFORM ? escapeWindowsPath : escapePosixPath;
    function escapeWindowsPath(pattern) {
      return pattern.replace(WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE, "\\$2");
    }
    exports2.escapeWindowsPath = escapeWindowsPath;
    function escapePosixPath(pattern) {
      return pattern.replace(POSIX_UNESCAPED_GLOB_SYMBOLS_RE, "\\$2");
    }
    exports2.escapePosixPath = escapePosixPath;
    exports2.convertPathToPattern = IS_WINDOWS_PLATFORM ? convertWindowsPathToPattern : convertPosixPathToPattern;
    function convertWindowsPathToPattern(filepath) {
      return escapeWindowsPath(filepath).replace(DOS_DEVICE_PATH_RE, "//$1").replace(WINDOWS_BACKSLASHES_RE, "/");
    }
    exports2.convertWindowsPathToPattern = convertWindowsPathToPattern;
    function convertPosixPathToPattern(filepath) {
      return escapePosixPath(filepath);
    }
    exports2.convertPosixPathToPattern = convertPosixPathToPattern;
  }
});

// node_modules/.pnpm/is-extglob@2.1.1/node_modules/is-extglob/index.js
var require_is_extglob = __commonJS({
  "node_modules/.pnpm/is-extglob@2.1.1/node_modules/is-extglob/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function isExtglob(str) {
      if (typeof str !== "string" || str === "") {
        return false;
      }
      var match2;
      while (match2 = /(\\).|([@?!+*]\(.*\))/g.exec(str)) {
        if (match2[2]) return true;
        str = str.slice(match2.index + match2[0].length);
      }
      return false;
    };
  }
});

// node_modules/.pnpm/is-glob@4.0.3/node_modules/is-glob/index.js
var require_is_glob = __commonJS({
  "node_modules/.pnpm/is-glob@4.0.3/node_modules/is-glob/index.js"(exports2, module2) {
    "use strict";
    var isExtglob = require_is_extglob();
    var chars = { "{": "}", "(": ")", "[": "]" };
    var strictCheck = function(str) {
      if (str[0] === "!") {
        return true;
      }
      var index = 0;
      var pipeIndex = -2;
      var closeSquareIndex = -2;
      var closeCurlyIndex = -2;
      var closeParenIndex = -2;
      var backSlashIndex = -2;
      while (index < str.length) {
        if (str[index] === "*") {
          return true;
        }
        if (str[index + 1] === "?" && /[\].+)]/.test(str[index])) {
          return true;
        }
        if (closeSquareIndex !== -1 && str[index] === "[" && str[index + 1] !== "]") {
          if (closeSquareIndex < index) {
            closeSquareIndex = str.indexOf("]", index);
          }
          if (closeSquareIndex > index) {
            if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
              return true;
            }
            backSlashIndex = str.indexOf("\\", index);
            if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
              return true;
            }
          }
        }
        if (closeCurlyIndex !== -1 && str[index] === "{" && str[index + 1] !== "}") {
          closeCurlyIndex = str.indexOf("}", index);
          if (closeCurlyIndex > index) {
            backSlashIndex = str.indexOf("\\", index);
            if (backSlashIndex === -1 || backSlashIndex > closeCurlyIndex) {
              return true;
            }
          }
        }
        if (closeParenIndex !== -1 && str[index] === "(" && str[index + 1] === "?" && /[:!=]/.test(str[index + 2]) && str[index + 3] !== ")") {
          closeParenIndex = str.indexOf(")", index);
          if (closeParenIndex > index) {
            backSlashIndex = str.indexOf("\\", index);
            if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
              return true;
            }
          }
        }
        if (pipeIndex !== -1 && str[index] === "(" && str[index + 1] !== "|") {
          if (pipeIndex < index) {
            pipeIndex = str.indexOf("|", index);
          }
          if (pipeIndex !== -1 && str[pipeIndex + 1] !== ")") {
            closeParenIndex = str.indexOf(")", pipeIndex);
            if (closeParenIndex > pipeIndex) {
              backSlashIndex = str.indexOf("\\", pipeIndex);
              if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
                return true;
              }
            }
          }
        }
        if (str[index] === "\\") {
          var open = str[index + 1];
          index += 2;
          var close = chars[open];
          if (close) {
            var n = str.indexOf(close, index);
            if (n !== -1) {
              index = n + 1;
            }
          }
          if (str[index] === "!") {
            return true;
          }
        } else {
          index++;
        }
      }
      return false;
    };
    var relaxedCheck = function(str) {
      if (str[0] === "!") {
        return true;
      }
      var index = 0;
      while (index < str.length) {
        if (/[*?{}()[\]]/.test(str[index])) {
          return true;
        }
        if (str[index] === "\\") {
          var open = str[index + 1];
          index += 2;
          var close = chars[open];
          if (close) {
            var n = str.indexOf(close, index);
            if (n !== -1) {
              index = n + 1;
            }
          }
          if (str[index] === "!") {
            return true;
          }
        } else {
          index++;
        }
      }
      return false;
    };
    module2.exports = function isGlob(str, options) {
      if (typeof str !== "string" || str === "") {
        return false;
      }
      if (isExtglob(str)) {
        return true;
      }
      var check = strictCheck;
      if (options && options.strict === false) {
        check = relaxedCheck;
      }
      return check(str);
    };
  }
});

// node_modules/.pnpm/glob-parent@5.1.2/node_modules/glob-parent/index.js
var require_glob_parent = __commonJS({
  "node_modules/.pnpm/glob-parent@5.1.2/node_modules/glob-parent/index.js"(exports2, module2) {
    "use strict";
    var isGlob = require_is_glob();
    var pathPosixDirname = require("path").posix.dirname;
    var isWin32 = require("os").platform() === "win32";
    var slash = "/";
    var backslash = /\\/g;
    var enclosure = /[\{\[].*[\}\]]$/;
    var globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
    var escaped = /\\([\!\*\?\|\[\]\(\)\{\}])/g;
    module2.exports = function globParent(str, opts) {
      var options = Object.assign({ flipBackslashes: true }, opts);
      if (options.flipBackslashes && isWin32 && str.indexOf(slash) < 0) {
        str = str.replace(backslash, slash);
      }
      if (enclosure.test(str)) {
        str += slash;
      }
      str += "a";
      do {
        str = pathPosixDirname(str);
      } while (isGlob(str) || globby.test(str));
      return str.replace(escaped, "$1");
    };
  }
});

// node_modules/.pnpm/braces@3.0.2/node_modules/braces/lib/utils.js
var require_utils = __commonJS({
  "node_modules/.pnpm/braces@3.0.2/node_modules/braces/lib/utils.js"(exports2) {
    "use strict";
    exports2.isInteger = (num) => {
      if (typeof num === "number") {
        return Number.isInteger(num);
      }
      if (typeof num === "string" && num.trim() !== "") {
        return Number.isInteger(Number(num));
      }
      return false;
    };
    exports2.find = (node, type) => node.nodes.find((node2) => node2.type === type);
    exports2.exceedsLimit = (min, max, step = 1, limit) => {
      if (limit === false) return false;
      if (!exports2.isInteger(min) || !exports2.isInteger(max)) return false;
      return (Number(max) - Number(min)) / Number(step) >= limit;
    };
    exports2.escapeNode = (block, n = 0, type) => {
      let node = block.nodes[n];
      if (!node) return;
      if (type && node.type === type || node.type === "open" || node.type === "close") {
        if (node.escaped !== true) {
          node.value = "\\" + node.value;
          node.escaped = true;
        }
      }
    };
    exports2.encloseBrace = (node) => {
      if (node.type !== "brace") return false;
      if (node.commas >> 0 + node.ranges >> 0 === 0) {
        node.invalid = true;
        return true;
      }
      return false;
    };
    exports2.isInvalidBrace = (block) => {
      if (block.type !== "brace") return false;
      if (block.invalid === true || block.dollar) return true;
      if (block.commas >> 0 + block.ranges >> 0 === 0) {
        block.invalid = true;
        return true;
      }
      if (block.open !== true || block.close !== true) {
        block.invalid = true;
        return true;
      }
      return false;
    };
    exports2.isOpenOrClose = (node) => {
      if (node.type === "open" || node.type === "close") {
        return true;
      }
      return node.open === true || node.close === true;
    };
    exports2.reduce = (nodes) => nodes.reduce((acc, node) => {
      if (node.type === "text") acc.push(node.value);
      if (node.type === "range") node.type = "text";
      return acc;
    }, []);
    exports2.flatten = (...args) => {
      const result = [];
      const flat = (arr) => {
        for (let i = 0; i < arr.length; i++) {
          let ele = arr[i];
          Array.isArray(ele) ? flat(ele, result) : ele !== void 0 && result.push(ele);
        }
        return result;
      };
      flat(args);
      return result;
    };
  }
});

// node_modules/.pnpm/braces@3.0.2/node_modules/braces/lib/stringify.js
var require_stringify = __commonJS({
  "node_modules/.pnpm/braces@3.0.2/node_modules/braces/lib/stringify.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    module2.exports = (ast, options = {}) => {
      let stringify = (node, parent = {}) => {
        let invalidBlock = options.escapeInvalid && utils.isInvalidBrace(parent);
        let invalidNode = node.invalid === true && options.escapeInvalid === true;
        let output = "";
        if (node.value) {
          if ((invalidBlock || invalidNode) && utils.isOpenOrClose(node)) {
            return "\\" + node.value;
          }
          return node.value;
        }
        if (node.value) {
          return node.value;
        }
        if (node.nodes) {
          for (let child of node.nodes) {
            output += stringify(child);
          }
        }
        return output;
      };
      return stringify(ast);
    };
  }
});

// node_modules/.pnpm/is-number@7.0.0/node_modules/is-number/index.js
var require_is_number = __commonJS({
  "node_modules/.pnpm/is-number@7.0.0/node_modules/is-number/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function(num) {
      if (typeof num === "number") {
        return num - num === 0;
      }
      if (typeof num === "string" && num.trim() !== "") {
        return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
      }
      return false;
    };
  }
});

// node_modules/.pnpm/to-regex-range@5.0.1/node_modules/to-regex-range/index.js
var require_to_regex_range = __commonJS({
  "node_modules/.pnpm/to-regex-range@5.0.1/node_modules/to-regex-range/index.js"(exports2, module2) {
    "use strict";
    var isNumber = require_is_number();
    var toRegexRange = (min, max, options) => {
      if (isNumber(min) === false) {
        throw new TypeError("toRegexRange: expected the first argument to be a number");
      }
      if (max === void 0 || min === max) {
        return String(min);
      }
      if (isNumber(max) === false) {
        throw new TypeError("toRegexRange: expected the second argument to be a number.");
      }
      let opts = { relaxZeros: true, ...options };
      if (typeof opts.strictZeros === "boolean") {
        opts.relaxZeros = opts.strictZeros === false;
      }
      let relax = String(opts.relaxZeros);
      let shorthand = String(opts.shorthand);
      let capture = String(opts.capture);
      let wrap = String(opts.wrap);
      let cacheKey = min + ":" + max + "=" + relax + shorthand + capture + wrap;
      if (toRegexRange.cache.hasOwnProperty(cacheKey)) {
        return toRegexRange.cache[cacheKey].result;
      }
      let a = Math.min(min, max);
      let b = Math.max(min, max);
      if (Math.abs(a - b) === 1) {
        let result = min + "|" + max;
        if (opts.capture) {
          return `(${result})`;
        }
        if (opts.wrap === false) {
          return result;
        }
        return `(?:${result})`;
      }
      let isPadded2 = hasPadding(min) || hasPadding(max);
      let state = { min, max, a, b };
      let positives = [];
      let negatives = [];
      if (isPadded2) {
        state.isPadded = isPadded2;
        state.maxLen = String(state.max).length;
      }
      if (a < 0) {
        let newMin = b < 0 ? Math.abs(b) : 1;
        negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
        a = state.a = 0;
      }
      if (b >= 0) {
        positives = splitToPatterns(a, b, state, opts);
      }
      state.negatives = negatives;
      state.positives = positives;
      state.result = collatePatterns(negatives, positives, opts);
      if (opts.capture === true) {
        state.result = `(${state.result})`;
      } else if (opts.wrap !== false && positives.length + negatives.length > 1) {
        state.result = `(?:${state.result})`;
      }
      toRegexRange.cache[cacheKey] = state;
      return state.result;
    };
    function collatePatterns(neg, pos, options) {
      let onlyNegative = filterPatterns(neg, pos, "-", false, options) || [];
      let onlyPositive = filterPatterns(pos, neg, "", false, options) || [];
      let intersected = filterPatterns(neg, pos, "-?", true, options) || [];
      let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
      return subpatterns.join("|");
    }
    function splitToRanges(min, max) {
      let nines = 1;
      let zeros = 1;
      let stop = countNines(min, nines);
      let stops = /* @__PURE__ */ new Set([max]);
      while (min <= stop && stop <= max) {
        stops.add(stop);
        nines += 1;
        stop = countNines(min, nines);
      }
      stop = countZeros(max + 1, zeros) - 1;
      while (min < stop && stop <= max) {
        stops.add(stop);
        zeros += 1;
        stop = countZeros(max + 1, zeros) - 1;
      }
      stops = [...stops];
      stops.sort(compare);
      return stops;
    }
    function rangeToPattern(start, stop, options) {
      if (start === stop) {
        return { pattern: start, count: [], digits: 0 };
      }
      let zipped = zip(start, stop);
      let digits = zipped.length;
      let pattern = "";
      let count = 0;
      for (let i = 0; i < digits; i++) {
        let [startDigit, stopDigit] = zipped[i];
        if (startDigit === stopDigit) {
          pattern += startDigit;
        } else if (startDigit !== "0" || stopDigit !== "9") {
          pattern += toCharacterClass(startDigit, stopDigit, options);
        } else {
          count++;
        }
      }
      if (count) {
        pattern += options.shorthand === true ? "\\d" : "[0-9]";
      }
      return { pattern, count: [count], digits };
    }
    function splitToPatterns(min, max, tok, options) {
      let ranges = splitToRanges(min, max);
      let tokens = [];
      let start = min;
      let prev;
      for (let i = 0; i < ranges.length; i++) {
        let max2 = ranges[i];
        let obj = rangeToPattern(String(start), String(max2), options);
        let zeros = "";
        if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
          if (prev.count.length > 1) {
            prev.count.pop();
          }
          prev.count.push(obj.count[0]);
          prev.string = prev.pattern + toQuantifier(prev.count);
          start = max2 + 1;
          continue;
        }
        if (tok.isPadded) {
          zeros = padZeros(max2, tok, options);
        }
        obj.string = zeros + obj.pattern + toQuantifier(obj.count);
        tokens.push(obj);
        start = max2 + 1;
        prev = obj;
      }
      return tokens;
    }
    function filterPatterns(arr, comparison, prefix2, intersection, options) {
      let result = [];
      for (let ele of arr) {
        let { string } = ele;
        if (!intersection && !contains(comparison, "string", string)) {
          result.push(prefix2 + string);
        }
        if (intersection && contains(comparison, "string", string)) {
          result.push(prefix2 + string);
        }
      }
      return result;
    }
    function zip(a, b) {
      let arr = [];
      for (let i = 0; i < a.length; i++) arr.push([a[i], b[i]]);
      return arr;
    }
    function compare(a, b) {
      return a > b ? 1 : b > a ? -1 : 0;
    }
    function contains(arr, key, val) {
      return arr.some((ele) => ele[key] === val);
    }
    function countNines(min, len) {
      return Number(String(min).slice(0, -len) + "9".repeat(len));
    }
    function countZeros(integer, zeros) {
      return integer - integer % Math.pow(10, zeros);
    }
    function toQuantifier(digits) {
      let [start = 0, stop = ""] = digits;
      if (stop || start > 1) {
        return `{${start + (stop ? "," + stop : "")}}`;
      }
      return "";
    }
    function toCharacterClass(a, b, options) {
      return `[${a}${b - a === 1 ? "" : "-"}${b}]`;
    }
    function hasPadding(str) {
      return /^-?(0+)\d/.test(str);
    }
    function padZeros(value, tok, options) {
      if (!tok.isPadded) {
        return value;
      }
      let diff = Math.abs(tok.maxLen - String(value).length);
      let relax = options.relaxZeros !== false;
      switch (diff) {
        case 0:
          return "";
        case 1:
          return relax ? "0?" : "0";
        case 2:
          return relax ? "0{0,2}" : "00";
        default: {
          return relax ? `0{0,${diff}}` : `0{${diff}}`;
        }
      }
    }
    toRegexRange.cache = {};
    toRegexRange.clearCache = () => toRegexRange.cache = {};
    module2.exports = toRegexRange;
  }
});

// node_modules/.pnpm/fill-range@7.0.1/node_modules/fill-range/index.js
var require_fill_range = __commonJS({
  "node_modules/.pnpm/fill-range@7.0.1/node_modules/fill-range/index.js"(exports2, module2) {
    "use strict";
    var util2 = require("util");
    var toRegexRange = require_to_regex_range();
    var isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
    var transform = (toNumber) => {
      return (value) => toNumber === true ? Number(value) : String(value);
    };
    var isValidValue = (value) => {
      return typeof value === "number" || typeof value === "string" && value !== "";
    };
    var isNumber = (num) => Number.isInteger(+num);
    var zeros = (input) => {
      let value = `${input}`;
      let index = -1;
      if (value[0] === "-") value = value.slice(1);
      if (value === "0") return false;
      while (value[++index] === "0") ;
      return index > 0;
    };
    var stringify = (start, end, options) => {
      if (typeof start === "string" || typeof end === "string") {
        return true;
      }
      return options.stringify === true;
    };
    var pad = (input, maxLength, toNumber) => {
      if (maxLength > 0) {
        let dash = input[0] === "-" ? "-" : "";
        if (dash) input = input.slice(1);
        input = dash + input.padStart(dash ? maxLength - 1 : maxLength, "0");
      }
      if (toNumber === false) {
        return String(input);
      }
      return input;
    };
    var toMaxLen = (input, maxLength) => {
      let negative = input[0] === "-" ? "-" : "";
      if (negative) {
        input = input.slice(1);
        maxLength--;
      }
      while (input.length < maxLength) input = "0" + input;
      return negative ? "-" + input : input;
    };
    var toSequence = (parts, options) => {
      parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
      parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
      let prefix2 = options.capture ? "" : "?:";
      let positives = "";
      let negatives = "";
      let result;
      if (parts.positives.length) {
        positives = parts.positives.join("|");
      }
      if (parts.negatives.length) {
        negatives = `-(${prefix2}${parts.negatives.join("|")})`;
      }
      if (positives && negatives) {
        result = `${positives}|${negatives}`;
      } else {
        result = positives || negatives;
      }
      if (options.wrap) {
        return `(${prefix2}${result})`;
      }
      return result;
    };
    var toRange = (a, b, isNumbers, options) => {
      if (isNumbers) {
        return toRegexRange(a, b, { wrap: false, ...options });
      }
      let start = String.fromCharCode(a);
      if (a === b) return start;
      let stop = String.fromCharCode(b);
      return `[${start}-${stop}]`;
    };
    var toRegex = (start, end, options) => {
      if (Array.isArray(start)) {
        let wrap = options.wrap === true;
        let prefix2 = options.capture ? "" : "?:";
        return wrap ? `(${prefix2}${start.join("|")})` : start.join("|");
      }
      return toRegexRange(start, end, options);
    };
    var rangeError = (...args) => {
      return new RangeError("Invalid range arguments: " + util2.inspect(...args));
    };
    var invalidRange = (start, end, options) => {
      if (options.strictRanges === true) throw rangeError([start, end]);
      return [];
    };
    var invalidStep = (step, options) => {
      if (options.strictRanges === true) {
        throw new TypeError(`Expected step "${step}" to be a number`);
      }
      return [];
    };
    var fillNumbers = (start, end, step = 1, options = {}) => {
      let a = Number(start);
      let b = Number(end);
      if (!Number.isInteger(a) || !Number.isInteger(b)) {
        if (options.strictRanges === true) throw rangeError([start, end]);
        return [];
      }
      if (a === 0) a = 0;
      if (b === 0) b = 0;
      let descending = a > b;
      let startString = String(start);
      let endString = String(end);
      let stepString = String(step);
      step = Math.max(Math.abs(step), 1);
      let padded = zeros(startString) || zeros(endString) || zeros(stepString);
      let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
      let toNumber = padded === false && stringify(start, end, options) === false;
      let format2 = options.transform || transform(toNumber);
      if (options.toRegex && step === 1) {
        return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
      }
      let parts = { negatives: [], positives: [] };
      let push = (num) => parts[num < 0 ? "negatives" : "positives"].push(Math.abs(num));
      let range2 = [];
      let index = 0;
      while (descending ? a >= b : a <= b) {
        if (options.toRegex === true && step > 1) {
          push(a);
        } else {
          range2.push(pad(format2(a, index), maxLen, toNumber));
        }
        a = descending ? a - step : a + step;
        index++;
      }
      if (options.toRegex === true) {
        return step > 1 ? toSequence(parts, options) : toRegex(range2, null, { wrap: false, ...options });
      }
      return range2;
    };
    var fillLetters = (start, end, step = 1, options = {}) => {
      if (!isNumber(start) && start.length > 1 || !isNumber(end) && end.length > 1) {
        return invalidRange(start, end, options);
      }
      let format2 = options.transform || ((val) => String.fromCharCode(val));
      let a = `${start}`.charCodeAt(0);
      let b = `${end}`.charCodeAt(0);
      let descending = a > b;
      let min = Math.min(a, b);
      let max = Math.max(a, b);
      if (options.toRegex && step === 1) {
        return toRange(min, max, false, options);
      }
      let range2 = [];
      let index = 0;
      while (descending ? a >= b : a <= b) {
        range2.push(format2(a, index));
        a = descending ? a - step : a + step;
        index++;
      }
      if (options.toRegex === true) {
        return toRegex(range2, null, { wrap: false, options });
      }
      return range2;
    };
    var fill = (start, end, step, options = {}) => {
      if (end == null && isValidValue(start)) {
        return [start];
      }
      if (!isValidValue(start) || !isValidValue(end)) {
        return invalidRange(start, end, options);
      }
      if (typeof step === "function") {
        return fill(start, end, 1, { transform: step });
      }
      if (isObject(step)) {
        return fill(start, end, 0, step);
      }
      let opts = { ...options };
      if (opts.capture === true) opts.wrap = true;
      step = step || opts.step || 1;
      if (!isNumber(step)) {
        if (step != null && !isObject(step)) return invalidStep(step, opts);
        return fill(start, end, 1, step);
      }
      if (isNumber(start) && isNumber(end)) {
        return fillNumbers(start, end, step, opts);
      }
      return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
    };
    module2.exports = fill;
  }
});

// node_modules/.pnpm/braces@3.0.2/node_modules/braces/lib/compile.js
var require_compile = __commonJS({
  "node_modules/.pnpm/braces@3.0.2/node_modules/braces/lib/compile.js"(exports2, module2) {
    "use strict";
    var fill = require_fill_range();
    var utils = require_utils();
    var compile = (ast, options = {}) => {
      let walk = (node, parent = {}) => {
        let invalidBlock = utils.isInvalidBrace(parent);
        let invalidNode = node.invalid === true && options.escapeInvalid === true;
        let invalid = invalidBlock === true || invalidNode === true;
        let prefix2 = options.escapeInvalid === true ? "\\" : "";
        let output = "";
        if (node.isOpen === true) {
          return prefix2 + node.value;
        }
        if (node.isClose === true) {
          return prefix2 + node.value;
        }
        if (node.type === "open") {
          return invalid ? prefix2 + node.value : "(";
        }
        if (node.type === "close") {
          return invalid ? prefix2 + node.value : ")";
        }
        if (node.type === "comma") {
          return node.prev.type === "comma" ? "" : invalid ? node.value : "|";
        }
        if (node.value) {
          return node.value;
        }
        if (node.nodes && node.ranges > 0) {
          let args = utils.reduce(node.nodes);
          let range2 = fill(...args, { ...options, wrap: false, toRegex: true });
          if (range2.length !== 0) {
            return args.length > 1 && range2.length > 1 ? `(${range2})` : range2;
          }
        }
        if (node.nodes) {
          for (let child of node.nodes) {
            output += walk(child, node);
          }
        }
        return output;
      };
      return walk(ast);
    };
    module2.exports = compile;
  }
});

// node_modules/.pnpm/braces@3.0.2/node_modules/braces/lib/expand.js
var require_expand = __commonJS({
  "node_modules/.pnpm/braces@3.0.2/node_modules/braces/lib/expand.js"(exports2, module2) {
    "use strict";
    var fill = require_fill_range();
    var stringify = require_stringify();
    var utils = require_utils();
    var append = (queue = "", stash = "", enclose = false) => {
      let result = [];
      queue = [].concat(queue);
      stash = [].concat(stash);
      if (!stash.length) return queue;
      if (!queue.length) {
        return enclose ? utils.flatten(stash).map((ele) => `{${ele}}`) : stash;
      }
      for (let item of queue) {
        if (Array.isArray(item)) {
          for (let value of item) {
            result.push(append(value, stash, enclose));
          }
        } else {
          for (let ele of stash) {
            if (enclose === true && typeof ele === "string") ele = `{${ele}}`;
            result.push(Array.isArray(ele) ? append(item, ele, enclose) : item + ele);
          }
        }
      }
      return utils.flatten(result);
    };
    var expand2 = (ast, options = {}) => {
      let rangeLimit = options.rangeLimit === void 0 ? 1e3 : options.rangeLimit;
      let walk = (node, parent = {}) => {
        node.queue = [];
        let p = parent;
        let q = parent.queue;
        while (p.type !== "brace" && p.type !== "root" && p.parent) {
          p = p.parent;
          q = p.queue;
        }
        if (node.invalid || node.dollar) {
          q.push(append(q.pop(), stringify(node, options)));
          return;
        }
        if (node.type === "brace" && node.invalid !== true && node.nodes.length === 2) {
          q.push(append(q.pop(), ["{}"]));
          return;
        }
        if (node.nodes && node.ranges > 0) {
          let args = utils.reduce(node.nodes);
          if (utils.exceedsLimit(...args, options.step, rangeLimit)) {
            throw new RangeError("expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.");
          }
          let range2 = fill(...args, options);
          if (range2.length === 0) {
            range2 = stringify(node, options);
          }
          q.push(append(q.pop(), range2));
          node.nodes = [];
          return;
        }
        let enclose = utils.encloseBrace(node);
        let queue = node.queue;
        let block = node;
        while (block.type !== "brace" && block.type !== "root" && block.parent) {
          block = block.parent;
          queue = block.queue;
        }
        for (let i = 0; i < node.nodes.length; i++) {
          let child = node.nodes[i];
          if (child.type === "comma" && node.type === "brace") {
            if (i === 1) queue.push("");
            queue.push("");
            continue;
          }
          if (child.type === "close") {
            q.push(append(q.pop(), queue, enclose));
            continue;
          }
          if (child.value && child.type !== "open") {
            queue.push(append(queue.pop(), child.value));
            continue;
          }
          if (child.nodes) {
            walk(child, node);
          }
        }
        return queue;
      };
      return utils.flatten(walk(ast));
    };
    module2.exports = expand2;
  }
});

// node_modules/.pnpm/braces@3.0.2/node_modules/braces/lib/constants.js
var require_constants = __commonJS({
  "node_modules/.pnpm/braces@3.0.2/node_modules/braces/lib/constants.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      MAX_LENGTH: 1024 * 64,
      // Digits
      CHAR_0: "0",
      /* 0 */
      CHAR_9: "9",
      /* 9 */
      // Alphabet chars.
      CHAR_UPPERCASE_A: "A",
      /* A */
      CHAR_LOWERCASE_A: "a",
      /* a */
      CHAR_UPPERCASE_Z: "Z",
      /* Z */
      CHAR_LOWERCASE_Z: "z",
      /* z */
      CHAR_LEFT_PARENTHESES: "(",
      /* ( */
      CHAR_RIGHT_PARENTHESES: ")",
      /* ) */
      CHAR_ASTERISK: "*",
      /* * */
      // Non-alphabetic chars.
      CHAR_AMPERSAND: "&",
      /* & */
      CHAR_AT: "@",
      /* @ */
      CHAR_BACKSLASH: "\\",
      /* \ */
      CHAR_BACKTICK: "`",
      /* ` */
      CHAR_CARRIAGE_RETURN: "\r",
      /* \r */
      CHAR_CIRCUMFLEX_ACCENT: "^",
      /* ^ */
      CHAR_COLON: ":",
      /* : */
      CHAR_COMMA: ",",
      /* , */
      CHAR_DOLLAR: "$",
      /* . */
      CHAR_DOT: ".",
      /* . */
      CHAR_DOUBLE_QUOTE: '"',
      /* " */
      CHAR_EQUAL: "=",
      /* = */
      CHAR_EXCLAMATION_MARK: "!",
      /* ! */
      CHAR_FORM_FEED: "\f",
      /* \f */
      CHAR_FORWARD_SLASH: "/",
      /* / */
      CHAR_HASH: "#",
      /* # */
      CHAR_HYPHEN_MINUS: "-",
      /* - */
      CHAR_LEFT_ANGLE_BRACKET: "<",
      /* < */
      CHAR_LEFT_CURLY_BRACE: "{",
      /* { */
      CHAR_LEFT_SQUARE_BRACKET: "[",
      /* [ */
      CHAR_LINE_FEED: "\n",
      /* \n */
      CHAR_NO_BREAK_SPACE: "\xA0",
      /* \u00A0 */
      CHAR_PERCENT: "%",
      /* % */
      CHAR_PLUS: "+",
      /* + */
      CHAR_QUESTION_MARK: "?",
      /* ? */
      CHAR_RIGHT_ANGLE_BRACKET: ">",
      /* > */
      CHAR_RIGHT_CURLY_BRACE: "}",
      /* } */
      CHAR_RIGHT_SQUARE_BRACKET: "]",
      /* ] */
      CHAR_SEMICOLON: ";",
      /* ; */
      CHAR_SINGLE_QUOTE: "'",
      /* ' */
      CHAR_SPACE: " ",
      /*   */
      CHAR_TAB: "	",
      /* \t */
      CHAR_UNDERSCORE: "_",
      /* _ */
      CHAR_VERTICAL_LINE: "|",
      /* | */
      CHAR_ZERO_WIDTH_NOBREAK_SPACE: "\uFEFF"
      /* \uFEFF */
    };
  }
});

// node_modules/.pnpm/braces@3.0.2/node_modules/braces/lib/parse.js
var require_parse2 = __commonJS({
  "node_modules/.pnpm/braces@3.0.2/node_modules/braces/lib/parse.js"(exports2, module2) {
    "use strict";
    var stringify = require_stringify();
    var {
      MAX_LENGTH,
      CHAR_BACKSLASH,
      /* \ */
      CHAR_BACKTICK,
      /* ` */
      CHAR_COMMA,
      /* , */
      CHAR_DOT,
      /* . */
      CHAR_LEFT_PARENTHESES,
      /* ( */
      CHAR_RIGHT_PARENTHESES,
      /* ) */
      CHAR_LEFT_CURLY_BRACE,
      /* { */
      CHAR_RIGHT_CURLY_BRACE,
      /* } */
      CHAR_LEFT_SQUARE_BRACKET,
      /* [ */
      CHAR_RIGHT_SQUARE_BRACKET,
      /* ] */
      CHAR_DOUBLE_QUOTE,
      /* " */
      CHAR_SINGLE_QUOTE,
      /* ' */
      CHAR_NO_BREAK_SPACE,
      CHAR_ZERO_WIDTH_NOBREAK_SPACE
    } = require_constants();
    var parse = (input, options = {}) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected a string");
      }
      let opts = options || {};
      let max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      if (input.length > max) {
        throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
      }
      let ast = { type: "root", input, nodes: [] };
      let stack = [ast];
      let block = ast;
      let prev = ast;
      let brackets = 0;
      let length = input.length;
      let index = 0;
      let depth = 0;
      let value;
      let memo = {};
      const advance = () => input[index++];
      const push = (node) => {
        if (node.type === "text" && prev.type === "dot") {
          prev.type = "text";
        }
        if (prev && prev.type === "text" && node.type === "text") {
          prev.value += node.value;
          return;
        }
        block.nodes.push(node);
        node.parent = block;
        node.prev = prev;
        prev = node;
        return node;
      };
      push({ type: "bos" });
      while (index < length) {
        block = stack[stack.length - 1];
        value = advance();
        if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
          continue;
        }
        if (value === CHAR_BACKSLASH) {
          push({ type: "text", value: (options.keepEscaping ? value : "") + advance() });
          continue;
        }
        if (value === CHAR_RIGHT_SQUARE_BRACKET) {
          push({ type: "text", value: "\\" + value });
          continue;
        }
        if (value === CHAR_LEFT_SQUARE_BRACKET) {
          brackets++;
          let closed = true;
          let next;
          while (index < length && (next = advance())) {
            value += next;
            if (next === CHAR_LEFT_SQUARE_BRACKET) {
              brackets++;
              continue;
            }
            if (next === CHAR_BACKSLASH) {
              value += advance();
              continue;
            }
            if (next === CHAR_RIGHT_SQUARE_BRACKET) {
              brackets--;
              if (brackets === 0) {
                break;
              }
            }
          }
          push({ type: "text", value });
          continue;
        }
        if (value === CHAR_LEFT_PARENTHESES) {
          block = push({ type: "paren", nodes: [] });
          stack.push(block);
          push({ type: "text", value });
          continue;
        }
        if (value === CHAR_RIGHT_PARENTHESES) {
          if (block.type !== "paren") {
            push({ type: "text", value });
            continue;
          }
          block = stack.pop();
          push({ type: "text", value });
          block = stack[stack.length - 1];
          continue;
        }
        if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
          let open = value;
          let next;
          if (options.keepQuotes !== true) {
            value = "";
          }
          while (index < length && (next = advance())) {
            if (next === CHAR_BACKSLASH) {
              value += next + advance();
              continue;
            }
            if (next === open) {
              if (options.keepQuotes === true) value += next;
              break;
            }
            value += next;
          }
          push({ type: "text", value });
          continue;
        }
        if (value === CHAR_LEFT_CURLY_BRACE) {
          depth++;
          let dollar = prev.value && prev.value.slice(-1) === "$" || block.dollar === true;
          let brace = {
            type: "brace",
            open: true,
            close: false,
            dollar,
            depth,
            commas: 0,
            ranges: 0,
            nodes: []
          };
          block = push(brace);
          stack.push(block);
          push({ type: "open", value });
          continue;
        }
        if (value === CHAR_RIGHT_CURLY_BRACE) {
          if (block.type !== "brace") {
            push({ type: "text", value });
            continue;
          }
          let type = "close";
          block = stack.pop();
          block.close = true;
          push({ type, value });
          depth--;
          block = stack[stack.length - 1];
          continue;
        }
        if (value === CHAR_COMMA && depth > 0) {
          if (block.ranges > 0) {
            block.ranges = 0;
            let open = block.nodes.shift();
            block.nodes = [open, { type: "text", value: stringify(block) }];
          }
          push({ type: "comma", value });
          block.commas++;
          continue;
        }
        if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
          let siblings = block.nodes;
          if (depth === 0 || siblings.length === 0) {
            push({ type: "text", value });
            continue;
          }
          if (prev.type === "dot") {
            block.range = [];
            prev.value += value;
            prev.type = "range";
            if (block.nodes.length !== 3 && block.nodes.length !== 5) {
              block.invalid = true;
              block.ranges = 0;
              prev.type = "text";
              continue;
            }
            block.ranges++;
            block.args = [];
            continue;
          }
          if (prev.type === "range") {
            siblings.pop();
            let before = siblings[siblings.length - 1];
            before.value += prev.value + value;
            prev = before;
            block.ranges--;
            continue;
          }
          push({ type: "dot", value });
          continue;
        }
        push({ type: "text", value });
      }
      do {
        block = stack.pop();
        if (block.type !== "root") {
          block.nodes.forEach((node) => {
            if (!node.nodes) {
              if (node.type === "open") node.isOpen = true;
              if (node.type === "close") node.isClose = true;
              if (!node.nodes) node.type = "text";
              node.invalid = true;
            }
          });
          let parent = stack[stack.length - 1];
          let index2 = parent.nodes.indexOf(block);
          parent.nodes.splice(index2, 1, ...block.nodes);
        }
      } while (stack.length > 0);
      push({ type: "eos" });
      return ast;
    };
    module2.exports = parse;
  }
});

// node_modules/.pnpm/braces@3.0.2/node_modules/braces/index.js
var require_braces = __commonJS({
  "node_modules/.pnpm/braces@3.0.2/node_modules/braces/index.js"(exports2, module2) {
    "use strict";
    var stringify = require_stringify();
    var compile = require_compile();
    var expand2 = require_expand();
    var parse = require_parse2();
    var braces = (input, options = {}) => {
      let output = [];
      if (Array.isArray(input)) {
        for (let pattern of input) {
          let result = braces.create(pattern, options);
          if (Array.isArray(result)) {
            output.push(...result);
          } else {
            output.push(result);
          }
        }
      } else {
        output = [].concat(braces.create(input, options));
      }
      if (options && options.expand === true && options.nodupes === true) {
        output = [...new Set(output)];
      }
      return output;
    };
    braces.parse = (input, options = {}) => parse(input, options);
    braces.stringify = (input, options = {}) => {
      if (typeof input === "string") {
        return stringify(braces.parse(input, options), options);
      }
      return stringify(input, options);
    };
    braces.compile = (input, options = {}) => {
      if (typeof input === "string") {
        input = braces.parse(input, options);
      }
      return compile(input, options);
    };
    braces.expand = (input, options = {}) => {
      if (typeof input === "string") {
        input = braces.parse(input, options);
      }
      let result = expand2(input, options);
      if (options.noempty === true) {
        result = result.filter(Boolean);
      }
      if (options.nodupes === true) {
        result = [...new Set(result)];
      }
      return result;
    };
    braces.create = (input, options = {}) => {
      if (input === "" || input.length < 3) {
        return [input];
      }
      return options.expand !== true ? braces.compile(input, options) : braces.expand(input, options);
    };
    module2.exports = braces;
  }
});

// node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/lib/constants.js
var require_constants2 = __commonJS({
  "node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/lib/constants.js"(exports2, module2) {
    "use strict";
    var path6 = require("path");
    var WIN_SLASH = "\\\\/";
    var WIN_NO_SLASH = `[^${WIN_SLASH}]`;
    var DOT_LITERAL = "\\.";
    var PLUS_LITERAL = "\\+";
    var QMARK_LITERAL = "\\?";
    var SLASH_LITERAL = "\\/";
    var ONE_CHAR = "(?=.)";
    var QMARK = "[^/]";
    var END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
    var START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
    var DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
    var NO_DOT = `(?!${DOT_LITERAL})`;
    var NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
    var NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
    var NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
    var QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
    var STAR = `${QMARK}*?`;
    var POSIX_CHARS = {
      DOT_LITERAL,
      PLUS_LITERAL,
      QMARK_LITERAL,
      SLASH_LITERAL,
      ONE_CHAR,
      QMARK,
      END_ANCHOR,
      DOTS_SLASH,
      NO_DOT,
      NO_DOTS,
      NO_DOT_SLASH,
      NO_DOTS_SLASH,
      QMARK_NO_DOT,
      STAR,
      START_ANCHOR
    };
    var WINDOWS_CHARS = {
      ...POSIX_CHARS,
      SLASH_LITERAL: `[${WIN_SLASH}]`,
      QMARK: WIN_NO_SLASH,
      STAR: `${WIN_NO_SLASH}*?`,
      DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
      NO_DOT: `(?!${DOT_LITERAL})`,
      NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
      NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
      START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
      END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
    };
    var POSIX_REGEX_SOURCE = {
      alnum: "a-zA-Z0-9",
      alpha: "a-zA-Z",
      ascii: "\\x00-\\x7F",
      blank: " \\t",
      cntrl: "\\x00-\\x1F\\x7F",
      digit: "0-9",
      graph: "\\x21-\\x7E",
      lower: "a-z",
      print: "\\x20-\\x7E ",
      punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
      space: " \\t\\r\\n\\v\\f",
      upper: "A-Z",
      word: "A-Za-z0-9_",
      xdigit: "A-Fa-f0-9"
    };
    module2.exports = {
      MAX_LENGTH: 1024 * 64,
      POSIX_REGEX_SOURCE,
      // regular expressions
      REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
      REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
      REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
      REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
      REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
      REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
      // Replace globs with equivalent patterns to reduce parsing time.
      REPLACEMENTS: {
        "***": "*",
        "**/**": "**",
        "**/**/**": "**"
      },
      // Digits
      CHAR_0: 48,
      /* 0 */
      CHAR_9: 57,
      /* 9 */
      // Alphabet chars.
      CHAR_UPPERCASE_A: 65,
      /* A */
      CHAR_LOWERCASE_A: 97,
      /* a */
      CHAR_UPPERCASE_Z: 90,
      /* Z */
      CHAR_LOWERCASE_Z: 122,
      /* z */
      CHAR_LEFT_PARENTHESES: 40,
      /* ( */
      CHAR_RIGHT_PARENTHESES: 41,
      /* ) */
      CHAR_ASTERISK: 42,
      /* * */
      // Non-alphabetic chars.
      CHAR_AMPERSAND: 38,
      /* & */
      CHAR_AT: 64,
      /* @ */
      CHAR_BACKWARD_SLASH: 92,
      /* \ */
      CHAR_CARRIAGE_RETURN: 13,
      /* \r */
      CHAR_CIRCUMFLEX_ACCENT: 94,
      /* ^ */
      CHAR_COLON: 58,
      /* : */
      CHAR_COMMA: 44,
      /* , */
      CHAR_DOT: 46,
      /* . */
      CHAR_DOUBLE_QUOTE: 34,
      /* " */
      CHAR_EQUAL: 61,
      /* = */
      CHAR_EXCLAMATION_MARK: 33,
      /* ! */
      CHAR_FORM_FEED: 12,
      /* \f */
      CHAR_FORWARD_SLASH: 47,
      /* / */
      CHAR_GRAVE_ACCENT: 96,
      /* ` */
      CHAR_HASH: 35,
      /* # */
      CHAR_HYPHEN_MINUS: 45,
      /* - */
      CHAR_LEFT_ANGLE_BRACKET: 60,
      /* < */
      CHAR_LEFT_CURLY_BRACE: 123,
      /* { */
      CHAR_LEFT_SQUARE_BRACKET: 91,
      /* [ */
      CHAR_LINE_FEED: 10,
      /* \n */
      CHAR_NO_BREAK_SPACE: 160,
      /* \u00A0 */
      CHAR_PERCENT: 37,
      /* % */
      CHAR_PLUS: 43,
      /* + */
      CHAR_QUESTION_MARK: 63,
      /* ? */
      CHAR_RIGHT_ANGLE_BRACKET: 62,
      /* > */
      CHAR_RIGHT_CURLY_BRACE: 125,
      /* } */
      CHAR_RIGHT_SQUARE_BRACKET: 93,
      /* ] */
      CHAR_SEMICOLON: 59,
      /* ; */
      CHAR_SINGLE_QUOTE: 39,
      /* ' */
      CHAR_SPACE: 32,
      /*   */
      CHAR_TAB: 9,
      /* \t */
      CHAR_UNDERSCORE: 95,
      /* _ */
      CHAR_VERTICAL_LINE: 124,
      /* | */
      CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
      /* \uFEFF */
      SEP: path6.sep,
      /**
       * Create EXTGLOB_CHARS
       */
      extglobChars(chars) {
        return {
          "!": { type: "negate", open: "(?:(?!(?:", close: `))${chars.STAR})` },
          "?": { type: "qmark", open: "(?:", close: ")?" },
          "+": { type: "plus", open: "(?:", close: ")+" },
          "*": { type: "star", open: "(?:", close: ")*" },
          "@": { type: "at", open: "(?:", close: ")" }
        };
      },
      /**
       * Create GLOB_CHARS
       */
      globChars(win322) {
        return win322 === true ? WINDOWS_CHARS : POSIX_CHARS;
      }
    };
  }
});

// node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/lib/utils.js
var require_utils2 = __commonJS({
  "node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/lib/utils.js"(exports2) {
    "use strict";
    var path6 = require("path");
    var win322 = process.platform === "win32";
    var {
      REGEX_BACKSLASH,
      REGEX_REMOVE_BACKSLASH,
      REGEX_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_GLOBAL
    } = require_constants2();
    exports2.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
    exports2.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
    exports2.isRegexChar = (str) => str.length === 1 && exports2.hasRegexChars(str);
    exports2.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
    exports2.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
    exports2.removeBackslashes = (str) => {
      return str.replace(REGEX_REMOVE_BACKSLASH, (match2) => {
        return match2 === "\\" ? "" : match2;
      });
    };
    exports2.supportsLookbehinds = () => {
      const segs = process.version.slice(1).split(".").map(Number);
      if (segs.length === 3 && segs[0] >= 9 || segs[0] === 8 && segs[1] >= 10) {
        return true;
      }
      return false;
    };
    exports2.isWindows = (options) => {
      if (options && typeof options.windows === "boolean") {
        return options.windows;
      }
      return win322 === true || path6.sep === "\\";
    };
    exports2.escapeLast = (input, char, lastIdx) => {
      const idx = input.lastIndexOf(char, lastIdx);
      if (idx === -1) return input;
      if (input[idx - 1] === "\\") return exports2.escapeLast(input, char, idx - 1);
      return `${input.slice(0, idx)}\\${input.slice(idx)}`;
    };
    exports2.removePrefix = (input, state = {}) => {
      let output = input;
      if (output.startsWith("./")) {
        output = output.slice(2);
        state.prefix = "./";
      }
      return output;
    };
    exports2.wrapOutput = (input, state = {}, options = {}) => {
      const prepend = options.contains ? "" : "^";
      const append = options.contains ? "" : "$";
      let output = `${prepend}(?:${input})${append}`;
      if (state.negated === true) {
        output = `(?:^(?!${output}).*$)`;
      }
      return output;
    };
  }
});

// node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/lib/scan.js
var require_scan = __commonJS({
  "node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/lib/scan.js"(exports2, module2) {
    "use strict";
    var utils = require_utils2();
    var {
      CHAR_ASTERISK,
      /* * */
      CHAR_AT,
      /* @ */
      CHAR_BACKWARD_SLASH,
      /* \ */
      CHAR_COMMA,
      /* , */
      CHAR_DOT,
      /* . */
      CHAR_EXCLAMATION_MARK,
      /* ! */
      CHAR_FORWARD_SLASH,
      /* / */
      CHAR_LEFT_CURLY_BRACE,
      /* { */
      CHAR_LEFT_PARENTHESES,
      /* ( */
      CHAR_LEFT_SQUARE_BRACKET,
      /* [ */
      CHAR_PLUS,
      /* + */
      CHAR_QUESTION_MARK,
      /* ? */
      CHAR_RIGHT_CURLY_BRACE,
      /* } */
      CHAR_RIGHT_PARENTHESES,
      /* ) */
      CHAR_RIGHT_SQUARE_BRACKET
      /* ] */
    } = require_constants2();
    var isPathSeparator = (code) => {
      return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
    };
    var depth = (token) => {
      if (token.isPrefix !== true) {
        token.depth = token.isGlobstar ? Infinity : 1;
      }
    };
    var scan = (input, options) => {
      const opts = options || {};
      const length = input.length - 1;
      const scanToEnd = opts.parts === true || opts.scanToEnd === true;
      const slashes = [];
      const tokens = [];
      const parts = [];
      let str = input;
      let index = -1;
      let start = 0;
      let lastIndex = 0;
      let isBrace = false;
      let isBracket = false;
      let isGlob = false;
      let isExtglob = false;
      let isGlobstar = false;
      let braceEscaped = false;
      let backslashes = false;
      let negated = false;
      let negatedExtglob = false;
      let finished = false;
      let braces = 0;
      let prev;
      let code;
      let token = { value: "", depth: 0, isGlob: false };
      const eos = () => index >= length;
      const peek = () => str.charCodeAt(index + 1);
      const advance = () => {
        prev = code;
        return str.charCodeAt(++index);
      };
      while (index < length) {
        code = advance();
        let next;
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          code = advance();
          if (code === CHAR_LEFT_CURLY_BRACE) {
            braceEscaped = true;
          }
          continue;
        }
        if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (code === CHAR_LEFT_CURLY_BRACE) {
              braces++;
              continue;
            }
            if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;
              if (scanToEnd === true) {
                continue;
              }
              break;
            }
            if (braceEscaped !== true && code === CHAR_COMMA) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;
              if (scanToEnd === true) {
                continue;
              }
              break;
            }
            if (code === CHAR_RIGHT_CURLY_BRACE) {
              braces--;
              if (braces === 0) {
                braceEscaped = false;
                isBrace = token.isBrace = true;
                finished = true;
                break;
              }
            }
          }
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_FORWARD_SLASH) {
          slashes.push(index);
          tokens.push(token);
          token = { value: "", depth: 0, isGlob: false };
          if (finished === true) continue;
          if (prev === CHAR_DOT && index === start + 1) {
            start += 2;
            continue;
          }
          lastIndex = index + 1;
          continue;
        }
        if (opts.noext !== true) {
          const isExtglobChar = code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK;
          if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
            isGlob = token.isGlob = true;
            isExtglob = token.isExtglob = true;
            finished = true;
            if (code === CHAR_EXCLAMATION_MARK && index === start) {
              negatedExtglob = true;
            }
            if (scanToEnd === true) {
              while (eos() !== true && (code = advance())) {
                if (code === CHAR_BACKWARD_SLASH) {
                  backslashes = token.backslashes = true;
                  code = advance();
                  continue;
                }
                if (code === CHAR_RIGHT_PARENTHESES) {
                  isGlob = token.isGlob = true;
                  finished = true;
                  break;
                }
              }
              continue;
            }
            break;
          }
        }
        if (code === CHAR_ASTERISK) {
          if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
          isGlob = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_QUESTION_MARK) {
          isGlob = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_LEFT_SQUARE_BRACKET) {
          while (eos() !== true && (next = advance())) {
            if (next === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (next === CHAR_RIGHT_SQUARE_BRACKET) {
              isBracket = token.isBracket = true;
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
          negated = token.negated = true;
          start++;
          continue;
        }
        if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
          isGlob = token.isGlob = true;
          if (scanToEnd === true) {
            while (eos() !== true && (code = advance())) {
              if (code === CHAR_LEFT_PARENTHESES) {
                backslashes = token.backslashes = true;
                code = advance();
                continue;
              }
              if (code === CHAR_RIGHT_PARENTHESES) {
                finished = true;
                break;
              }
            }
            continue;
          }
          break;
        }
        if (isGlob === true) {
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
      }
      if (opts.noext === true) {
        isExtglob = false;
        isGlob = false;
      }
      let base = str;
      let prefix2 = "";
      let glob2 = "";
      if (start > 0) {
        prefix2 = str.slice(0, start);
        str = str.slice(start);
        lastIndex -= start;
      }
      if (base && isGlob === true && lastIndex > 0) {
        base = str.slice(0, lastIndex);
        glob2 = str.slice(lastIndex);
      } else if (isGlob === true) {
        base = "";
        glob2 = str;
      } else {
        base = str;
      }
      if (base && base !== "" && base !== "/" && base !== str) {
        if (isPathSeparator(base.charCodeAt(base.length - 1))) {
          base = base.slice(0, -1);
        }
      }
      if (opts.unescape === true) {
        if (glob2) glob2 = utils.removeBackslashes(glob2);
        if (base && backslashes === true) {
          base = utils.removeBackslashes(base);
        }
      }
      const state = {
        prefix: prefix2,
        input,
        start,
        base,
        glob: glob2,
        isBrace,
        isBracket,
        isGlob,
        isExtglob,
        isGlobstar,
        negated,
        negatedExtglob
      };
      if (opts.tokens === true) {
        state.maxDepth = 0;
        if (!isPathSeparator(code)) {
          tokens.push(token);
        }
        state.tokens = tokens;
      }
      if (opts.parts === true || opts.tokens === true) {
        let prevIndex;
        for (let idx = 0; idx < slashes.length; idx++) {
          const n = prevIndex ? prevIndex + 1 : start;
          const i = slashes[idx];
          const value = input.slice(n, i);
          if (opts.tokens) {
            if (idx === 0 && start !== 0) {
              tokens[idx].isPrefix = true;
              tokens[idx].value = prefix2;
            } else {
              tokens[idx].value = value;
            }
            depth(tokens[idx]);
            state.maxDepth += tokens[idx].depth;
          }
          if (idx !== 0 || value !== "") {
            parts.push(value);
          }
          prevIndex = i;
        }
        if (prevIndex && prevIndex + 1 < input.length) {
          const value = input.slice(prevIndex + 1);
          parts.push(value);
          if (opts.tokens) {
            tokens[tokens.length - 1].value = value;
            depth(tokens[tokens.length - 1]);
            state.maxDepth += tokens[tokens.length - 1].depth;
          }
        }
        state.slashes = slashes;
        state.parts = parts;
      }
      return state;
    };
    module2.exports = scan;
  }
});

// node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/lib/parse.js
var require_parse3 = __commonJS({
  "node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/lib/parse.js"(exports2, module2) {
    "use strict";
    var constants = require_constants2();
    var utils = require_utils2();
    var {
      MAX_LENGTH,
      POSIX_REGEX_SOURCE,
      REGEX_NON_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_BACKREF,
      REPLACEMENTS
    } = constants;
    var expandRange = (args, options) => {
      if (typeof options.expandRange === "function") {
        return options.expandRange(...args, options);
      }
      args.sort();
      const value = `[${args.join("-")}]`;
      try {
        new RegExp(value);
      } catch (ex) {
        return args.map((v) => utils.escapeRegex(v)).join("..");
      }
      return value;
    };
    var syntaxError = (type, char) => {
      return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
    };
    var parse = (input, options) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected a string");
      }
      input = REPLACEMENTS[input] || input;
      const opts = { ...options };
      const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      let len = input.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }
      const bos = { type: "bos", value: "", output: opts.prepend || "" };
      const tokens = [bos];
      const capture = opts.capture ? "" : "?:";
      const win322 = utils.isWindows(options);
      const PLATFORM_CHARS = constants.globChars(win322);
      const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);
      const {
        DOT_LITERAL,
        PLUS_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOT_SLASH,
        NO_DOTS_SLASH,
        QMARK,
        QMARK_NO_DOT,
        STAR,
        START_ANCHOR
      } = PLATFORM_CHARS;
      const globstar = (opts2) => {
        return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };
      const nodot = opts.dot ? "" : NO_DOT;
      const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
      let star3 = opts.bash === true ? globstar(opts) : STAR;
      if (opts.capture) {
        star3 = `(${star3})`;
      }
      if (typeof opts.noext === "boolean") {
        opts.noextglob = opts.noext;
      }
      const state = {
        input,
        index: -1,
        start: 0,
        dot: opts.dot === true,
        consumed: "",
        output: "",
        prefix: "",
        backtrack: false,
        negated: false,
        brackets: 0,
        braces: 0,
        parens: 0,
        quotes: 0,
        globstar: false,
        tokens
      };
      input = utils.removePrefix(input, state);
      len = input.length;
      const extglobs = [];
      const braces = [];
      const stack = [];
      let prev = bos;
      let value;
      const eos = () => state.index === len - 1;
      const peek = state.peek = (n = 1) => input[state.index + n];
      const advance = state.advance = () => input[++state.index] || "";
      const remaining = () => input.slice(state.index + 1);
      const consume = (value2 = "", num = 0) => {
        state.consumed += value2;
        state.index += num;
      };
      const append = (token) => {
        state.output += token.output != null ? token.output : token.value;
        consume(token.value);
      };
      const negate = () => {
        let count = 1;
        while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
          advance();
          state.start++;
          count++;
        }
        if (count % 2 === 0) {
          return false;
        }
        state.negated = true;
        state.start++;
        return true;
      };
      const increment = (type) => {
        state[type]++;
        stack.push(type);
      };
      const decrement = (type) => {
        state[type]--;
        stack.pop();
      };
      const push = (tok) => {
        if (prev.type === "globstar") {
          const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
          const isExtglob = tok.extglob === true || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
          if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob) {
            state.output = state.output.slice(0, -prev.output.length);
            prev.type = "star";
            prev.value = "*";
            prev.output = star3;
            state.output += prev.output;
          }
        }
        if (extglobs.length && tok.type !== "paren") {
          extglobs[extglobs.length - 1].inner += tok.value;
        }
        if (tok.value || tok.output) append(tok);
        if (prev && prev.type === "text" && tok.type === "text") {
          prev.value += tok.value;
          prev.output = (prev.output || "") + tok.value;
          return;
        }
        tok.prev = prev;
        tokens.push(tok);
        prev = tok;
      };
      const extglobOpen = (type, value2) => {
        const token = { ...EXTGLOB_CHARS[value2], conditions: 1, inner: "" };
        token.prev = prev;
        token.parens = state.parens;
        token.output = state.output;
        const output = (opts.capture ? "(" : "") + token.open;
        increment("parens");
        push({ type, value: value2, output: state.output ? "" : ONE_CHAR });
        push({ type: "paren", extglob: true, value: advance(), output });
        extglobs.push(token);
      };
      const extglobClose = (token) => {
        let output = token.close + (opts.capture ? ")" : "");
        let rest;
        if (token.type === "negate") {
          let extglobStar = star3;
          if (token.inner && token.inner.length > 1 && token.inner.includes("/")) {
            extglobStar = globstar(opts);
          }
          if (extglobStar !== star3 || eos() || /^\)+$/.test(remaining())) {
            output = token.close = `)$))${extglobStar}`;
          }
          if (token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
            const expression = parse(rest, { ...options, fastpaths: false }).output;
            output = token.close = `)${expression})${extglobStar})`;
          }
          if (token.prev.type === "bos") {
            state.negatedExtglob = true;
          }
        }
        push({ type: "paren", extglob: true, value, output });
        decrement("parens");
      };
      if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
        let backslashes = false;
        let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
          if (first === "\\") {
            backslashes = true;
            return m;
          }
          if (first === "?") {
            if (esc) {
              return esc + first + (rest ? QMARK.repeat(rest.length) : "");
            }
            if (index === 0) {
              return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "");
            }
            return QMARK.repeat(chars.length);
          }
          if (first === ".") {
            return DOT_LITERAL.repeat(chars.length);
          }
          if (first === "*") {
            if (esc) {
              return esc + first + (rest ? star3 : "");
            }
            return star3;
          }
          return esc ? m : `\\${m}`;
        });
        if (backslashes === true) {
          if (opts.unescape === true) {
            output = output.replace(/\\/g, "");
          } else {
            output = output.replace(/\\+/g, (m) => {
              return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
            });
          }
        }
        if (output === input && opts.contains === true) {
          state.output = input;
          return state;
        }
        state.output = utils.wrapOutput(output, state, options);
        return state;
      }
      while (!eos()) {
        value = advance();
        if (value === "\0") {
          continue;
        }
        if (value === "\\") {
          const next = peek();
          if (next === "/" && opts.bash !== true) {
            continue;
          }
          if (next === "." || next === ";") {
            continue;
          }
          if (!next) {
            value += "\\";
            push({ type: "text", value });
            continue;
          }
          const match2 = /^\\+/.exec(remaining());
          let slashes = 0;
          if (match2 && match2[0].length > 2) {
            slashes = match2[0].length;
            state.index += slashes;
            if (slashes % 2 !== 0) {
              value += "\\";
            }
          }
          if (opts.unescape === true) {
            value = advance();
          } else {
            value += advance();
          }
          if (state.brackets === 0) {
            push({ type: "text", value });
            continue;
          }
        }
        if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
          if (opts.posix !== false && value === ":") {
            const inner = prev.value.slice(1);
            if (inner.includes("[")) {
              prev.posix = true;
              if (inner.includes(":")) {
                const idx = prev.value.lastIndexOf("[");
                const pre = prev.value.slice(0, idx);
                const rest2 = prev.value.slice(idx + 2);
                const posix2 = POSIX_REGEX_SOURCE[rest2];
                if (posix2) {
                  prev.value = pre + posix2;
                  state.backtrack = true;
                  advance();
                  if (!bos.output && tokens.indexOf(prev) === 1) {
                    bos.output = ONE_CHAR;
                  }
                  continue;
                }
              }
            }
          }
          if (value === "[" && peek() !== ":" || value === "-" && peek() === "]") {
            value = `\\${value}`;
          }
          if (value === "]" && (prev.value === "[" || prev.value === "[^")) {
            value = `\\${value}`;
          }
          if (opts.posix === true && value === "!" && prev.value === "[") {
            value = "^";
          }
          prev.value += value;
          append({ value });
          continue;
        }
        if (state.quotes === 1 && value !== '"') {
          value = utils.escapeRegex(value);
          prev.value += value;
          append({ value });
          continue;
        }
        if (value === '"') {
          state.quotes = state.quotes === 1 ? 0 : 1;
          if (opts.keepQuotes === true) {
            push({ type: "text", value });
          }
          continue;
        }
        if (value === "(") {
          increment("parens");
          push({ type: "paren", value });
          continue;
        }
        if (value === ")") {
          if (state.parens === 0 && opts.strictBrackets === true) {
            throw new SyntaxError(syntaxError("opening", "("));
          }
          const extglob = extglobs[extglobs.length - 1];
          if (extglob && state.parens === extglob.parens + 1) {
            extglobClose(extglobs.pop());
            continue;
          }
          push({ type: "paren", value, output: state.parens ? ")" : "\\)" });
          decrement("parens");
          continue;
        }
        if (value === "[") {
          if (opts.nobracket === true || !remaining().includes("]")) {
            if (opts.nobracket !== true && opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError("closing", "]"));
            }
            value = `\\${value}`;
          } else {
            increment("brackets");
          }
          push({ type: "bracket", value });
          continue;
        }
        if (value === "]") {
          if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
            push({ type: "text", value, output: `\\${value}` });
            continue;
          }
          if (state.brackets === 0) {
            if (opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError("opening", "["));
            }
            push({ type: "text", value, output: `\\${value}` });
            continue;
          }
          decrement("brackets");
          const prevValue = prev.value.slice(1);
          if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) {
            value = `/${value}`;
          }
          prev.value += value;
          append({ value });
          if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
            continue;
          }
          const escaped = utils.escapeRegex(prev.value);
          state.output = state.output.slice(0, -prev.value.length);
          if (opts.literalBrackets === true) {
            state.output += escaped;
            prev.value = escaped;
            continue;
          }
          prev.value = `(${capture}${escaped}|${prev.value})`;
          state.output += prev.value;
          continue;
        }
        if (value === "{" && opts.nobrace !== true) {
          increment("braces");
          const open = {
            type: "brace",
            value,
            output: "(",
            outputIndex: state.output.length,
            tokensIndex: state.tokens.length
          };
          braces.push(open);
          push(open);
          continue;
        }
        if (value === "}") {
          const brace = braces[braces.length - 1];
          if (opts.nobrace === true || !brace) {
            push({ type: "text", value, output: value });
            continue;
          }
          let output = ")";
          if (brace.dots === true) {
            const arr = tokens.slice();
            const range2 = [];
            for (let i = arr.length - 1; i >= 0; i--) {
              tokens.pop();
              if (arr[i].type === "brace") {
                break;
              }
              if (arr[i].type !== "dots") {
                range2.unshift(arr[i].value);
              }
            }
            output = expandRange(range2, opts);
            state.backtrack = true;
          }
          if (brace.comma !== true && brace.dots !== true) {
            const out = state.output.slice(0, brace.outputIndex);
            const toks = state.tokens.slice(brace.tokensIndex);
            brace.value = brace.output = "\\{";
            value = output = "\\}";
            state.output = out;
            for (const t of toks) {
              state.output += t.output || t.value;
            }
          }
          push({ type: "brace", value, output });
          decrement("braces");
          braces.pop();
          continue;
        }
        if (value === "|") {
          if (extglobs.length > 0) {
            extglobs[extglobs.length - 1].conditions++;
          }
          push({ type: "text", value });
          continue;
        }
        if (value === ",") {
          let output = value;
          const brace = braces[braces.length - 1];
          if (brace && stack[stack.length - 1] === "braces") {
            brace.comma = true;
            output = "|";
          }
          push({ type: "comma", value, output });
          continue;
        }
        if (value === "/") {
          if (prev.type === "dot" && state.index === state.start + 1) {
            state.start = state.index + 1;
            state.consumed = "";
            state.output = "";
            tokens.pop();
            prev = bos;
            continue;
          }
          push({ type: "slash", value, output: SLASH_LITERAL });
          continue;
        }
        if (value === ".") {
          if (state.braces > 0 && prev.type === "dot") {
            if (prev.value === ".") prev.output = DOT_LITERAL;
            const brace = braces[braces.length - 1];
            prev.type = "dots";
            prev.output += value;
            prev.value += value;
            brace.dots = true;
            continue;
          }
          if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
            push({ type: "text", value, output: DOT_LITERAL });
            continue;
          }
          push({ type: "dot", value, output: DOT_LITERAL });
          continue;
        }
        if (value === "?") {
          const isGroup = prev && prev.value === "(";
          if (!isGroup && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            extglobOpen("qmark", value);
            continue;
          }
          if (prev && prev.type === "paren") {
            const next = peek();
            let output = value;
            if (next === "<" && !utils.supportsLookbehinds()) {
              throw new Error("Node.js v10 or higher is required for regex lookbehinds");
            }
            if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) {
              output = `\\${value}`;
            }
            push({ type: "text", value, output });
            continue;
          }
          if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
            push({ type: "qmark", value, output: QMARK_NO_DOT });
            continue;
          }
          push({ type: "qmark", value, output: QMARK });
          continue;
        }
        if (value === "!") {
          if (opts.noextglob !== true && peek() === "(") {
            if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
              extglobOpen("negate", value);
              continue;
            }
          }
          if (opts.nonegate !== true && state.index === 0) {
            negate();
            continue;
          }
        }
        if (value === "+") {
          if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            extglobOpen("plus", value);
            continue;
          }
          if (prev && prev.value === "(" || opts.regex === false) {
            push({ type: "plus", value, output: PLUS_LITERAL });
            continue;
          }
          if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state.parens > 0) {
            push({ type: "plus", value });
            continue;
          }
          push({ type: "plus", value: PLUS_LITERAL });
          continue;
        }
        if (value === "@") {
          if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            push({ type: "at", extglob: true, value, output: "" });
            continue;
          }
          push({ type: "text", value });
          continue;
        }
        if (value !== "*") {
          if (value === "$" || value === "^") {
            value = `\\${value}`;
          }
          const match2 = REGEX_NON_SPECIAL_CHARS.exec(remaining());
          if (match2) {
            value += match2[0];
            state.index += match2[0].length;
          }
          push({ type: "text", value });
          continue;
        }
        if (prev && (prev.type === "globstar" || prev.star === true)) {
          prev.type = "star";
          prev.star = true;
          prev.value += value;
          prev.output = star3;
          state.backtrack = true;
          state.globstar = true;
          consume(value);
          continue;
        }
        let rest = remaining();
        if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
          extglobOpen("star", value);
          continue;
        }
        if (prev.type === "star") {
          if (opts.noglobstar === true) {
            consume(value);
            continue;
          }
          const prior = prev.prev;
          const before = prior.prev;
          const isStart = prior.type === "slash" || prior.type === "bos";
          const afterStar = before && (before.type === "star" || before.type === "globstar");
          if (opts.bash === true && (!isStart || rest[0] && rest[0] !== "/")) {
            push({ type: "star", value, output: "" });
            continue;
          }
          const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
          const isExtglob = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
          if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
            push({ type: "star", value, output: "" });
            continue;
          }
          while (rest.slice(0, 3) === "/**") {
            const after = input[state.index + 4];
            if (after && after !== "/") {
              break;
            }
            rest = rest.slice(3);
            consume("/**", 3);
          }
          if (prior.type === "bos" && eos()) {
            prev.type = "globstar";
            prev.value += value;
            prev.output = globstar(opts);
            state.output = prev.output;
            state.globstar = true;
            consume(value);
            continue;
          }
          if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && eos()) {
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;
            prev.type = "globstar";
            prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
            prev.value += value;
            state.globstar = true;
            state.output += prior.output + prev.output;
            consume(value);
            continue;
          }
          if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
            const end = rest[1] !== void 0 ? "|$" : "";
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;
            prev.type = "globstar";
            prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
            prev.value += value;
            state.output += prior.output + prev.output;
            state.globstar = true;
            consume(value + advance());
            push({ type: "slash", value: "/", output: "" });
            continue;
          }
          if (prior.type === "bos" && rest[0] === "/") {
            prev.type = "globstar";
            prev.value += value;
            prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
            state.output = prev.output;
            state.globstar = true;
            consume(value + advance());
            push({ type: "slash", value: "/", output: "" });
            continue;
          }
          state.output = state.output.slice(0, -prev.output.length);
          prev.type = "globstar";
          prev.output = globstar(opts);
          prev.value += value;
          state.output += prev.output;
          state.globstar = true;
          consume(value);
          continue;
        }
        const token = { type: "star", value, output: star3 };
        if (opts.bash === true) {
          token.output = ".*?";
          if (prev.type === "bos" || prev.type === "slash") {
            token.output = nodot + token.output;
          }
          push(token);
          continue;
        }
        if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
          token.output = value;
          push(token);
          continue;
        }
        if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
          if (prev.type === "dot") {
            state.output += NO_DOT_SLASH;
            prev.output += NO_DOT_SLASH;
          } else if (opts.dot === true) {
            state.output += NO_DOTS_SLASH;
            prev.output += NO_DOTS_SLASH;
          } else {
            state.output += nodot;
            prev.output += nodot;
          }
          if (peek() !== "*") {
            state.output += ONE_CHAR;
            prev.output += ONE_CHAR;
          }
        }
        push(token);
      }
      while (state.brackets > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
        state.output = utils.escapeLast(state.output, "[");
        decrement("brackets");
      }
      while (state.parens > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", ")"));
        state.output = utils.escapeLast(state.output, "(");
        decrement("parens");
      }
      while (state.braces > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "}"));
        state.output = utils.escapeLast(state.output, "{");
        decrement("braces");
      }
      if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) {
        push({ type: "maybe_slash", value: "", output: `${SLASH_LITERAL}?` });
      }
      if (state.backtrack === true) {
        state.output = "";
        for (const token of state.tokens) {
          state.output += token.output != null ? token.output : token.value;
          if (token.suffix) {
            state.output += token.suffix;
          }
        }
      }
      return state;
    };
    parse.fastpaths = (input, options) => {
      const opts = { ...options };
      const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      const len = input.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }
      input = REPLACEMENTS[input] || input;
      const win322 = utils.isWindows(options);
      const {
        DOT_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOTS,
        NO_DOTS_SLASH,
        STAR,
        START_ANCHOR
      } = constants.globChars(win322);
      const nodot = opts.dot ? NO_DOTS : NO_DOT;
      const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
      const capture = opts.capture ? "" : "?:";
      const state = { negated: false, prefix: "" };
      let star3 = opts.bash === true ? ".*?" : STAR;
      if (opts.capture) {
        star3 = `(${star3})`;
      }
      const globstar = (opts2) => {
        if (opts2.noglobstar === true) return star3;
        return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };
      const create = (str) => {
        switch (str) {
          case "*":
            return `${nodot}${ONE_CHAR}${star3}`;
          case ".*":
            return `${DOT_LITERAL}${ONE_CHAR}${star3}`;
          case "*.*":
            return `${nodot}${star3}${DOT_LITERAL}${ONE_CHAR}${star3}`;
          case "*/*":
            return `${nodot}${star3}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star3}`;
          case "**":
            return nodot + globstar(opts);
          case "**/*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star3}`;
          case "**/*.*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star3}${DOT_LITERAL}${ONE_CHAR}${star3}`;
          case "**/.*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star3}`;
          default: {
            const match2 = /^(.*?)\.(\w+)$/.exec(str);
            if (!match2) return;
            const source2 = create(match2[1]);
            if (!source2) return;
            return source2 + DOT_LITERAL + match2[2];
          }
        }
      };
      const output = utils.removePrefix(input, state);
      let source = create(output);
      if (source && opts.strictSlashes !== true) {
        source += `${SLASH_LITERAL}?`;
      }
      return source;
    };
    module2.exports = parse;
  }
});

// node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/lib/picomatch.js
var require_picomatch = __commonJS({
  "node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/lib/picomatch.js"(exports2, module2) {
    "use strict";
    var path6 = require("path");
    var scan = require_scan();
    var parse = require_parse3();
    var utils = require_utils2();
    var constants = require_constants2();
    var isObject = (val) => val && typeof val === "object" && !Array.isArray(val);
    var picomatch = (glob2, options, returnState = false) => {
      if (Array.isArray(glob2)) {
        const fns = glob2.map((input) => picomatch(input, options, returnState));
        const arrayMatcher = (str) => {
          for (const isMatch of fns) {
            const state2 = isMatch(str);
            if (state2) return state2;
          }
          return false;
        };
        return arrayMatcher;
      }
      const isState = isObject(glob2) && glob2.tokens && glob2.input;
      if (glob2 === "" || typeof glob2 !== "string" && !isState) {
        throw new TypeError("Expected pattern to be a non-empty string");
      }
      const opts = options || {};
      const posix2 = utils.isWindows(options);
      const regex = isState ? picomatch.compileRe(glob2, options) : picomatch.makeRe(glob2, options, false, true);
      const state = regex.state;
      delete regex.state;
      let isIgnored = () => false;
      if (opts.ignore) {
        const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
        isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
      }
      const matcher = (input, returnObject = false) => {
        const { isMatch, match: match2, output } = picomatch.test(input, regex, options, { glob: glob2, posix: posix2 });
        const result = { glob: glob2, state, regex, posix: posix2, input, output, match: match2, isMatch };
        if (typeof opts.onResult === "function") {
          opts.onResult(result);
        }
        if (isMatch === false) {
          result.isMatch = false;
          return returnObject ? result : false;
        }
        if (isIgnored(input)) {
          if (typeof opts.onIgnore === "function") {
            opts.onIgnore(result);
          }
          result.isMatch = false;
          return returnObject ? result : false;
        }
        if (typeof opts.onMatch === "function") {
          opts.onMatch(result);
        }
        return returnObject ? result : true;
      };
      if (returnState) {
        matcher.state = state;
      }
      return matcher;
    };
    picomatch.test = (input, regex, options, { glob: glob2, posix: posix2 } = {}) => {
      if (typeof input !== "string") {
        throw new TypeError("Expected input to be a string");
      }
      if (input === "") {
        return { isMatch: false, output: "" };
      }
      const opts = options || {};
      const format2 = opts.format || (posix2 ? utils.toPosixSlashes : null);
      let match2 = input === glob2;
      let output = match2 && format2 ? format2(input) : input;
      if (match2 === false) {
        output = format2 ? format2(input) : input;
        match2 = output === glob2;
      }
      if (match2 === false || opts.capture === true) {
        if (opts.matchBase === true || opts.basename === true) {
          match2 = picomatch.matchBase(input, regex, options, posix2);
        } else {
          match2 = regex.exec(output);
        }
      }
      return { isMatch: Boolean(match2), match: match2, output };
    };
    picomatch.matchBase = (input, glob2, options, posix2 = utils.isWindows(options)) => {
      const regex = glob2 instanceof RegExp ? glob2 : picomatch.makeRe(glob2, options);
      return regex.test(path6.basename(input));
    };
    picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
    picomatch.parse = (pattern, options) => {
      if (Array.isArray(pattern)) return pattern.map((p) => picomatch.parse(p, options));
      return parse(pattern, { ...options, fastpaths: false });
    };
    picomatch.scan = (input, options) => scan(input, options);
    picomatch.compileRe = (state, options, returnOutput = false, returnState = false) => {
      if (returnOutput === true) {
        return state.output;
      }
      const opts = options || {};
      const prepend = opts.contains ? "" : "^";
      const append = opts.contains ? "" : "$";
      let source = `${prepend}(?:${state.output})${append}`;
      if (state && state.negated === true) {
        source = `^(?!${source}).*$`;
      }
      const regex = picomatch.toRegex(source, options);
      if (returnState === true) {
        regex.state = state;
      }
      return regex;
    };
    picomatch.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
      if (!input || typeof input !== "string") {
        throw new TypeError("Expected a non-empty string");
      }
      let parsed = { negated: false, fastpaths: true };
      if (options.fastpaths !== false && (input[0] === "." || input[0] === "*")) {
        parsed.output = parse.fastpaths(input, options);
      }
      if (!parsed.output) {
        parsed = parse(input, options);
      }
      return picomatch.compileRe(parsed, options, returnOutput, returnState);
    };
    picomatch.toRegex = (source, options) => {
      try {
        const opts = options || {};
        return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
      } catch (err) {
        if (options && options.debug === true) throw err;
        return /$^/;
      }
    };
    picomatch.constants = constants;
    module2.exports = picomatch;
  }
});

// node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/index.js
var require_picomatch2 = __commonJS({
  "node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/index.js"(exports2, module2) {
    "use strict";
    module2.exports = require_picomatch();
  }
});

// node_modules/.pnpm/micromatch@4.0.5/node_modules/micromatch/index.js
var require_micromatch = __commonJS({
  "node_modules/.pnpm/micromatch@4.0.5/node_modules/micromatch/index.js"(exports2, module2) {
    "use strict";
    var util2 = require("util");
    var braces = require_braces();
    var picomatch = require_picomatch2();
    var utils = require_utils2();
    var isEmptyString = (val) => val === "" || val === "./";
    var micromatch2 = (list, patterns, options) => {
      patterns = [].concat(patterns);
      list = [].concat(list);
      let omit = /* @__PURE__ */ new Set();
      let keep = /* @__PURE__ */ new Set();
      let items = /* @__PURE__ */ new Set();
      let negatives = 0;
      let onResult = (state) => {
        items.add(state.output);
        if (options && options.onResult) {
          options.onResult(state);
        }
      };
      for (let i = 0; i < patterns.length; i++) {
        let isMatch = picomatch(String(patterns[i]), { ...options, onResult }, true);
        let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
        if (negated) negatives++;
        for (let item of list) {
          let matched = isMatch(item, true);
          let match2 = negated ? !matched.isMatch : matched.isMatch;
          if (!match2) continue;
          if (negated) {
            omit.add(matched.output);
          } else {
            omit.delete(matched.output);
            keep.add(matched.output);
          }
        }
      }
      let result = negatives === patterns.length ? [...items] : [...keep];
      let matches = result.filter((item) => !omit.has(item));
      if (options && matches.length === 0) {
        if (options.failglob === true) {
          throw new Error(`No matches found for "${patterns.join(", ")}"`);
        }
        if (options.nonull === true || options.nullglob === true) {
          return options.unescape ? patterns.map((p) => p.replace(/\\/g, "")) : patterns;
        }
      }
      return matches;
    };
    micromatch2.match = micromatch2;
    micromatch2.matcher = (pattern, options) => picomatch(pattern, options);
    micromatch2.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
    micromatch2.any = micromatch2.isMatch;
    micromatch2.not = (list, patterns, options = {}) => {
      patterns = [].concat(patterns).map(String);
      let result = /* @__PURE__ */ new Set();
      let items = [];
      let onResult = (state) => {
        if (options.onResult) options.onResult(state);
        items.push(state.output);
      };
      let matches = new Set(micromatch2(list, patterns, { ...options, onResult }));
      for (let item of items) {
        if (!matches.has(item)) {
          result.add(item);
        }
      }
      return [...result];
    };
    micromatch2.contains = (str, pattern, options) => {
      if (typeof str !== "string") {
        throw new TypeError(`Expected a string: "${util2.inspect(str)}"`);
      }
      if (Array.isArray(pattern)) {
        return pattern.some((p) => micromatch2.contains(str, p, options));
      }
      if (typeof pattern === "string") {
        if (isEmptyString(str) || isEmptyString(pattern)) {
          return false;
        }
        if (str.includes(pattern) || str.startsWith("./") && str.slice(2).includes(pattern)) {
          return true;
        }
      }
      return micromatch2.isMatch(str, pattern, { ...options, contains: true });
    };
    micromatch2.matchKeys = (obj, patterns, options) => {
      if (!utils.isObject(obj)) {
        throw new TypeError("Expected the first argument to be an object");
      }
      let keys = micromatch2(Object.keys(obj), patterns, options);
      let res = {};
      for (let key of keys) res[key] = obj[key];
      return res;
    };
    micromatch2.some = (list, patterns, options) => {
      let items = [].concat(list);
      for (let pattern of [].concat(patterns)) {
        let isMatch = picomatch(String(pattern), options);
        if (items.some((item) => isMatch(item))) {
          return true;
        }
      }
      return false;
    };
    micromatch2.every = (list, patterns, options) => {
      let items = [].concat(list);
      for (let pattern of [].concat(patterns)) {
        let isMatch = picomatch(String(pattern), options);
        if (!items.every((item) => isMatch(item))) {
          return false;
        }
      }
      return true;
    };
    micromatch2.all = (str, patterns, options) => {
      if (typeof str !== "string") {
        throw new TypeError(`Expected a string: "${util2.inspect(str)}"`);
      }
      return [].concat(patterns).every((p) => picomatch(p, options)(str));
    };
    micromatch2.capture = (glob2, input, options) => {
      let posix2 = utils.isWindows(options);
      let regex = picomatch.makeRe(String(glob2), { ...options, capture: true });
      let match2 = regex.exec(posix2 ? utils.toPosixSlashes(input) : input);
      if (match2) {
        return match2.slice(1).map((v) => v === void 0 ? "" : v);
      }
    };
    micromatch2.makeRe = (...args) => picomatch.makeRe(...args);
    micromatch2.scan = (...args) => picomatch.scan(...args);
    micromatch2.parse = (patterns, options) => {
      let res = [];
      for (let pattern of [].concat(patterns || [])) {
        for (let str of braces(String(pattern), options)) {
          res.push(picomatch.parse(str, options));
        }
      }
      return res;
    };
    micromatch2.braces = (pattern, options) => {
      if (typeof pattern !== "string") throw new TypeError("Expected a string");
      if (options && options.nobrace === true || !/\{.*\}/.test(pattern)) {
        return [pattern];
      }
      return braces(pattern, options);
    };
    micromatch2.braceExpand = (pattern, options) => {
      if (typeof pattern !== "string") throw new TypeError("Expected a string");
      return micromatch2.braces(pattern, { ...options, expand: true });
    };
    module2.exports = micromatch2;
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/pattern.js
var require_pattern = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/pattern.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.removeDuplicateSlashes = exports2.matchAny = exports2.convertPatternsToRe = exports2.makeRe = exports2.getPatternParts = exports2.expandBraceExpansion = exports2.expandPatternsWithBraceExpansion = exports2.isAffectDepthOfReadingPattern = exports2.endsWithSlashGlobStar = exports2.hasGlobStar = exports2.getBaseDirectory = exports2.isPatternRelatedToParentDirectory = exports2.getPatternsOutsideCurrentDirectory = exports2.getPatternsInsideCurrentDirectory = exports2.getPositivePatterns = exports2.getNegativePatterns = exports2.isPositivePattern = exports2.isNegativePattern = exports2.convertToNegativePattern = exports2.convertToPositivePattern = exports2.isDynamicPattern = exports2.isStaticPattern = void 0;
    var path6 = require("path");
    var globParent = require_glob_parent();
    var micromatch2 = require_micromatch();
    var GLOBSTAR2 = "**";
    var ESCAPE_SYMBOL = "\\";
    var COMMON_GLOB_SYMBOLS_RE = /[*?]|^!/;
    var REGEX_CHARACTER_CLASS_SYMBOLS_RE = /\[[^[]*]/;
    var REGEX_GROUP_SYMBOLS_RE = /(?:^|[^!*+?@])\([^(]*\|[^|]*\)/;
    var GLOB_EXTENSION_SYMBOLS_RE = /[!*+?@]\([^(]*\)/;
    var BRACE_EXPANSION_SEPARATORS_RE = /,|\.\./;
    var DOUBLE_SLASH_RE = /(?!^)\/{2,}/g;
    function isStaticPattern(pattern, options = {}) {
      return !isDynamicPattern(pattern, options);
    }
    exports2.isStaticPattern = isStaticPattern;
    function isDynamicPattern(pattern, options = {}) {
      if (pattern === "") {
        return false;
      }
      if (options.caseSensitiveMatch === false || pattern.includes(ESCAPE_SYMBOL)) {
        return true;
      }
      if (COMMON_GLOB_SYMBOLS_RE.test(pattern) || REGEX_CHARACTER_CLASS_SYMBOLS_RE.test(pattern) || REGEX_GROUP_SYMBOLS_RE.test(pattern)) {
        return true;
      }
      if (options.extglob !== false && GLOB_EXTENSION_SYMBOLS_RE.test(pattern)) {
        return true;
      }
      if (options.braceExpansion !== false && hasBraceExpansion(pattern)) {
        return true;
      }
      return false;
    }
    exports2.isDynamicPattern = isDynamicPattern;
    function hasBraceExpansion(pattern) {
      const openingBraceIndex = pattern.indexOf("{");
      if (openingBraceIndex === -1) {
        return false;
      }
      const closingBraceIndex = pattern.indexOf("}", openingBraceIndex + 1);
      if (closingBraceIndex === -1) {
        return false;
      }
      const braceContent = pattern.slice(openingBraceIndex, closingBraceIndex);
      return BRACE_EXPANSION_SEPARATORS_RE.test(braceContent);
    }
    function convertToPositivePattern(pattern) {
      return isNegativePattern(pattern) ? pattern.slice(1) : pattern;
    }
    exports2.convertToPositivePattern = convertToPositivePattern;
    function convertToNegativePattern(pattern) {
      return "!" + pattern;
    }
    exports2.convertToNegativePattern = convertToNegativePattern;
    function isNegativePattern(pattern) {
      return pattern.startsWith("!") && pattern[1] !== "(";
    }
    exports2.isNegativePattern = isNegativePattern;
    function isPositivePattern(pattern) {
      return !isNegativePattern(pattern);
    }
    exports2.isPositivePattern = isPositivePattern;
    function getNegativePatterns(patterns) {
      return patterns.filter(isNegativePattern);
    }
    exports2.getNegativePatterns = getNegativePatterns;
    function getPositivePatterns(patterns) {
      return patterns.filter(isPositivePattern);
    }
    exports2.getPositivePatterns = getPositivePatterns;
    function getPatternsInsideCurrentDirectory(patterns) {
      return patterns.filter((pattern) => !isPatternRelatedToParentDirectory(pattern));
    }
    exports2.getPatternsInsideCurrentDirectory = getPatternsInsideCurrentDirectory;
    function getPatternsOutsideCurrentDirectory(patterns) {
      return patterns.filter(isPatternRelatedToParentDirectory);
    }
    exports2.getPatternsOutsideCurrentDirectory = getPatternsOutsideCurrentDirectory;
    function isPatternRelatedToParentDirectory(pattern) {
      return pattern.startsWith("..") || pattern.startsWith("./..");
    }
    exports2.isPatternRelatedToParentDirectory = isPatternRelatedToParentDirectory;
    function getBaseDirectory(pattern) {
      return globParent(pattern, { flipBackslashes: false });
    }
    exports2.getBaseDirectory = getBaseDirectory;
    function hasGlobStar(pattern) {
      return pattern.includes(GLOBSTAR2);
    }
    exports2.hasGlobStar = hasGlobStar;
    function endsWithSlashGlobStar(pattern) {
      return pattern.endsWith("/" + GLOBSTAR2);
    }
    exports2.endsWithSlashGlobStar = endsWithSlashGlobStar;
    function isAffectDepthOfReadingPattern(pattern) {
      const basename = path6.basename(pattern);
      return endsWithSlashGlobStar(pattern) || isStaticPattern(basename);
    }
    exports2.isAffectDepthOfReadingPattern = isAffectDepthOfReadingPattern;
    function expandPatternsWithBraceExpansion(patterns) {
      return patterns.reduce((collection, pattern) => {
        return collection.concat(expandBraceExpansion(pattern));
      }, []);
    }
    exports2.expandPatternsWithBraceExpansion = expandPatternsWithBraceExpansion;
    function expandBraceExpansion(pattern) {
      const patterns = micromatch2.braces(pattern, { expand: true, nodupes: true, keepEscaping: true });
      patterns.sort((a, b) => a.length - b.length);
      return patterns.filter((pattern2) => pattern2 !== "");
    }
    exports2.expandBraceExpansion = expandBraceExpansion;
    function getPatternParts(pattern, options) {
      let { parts } = micromatch2.scan(pattern, Object.assign(Object.assign({}, options), { parts: true }));
      if (parts.length === 0) {
        parts = [pattern];
      }
      if (parts[0].startsWith("/")) {
        parts[0] = parts[0].slice(1);
        parts.unshift("");
      }
      return parts;
    }
    exports2.getPatternParts = getPatternParts;
    function makeRe2(pattern, options) {
      return micromatch2.makeRe(pattern, options);
    }
    exports2.makeRe = makeRe2;
    function convertPatternsToRe(patterns, options) {
      return patterns.map((pattern) => makeRe2(pattern, options));
    }
    exports2.convertPatternsToRe = convertPatternsToRe;
    function matchAny(entry, patternsRe) {
      return patternsRe.some((patternRe) => patternRe.test(entry));
    }
    exports2.matchAny = matchAny;
    function removeDuplicateSlashes(pattern) {
      return pattern.replace(DOUBLE_SLASH_RE, "/");
    }
    exports2.removeDuplicateSlashes = removeDuplicateSlashes;
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/stream.js
var require_stream = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/stream.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.merge = void 0;
    var merge2 = require_merge2();
    function merge(streams) {
      const mergedStream = merge2(streams);
      streams.forEach((stream2) => {
        stream2.once("error", (error) => mergedStream.emit("error", error));
      });
      mergedStream.once("close", () => propagateCloseEventToSources(streams));
      mergedStream.once("end", () => propagateCloseEventToSources(streams));
      return mergedStream;
    }
    exports2.merge = merge;
    function propagateCloseEventToSources(streams) {
      streams.forEach((stream2) => stream2.emit("close"));
    }
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/string.js
var require_string = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/string.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isEmpty = exports2.isString = void 0;
    function isString(input) {
      return typeof input === "string";
    }
    exports2.isString = isString;
    function isEmpty(input) {
      return input === "";
    }
    exports2.isEmpty = isEmpty;
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/index.js
var require_utils3 = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/utils/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.string = exports2.stream = exports2.pattern = exports2.path = exports2.fs = exports2.errno = exports2.array = void 0;
    var array = require_array();
    exports2.array = array;
    var errno = require_errno();
    exports2.errno = errno;
    var fs5 = require_fs3();
    exports2.fs = fs5;
    var path6 = require_path();
    exports2.path = path6;
    var pattern = require_pattern();
    exports2.pattern = pattern;
    var stream2 = require_stream();
    exports2.stream = stream2;
    var string = require_string();
    exports2.string = string;
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/managers/tasks.js
var require_tasks = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/managers/tasks.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.convertPatternGroupToTask = exports2.convertPatternGroupsToTasks = exports2.groupPatternsByBaseDirectory = exports2.getNegativePatternsAsPositive = exports2.getPositivePatterns = exports2.convertPatternsToTasks = exports2.generate = void 0;
    var utils = require_utils3();
    function generate(input, settings) {
      const patterns = processPatterns(input, settings);
      const ignore = processPatterns(settings.ignore, settings);
      const positivePatterns = getPositivePatterns(patterns);
      const negativePatterns = getNegativePatternsAsPositive(patterns, ignore);
      const staticPatterns = positivePatterns.filter((pattern) => utils.pattern.isStaticPattern(pattern, settings));
      const dynamicPatterns = positivePatterns.filter((pattern) => utils.pattern.isDynamicPattern(pattern, settings));
      const staticTasks = convertPatternsToTasks(
        staticPatterns,
        negativePatterns,
        /* dynamic */
        false
      );
      const dynamicTasks = convertPatternsToTasks(
        dynamicPatterns,
        negativePatterns,
        /* dynamic */
        true
      );
      return staticTasks.concat(dynamicTasks);
    }
    exports2.generate = generate;
    function processPatterns(input, settings) {
      let patterns = input;
      if (settings.braceExpansion) {
        patterns = utils.pattern.expandPatternsWithBraceExpansion(patterns);
      }
      if (settings.baseNameMatch) {
        patterns = patterns.map((pattern) => pattern.includes("/") ? pattern : `**/${pattern}`);
      }
      return patterns.map((pattern) => utils.pattern.removeDuplicateSlashes(pattern));
    }
    function convertPatternsToTasks(positive, negative, dynamic) {
      const tasks = [];
      const patternsOutsideCurrentDirectory = utils.pattern.getPatternsOutsideCurrentDirectory(positive);
      const patternsInsideCurrentDirectory = utils.pattern.getPatternsInsideCurrentDirectory(positive);
      const outsideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsOutsideCurrentDirectory);
      const insideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsInsideCurrentDirectory);
      tasks.push(...convertPatternGroupsToTasks(outsideCurrentDirectoryGroup, negative, dynamic));
      if ("." in insideCurrentDirectoryGroup) {
        tasks.push(convertPatternGroupToTask(".", patternsInsideCurrentDirectory, negative, dynamic));
      } else {
        tasks.push(...convertPatternGroupsToTasks(insideCurrentDirectoryGroup, negative, dynamic));
      }
      return tasks;
    }
    exports2.convertPatternsToTasks = convertPatternsToTasks;
    function getPositivePatterns(patterns) {
      return utils.pattern.getPositivePatterns(patterns);
    }
    exports2.getPositivePatterns = getPositivePatterns;
    function getNegativePatternsAsPositive(patterns, ignore) {
      const negative = utils.pattern.getNegativePatterns(patterns).concat(ignore);
      const positive = negative.map(utils.pattern.convertToPositivePattern);
      return positive;
    }
    exports2.getNegativePatternsAsPositive = getNegativePatternsAsPositive;
    function groupPatternsByBaseDirectory(patterns) {
      const group = {};
      return patterns.reduce((collection, pattern) => {
        const base = utils.pattern.getBaseDirectory(pattern);
        if (base in collection) {
          collection[base].push(pattern);
        } else {
          collection[base] = [pattern];
        }
        return collection;
      }, group);
    }
    exports2.groupPatternsByBaseDirectory = groupPatternsByBaseDirectory;
    function convertPatternGroupsToTasks(positive, negative, dynamic) {
      return Object.keys(positive).map((base) => {
        return convertPatternGroupToTask(base, positive[base], negative, dynamic);
      });
    }
    exports2.convertPatternGroupsToTasks = convertPatternGroupsToTasks;
    function convertPatternGroupToTask(base, positive, negative, dynamic) {
      return {
        dynamic,
        positive,
        negative,
        base,
        patterns: [].concat(positive, negative.map(utils.pattern.convertToNegativePattern))
      };
    }
    exports2.convertPatternGroupToTask = convertPatternGroupToTask;
  }
});

// node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/providers/async.js
var require_async = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/providers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.read = void 0;
    function read(path6, settings, callback) {
      settings.fs.lstat(path6, (lstatError, lstat3) => {
        if (lstatError !== null) {
          callFailureCallback(callback, lstatError);
          return;
        }
        if (!lstat3.isSymbolicLink() || !settings.followSymbolicLink) {
          callSuccessCallback(callback, lstat3);
          return;
        }
        settings.fs.stat(path6, (statError, stat) => {
          if (statError !== null) {
            if (settings.throwErrorOnBrokenSymbolicLink) {
              callFailureCallback(callback, statError);
              return;
            }
            callSuccessCallback(callback, lstat3);
            return;
          }
          if (settings.markSymbolicLink) {
            stat.isSymbolicLink = () => true;
          }
          callSuccessCallback(callback, stat);
        });
      });
    }
    exports2.read = read;
    function callFailureCallback(callback, error) {
      callback(error);
    }
    function callSuccessCallback(callback, result) {
      callback(null, result);
    }
  }
});

// node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/providers/sync.js
var require_sync = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/providers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.read = void 0;
    function read(path6, settings) {
      const lstat3 = settings.fs.lstatSync(path6);
      if (!lstat3.isSymbolicLink() || !settings.followSymbolicLink) {
        return lstat3;
      }
      try {
        const stat = settings.fs.statSync(path6);
        if (settings.markSymbolicLink) {
          stat.isSymbolicLink = () => true;
        }
        return stat;
      } catch (error) {
        if (!settings.throwErrorOnBrokenSymbolicLink) {
          return lstat3;
        }
        throw error;
      }
    }
    exports2.read = read;
  }
});

// node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/adapters/fs.js
var require_fs4 = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/adapters/fs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createFileSystemAdapter = exports2.FILE_SYSTEM_ADAPTER = void 0;
    var fs5 = require("fs");
    exports2.FILE_SYSTEM_ADAPTER = {
      lstat: fs5.lstat,
      stat: fs5.stat,
      lstatSync: fs5.lstatSync,
      statSync: fs5.statSync
    };
    function createFileSystemAdapter(fsMethods) {
      if (fsMethods === void 0) {
        return exports2.FILE_SYSTEM_ADAPTER;
      }
      return Object.assign(Object.assign({}, exports2.FILE_SYSTEM_ADAPTER), fsMethods);
    }
    exports2.createFileSystemAdapter = createFileSystemAdapter;
  }
});

// node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/settings.js
var require_settings = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/settings.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var fs5 = require_fs4();
    var Settings = class {
      constructor(_options = {}) {
        this._options = _options;
        this.followSymbolicLink = this._getValue(this._options.followSymbolicLink, true);
        this.fs = fs5.createFileSystemAdapter(this._options.fs);
        this.markSymbolicLink = this._getValue(this._options.markSymbolicLink, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
      }
      _getValue(option, value) {
        return option !== null && option !== void 0 ? option : value;
      }
    };
    exports2.default = Settings;
  }
});

// node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/index.js
var require_out = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.statSync = exports2.stat = exports2.Settings = void 0;
    var async = require_async();
    var sync3 = require_sync();
    var settings_1 = require_settings();
    exports2.Settings = settings_1.default;
    function stat(path6, optionsOrSettingsOrCallback, callback) {
      if (typeof optionsOrSettingsOrCallback === "function") {
        async.read(path6, getSettings(), optionsOrSettingsOrCallback);
        return;
      }
      async.read(path6, getSettings(optionsOrSettingsOrCallback), callback);
    }
    exports2.stat = stat;
    function statSync(path6, optionsOrSettings) {
      const settings = getSettings(optionsOrSettings);
      return sync3.read(path6, settings);
    }
    exports2.statSync = statSync;
    function getSettings(settingsOrOptions = {}) {
      if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
      }
      return new settings_1.default(settingsOrOptions);
    }
  }
});

// node_modules/.pnpm/queue-microtask@1.2.3/node_modules/queue-microtask/index.js
var require_queue_microtask = __commonJS({
  "node_modules/.pnpm/queue-microtask@1.2.3/node_modules/queue-microtask/index.js"(exports2, module2) {
    "use strict";
    var promise;
    module2.exports = typeof queueMicrotask === "function" ? queueMicrotask.bind(typeof window !== "undefined" ? window : global) : (cb) => (promise || (promise = Promise.resolve())).then(cb).catch((err) => setTimeout(() => {
      throw err;
    }, 0));
  }
});

// node_modules/.pnpm/run-parallel@1.2.0/node_modules/run-parallel/index.js
var require_run_parallel = __commonJS({
  "node_modules/.pnpm/run-parallel@1.2.0/node_modules/run-parallel/index.js"(exports2, module2) {
    "use strict";
    module2.exports = runParallel;
    var queueMicrotask2 = require_queue_microtask();
    function runParallel(tasks, cb) {
      let results, pending, keys;
      let isSync = true;
      if (Array.isArray(tasks)) {
        results = [];
        pending = tasks.length;
      } else {
        keys = Object.keys(tasks);
        results = {};
        pending = keys.length;
      }
      function done(err) {
        function end() {
          if (cb) cb(err, results);
          cb = null;
        }
        if (isSync) queueMicrotask2(end);
        else end();
      }
      function each(i, err, result) {
        results[i] = result;
        if (--pending === 0 || err) {
          done(err);
        }
      }
      if (!pending) {
        done(null);
      } else if (keys) {
        keys.forEach(function(key) {
          tasks[key](function(err, result) {
            each(key, err, result);
          });
        });
      } else {
        tasks.forEach(function(task, i) {
          task(function(err, result) {
            each(i, err, result);
          });
        });
      }
      isSync = false;
    }
  }
});

// node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/constants.js
var require_constants3 = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.IS_SUPPORT_READDIR_WITH_FILE_TYPES = void 0;
    var NODE_PROCESS_VERSION_PARTS = process.versions.node.split(".");
    if (NODE_PROCESS_VERSION_PARTS[0] === void 0 || NODE_PROCESS_VERSION_PARTS[1] === void 0) {
      throw new Error(`Unexpected behavior. The 'process.versions.node' variable has invalid value: ${process.versions.node}`);
    }
    var MAJOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[0], 10);
    var MINOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[1], 10);
    var SUPPORTED_MAJOR_VERSION = 10;
    var SUPPORTED_MINOR_VERSION = 10;
    var IS_MATCHED_BY_MAJOR = MAJOR_VERSION > SUPPORTED_MAJOR_VERSION;
    var IS_MATCHED_BY_MAJOR_AND_MINOR = MAJOR_VERSION === SUPPORTED_MAJOR_VERSION && MINOR_VERSION >= SUPPORTED_MINOR_VERSION;
    exports2.IS_SUPPORT_READDIR_WITH_FILE_TYPES = IS_MATCHED_BY_MAJOR || IS_MATCHED_BY_MAJOR_AND_MINOR;
  }
});

// node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/utils/fs.js
var require_fs5 = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/utils/fs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createDirentFromStats = void 0;
    var DirentFromStats = class {
      constructor(name, stats) {
        this.name = name;
        this.isBlockDevice = stats.isBlockDevice.bind(stats);
        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
        this.isDirectory = stats.isDirectory.bind(stats);
        this.isFIFO = stats.isFIFO.bind(stats);
        this.isFile = stats.isFile.bind(stats);
        this.isSocket = stats.isSocket.bind(stats);
        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
      }
    };
    function createDirentFromStats(name, stats) {
      return new DirentFromStats(name, stats);
    }
    exports2.createDirentFromStats = createDirentFromStats;
  }
});

// node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/utils/index.js
var require_utils4 = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/utils/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.fs = void 0;
    var fs5 = require_fs5();
    exports2.fs = fs5;
  }
});

// node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/providers/common.js
var require_common = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/providers/common.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.joinPathSegments = void 0;
    function joinPathSegments(a, b, separator) {
      if (a.endsWith(separator)) {
        return a + b;
      }
      return a + separator + b;
    }
    exports2.joinPathSegments = joinPathSegments;
  }
});

// node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/providers/async.js
var require_async2 = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/providers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.readdir = exports2.readdirWithFileTypes = exports2.read = void 0;
    var fsStat = require_out();
    var rpl = require_run_parallel();
    var constants_1 = require_constants3();
    var utils = require_utils4();
    var common = require_common();
    function read(directory, settings, callback) {
      if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
        readdirWithFileTypes(directory, settings, callback);
        return;
      }
      readdir2(directory, settings, callback);
    }
    exports2.read = read;
    function readdirWithFileTypes(directory, settings, callback) {
      settings.fs.readdir(directory, { withFileTypes: true }, (readdirError, dirents) => {
        if (readdirError !== null) {
          callFailureCallback(callback, readdirError);
          return;
        }
        const entries = dirents.map((dirent) => ({
          dirent,
          name: dirent.name,
          path: common.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
        }));
        if (!settings.followSymbolicLinks) {
          callSuccessCallback(callback, entries);
          return;
        }
        const tasks = entries.map((entry) => makeRplTaskEntry(entry, settings));
        rpl(tasks, (rplError, rplEntries) => {
          if (rplError !== null) {
            callFailureCallback(callback, rplError);
            return;
          }
          callSuccessCallback(callback, rplEntries);
        });
      });
    }
    exports2.readdirWithFileTypes = readdirWithFileTypes;
    function makeRplTaskEntry(entry, settings) {
      return (done) => {
        if (!entry.dirent.isSymbolicLink()) {
          done(null, entry);
          return;
        }
        settings.fs.stat(entry.path, (statError, stats) => {
          if (statError !== null) {
            if (settings.throwErrorOnBrokenSymbolicLink) {
              done(statError);
              return;
            }
            done(null, entry);
            return;
          }
          entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
          done(null, entry);
        });
      };
    }
    function readdir2(directory, settings, callback) {
      settings.fs.readdir(directory, (readdirError, names) => {
        if (readdirError !== null) {
          callFailureCallback(callback, readdirError);
          return;
        }
        const tasks = names.map((name) => {
          const path6 = common.joinPathSegments(directory, name, settings.pathSegmentSeparator);
          return (done) => {
            fsStat.stat(path6, settings.fsStatSettings, (error, stats) => {
              if (error !== null) {
                done(error);
                return;
              }
              const entry = {
                name,
                path: path6,
                dirent: utils.fs.createDirentFromStats(name, stats)
              };
              if (settings.stats) {
                entry.stats = stats;
              }
              done(null, entry);
            });
          };
        });
        rpl(tasks, (rplError, entries) => {
          if (rplError !== null) {
            callFailureCallback(callback, rplError);
            return;
          }
          callSuccessCallback(callback, entries);
        });
      });
    }
    exports2.readdir = readdir2;
    function callFailureCallback(callback, error) {
      callback(error);
    }
    function callSuccessCallback(callback, result) {
      callback(null, result);
    }
  }
});

// node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/providers/sync.js
var require_sync2 = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/providers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.readdir = exports2.readdirWithFileTypes = exports2.read = void 0;
    var fsStat = require_out();
    var constants_1 = require_constants3();
    var utils = require_utils4();
    var common = require_common();
    function read(directory, settings) {
      if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
        return readdirWithFileTypes(directory, settings);
      }
      return readdir2(directory, settings);
    }
    exports2.read = read;
    function readdirWithFileTypes(directory, settings) {
      const dirents = settings.fs.readdirSync(directory, { withFileTypes: true });
      return dirents.map((dirent) => {
        const entry = {
          dirent,
          name: dirent.name,
          path: common.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
        };
        if (entry.dirent.isSymbolicLink() && settings.followSymbolicLinks) {
          try {
            const stats = settings.fs.statSync(entry.path);
            entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
          } catch (error) {
            if (settings.throwErrorOnBrokenSymbolicLink) {
              throw error;
            }
          }
        }
        return entry;
      });
    }
    exports2.readdirWithFileTypes = readdirWithFileTypes;
    function readdir2(directory, settings) {
      const names = settings.fs.readdirSync(directory);
      return names.map((name) => {
        const entryPath = common.joinPathSegments(directory, name, settings.pathSegmentSeparator);
        const stats = fsStat.statSync(entryPath, settings.fsStatSettings);
        const entry = {
          name,
          path: entryPath,
          dirent: utils.fs.createDirentFromStats(name, stats)
        };
        if (settings.stats) {
          entry.stats = stats;
        }
        return entry;
      });
    }
    exports2.readdir = readdir2;
  }
});

// node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/adapters/fs.js
var require_fs6 = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/adapters/fs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createFileSystemAdapter = exports2.FILE_SYSTEM_ADAPTER = void 0;
    var fs5 = require("fs");
    exports2.FILE_SYSTEM_ADAPTER = {
      lstat: fs5.lstat,
      stat: fs5.stat,
      lstatSync: fs5.lstatSync,
      statSync: fs5.statSync,
      readdir: fs5.readdir,
      readdirSync: fs5.readdirSync
    };
    function createFileSystemAdapter(fsMethods) {
      if (fsMethods === void 0) {
        return exports2.FILE_SYSTEM_ADAPTER;
      }
      return Object.assign(Object.assign({}, exports2.FILE_SYSTEM_ADAPTER), fsMethods);
    }
    exports2.createFileSystemAdapter = createFileSystemAdapter;
  }
});

// node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/settings.js
var require_settings2 = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/settings.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var path6 = require("path");
    var fsStat = require_out();
    var fs5 = require_fs6();
    var Settings = class {
      constructor(_options = {}) {
        this._options = _options;
        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, false);
        this.fs = fs5.createFileSystemAdapter(this._options.fs);
        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path6.sep);
        this.stats = this._getValue(this._options.stats, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
        this.fsStatSettings = new fsStat.Settings({
          followSymbolicLink: this.followSymbolicLinks,
          fs: this.fs,
          throwErrorOnBrokenSymbolicLink: this.throwErrorOnBrokenSymbolicLink
        });
      }
      _getValue(option, value) {
        return option !== null && option !== void 0 ? option : value;
      }
    };
    exports2.default = Settings;
  }
});

// node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/index.js
var require_out2 = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Settings = exports2.scandirSync = exports2.scandir = void 0;
    var async = require_async2();
    var sync3 = require_sync2();
    var settings_1 = require_settings2();
    exports2.Settings = settings_1.default;
    function scandir(path6, optionsOrSettingsOrCallback, callback) {
      if (typeof optionsOrSettingsOrCallback === "function") {
        async.read(path6, getSettings(), optionsOrSettingsOrCallback);
        return;
      }
      async.read(path6, getSettings(optionsOrSettingsOrCallback), callback);
    }
    exports2.scandir = scandir;
    function scandirSync(path6, optionsOrSettings) {
      const settings = getSettings(optionsOrSettings);
      return sync3.read(path6, settings);
    }
    exports2.scandirSync = scandirSync;
    function getSettings(settingsOrOptions = {}) {
      if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
      }
      return new settings_1.default(settingsOrOptions);
    }
  }
});

// node_modules/.pnpm/reusify@1.0.4/node_modules/reusify/reusify.js
var require_reusify = __commonJS({
  "node_modules/.pnpm/reusify@1.0.4/node_modules/reusify/reusify.js"(exports2, module2) {
    "use strict";
    function reusify(Constructor) {
      var head = new Constructor();
      var tail = head;
      function get() {
        var current = head;
        if (current.next) {
          head = current.next;
        } else {
          head = new Constructor();
          tail = head;
        }
        current.next = null;
        return current;
      }
      function release(obj) {
        tail.next = obj;
        tail = obj;
      }
      return {
        get,
        release
      };
    }
    module2.exports = reusify;
  }
});

// node_modules/.pnpm/fastq@1.16.0/node_modules/fastq/queue.js
var require_queue = __commonJS({
  "node_modules/.pnpm/fastq@1.16.0/node_modules/fastq/queue.js"(exports2, module2) {
    "use strict";
    var reusify = require_reusify();
    function fastqueue(context, worker, concurrency) {
      if (typeof context === "function") {
        concurrency = worker;
        worker = context;
        context = null;
      }
      if (concurrency < 1) {
        throw new Error("fastqueue concurrency must be greater than 1");
      }
      var cache = reusify(Task);
      var queueHead = null;
      var queueTail = null;
      var _running = 0;
      var errorHandler = null;
      var self2 = {
        push,
        drain: noop,
        saturated: noop,
        pause,
        paused: false,
        concurrency,
        running,
        resume,
        idle,
        length,
        getQueue,
        unshift,
        empty: noop,
        kill,
        killAndDrain,
        error
      };
      return self2;
      function running() {
        return _running;
      }
      function pause() {
        self2.paused = true;
      }
      function length() {
        var current = queueHead;
        var counter = 0;
        while (current) {
          current = current.next;
          counter++;
        }
        return counter;
      }
      function getQueue() {
        var current = queueHead;
        var tasks = [];
        while (current) {
          tasks.push(current.value);
          current = current.next;
        }
        return tasks;
      }
      function resume() {
        if (!self2.paused) return;
        self2.paused = false;
        for (var i = 0; i < self2.concurrency; i++) {
          _running++;
          release();
        }
      }
      function idle() {
        return _running === 0 && self2.length() === 0;
      }
      function push(value, done) {
        var current = cache.get();
        current.context = context;
        current.release = release;
        current.value = value;
        current.callback = done || noop;
        current.errorHandler = errorHandler;
        if (_running === self2.concurrency || self2.paused) {
          if (queueTail) {
            queueTail.next = current;
            queueTail = current;
          } else {
            queueHead = current;
            queueTail = current;
            self2.saturated();
          }
        } else {
          _running++;
          worker.call(context, current.value, current.worked);
        }
      }
      function unshift(value, done) {
        var current = cache.get();
        current.context = context;
        current.release = release;
        current.value = value;
        current.callback = done || noop;
        current.errorHandler = errorHandler;
        if (_running === self2.concurrency || self2.paused) {
          if (queueHead) {
            current.next = queueHead;
            queueHead = current;
          } else {
            queueHead = current;
            queueTail = current;
            self2.saturated();
          }
        } else {
          _running++;
          worker.call(context, current.value, current.worked);
        }
      }
      function release(holder) {
        if (holder) {
          cache.release(holder);
        }
        var next = queueHead;
        if (next) {
          if (!self2.paused) {
            if (queueTail === queueHead) {
              queueTail = null;
            }
            queueHead = next.next;
            next.next = null;
            worker.call(context, next.value, next.worked);
            if (queueTail === null) {
              self2.empty();
            }
          } else {
            _running--;
          }
        } else if (--_running === 0) {
          self2.drain();
        }
      }
      function kill() {
        queueHead = null;
        queueTail = null;
        self2.drain = noop;
      }
      function killAndDrain() {
        queueHead = null;
        queueTail = null;
        self2.drain();
        self2.drain = noop;
      }
      function error(handler) {
        errorHandler = handler;
      }
    }
    function noop() {
    }
    function Task() {
      this.value = null;
      this.callback = noop;
      this.next = null;
      this.release = noop;
      this.context = null;
      this.errorHandler = null;
      var self2 = this;
      this.worked = function worked(err, result) {
        var callback = self2.callback;
        var errorHandler = self2.errorHandler;
        var val = self2.value;
        self2.value = null;
        self2.callback = noop;
        if (self2.errorHandler) {
          errorHandler(err, val);
        }
        callback.call(self2.context, err, result);
        self2.release(self2);
      };
    }
    function queueAsPromised(context, worker, concurrency) {
      if (typeof context === "function") {
        concurrency = worker;
        worker = context;
        context = null;
      }
      function asyncWrapper(arg, cb) {
        worker.call(this, arg).then(function(res) {
          cb(null, res);
        }, cb);
      }
      var queue = fastqueue(context, asyncWrapper, concurrency);
      var pushCb = queue.push;
      var unshiftCb = queue.unshift;
      queue.push = push;
      queue.unshift = unshift;
      queue.drained = drained;
      return queue;
      function push(value) {
        var p = new Promise(function(resolve, reject) {
          pushCb(value, function(err, result) {
            if (err) {
              reject(err);
              return;
            }
            resolve(result);
          });
        });
        p.catch(noop);
        return p;
      }
      function unshift(value) {
        var p = new Promise(function(resolve, reject) {
          unshiftCb(value, function(err, result) {
            if (err) {
              reject(err);
              return;
            }
            resolve(result);
          });
        });
        p.catch(noop);
        return p;
      }
      function drained() {
        if (queue.idle()) {
          return new Promise(function(resolve) {
            resolve();
          });
        }
        var previousDrain = queue.drain;
        var p = new Promise(function(resolve) {
          queue.drain = function() {
            previousDrain();
            resolve();
          };
        });
        return p;
      }
    }
    module2.exports = fastqueue;
    module2.exports.promise = queueAsPromised;
  }
});

// node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/common.js
var require_common2 = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/common.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.joinPathSegments = exports2.replacePathSegmentSeparator = exports2.isAppliedFilter = exports2.isFatalError = void 0;
    function isFatalError(settings, error) {
      if (settings.errorFilter === null) {
        return true;
      }
      return !settings.errorFilter(error);
    }
    exports2.isFatalError = isFatalError;
    function isAppliedFilter(filter2, value) {
      return filter2 === null || filter2(value);
    }
    exports2.isAppliedFilter = isAppliedFilter;
    function replacePathSegmentSeparator(filepath, separator) {
      return filepath.split(/[/\\]/).join(separator);
    }
    exports2.replacePathSegmentSeparator = replacePathSegmentSeparator;
    function joinPathSegments(a, b, separator) {
      if (a === "") {
        return b;
      }
      if (a.endsWith(separator)) {
        return a + b;
      }
      return a + separator + b;
    }
    exports2.joinPathSegments = joinPathSegments;
  }
});

// node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/reader.js
var require_reader = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/reader.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var common = require_common2();
    var Reader = class {
      constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._root = common.replacePathSegmentSeparator(_root, _settings.pathSegmentSeparator);
      }
    };
    exports2.default = Reader;
  }
});

// node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/async.js
var require_async3 = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var events_1 = require("events");
    var fsScandir = require_out2();
    var fastq = require_queue();
    var common = require_common2();
    var reader_1 = require_reader();
    var AsyncReader = class extends reader_1.default {
      constructor(_root, _settings) {
        super(_root, _settings);
        this._settings = _settings;
        this._scandir = fsScandir.scandir;
        this._emitter = new events_1.EventEmitter();
        this._queue = fastq(this._worker.bind(this), this._settings.concurrency);
        this._isFatalError = false;
        this._isDestroyed = false;
        this._queue.drain = () => {
          if (!this._isFatalError) {
            this._emitter.emit("end");
          }
        };
      }
      read() {
        this._isFatalError = false;
        this._isDestroyed = false;
        setImmediate(() => {
          this._pushToQueue(this._root, this._settings.basePath);
        });
        return this._emitter;
      }
      get isDestroyed() {
        return this._isDestroyed;
      }
      destroy() {
        if (this._isDestroyed) {
          throw new Error("The reader is already destroyed");
        }
        this._isDestroyed = true;
        this._queue.killAndDrain();
      }
      onEntry(callback) {
        this._emitter.on("entry", callback);
      }
      onError(callback) {
        this._emitter.once("error", callback);
      }
      onEnd(callback) {
        this._emitter.once("end", callback);
      }
      _pushToQueue(directory, base) {
        const queueItem = { directory, base };
        this._queue.push(queueItem, (error) => {
          if (error !== null) {
            this._handleError(error);
          }
        });
      }
      _worker(item, done) {
        this._scandir(item.directory, this._settings.fsScandirSettings, (error, entries) => {
          if (error !== null) {
            done(error, void 0);
            return;
          }
          for (const entry of entries) {
            this._handleEntry(entry, item.base);
          }
          done(null, void 0);
        });
      }
      _handleError(error) {
        if (this._isDestroyed || !common.isFatalError(this._settings, error)) {
          return;
        }
        this._isFatalError = true;
        this._isDestroyed = true;
        this._emitter.emit("error", error);
      }
      _handleEntry(entry, base) {
        if (this._isDestroyed || this._isFatalError) {
          return;
        }
        const fullpath = entry.path;
        if (base !== void 0) {
          entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
        }
        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
          this._emitEntry(entry);
        }
        if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
          this._pushToQueue(fullpath, base === void 0 ? void 0 : entry.path);
        }
      }
      _emitEntry(entry) {
        this._emitter.emit("entry", entry);
      }
    };
    exports2.default = AsyncReader;
  }
});

// node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/providers/async.js
var require_async4 = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/providers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var async_1 = require_async3();
    var AsyncProvider = class {
      constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new async_1.default(this._root, this._settings);
        this._storage = [];
      }
      read(callback) {
        this._reader.onError((error) => {
          callFailureCallback(callback, error);
        });
        this._reader.onEntry((entry) => {
          this._storage.push(entry);
        });
        this._reader.onEnd(() => {
          callSuccessCallback(callback, this._storage);
        });
        this._reader.read();
      }
    };
    exports2.default = AsyncProvider;
    function callFailureCallback(callback, error) {
      callback(error);
    }
    function callSuccessCallback(callback, entries) {
      callback(null, entries);
    }
  }
});

// node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/providers/stream.js
var require_stream2 = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/providers/stream.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var stream_1 = require("stream");
    var async_1 = require_async3();
    var StreamProvider = class {
      constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new async_1.default(this._root, this._settings);
        this._stream = new stream_1.Readable({
          objectMode: true,
          read: () => {
          },
          destroy: () => {
            if (!this._reader.isDestroyed) {
              this._reader.destroy();
            }
          }
        });
      }
      read() {
        this._reader.onError((error) => {
          this._stream.emit("error", error);
        });
        this._reader.onEntry((entry) => {
          this._stream.push(entry);
        });
        this._reader.onEnd(() => {
          this._stream.push(null);
        });
        this._reader.read();
        return this._stream;
      }
    };
    exports2.default = StreamProvider;
  }
});

// node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/sync.js
var require_sync3 = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var fsScandir = require_out2();
    var common = require_common2();
    var reader_1 = require_reader();
    var SyncReader = class extends reader_1.default {
      constructor() {
        super(...arguments);
        this._scandir = fsScandir.scandirSync;
        this._storage = [];
        this._queue = /* @__PURE__ */ new Set();
      }
      read() {
        this._pushToQueue(this._root, this._settings.basePath);
        this._handleQueue();
        return this._storage;
      }
      _pushToQueue(directory, base) {
        this._queue.add({ directory, base });
      }
      _handleQueue() {
        for (const item of this._queue.values()) {
          this._handleDirectory(item.directory, item.base);
        }
      }
      _handleDirectory(directory, base) {
        try {
          const entries = this._scandir(directory, this._settings.fsScandirSettings);
          for (const entry of entries) {
            this._handleEntry(entry, base);
          }
        } catch (error) {
          this._handleError(error);
        }
      }
      _handleError(error) {
        if (!common.isFatalError(this._settings, error)) {
          return;
        }
        throw error;
      }
      _handleEntry(entry, base) {
        const fullpath = entry.path;
        if (base !== void 0) {
          entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
        }
        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
          this._pushToStorage(entry);
        }
        if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
          this._pushToQueue(fullpath, base === void 0 ? void 0 : entry.path);
        }
      }
      _pushToStorage(entry) {
        this._storage.push(entry);
      }
    };
    exports2.default = SyncReader;
  }
});

// node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/providers/sync.js
var require_sync4 = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/providers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var sync_1 = require_sync3();
    var SyncProvider = class {
      constructor(_root, _settings) {
        this._root = _root;
        this._settings = _settings;
        this._reader = new sync_1.default(this._root, this._settings);
      }
      read() {
        return this._reader.read();
      }
    };
    exports2.default = SyncProvider;
  }
});

// node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/settings.js
var require_settings3 = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/settings.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var path6 = require("path");
    var fsScandir = require_out2();
    var Settings = class {
      constructor(_options = {}) {
        this._options = _options;
        this.basePath = this._getValue(this._options.basePath, void 0);
        this.concurrency = this._getValue(this._options.concurrency, Number.POSITIVE_INFINITY);
        this.deepFilter = this._getValue(this._options.deepFilter, null);
        this.entryFilter = this._getValue(this._options.entryFilter, null);
        this.errorFilter = this._getValue(this._options.errorFilter, null);
        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path6.sep);
        this.fsScandirSettings = new fsScandir.Settings({
          followSymbolicLinks: this._options.followSymbolicLinks,
          fs: this._options.fs,
          pathSegmentSeparator: this._options.pathSegmentSeparator,
          stats: this._options.stats,
          throwErrorOnBrokenSymbolicLink: this._options.throwErrorOnBrokenSymbolicLink
        });
      }
      _getValue(option, value) {
        return option !== null && option !== void 0 ? option : value;
      }
    };
    exports2.default = Settings;
  }
});

// node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/index.js
var require_out3 = __commonJS({
  "node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Settings = exports2.walkStream = exports2.walkSync = exports2.walk = void 0;
    var async_1 = require_async4();
    var stream_1 = require_stream2();
    var sync_1 = require_sync4();
    var settings_1 = require_settings3();
    exports2.Settings = settings_1.default;
    function walk(directory, optionsOrSettingsOrCallback, callback) {
      if (typeof optionsOrSettingsOrCallback === "function") {
        new async_1.default(directory, getSettings()).read(optionsOrSettingsOrCallback);
        return;
      }
      new async_1.default(directory, getSettings(optionsOrSettingsOrCallback)).read(callback);
    }
    exports2.walk = walk;
    function walkSync(directory, optionsOrSettings) {
      const settings = getSettings(optionsOrSettings);
      const provider = new sync_1.default(directory, settings);
      return provider.read();
    }
    exports2.walkSync = walkSync;
    function walkStream(directory, optionsOrSettings) {
      const settings = getSettings(optionsOrSettings);
      const provider = new stream_1.default(directory, settings);
      return provider.read();
    }
    exports2.walkStream = walkStream;
    function getSettings(settingsOrOptions = {}) {
      if (settingsOrOptions instanceof settings_1.default) {
        return settingsOrOptions;
      }
      return new settings_1.default(settingsOrOptions);
    }
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/readers/reader.js
var require_reader2 = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/readers/reader.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var path6 = require("path");
    var fsStat = require_out();
    var utils = require_utils3();
    var Reader = class {
      constructor(_settings) {
        this._settings = _settings;
        this._fsStatSettings = new fsStat.Settings({
          followSymbolicLink: this._settings.followSymbolicLinks,
          fs: this._settings.fs,
          throwErrorOnBrokenSymbolicLink: this._settings.followSymbolicLinks
        });
      }
      _getFullEntryPath(filepath) {
        return path6.resolve(this._settings.cwd, filepath);
      }
      _makeEntry(stats, pattern) {
        const entry = {
          name: pattern,
          path: pattern,
          dirent: utils.fs.createDirentFromStats(pattern, stats)
        };
        if (this._settings.stats) {
          entry.stats = stats;
        }
        return entry;
      }
      _isFatalError(error) {
        return !utils.errno.isEnoentCodeError(error) && !this._settings.suppressErrors;
      }
    };
    exports2.default = Reader;
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/readers/stream.js
var require_stream3 = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/readers/stream.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var stream_1 = require("stream");
    var fsStat = require_out();
    var fsWalk = require_out3();
    var reader_1 = require_reader2();
    var ReaderStream = class extends reader_1.default {
      constructor() {
        super(...arguments);
        this._walkStream = fsWalk.walkStream;
        this._stat = fsStat.stat;
      }
      dynamic(root, options) {
        return this._walkStream(root, options);
      }
      static(patterns, options) {
        const filepaths = patterns.map(this._getFullEntryPath, this);
        const stream2 = new stream_1.PassThrough({ objectMode: true });
        stream2._write = (index, _enc, done) => {
          return this._getEntry(filepaths[index], patterns[index], options).then((entry) => {
            if (entry !== null && options.entryFilter(entry)) {
              stream2.push(entry);
            }
            if (index === filepaths.length - 1) {
              stream2.end();
            }
            done();
          }).catch(done);
        };
        for (let i = 0; i < filepaths.length; i++) {
          stream2.write(i);
        }
        return stream2;
      }
      _getEntry(filepath, pattern, options) {
        return this._getStat(filepath).then((stats) => this._makeEntry(stats, pattern)).catch((error) => {
          if (options.errorFilter(error)) {
            return null;
          }
          throw error;
        });
      }
      _getStat(filepath) {
        return new Promise((resolve, reject) => {
          this._stat(filepath, this._fsStatSettings, (error, stats) => {
            return error === null ? resolve(stats) : reject(error);
          });
        });
      }
    };
    exports2.default = ReaderStream;
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/readers/async.js
var require_async5 = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/readers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var fsWalk = require_out3();
    var reader_1 = require_reader2();
    var stream_1 = require_stream3();
    var ReaderAsync = class extends reader_1.default {
      constructor() {
        super(...arguments);
        this._walkAsync = fsWalk.walk;
        this._readerStream = new stream_1.default(this._settings);
      }
      dynamic(root, options) {
        return new Promise((resolve, reject) => {
          this._walkAsync(root, options, (error, entries) => {
            if (error === null) {
              resolve(entries);
            } else {
              reject(error);
            }
          });
        });
      }
      async static(patterns, options) {
        const entries = [];
        const stream2 = this._readerStream.static(patterns, options);
        return new Promise((resolve, reject) => {
          stream2.once("error", reject);
          stream2.on("data", (entry) => entries.push(entry));
          stream2.once("end", () => resolve(entries));
        });
      }
    };
    exports2.default = ReaderAsync;
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/matchers/matcher.js
var require_matcher = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/matchers/matcher.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var utils = require_utils3();
    var Matcher = class {
      constructor(_patterns, _settings, _micromatchOptions) {
        this._patterns = _patterns;
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
        this._storage = [];
        this._fillStorage();
      }
      _fillStorage() {
        for (const pattern of this._patterns) {
          const segments = this._getPatternSegments(pattern);
          const sections = this._splitSegmentsIntoSections(segments);
          this._storage.push({
            complete: sections.length <= 1,
            pattern,
            segments,
            sections
          });
        }
      }
      _getPatternSegments(pattern) {
        const parts = utils.pattern.getPatternParts(pattern, this._micromatchOptions);
        return parts.map((part) => {
          const dynamic = utils.pattern.isDynamicPattern(part, this._settings);
          if (!dynamic) {
            return {
              dynamic: false,
              pattern: part
            };
          }
          return {
            dynamic: true,
            pattern: part,
            patternRe: utils.pattern.makeRe(part, this._micromatchOptions)
          };
        });
      }
      _splitSegmentsIntoSections(segments) {
        return utils.array.splitWhen(segments, (segment) => segment.dynamic && utils.pattern.hasGlobStar(segment.pattern));
      }
    };
    exports2.default = Matcher;
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/matchers/partial.js
var require_partial = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/matchers/partial.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var matcher_1 = require_matcher();
    var PartialMatcher = class extends matcher_1.default {
      match(filepath) {
        const parts = filepath.split("/");
        const levels = parts.length;
        const patterns = this._storage.filter((info) => !info.complete || info.segments.length > levels);
        for (const pattern of patterns) {
          const section = pattern.sections[0];
          if (!pattern.complete && levels > section.length) {
            return true;
          }
          const match2 = parts.every((part, index) => {
            const segment = pattern.segments[index];
            if (segment.dynamic && segment.patternRe.test(part)) {
              return true;
            }
            if (!segment.dynamic && segment.pattern === part) {
              return true;
            }
            return false;
          });
          if (match2) {
            return true;
          }
        }
        return false;
      }
    };
    exports2.default = PartialMatcher;
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/filters/deep.js
var require_deep = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/filters/deep.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var utils = require_utils3();
    var partial_1 = require_partial();
    var DeepFilter = class {
      constructor(_settings, _micromatchOptions) {
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
      }
      getFilter(basePath, positive, negative) {
        const matcher = this._getMatcher(positive);
        const negativeRe = this._getNegativePatternsRe(negative);
        return (entry) => this._filter(basePath, entry, matcher, negativeRe);
      }
      _getMatcher(patterns) {
        return new partial_1.default(patterns, this._settings, this._micromatchOptions);
      }
      _getNegativePatternsRe(patterns) {
        const affectDepthOfReadingPatterns = patterns.filter(utils.pattern.isAffectDepthOfReadingPattern);
        return utils.pattern.convertPatternsToRe(affectDepthOfReadingPatterns, this._micromatchOptions);
      }
      _filter(basePath, entry, matcher, negativeRe) {
        if (this._isSkippedByDeep(basePath, entry.path)) {
          return false;
        }
        if (this._isSkippedSymbolicLink(entry)) {
          return false;
        }
        const filepath = utils.path.removeLeadingDotSegment(entry.path);
        if (this._isSkippedByPositivePatterns(filepath, matcher)) {
          return false;
        }
        return this._isSkippedByNegativePatterns(filepath, negativeRe);
      }
      _isSkippedByDeep(basePath, entryPath) {
        if (this._settings.deep === Infinity) {
          return false;
        }
        return this._getEntryLevel(basePath, entryPath) >= this._settings.deep;
      }
      _getEntryLevel(basePath, entryPath) {
        const entryPathDepth = entryPath.split("/").length;
        if (basePath === "") {
          return entryPathDepth;
        }
        const basePathDepth = basePath.split("/").length;
        return entryPathDepth - basePathDepth;
      }
      _isSkippedSymbolicLink(entry) {
        return !this._settings.followSymbolicLinks && entry.dirent.isSymbolicLink();
      }
      _isSkippedByPositivePatterns(entryPath, matcher) {
        return !this._settings.baseNameMatch && !matcher.match(entryPath);
      }
      _isSkippedByNegativePatterns(entryPath, patternsRe) {
        return !utils.pattern.matchAny(entryPath, patternsRe);
      }
    };
    exports2.default = DeepFilter;
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/filters/entry.js
var require_entry = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/filters/entry.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var utils = require_utils3();
    var EntryFilter = class {
      constructor(_settings, _micromatchOptions) {
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
        this.index = /* @__PURE__ */ new Map();
      }
      getFilter(positive, negative) {
        const positiveRe = utils.pattern.convertPatternsToRe(positive, this._micromatchOptions);
        const negativeRe = utils.pattern.convertPatternsToRe(negative, Object.assign(Object.assign({}, this._micromatchOptions), { dot: true }));
        return (entry) => this._filter(entry, positiveRe, negativeRe);
      }
      _filter(entry, positiveRe, negativeRe) {
        const filepath = utils.path.removeLeadingDotSegment(entry.path);
        if (this._settings.unique && this._isDuplicateEntry(filepath)) {
          return false;
        }
        if (this._onlyFileFilter(entry) || this._onlyDirectoryFilter(entry)) {
          return false;
        }
        if (this._isSkippedByAbsoluteNegativePatterns(filepath, negativeRe)) {
          return false;
        }
        const isDirectory = entry.dirent.isDirectory();
        const isMatched = this._isMatchToPatterns(filepath, positiveRe, isDirectory) && !this._isMatchToPatterns(filepath, negativeRe, isDirectory);
        if (this._settings.unique && isMatched) {
          this._createIndexRecord(filepath);
        }
        return isMatched;
      }
      _isDuplicateEntry(filepath) {
        return this.index.has(filepath);
      }
      _createIndexRecord(filepath) {
        this.index.set(filepath, void 0);
      }
      _onlyFileFilter(entry) {
        return this._settings.onlyFiles && !entry.dirent.isFile();
      }
      _onlyDirectoryFilter(entry) {
        return this._settings.onlyDirectories && !entry.dirent.isDirectory();
      }
      _isSkippedByAbsoluteNegativePatterns(entryPath, patternsRe) {
        if (!this._settings.absolute) {
          return false;
        }
        const fullpath = utils.path.makeAbsolute(this._settings.cwd, entryPath);
        return utils.pattern.matchAny(fullpath, patternsRe);
      }
      _isMatchToPatterns(filepath, patternsRe, isDirectory) {
        const isMatched = utils.pattern.matchAny(filepath, patternsRe);
        if (!isMatched && isDirectory) {
          return utils.pattern.matchAny(filepath + "/", patternsRe);
        }
        return isMatched;
      }
    };
    exports2.default = EntryFilter;
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/filters/error.js
var require_error = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/filters/error.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var utils = require_utils3();
    var ErrorFilter = class {
      constructor(_settings) {
        this._settings = _settings;
      }
      getFilter() {
        return (error) => this._isNonFatalError(error);
      }
      _isNonFatalError(error) {
        return utils.errno.isEnoentCodeError(error) || this._settings.suppressErrors;
      }
    };
    exports2.default = ErrorFilter;
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/transformers/entry.js
var require_entry2 = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/transformers/entry.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var utils = require_utils3();
    var EntryTransformer = class {
      constructor(_settings) {
        this._settings = _settings;
      }
      getTransformer() {
        return (entry) => this._transform(entry);
      }
      _transform(entry) {
        let filepath = entry.path;
        if (this._settings.absolute) {
          filepath = utils.path.makeAbsolute(this._settings.cwd, filepath);
          filepath = utils.path.unixify(filepath);
        }
        if (this._settings.markDirectories && entry.dirent.isDirectory()) {
          filepath += "/";
        }
        if (!this._settings.objectMode) {
          return filepath;
        }
        return Object.assign(Object.assign({}, entry), { path: filepath });
      }
    };
    exports2.default = EntryTransformer;
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/provider.js
var require_provider = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/provider.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var path6 = require("path");
    var deep_1 = require_deep();
    var entry_1 = require_entry();
    var error_1 = require_error();
    var entry_2 = require_entry2();
    var Provider = class {
      constructor(_settings) {
        this._settings = _settings;
        this.errorFilter = new error_1.default(this._settings);
        this.entryFilter = new entry_1.default(this._settings, this._getMicromatchOptions());
        this.deepFilter = new deep_1.default(this._settings, this._getMicromatchOptions());
        this.entryTransformer = new entry_2.default(this._settings);
      }
      _getRootDirectory(task) {
        return path6.resolve(this._settings.cwd, task.base);
      }
      _getReaderOptions(task) {
        const basePath = task.base === "." ? "" : task.base;
        return {
          basePath,
          pathSegmentSeparator: "/",
          concurrency: this._settings.concurrency,
          deepFilter: this.deepFilter.getFilter(basePath, task.positive, task.negative),
          entryFilter: this.entryFilter.getFilter(task.positive, task.negative),
          errorFilter: this.errorFilter.getFilter(),
          followSymbolicLinks: this._settings.followSymbolicLinks,
          fs: this._settings.fs,
          stats: this._settings.stats,
          throwErrorOnBrokenSymbolicLink: this._settings.throwErrorOnBrokenSymbolicLink,
          transform: this.entryTransformer.getTransformer()
        };
      }
      _getMicromatchOptions() {
        return {
          dot: this._settings.dot,
          matchBase: this._settings.baseNameMatch,
          nobrace: !this._settings.braceExpansion,
          nocase: !this._settings.caseSensitiveMatch,
          noext: !this._settings.extglob,
          noglobstar: !this._settings.globstar,
          posix: true,
          strictSlashes: false
        };
      }
    };
    exports2.default = Provider;
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/async.js
var require_async6 = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var async_1 = require_async5();
    var provider_1 = require_provider();
    var ProviderAsync = class extends provider_1.default {
      constructor() {
        super(...arguments);
        this._reader = new async_1.default(this._settings);
      }
      async read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const entries = await this.api(root, task, options);
        return entries.map((entry) => options.transform(entry));
      }
      api(root, task, options) {
        if (task.dynamic) {
          return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
      }
    };
    exports2.default = ProviderAsync;
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/stream.js
var require_stream4 = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/stream.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var stream_1 = require("stream");
    var stream_2 = require_stream3();
    var provider_1 = require_provider();
    var ProviderStream = class extends provider_1.default {
      constructor() {
        super(...arguments);
        this._reader = new stream_2.default(this._settings);
      }
      read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const source = this.api(root, task, options);
        const destination = new stream_1.Readable({ objectMode: true, read: () => {
        } });
        source.once("error", (error) => destination.emit("error", error)).on("data", (entry) => destination.emit("data", options.transform(entry))).once("end", () => destination.emit("end"));
        destination.once("close", () => source.destroy());
        return destination;
      }
      api(root, task, options) {
        if (task.dynamic) {
          return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
      }
    };
    exports2.default = ProviderStream;
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/readers/sync.js
var require_sync5 = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/readers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var fsStat = require_out();
    var fsWalk = require_out3();
    var reader_1 = require_reader2();
    var ReaderSync = class extends reader_1.default {
      constructor() {
        super(...arguments);
        this._walkSync = fsWalk.walkSync;
        this._statSync = fsStat.statSync;
      }
      dynamic(root, options) {
        return this._walkSync(root, options);
      }
      static(patterns, options) {
        const entries = [];
        for (const pattern of patterns) {
          const filepath = this._getFullEntryPath(pattern);
          const entry = this._getEntry(filepath, pattern, options);
          if (entry === null || !options.entryFilter(entry)) {
            continue;
          }
          entries.push(entry);
        }
        return entries;
      }
      _getEntry(filepath, pattern, options) {
        try {
          const stats = this._getStat(filepath);
          return this._makeEntry(stats, pattern);
        } catch (error) {
          if (options.errorFilter(error)) {
            return null;
          }
          throw error;
        }
      }
      _getStat(filepath) {
        return this._statSync(filepath, this._fsStatSettings);
      }
    };
    exports2.default = ReaderSync;
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/sync.js
var require_sync6 = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/providers/sync.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var sync_1 = require_sync5();
    var provider_1 = require_provider();
    var ProviderSync = class extends provider_1.default {
      constructor() {
        super(...arguments);
        this._reader = new sync_1.default(this._settings);
      }
      read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const entries = this.api(root, task, options);
        return entries.map(options.transform);
      }
      api(root, task, options) {
        if (task.dynamic) {
          return this._reader.dynamic(root, options);
        }
        return this._reader.static(task.patterns, options);
      }
    };
    exports2.default = ProviderSync;
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/settings.js
var require_settings4 = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/settings.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DEFAULT_FILE_SYSTEM_ADAPTER = void 0;
    var fs5 = require("fs");
    var os = require("os");
    var CPU_COUNT = Math.max(os.cpus().length, 1);
    exports2.DEFAULT_FILE_SYSTEM_ADAPTER = {
      lstat: fs5.lstat,
      lstatSync: fs5.lstatSync,
      stat: fs5.stat,
      statSync: fs5.statSync,
      readdir: fs5.readdir,
      readdirSync: fs5.readdirSync
    };
    var Settings = class {
      constructor(_options = {}) {
        this._options = _options;
        this.absolute = this._getValue(this._options.absolute, false);
        this.baseNameMatch = this._getValue(this._options.baseNameMatch, false);
        this.braceExpansion = this._getValue(this._options.braceExpansion, true);
        this.caseSensitiveMatch = this._getValue(this._options.caseSensitiveMatch, true);
        this.concurrency = this._getValue(this._options.concurrency, CPU_COUNT);
        this.cwd = this._getValue(this._options.cwd, process.cwd());
        this.deep = this._getValue(this._options.deep, Infinity);
        this.dot = this._getValue(this._options.dot, false);
        this.extglob = this._getValue(this._options.extglob, true);
        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, true);
        this.fs = this._getFileSystemMethods(this._options.fs);
        this.globstar = this._getValue(this._options.globstar, true);
        this.ignore = this._getValue(this._options.ignore, []);
        this.markDirectories = this._getValue(this._options.markDirectories, false);
        this.objectMode = this._getValue(this._options.objectMode, false);
        this.onlyDirectories = this._getValue(this._options.onlyDirectories, false);
        this.onlyFiles = this._getValue(this._options.onlyFiles, true);
        this.stats = this._getValue(this._options.stats, false);
        this.suppressErrors = this._getValue(this._options.suppressErrors, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, false);
        this.unique = this._getValue(this._options.unique, true);
        if (this.onlyDirectories) {
          this.onlyFiles = false;
        }
        if (this.stats) {
          this.objectMode = true;
        }
        this.ignore = [].concat(this.ignore);
      }
      _getValue(option, value) {
        return option === void 0 ? value : option;
      }
      _getFileSystemMethods(methods = {}) {
        return Object.assign(Object.assign({}, exports2.DEFAULT_FILE_SYSTEM_ADAPTER), methods);
      }
    };
    exports2.default = Settings;
  }
});

// node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/index.js
var require_out4 = __commonJS({
  "node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/index.js"(exports2, module2) {
    "use strict";
    var taskManager = require_tasks();
    var async_1 = require_async6();
    var stream_1 = require_stream4();
    var sync_1 = require_sync6();
    var settings_1 = require_settings4();
    var utils = require_utils3();
    async function FastGlob(source, options) {
      assertPatternsInput(source);
      const works = getWorks(source, async_1.default, options);
      const result = await Promise.all(works);
      return utils.array.flatten(result);
    }
    (function(FastGlob2) {
      FastGlob2.glob = FastGlob2;
      FastGlob2.globSync = sync3;
      FastGlob2.globStream = stream2;
      FastGlob2.async = FastGlob2;
      function sync3(source, options) {
        assertPatternsInput(source);
        const works = getWorks(source, sync_1.default, options);
        return utils.array.flatten(works);
      }
      FastGlob2.sync = sync3;
      function stream2(source, options) {
        assertPatternsInput(source);
        const works = getWorks(source, stream_1.default, options);
        return utils.stream.merge(works);
      }
      FastGlob2.stream = stream2;
      function generateTasks(source, options) {
        assertPatternsInput(source);
        const patterns = [].concat(source);
        const settings = new settings_1.default(options);
        return taskManager.generate(patterns, settings);
      }
      FastGlob2.generateTasks = generateTasks;
      function isDynamicPattern(source, options) {
        assertPatternsInput(source);
        const settings = new settings_1.default(options);
        return utils.pattern.isDynamicPattern(source, settings);
      }
      FastGlob2.isDynamicPattern = isDynamicPattern;
      function escapePath(source) {
        assertPatternsInput(source);
        return utils.path.escape(source);
      }
      FastGlob2.escapePath = escapePath;
      function convertPathToPattern(source) {
        assertPatternsInput(source);
        return utils.path.convertPathToPattern(source);
      }
      FastGlob2.convertPathToPattern = convertPathToPattern;
      let posix2;
      (function(posix3) {
        function escapePath2(source) {
          assertPatternsInput(source);
          return utils.path.escapePosixPath(source);
        }
        posix3.escapePath = escapePath2;
        function convertPathToPattern2(source) {
          assertPatternsInput(source);
          return utils.path.convertPosixPathToPattern(source);
        }
        posix3.convertPathToPattern = convertPathToPattern2;
      })(posix2 = FastGlob2.posix || (FastGlob2.posix = {}));
      let win322;
      (function(win323) {
        function escapePath2(source) {
          assertPatternsInput(source);
          return utils.path.escapeWindowsPath(source);
        }
        win323.escapePath = escapePath2;
        function convertPathToPattern2(source) {
          assertPatternsInput(source);
          return utils.path.convertWindowsPathToPattern(source);
        }
        win323.convertPathToPattern = convertPathToPattern2;
      })(win322 = FastGlob2.win32 || (FastGlob2.win32 = {}));
    })(FastGlob || (FastGlob = {}));
    function getWorks(source, _Provider, options) {
      const patterns = [].concat(source);
      const settings = new settings_1.default(options);
      const tasks = taskManager.generate(patterns, settings);
      const provider = new _Provider(settings);
      return tasks.map(provider.read, provider);
    }
    function assertPatternsInput(input) {
      const source = [].concat(input);
      const isValidSource = source.every((item) => utils.string.isString(item) && !utils.string.isEmpty(item));
      if (!isValidSource) {
        throw new TypeError("Patterns must be a string (non empty) or an array of strings");
      }
    }
    module2.exports = FastGlob;
  }
});

// node_modules/.pnpm/path-type@4.0.0/node_modules/path-type/index.js
var require_path_type = __commonJS({
  "node_modules/.pnpm/path-type@4.0.0/node_modules/path-type/index.js"(exports2) {
    "use strict";
    var { promisify } = require("util");
    var fs5 = require("fs");
    async function isType(fsStatType, statsMethodName, filePath) {
      if (typeof filePath !== "string") {
        throw new TypeError(`Expected a string, got ${typeof filePath}`);
      }
      try {
        const stats = await promisify(fs5[fsStatType])(filePath);
        return stats[statsMethodName]();
      } catch (error) {
        if (error.code === "ENOENT") {
          return false;
        }
        throw error;
      }
    }
    function isTypeSync(fsStatType, statsMethodName, filePath) {
      if (typeof filePath !== "string") {
        throw new TypeError(`Expected a string, got ${typeof filePath}`);
      }
      try {
        return fs5[fsStatType](filePath)[statsMethodName]();
      } catch (error) {
        if (error.code === "ENOENT") {
          return false;
        }
        throw error;
      }
    }
    exports2.isFile = isType.bind(null, "stat", "isFile");
    exports2.isDirectory = isType.bind(null, "stat", "isDirectory");
    exports2.isSymlink = isType.bind(null, "lstat", "isSymbolicLink");
    exports2.isFileSync = isTypeSync.bind(null, "statSync", "isFile");
    exports2.isDirectorySync = isTypeSync.bind(null, "statSync", "isDirectory");
    exports2.isSymlinkSync = isTypeSync.bind(null, "lstatSync", "isSymbolicLink");
  }
});

// node_modules/.pnpm/dir-glob@3.0.1/node_modules/dir-glob/index.js
var require_dir_glob = __commonJS({
  "node_modules/.pnpm/dir-glob@3.0.1/node_modules/dir-glob/index.js"(exports2, module2) {
    "use strict";
    var path6 = require("path");
    var pathType = require_path_type();
    var getExtensions = (extensions) => extensions.length > 1 ? `{${extensions.join(",")}}` : extensions[0];
    var getPath = (filepath, cwd) => {
      const pth = filepath[0] === "!" ? filepath.slice(1) : filepath;
      return path6.isAbsolute(pth) ? pth : path6.join(cwd, pth);
    };
    var addExtensions = (file, extensions) => {
      if (path6.extname(file)) {
        return `**/${file}`;
      }
      return `**/${file}.${getExtensions(extensions)}`;
    };
    var getGlob = (directory, options) => {
      if (options.files && !Array.isArray(options.files)) {
        throw new TypeError(`Expected \`files\` to be of type \`Array\` but received type \`${typeof options.files}\``);
      }
      if (options.extensions && !Array.isArray(options.extensions)) {
        throw new TypeError(`Expected \`extensions\` to be of type \`Array\` but received type \`${typeof options.extensions}\``);
      }
      if (options.files && options.extensions) {
        return options.files.map((x) => path6.posix.join(directory, addExtensions(x, options.extensions)));
      }
      if (options.files) {
        return options.files.map((x) => path6.posix.join(directory, `**/${x}`));
      }
      if (options.extensions) {
        return [path6.posix.join(directory, `**/*.${getExtensions(options.extensions)}`)];
      }
      return [path6.posix.join(directory, "**")];
    };
    module2.exports = async (input, options) => {
      options = {
        cwd: process.cwd(),
        ...options
      };
      if (typeof options.cwd !== "string") {
        throw new TypeError(`Expected \`cwd\` to be of type \`string\` but received type \`${typeof options.cwd}\``);
      }
      const globs = await Promise.all([].concat(input).map(async (x) => {
        const isDirectory = await pathType.isDirectory(getPath(x, options.cwd));
        return isDirectory ? getGlob(x, options) : x;
      }));
      return [].concat.apply([], globs);
    };
    module2.exports.sync = (input, options) => {
      options = {
        cwd: process.cwd(),
        ...options
      };
      if (typeof options.cwd !== "string") {
        throw new TypeError(`Expected \`cwd\` to be of type \`string\` but received type \`${typeof options.cwd}\``);
      }
      const globs = [].concat(input).map((x) => pathType.isDirectorySync(getPath(x, options.cwd)) ? getGlob(x, options) : x);
      return [].concat.apply([], globs);
    };
  }
});

// node_modules/.pnpm/ignore@5.3.1/node_modules/ignore/index.js
var require_ignore = __commonJS({
  "node_modules/.pnpm/ignore@5.3.1/node_modules/ignore/index.js"(exports2, module2) {
    "use strict";
    function makeArray(subject) {
      return Array.isArray(subject) ? subject : [subject];
    }
    var EMPTY = "";
    var SPACE = " ";
    var ESCAPE = "\\";
    var REGEX_TEST_BLANK_LINE = /^\s+$/;
    var REGEX_INVALID_TRAILING_BACKSLASH = /(?:[^\\]|^)\\$/;
    var REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/;
    var REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/;
    var REGEX_SPLITALL_CRLF = /\r?\n/g;
    var REGEX_TEST_INVALID_PATH = /^\.*\/|^\.+$/;
    var SLASH = "/";
    var TMP_KEY_IGNORE = "node-ignore";
    if (typeof Symbol !== "undefined") {
      TMP_KEY_IGNORE = /* @__PURE__ */ Symbol.for("node-ignore");
    }
    var KEY_IGNORE = TMP_KEY_IGNORE;
    var define2 = (object, key, value) => Object.defineProperty(object, key, { value });
    var REGEX_REGEXP_RANGE = /([0-z])-([0-z])/g;
    var RETURN_FALSE = () => false;
    var sanitizeRange = (range2) => range2.replace(
      REGEX_REGEXP_RANGE,
      (match2, from, to) => from.charCodeAt(0) <= to.charCodeAt(0) ? match2 : EMPTY
    );
    var cleanRangeBackSlash = (slashes) => {
      const { length } = slashes;
      return slashes.slice(0, length - length % 2);
    };
    var REPLACERS = [
      [
        // remove BOM
        // TODO:
        // Other similar zero-width characters?
        /^\uFEFF/,
        () => EMPTY
      ],
      // > Trailing spaces are ignored unless they are quoted with backslash ("\")
      [
        // (a\ ) -> (a )
        // (a  ) -> (a)
        // (a \ ) -> (a  )
        /\\?\s+$/,
        (match2) => match2.indexOf("\\") === 0 ? SPACE : EMPTY
      ],
      // replace (\ ) with ' '
      [
        /\\\s/g,
        () => SPACE
      ],
      // Escape metacharacters
      // which is written down by users but means special for regular expressions.
      // > There are 12 characters with special meanings:
      // > - the backslash \,
      // > - the caret ^,
      // > - the dollar sign $,
      // > - the period or dot .,
      // > - the vertical bar or pipe symbol |,
      // > - the question mark ?,
      // > - the asterisk or star *,
      // > - the plus sign +,
      // > - the opening parenthesis (,
      // > - the closing parenthesis ),
      // > - and the opening square bracket [,
      // > - the opening curly brace {,
      // > These special characters are often called "metacharacters".
      [
        /[\\$.|*+(){^]/g,
        (match2) => `\\${match2}`
      ],
      [
        // > a question mark (?) matches a single character
        /(?!\\)\?/g,
        () => "[^/]"
      ],
      // leading slash
      [
        // > A leading slash matches the beginning of the pathname.
        // > For example, "/*.c" matches "cat-file.c" but not "mozilla-sha1/sha1.c".
        // A leading slash matches the beginning of the pathname
        /^\//,
        () => "^"
      ],
      // replace special metacharacter slash after the leading slash
      [
        /\//g,
        () => "\\/"
      ],
      [
        // > A leading "**" followed by a slash means match in all directories.
        // > For example, "**/foo" matches file or directory "foo" anywhere,
        // > the same as pattern "foo".
        // > "**/foo/bar" matches file or directory "bar" anywhere that is directly
        // >   under directory "foo".
        // Notice that the '*'s have been replaced as '\\*'
        /^\^*\\\*\\\*\\\//,
        // '**/foo' <-> 'foo'
        () => "^(?:.*\\/)?"
      ],
      // starting
      [
        // there will be no leading '/'
        //   (which has been replaced by section "leading slash")
        // If starts with '**', adding a '^' to the regular expression also works
        /^(?=[^^])/,
        function startingReplacer() {
          return !/\/(?!$)/.test(this) ? "(?:^|\\/)" : "^";
        }
      ],
      // two globstars
      [
        // Use lookahead assertions so that we could match more than one `'/**'`
        /\\\/\\\*\\\*(?=\\\/|$)/g,
        // Zero, one or several directories
        // should not use '*', or it will be replaced by the next replacer
        // Check if it is not the last `'/**'`
        (_, index, str) => index + 6 < str.length ? "(?:\\/[^\\/]+)*" : "\\/.+"
      ],
      // normal intermediate wildcards
      [
        // Never replace escaped '*'
        // ignore rule '\*' will match the path '*'
        // 'abc.*/' -> go
        // 'abc.*'  -> skip this rule,
        //    coz trailing single wildcard will be handed by [trailing wildcard]
        /(^|[^\\]+)(\\\*)+(?=.+)/g,
        // '*.js' matches '.js'
        // '*.js' doesn't match 'abc'
        (_, p1, p2) => {
          const unescaped = p2.replace(/\\\*/g, "[^\\/]*");
          return p1 + unescaped;
        }
      ],
      [
        // unescape, revert step 3 except for back slash
        // For example, if a user escape a '\\*',
        // after step 3, the result will be '\\\\\\*'
        /\\\\\\(?=[$.|*+(){^])/g,
        () => ESCAPE
      ],
      [
        // '\\\\' -> '\\'
        /\\\\/g,
        () => ESCAPE
      ],
      [
        // > The range notation, e.g. [a-zA-Z],
        // > can be used to match one of the characters in a range.
        // `\` is escaped by step 3
        /(\\)?\[([^\]/]*?)(\\*)($|\])/g,
        (match2, leadEscape, range2, endEscape, close) => leadEscape === ESCAPE ? `\\[${range2}${cleanRangeBackSlash(endEscape)}${close}` : close === "]" ? endEscape.length % 2 === 0 ? `[${sanitizeRange(range2)}${endEscape}]` : "[]" : "[]"
      ],
      // ending
      [
        // 'js' will not match 'js.'
        // 'ab' will not match 'abc'
        /(?:[^*])$/,
        // WTF!
        // https://git-scm.com/docs/gitignore
        // changes in [2.22.1](https://git-scm.com/docs/gitignore/2.22.1)
        // which re-fixes #24, #38
        // > If there is a separator at the end of the pattern then the pattern
        // > will only match directories, otherwise the pattern can match both
        // > files and directories.
        // 'js*' will not match 'a.js'
        // 'js/' will not match 'a.js'
        // 'js' will match 'a.js' and 'a.js/'
        (match2) => /\/$/.test(match2) ? `${match2}$` : `${match2}(?=$|\\/$)`
      ],
      // trailing wildcard
      [
        /(\^|\\\/)?\\\*$/,
        (_, p1) => {
          const prefix2 = p1 ? `${p1}[^/]+` : "[^/]*";
          return `${prefix2}(?=$|\\/$)`;
        }
      ]
    ];
    var regexCache = /* @__PURE__ */ Object.create(null);
    var makeRegex = (pattern, ignoreCase) => {
      let source = regexCache[pattern];
      if (!source) {
        source = REPLACERS.reduce(
          (prev, current) => prev.replace(current[0], current[1].bind(pattern)),
          pattern
        );
        regexCache[pattern] = source;
      }
      return ignoreCase ? new RegExp(source, "i") : new RegExp(source);
    };
    var isString = (subject) => typeof subject === "string";
    var checkPattern = (pattern) => pattern && isString(pattern) && !REGEX_TEST_BLANK_LINE.test(pattern) && !REGEX_INVALID_TRAILING_BACKSLASH.test(pattern) && pattern.indexOf("#") !== 0;
    var splitPattern = (pattern) => pattern.split(REGEX_SPLITALL_CRLF);
    var IgnoreRule = class {
      constructor(origin, pattern, negative, regex) {
        this.origin = origin;
        this.pattern = pattern;
        this.negative = negative;
        this.regex = regex;
      }
    };
    var createRule = (pattern, ignoreCase) => {
      const origin = pattern;
      let negative = false;
      if (pattern.indexOf("!") === 0) {
        negative = true;
        pattern = pattern.substr(1);
      }
      pattern = pattern.replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, "!").replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, "#");
      const regex = makeRegex(pattern, ignoreCase);
      return new IgnoreRule(
        origin,
        pattern,
        negative,
        regex
      );
    };
    var throwError = (message, Ctor) => {
      throw new Ctor(message);
    };
    var checkPath = (path6, originalPath, doThrow) => {
      if (!isString(path6)) {
        return doThrow(
          `path must be a string, but got \`${originalPath}\``,
          TypeError
        );
      }
      if (!path6) {
        return doThrow(`path must not be empty`, TypeError);
      }
      if (checkPath.isNotRelative(path6)) {
        const r = "`path.relative()`d";
        return doThrow(
          `path should be a ${r} string, but got "${originalPath}"`,
          RangeError
        );
      }
      return true;
    };
    var isNotRelative = (path6) => REGEX_TEST_INVALID_PATH.test(path6);
    checkPath.isNotRelative = isNotRelative;
    checkPath.convert = (p) => p;
    var Ignore2 = class {
      constructor({
        ignorecase = true,
        ignoreCase = ignorecase,
        allowRelativePaths = false
      } = {}) {
        define2(this, KEY_IGNORE, true);
        this._rules = [];
        this._ignoreCase = ignoreCase;
        this._allowRelativePaths = allowRelativePaths;
        this._initCache();
      }
      _initCache() {
        this._ignoreCache = /* @__PURE__ */ Object.create(null);
        this._testCache = /* @__PURE__ */ Object.create(null);
      }
      _addPattern(pattern) {
        if (pattern && pattern[KEY_IGNORE]) {
          this._rules = this._rules.concat(pattern._rules);
          this._added = true;
          return;
        }
        if (checkPattern(pattern)) {
          const rule = createRule(pattern, this._ignoreCase);
          this._added = true;
          this._rules.push(rule);
        }
      }
      // @param {Array<string> | string | Ignore} pattern
      add(pattern) {
        this._added = false;
        makeArray(
          isString(pattern) ? splitPattern(pattern) : pattern
        ).forEach(this._addPattern, this);
        if (this._added) {
          this._initCache();
        }
        return this;
      }
      // legacy
      addPattern(pattern) {
        return this.add(pattern);
      }
      //          |           ignored : unignored
      // negative |   0:0   |   0:1   |   1:0   |   1:1
      // -------- | ------- | ------- | ------- | --------
      //     0    |  TEST   |  TEST   |  SKIP   |    X
      //     1    |  TESTIF |  SKIP   |  TEST   |    X
      // - SKIP: always skip
      // - TEST: always test
      // - TESTIF: only test if checkUnignored
      // - X: that never happen
      // @param {boolean} whether should check if the path is unignored,
      //   setting `checkUnignored` to `false` could reduce additional
      //   path matching.
      // @returns {TestResult} true if a file is ignored
      _testOne(path6, checkUnignored) {
        let ignored = false;
        let unignored = false;
        this._rules.forEach((rule) => {
          const { negative } = rule;
          if (unignored === negative && ignored !== unignored || negative && !ignored && !unignored && !checkUnignored) {
            return;
          }
          const matched = rule.regex.test(path6);
          if (matched) {
            ignored = !negative;
            unignored = negative;
          }
        });
        return {
          ignored,
          unignored
        };
      }
      // @returns {TestResult}
      _test(originalPath, cache, checkUnignored, slices) {
        const path6 = originalPath && checkPath.convert(originalPath);
        checkPath(
          path6,
          originalPath,
          this._allowRelativePaths ? RETURN_FALSE : throwError
        );
        return this._t(path6, cache, checkUnignored, slices);
      }
      _t(path6, cache, checkUnignored, slices) {
        if (path6 in cache) {
          return cache[path6];
        }
        if (!slices) {
          slices = path6.split(SLASH);
        }
        slices.pop();
        if (!slices.length) {
          return cache[path6] = this._testOne(path6, checkUnignored);
        }
        const parent = this._t(
          slices.join(SLASH) + SLASH,
          cache,
          checkUnignored,
          slices
        );
        return cache[path6] = parent.ignored ? parent : this._testOne(path6, checkUnignored);
      }
      ignores(path6) {
        return this._test(path6, this._ignoreCache, false).ignored;
      }
      createFilter() {
        return (path6) => !this.ignores(path6);
      }
      filter(paths) {
        return makeArray(paths).filter(this.createFilter());
      }
      // @returns {TestResult}
      test(path6) {
        return this._test(path6, this._testCache, true);
      }
    };
    var factory = (options) => new Ignore2(options);
    var isPathValid = (path6) => checkPath(path6 && checkPath.convert(path6), path6, RETURN_FALSE);
    factory.isPathValid = isPathValid;
    factory.default = factory;
    module2.exports = factory;
    if (
      // Detect `process` so that it can run in browsers.
      typeof process !== "undefined" && (process.env && process.env.IGNORE_TEST_WIN32 || process.platform === "win32")
    ) {
      const makePosix = (str) => /^\\\\\?\\/.test(str) || /["<>|\u0000-\u001F]+/u.test(str) ? str : str.replace(/\\/g, "/");
      checkPath.convert = makePosix;
      const REGIX_IS_WINDOWS_PATH_ABSOLUTE = /^[a-z]:\//i;
      checkPath.isNotRelative = (path6) => REGIX_IS_WINDOWS_PATH_ABSOLUTE.test(path6) || isNotRelative(path6);
    }
  }
});

// node_modules/.pnpm/slash@3.0.0/node_modules/slash/index.js
var require_slash = __commonJS({
  "node_modules/.pnpm/slash@3.0.0/node_modules/slash/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (path6) => {
      const isExtendedLengthPath = /^\\\\\?\\/.test(path6);
      const hasNonAscii = /[^\u0000-\u0080]+/.test(path6);
      if (isExtendedLengthPath || hasNonAscii) {
        return path6;
      }
      return path6.replace(/\\/g, "/");
    };
  }
});

// node_modules/.pnpm/globby@11.1.0/node_modules/globby/gitignore.js
var require_gitignore = __commonJS({
  "node_modules/.pnpm/globby@11.1.0/node_modules/globby/gitignore.js"(exports2, module2) {
    "use strict";
    var { promisify } = require("util");
    var fs5 = require("fs");
    var path6 = require("path");
    var fastGlob = require_out4();
    var gitIgnore = require_ignore();
    var slash = require_slash();
    var DEFAULT_IGNORE = [
      "**/node_modules/**",
      "**/flow-typed/**",
      "**/coverage/**",
      "**/.git"
    ];
    var readFileP = promisify(fs5.readFile);
    var mapGitIgnorePatternTo = (base) => (ignore) => {
      if (ignore.startsWith("!")) {
        return "!" + path6.posix.join(base, ignore.slice(1));
      }
      return path6.posix.join(base, ignore);
    };
    var parseGitIgnore = (content, options) => {
      const base = slash(path6.relative(options.cwd, path6.dirname(options.fileName)));
      return content.split(/\r?\n/).filter(Boolean).filter((line) => !line.startsWith("#")).map(mapGitIgnorePatternTo(base));
    };
    var reduceIgnore = (files) => {
      const ignores = gitIgnore();
      for (const file of files) {
        ignores.add(parseGitIgnore(file.content, {
          cwd: file.cwd,
          fileName: file.filePath
        }));
      }
      return ignores;
    };
    var ensureAbsolutePathForCwd = (cwd, p) => {
      cwd = slash(cwd);
      if (path6.isAbsolute(p)) {
        if (slash(p).startsWith(cwd)) {
          return p;
        }
        throw new Error(`Path ${p} is not in cwd ${cwd}`);
      }
      return path6.join(cwd, p);
    };
    var getIsIgnoredPredecate = (ignores, cwd) => {
      return (p) => ignores.ignores(slash(path6.relative(cwd, ensureAbsolutePathForCwd(cwd, p.path || p))));
    };
    var getFile = async (file, cwd) => {
      const filePath = path6.join(cwd, file);
      const content = await readFileP(filePath, "utf8");
      return {
        cwd,
        filePath,
        content
      };
    };
    var getFileSync = (file, cwd) => {
      const filePath = path6.join(cwd, file);
      const content = fs5.readFileSync(filePath, "utf8");
      return {
        cwd,
        filePath,
        content
      };
    };
    var normalizeOptions = ({
      ignore = [],
      cwd = slash(process.cwd())
    } = {}) => {
      return { ignore, cwd };
    };
    module2.exports = async (options) => {
      options = normalizeOptions(options);
      const paths = await fastGlob("**/.gitignore", {
        ignore: DEFAULT_IGNORE.concat(options.ignore),
        cwd: options.cwd
      });
      const files = await Promise.all(paths.map((file) => getFile(file, options.cwd)));
      const ignores = reduceIgnore(files);
      return getIsIgnoredPredecate(ignores, options.cwd);
    };
    module2.exports.sync = (options) => {
      options = normalizeOptions(options);
      const paths = fastGlob.sync("**/.gitignore", {
        ignore: DEFAULT_IGNORE.concat(options.ignore),
        cwd: options.cwd
      });
      const files = paths.map((file) => getFileSync(file, options.cwd));
      const ignores = reduceIgnore(files);
      return getIsIgnoredPredecate(ignores, options.cwd);
    };
  }
});

// node_modules/.pnpm/globby@11.1.0/node_modules/globby/stream-utils.js
var require_stream_utils = __commonJS({
  "node_modules/.pnpm/globby@11.1.0/node_modules/globby/stream-utils.js"(exports2, module2) {
    "use strict";
    var { Transform } = require("stream");
    var ObjectTransform = class extends Transform {
      constructor() {
        super({
          objectMode: true
        });
      }
    };
    var FilterStream = class extends ObjectTransform {
      constructor(filter2) {
        super();
        this._filter = filter2;
      }
      _transform(data, encoding, callback) {
        if (this._filter(data)) {
          this.push(data);
        }
        callback();
      }
    };
    var UniqueStream = class extends ObjectTransform {
      constructor() {
        super();
        this._pushed = /* @__PURE__ */ new Set();
      }
      _transform(data, encoding, callback) {
        if (!this._pushed.has(data)) {
          this.push(data);
          this._pushed.add(data);
        }
        callback();
      }
    };
    module2.exports = {
      FilterStream,
      UniqueStream
    };
  }
});

// node_modules/.pnpm/globby@11.1.0/node_modules/globby/index.js
var require_globby = __commonJS({
  "node_modules/.pnpm/globby@11.1.0/node_modules/globby/index.js"(exports2, module2) {
    "use strict";
    var fs5 = require("fs");
    var arrayUnion = require_array_union();
    var merge2 = require_merge2();
    var fastGlob = require_out4();
    var dirGlob = require_dir_glob();
    var gitignore = require_gitignore();
    var { FilterStream, UniqueStream } = require_stream_utils();
    var DEFAULT_FILTER = () => false;
    var isNegative = (pattern) => pattern[0] === "!";
    var assertPatternsInput = (patterns) => {
      if (!patterns.every((pattern) => typeof pattern === "string")) {
        throw new TypeError("Patterns must be a string or an array of strings");
      }
    };
    var checkCwdOption = (options = {}) => {
      if (!options.cwd) {
        return;
      }
      let stat;
      try {
        stat = fs5.statSync(options.cwd);
      } catch {
        return;
      }
      if (!stat.isDirectory()) {
        throw new Error("The `cwd` option must be a path to a directory");
      }
    };
    var getPathString = (p) => p.stats instanceof fs5.Stats ? p.path : p;
    var generateGlobTasks = (patterns, taskOptions) => {
      patterns = arrayUnion([].concat(patterns));
      assertPatternsInput(patterns);
      checkCwdOption(taskOptions);
      const globTasks = [];
      taskOptions = {
        ignore: [],
        expandDirectories: true,
        ...taskOptions
      };
      for (const [index, pattern] of patterns.entries()) {
        if (isNegative(pattern)) {
          continue;
        }
        const ignore = patterns.slice(index).filter((pattern2) => isNegative(pattern2)).map((pattern2) => pattern2.slice(1));
        const options = {
          ...taskOptions,
          ignore: taskOptions.ignore.concat(ignore)
        };
        globTasks.push({ pattern, options });
      }
      return globTasks;
    };
    var globDirs = (task, fn) => {
      let options = {};
      if (task.options.cwd) {
        options.cwd = task.options.cwd;
      }
      if (Array.isArray(task.options.expandDirectories)) {
        options = {
          ...options,
          files: task.options.expandDirectories
        };
      } else if (typeof task.options.expandDirectories === "object") {
        options = {
          ...options,
          ...task.options.expandDirectories
        };
      }
      return fn(task.pattern, options);
    };
    var getPattern = (task, fn) => task.options.expandDirectories ? globDirs(task, fn) : [task.pattern];
    var getFilterSync = (options) => {
      return options && options.gitignore ? gitignore.sync({ cwd: options.cwd, ignore: options.ignore }) : DEFAULT_FILTER;
    };
    var globToTask = (task) => (glob2) => {
      const { options } = task;
      if (options.ignore && Array.isArray(options.ignore) && options.expandDirectories) {
        options.ignore = dirGlob.sync(options.ignore);
      }
      return {
        pattern: glob2,
        options
      };
    };
    module2.exports = async (patterns, options) => {
      const globTasks = generateGlobTasks(patterns, options);
      const getFilter = async () => {
        return options && options.gitignore ? gitignore({ cwd: options.cwd, ignore: options.ignore }) : DEFAULT_FILTER;
      };
      const getTasks = async () => {
        const tasks2 = await Promise.all(globTasks.map(async (task) => {
          const globs = await getPattern(task, dirGlob);
          return Promise.all(globs.map(globToTask(task)));
        }));
        return arrayUnion(...tasks2);
      };
      const [filter2, tasks] = await Promise.all([getFilter(), getTasks()]);
      const paths = await Promise.all(tasks.map((task) => fastGlob(task.pattern, task.options)));
      return arrayUnion(...paths).filter((path_) => !filter2(getPathString(path_)));
    };
    module2.exports.sync = (patterns, options) => {
      const globTasks = generateGlobTasks(patterns, options);
      const tasks = [];
      for (const task of globTasks) {
        const newTask = getPattern(task, dirGlob.sync).map(globToTask(task));
        tasks.push(...newTask);
      }
      const filter2 = getFilterSync(options);
      let matches = [];
      for (const task of tasks) {
        matches = arrayUnion(matches, fastGlob.sync(task.pattern, task.options));
      }
      return matches.filter((path_) => !filter2(path_));
    };
    module2.exports.stream = (patterns, options) => {
      const globTasks = generateGlobTasks(patterns, options);
      const tasks = [];
      for (const task of globTasks) {
        const newTask = getPattern(task, dirGlob.sync).map(globToTask(task));
        tasks.push(...newTask);
      }
      const filter2 = getFilterSync(options);
      const filterStream = new FilterStream((p) => !filter2(p));
      const uniqueStream = new UniqueStream();
      return merge2(tasks.map((task) => fastGlob.stream(task.pattern, task.options))).pipe(filterStream).pipe(uniqueStream);
    };
    module2.exports.generateGlobTasks = generateGlobTasks;
    module2.exports.hasMagic = (patterns, options) => [].concat(patterns).some((pattern) => fastGlob.isDynamicPattern(pattern, options));
    module2.exports.gitignore = gitignore;
  }
});

// node_modules/.pnpm/pify@4.0.1/node_modules/pify/index.js
var require_pify = __commonJS({
  "node_modules/.pnpm/pify@4.0.1/node_modules/pify/index.js"(exports2, module2) {
    "use strict";
    var processFn = (fn, options) => function(...args) {
      const P = options.promiseModule;
      return new P((resolve, reject) => {
        if (options.multiArgs) {
          args.push((...result) => {
            if (options.errorFirst) {
              if (result[0]) {
                reject(result);
              } else {
                result.shift();
                resolve(result);
              }
            } else {
              resolve(result);
            }
          });
        } else if (options.errorFirst) {
          args.push((error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        } else {
          args.push(resolve);
        }
        fn.apply(this, args);
      });
    };
    module2.exports = (input, options) => {
      options = Object.assign({
        exclude: [/.+(Sync|Stream)$/],
        errorFirst: true,
        promiseModule: Promise
      }, options);
      const objType = typeof input;
      if (!(input !== null && (objType === "object" || objType === "function"))) {
        throw new TypeError(`Expected \`input\` to be a \`Function\` or \`Object\`, got \`${input === null ? "null" : objType}\``);
      }
      const filter2 = (key) => {
        const match2 = (pattern) => typeof pattern === "string" ? key === pattern : pattern.test(key);
        return options.include ? options.include.some(match2) : !options.exclude.some(match2);
      };
      let ret;
      if (objType === "function") {
        ret = function(...args) {
          return options.excludeMain ? input(...args) : processFn(input, options).apply(this, args);
        };
      } else {
        ret = Object.create(Object.getPrototypeOf(input));
      }
      for (const key in input) {
        const property = input[key];
        ret[key] = typeof property === "function" && filter2(key) ? processFn(property, options) : property;
      }
      return ret;
    };
  }
});

// node_modules/.pnpm/strip-bom@3.0.0/node_modules/strip-bom/index.js
var require_strip_bom = __commonJS({
  "node_modules/.pnpm/strip-bom@3.0.0/node_modules/strip-bom/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (x) => {
      if (typeof x !== "string") {
        throw new TypeError("Expected a string, got " + typeof x);
      }
      if (x.charCodeAt(0) === 65279) {
        return x.slice(1);
      }
      return x;
    };
  }
});

// node_modules/.pnpm/read-yaml-file@1.1.0/node_modules/read-yaml-file/index.js
var require_read_yaml_file = __commonJS({
  "node_modules/.pnpm/read-yaml-file@1.1.0/node_modules/read-yaml-file/index.js"(exports2, module2) {
    "use strict";
    var fs5 = require_graceful_fs();
    var pify = require_pify();
    var stripBom = require_strip_bom();
    var yaml2 = require("js-yaml");
    var parse = (data) => yaml2.safeLoad(stripBom(data));
    var readYamlFile = (fp) => pify(fs5.readFile)(fp, "utf8").then((data) => parse(data));
    module2.exports = readYamlFile;
    module2.exports.default = readYamlFile;
    module2.exports.sync = (fp) => parse(fs5.readFileSync(fp, "utf8"));
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function() {
    var self2 = this, args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self2, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
var init_asyncToGenerator = __esm({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js"() {
    "use strict";
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/classCallCheck.js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var init_classCallCheck = __esm({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/classCallCheck.js"() {
    "use strict";
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
var init_typeof = __esm({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/typeof.js"() {
    "use strict";
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(self2) {
  if (self2 === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self2;
}
var init_assertThisInitialized = __esm({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js"() {
    "use strict";
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js
function _possibleConstructorReturn(self2, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self2);
}
var init_possibleConstructorReturn = __esm({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js"() {
    "use strict";
    init_typeof();
    init_assertThisInitialized();
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf(o);
}
var init_getPrototypeOf = __esm({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js"() {
    "use strict";
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf(o, p);
}
var init_setPrototypeOf = __esm({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js"() {
    "use strict";
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/inherits.js
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
var init_inherits = __esm({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/inherits.js"() {
    "use strict";
    init_setPrototypeOf();
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/isNativeFunction.js
function _isNativeFunction(fn) {
  try {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  } catch (e) {
    return typeof fn === "function";
  }
}
var init_isNativeFunction = __esm({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/isNativeFunction.js"() {
    "use strict";
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch (t2) {
  }
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct2() {
    return !!t;
  })();
}
var init_isNativeReflectConstruct = __esm({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js"() {
    "use strict";
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/construct.js
function _construct(t, e, r) {
  if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && _setPrototypeOf(p, r.prototype), p;
}
var init_construct = __esm({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/construct.js"() {
    "use strict";
    init_setPrototypeOf();
    init_isNativeReflectConstruct();
  }
});

// node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js
function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
  _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
    if (Class2 === null || !_isNativeFunction(Class2)) return Class2;
    if (typeof Class2 !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class2)) return _cache.get(Class2);
      _cache.set(Class2, Wrapper);
    }
    function Wrapper() {
      return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class2.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class2);
  };
  return _wrapNativeSuper(Class);
}
var init_wrapNativeSuper = __esm({
  "node_modules/.pnpm/@babel+runtime@7.24.0/node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js"() {
    "use strict";
    init_getPrototypeOf();
    init_setPrototypeOf();
    init_isNativeFunction();
    init_construct();
  }
});

// node_modules/.pnpm/p-try@2.2.0/node_modules/p-try/index.js
var require_p_try = __commonJS({
  "node_modules/.pnpm/p-try@2.2.0/node_modules/p-try/index.js"(exports2, module2) {
    "use strict";
    var pTry = (fn, ...arguments_) => new Promise((resolve) => {
      resolve(fn(...arguments_));
    });
    module2.exports = pTry;
    module2.exports.default = pTry;
  }
});

// node_modules/.pnpm/p-limit@2.3.0/node_modules/p-limit/index.js
var require_p_limit = __commonJS({
  "node_modules/.pnpm/p-limit@2.3.0/node_modules/p-limit/index.js"(exports2, module2) {
    "use strict";
    var pTry = require_p_try();
    var pLimit = (concurrency) => {
      if (!((Number.isInteger(concurrency) || concurrency === Infinity) && concurrency > 0)) {
        return Promise.reject(new TypeError("Expected `concurrency` to be a number from 1 and up"));
      }
      const queue = [];
      let activeCount = 0;
      const next = () => {
        activeCount--;
        if (queue.length > 0) {
          queue.shift()();
        }
      };
      const run = (fn, resolve, ...args) => {
        activeCount++;
        const result = pTry(fn, ...args);
        resolve(result);
        result.then(next, next);
      };
      const enqueue = (fn, resolve, ...args) => {
        if (activeCount < concurrency) {
          run(fn, resolve, ...args);
        } else {
          queue.push(run.bind(null, fn, resolve, ...args));
        }
      };
      const generator = (fn, ...args) => new Promise((resolve) => enqueue(fn, resolve, ...args));
      Object.defineProperties(generator, {
        activeCount: {
          get: () => activeCount
        },
        pendingCount: {
          get: () => queue.length
        },
        clearQueue: {
          value: () => {
            queue.length = 0;
          }
        }
      });
      return generator;
    };
    module2.exports = pLimit;
    module2.exports.default = pLimit;
  }
});

// node_modules/.pnpm/p-locate@4.1.0/node_modules/p-locate/index.js
var require_p_locate = __commonJS({
  "node_modules/.pnpm/p-locate@4.1.0/node_modules/p-locate/index.js"(exports2, module2) {
    "use strict";
    var pLimit = require_p_limit();
    var EndError = class extends Error {
      constructor(value) {
        super();
        this.value = value;
      }
    };
    var testElement = async (element, tester) => tester(await element);
    var finder = async (element) => {
      const values = await Promise.all(element);
      if (values[1] === true) {
        throw new EndError(values[0]);
      }
      return false;
    };
    var pLocate = async (iterable, tester, options) => {
      options = {
        concurrency: Infinity,
        preserveOrder: true,
        ...options
      };
      const limit = pLimit(options.concurrency);
      const items = [...iterable].map((element) => [element, limit(testElement, element, tester)]);
      const checkLimit = pLimit(options.preserveOrder ? 1 : Infinity);
      try {
        await Promise.all(items.map((element) => checkLimit(finder, element)));
      } catch (error) {
        if (error instanceof EndError) {
          return error.value;
        }
        throw error;
      }
    };
    module2.exports = pLocate;
    module2.exports.default = pLocate;
  }
});

// node_modules/.pnpm/locate-path@5.0.0/node_modules/locate-path/index.js
var require_locate_path = __commonJS({
  "node_modules/.pnpm/locate-path@5.0.0/node_modules/locate-path/index.js"(exports2, module2) {
    "use strict";
    var path6 = require("path");
    var fs5 = require("fs");
    var { promisify } = require("util");
    var pLocate = require_p_locate();
    var fsStat = promisify(fs5.stat);
    var fsLStat = promisify(fs5.lstat);
    var typeMappings = {
      directory: "isDirectory",
      file: "isFile"
    };
    function checkType({ type }) {
      if (type in typeMappings) {
        return;
      }
      throw new Error(`Invalid type specified: ${type}`);
    }
    var matchType = (type, stat) => type === void 0 || stat[typeMappings[type]]();
    module2.exports = async (paths, options) => {
      options = {
        cwd: process.cwd(),
        type: "file",
        allowSymlinks: true,
        ...options
      };
      checkType(options);
      const statFn = options.allowSymlinks ? fsStat : fsLStat;
      return pLocate(paths, async (path_) => {
        try {
          const stat = await statFn(path6.resolve(options.cwd, path_));
          return matchType(options.type, stat);
        } catch (_) {
          return false;
        }
      }, options);
    };
    module2.exports.sync = (paths, options) => {
      options = {
        cwd: process.cwd(),
        allowSymlinks: true,
        type: "file",
        ...options
      };
      checkType(options);
      const statFn = options.allowSymlinks ? fs5.statSync : fs5.lstatSync;
      for (const path_ of paths) {
        try {
          const stat = statFn(path6.resolve(options.cwd, path_));
          if (matchType(options.type, stat)) {
            return path_;
          }
        } catch (_) {
        }
      }
    };
  }
});

// node_modules/.pnpm/path-exists@4.0.0/node_modules/path-exists/index.js
var require_path_exists3 = __commonJS({
  "node_modules/.pnpm/path-exists@4.0.0/node_modules/path-exists/index.js"(exports2, module2) {
    "use strict";
    var fs5 = require("fs");
    var { promisify } = require("util");
    var pAccess = promisify(fs5.access);
    module2.exports = async (path6) => {
      try {
        await pAccess(path6);
        return true;
      } catch (_) {
        return false;
      }
    };
    module2.exports.sync = (path6) => {
      try {
        fs5.accessSync(path6);
        return true;
      } catch (_) {
        return false;
      }
    };
  }
});

// node_modules/.pnpm/find-up@4.1.0/node_modules/find-up/index.js
var require_find_up = __commonJS({
  "node_modules/.pnpm/find-up@4.1.0/node_modules/find-up/index.js"(exports2, module2) {
    "use strict";
    var path6 = require("path");
    var locatePath = require_locate_path();
    var pathExists = require_path_exists3();
    var stop = /* @__PURE__ */ Symbol("findUp.stop");
    module2.exports = async (name, options = {}) => {
      let directory = path6.resolve(options.cwd || "");
      const { root } = path6.parse(directory);
      const paths = [].concat(name);
      const runMatcher = async (locateOptions) => {
        if (typeof name !== "function") {
          return locatePath(paths, locateOptions);
        }
        const foundPath = await name(locateOptions.cwd);
        if (typeof foundPath === "string") {
          return locatePath([foundPath], locateOptions);
        }
        return foundPath;
      };
      while (true) {
        const foundPath = await runMatcher({ ...options, cwd: directory });
        if (foundPath === stop) {
          return;
        }
        if (foundPath) {
          return path6.resolve(directory, foundPath);
        }
        if (directory === root) {
          return;
        }
        directory = path6.dirname(directory);
      }
    };
    module2.exports.sync = (name, options = {}) => {
      let directory = path6.resolve(options.cwd || "");
      const { root } = path6.parse(directory);
      const paths = [].concat(name);
      const runMatcher = (locateOptions) => {
        if (typeof name !== "function") {
          return locatePath.sync(paths, locateOptions);
        }
        const foundPath = name(locateOptions.cwd);
        if (typeof foundPath === "string") {
          return locatePath.sync([foundPath], locateOptions);
        }
        return foundPath;
      };
      while (true) {
        const foundPath = runMatcher({ ...options, cwd: directory });
        if (foundPath === stop) {
          return;
        }
        if (foundPath) {
          return path6.resolve(directory, foundPath);
        }
        if (directory === root) {
          return;
        }
        directory = path6.dirname(directory);
      }
    };
    module2.exports.exists = pathExists;
    module2.exports.sync.exists = pathExists.sync;
    module2.exports.stop = stop;
  }
});

// node_modules/.pnpm/@manypkg+find-root@1.1.0/node_modules/@manypkg/find-root/dist/find-root.esm.js
var find_root_esm_exports = {};
__export(find_root_esm_exports, {
  NoPkgJsonFound: () => NoPkgJsonFound,
  findRoot: () => findRoot,
  findRootSync: () => findRootSync
});
function hasWorkspacesConfiguredViaPkgJson(_x, _x2) {
  return _hasWorkspacesConfiguredViaPkgJson.apply(this, arguments);
}
function _hasWorkspacesConfiguredViaPkgJson() {
  _hasWorkspacesConfiguredViaPkgJson = _asyncToGenerator(
    /* @__PURE__ */ import_regenerator.default.mark(function _callee(directory, firstPkgJsonDirRef) {
      var pkgJson;
      return import_regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return import_fs_extra.default.readJson(import_path.default.join(directory, "package.json"));
            case 3:
              pkgJson = _context.sent;
              if (firstPkgJsonDirRef.current === void 0) {
                firstPkgJsonDirRef.current = directory;
              }
              if (!(pkgJson.workspaces || pkgJson.bolt)) {
                _context.next = 7;
                break;
              }
              return _context.abrupt("return", directory);
            case 7:
              _context.next = 13;
              break;
            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](0);
              if (!(_context.t0.code !== "ENOENT")) {
                _context.next = 13;
                break;
              }
              throw _context.t0;
            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 9]]);
    })
  );
  return _hasWorkspacesConfiguredViaPkgJson.apply(this, arguments);
}
function hasWorkspacesConfiguredViaLerna(_x3) {
  return _hasWorkspacesConfiguredViaLerna.apply(this, arguments);
}
function _hasWorkspacesConfiguredViaLerna() {
  _hasWorkspacesConfiguredViaLerna = _asyncToGenerator(
    /* @__PURE__ */ import_regenerator.default.mark(function _callee2(directory) {
      var lernaJson;
      return import_regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return import_fs_extra.default.readJson(import_path.default.join(directory, "lerna.json"));
            case 3:
              lernaJson = _context2.sent;
              if (!(lernaJson.useWorkspaces !== true)) {
                _context2.next = 6;
                break;
              }
              return _context2.abrupt("return", directory);
            case 6:
              _context2.next = 12;
              break;
            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](0);
              if (!(_context2.t0.code !== "ENOENT")) {
                _context2.next = 12;
                break;
              }
              throw _context2.t0;
            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 8]]);
    })
  );
  return _hasWorkspacesConfiguredViaLerna.apply(this, arguments);
}
function hasWorkspacesConfiguredViaPnpm(_x4) {
  return _hasWorkspacesConfiguredViaPnpm.apply(this, arguments);
}
function _hasWorkspacesConfiguredViaPnpm() {
  _hasWorkspacesConfiguredViaPnpm = _asyncToGenerator(
    /* @__PURE__ */ import_regenerator.default.mark(function _callee3(directory) {
      var pnpmWorkspacesFileExists;
      return import_regenerator.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return import_fs_extra.default.exists(import_path.default.join(directory, "pnpm-workspace.yaml"));
            case 2:
              pnpmWorkspacesFileExists = _context3.sent;
              if (!pnpmWorkspacesFileExists) {
                _context3.next = 5;
                break;
              }
              return _context3.abrupt("return", directory);
            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })
  );
  return _hasWorkspacesConfiguredViaPnpm.apply(this, arguments);
}
function findRoot(_x5) {
  return _findRoot.apply(this, arguments);
}
function _findRoot() {
  _findRoot = _asyncToGenerator(
    /* @__PURE__ */ import_regenerator.default.mark(function _callee4(cwd) {
      var firstPkgJsonDirRef, dir;
      return import_regenerator.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              firstPkgJsonDirRef = {
                current: void 0
              };
              _context4.next = 3;
              return (0, import_find_up.default)(function(directory) {
                return Promise.all([hasWorkspacesConfiguredViaLerna(directory), hasWorkspacesConfiguredViaPkgJson(directory, firstPkgJsonDirRef), hasWorkspacesConfiguredViaPnpm(directory)]).then(function(x) {
                  return x.find(function(dir2) {
                    return dir2;
                  });
                });
              }, {
                cwd,
                type: "directory"
              });
            case 3:
              dir = _context4.sent;
              if (!(firstPkgJsonDirRef.current === void 0)) {
                _context4.next = 6;
                break;
              }
              throw new NoPkgJsonFound(cwd);
            case 6:
              if (!(dir === void 0)) {
                _context4.next = 8;
                break;
              }
              return _context4.abrupt("return", firstPkgJsonDirRef.current);
            case 8:
              return _context4.abrupt("return", dir);
            case 9:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })
  );
  return _findRoot.apply(this, arguments);
}
function hasWorkspacesConfiguredViaPkgJsonSync(directory, firstPkgJsonDirRef) {
  try {
    var pkgJson = import_fs_extra.default.readJsonSync(import_path.default.join(directory, "package.json"));
    if (firstPkgJsonDirRef.current === void 0) {
      firstPkgJsonDirRef.current = directory;
    }
    if (pkgJson.workspaces || pkgJson.bolt) {
      return directory;
    }
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
}
function hasWorkspacesConfiguredViaLernaSync(directory) {
  try {
    var lernaJson = import_fs_extra.default.readJsonSync(import_path.default.join(directory, "lerna.json"));
    if (lernaJson.useWorkspaces !== true) {
      return directory;
    }
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
}
function hasWorkspacesConfiguredViaPnpmSync(directory) {
  var pnpmWorkspacesFileExists = import_fs_extra.default.existsSync(import_path.default.join(directory, "pnpm-workspace.yaml"));
  if (pnpmWorkspacesFileExists) {
    return directory;
  }
}
function findRootSync(cwd) {
  var firstPkgJsonDirRef = {
    current: void 0
  };
  var dir = (0, import_find_up.sync)(function(directory) {
    return [hasWorkspacesConfiguredViaLernaSync(directory), hasWorkspacesConfiguredViaPkgJsonSync(directory, firstPkgJsonDirRef), hasWorkspacesConfiguredViaPnpmSync(directory)].find(function(dir2) {
      return dir2;
    });
  }, {
    cwd,
    type: "directory"
  });
  if (firstPkgJsonDirRef.current === void 0) {
    throw new NoPkgJsonFound(cwd);
  }
  if (dir === void 0) {
    return firstPkgJsonDirRef.current;
  }
  return dir;
}
var import_regenerator, import_find_up, import_path, import_fs_extra, NoPkgJsonFound;
var init_find_root_esm = __esm({
  "node_modules/.pnpm/@manypkg+find-root@1.1.0/node_modules/@manypkg/find-root/dist/find-root.esm.js"() {
    "use strict";
    import_regenerator = __toESM(require_regenerator());
    init_asyncToGenerator();
    init_classCallCheck();
    init_possibleConstructorReturn();
    init_getPrototypeOf();
    init_inherits();
    init_wrapNativeSuper();
    import_find_up = __toESM(require_find_up());
    import_path = __toESM(require("path"));
    import_fs_extra = __toESM(require_lib2());
    NoPkgJsonFound = /* @__PURE__ */ (function(_Error) {
      _inherits(NoPkgJsonFound2, _Error);
      function NoPkgJsonFound2(directory) {
        var _this;
        _classCallCheck(this, NoPkgJsonFound2);
        _this = _possibleConstructorReturn(this, _getPrototypeOf(NoPkgJsonFound2).call(this, "No package.json could be found upwards from the directory ".concat(directory)));
        _this.directory = directory;
        return _this;
      }
      return NoPkgJsonFound2;
    })(_wrapNativeSuper(Error));
  }
});

// node_modules/.pnpm/@manypkg+get-packages@1.1.3/node_modules/@manypkg/get-packages/dist/get-packages.cjs.prod.js
var require_get_packages_cjs_prod = __commonJS({
  "node_modules/.pnpm/@manypkg+get-packages@1.1.3/node_modules/@manypkg/get-packages/dist/get-packages.cjs.prod.js"(exports2) {
    "use strict";
    function _interopDefault(ex) {
      return ex && "object" == typeof ex && "default" in ex ? ex.default : ex;
    }
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    var _regeneratorRuntime2 = _interopDefault(require_regenerator());
    var _asyncToGenerator2 = _interopDefault(require_asyncToGenerator());
    var _classCallCheck2 = _interopDefault(require_classCallCheck());
    var _possibleConstructorReturn2 = _interopDefault(require_possibleConstructorReturn());
    var _getPrototypeOf2 = _interopDefault(require_getPrototypeOf());
    var _inherits2 = _interopDefault(require_inherits());
    var _wrapNativeSuper2 = _interopDefault(require_wrapNativeSuper());
    var fs5 = _interopDefault(require_lib2());
    var path6 = _interopDefault(require("path"));
    var globby = require_globby();
    var globby__default = _interopDefault(globby);
    var readYamlFile = require_read_yaml_file();
    var readYamlFile__default = _interopDefault(readYamlFile);
    var findRoot2 = (init_find_root_esm(), __toCommonJS(find_root_esm_exports));
    var PackageJsonMissingNameError = (function(_Error) {
      function PackageJsonMissingNameError2(directories) {
        var _this;
        return _classCallCheck2(this, PackageJsonMissingNameError2), (_this = _possibleConstructorReturn2(this, _getPrototypeOf2(PackageJsonMissingNameError2).call(this, 'The following package.jsons are missing the "name" field:\n'.concat(directories.join("\n"))))).directories = directories, _this;
      }
      return _inherits2(PackageJsonMissingNameError2, _Error), PackageJsonMissingNameError2;
    })(_wrapNativeSuper2(Error));
    function getPackages2(_x) {
      return _getPackages.apply(this, arguments);
    }
    function _getPackages() {
      return (_getPackages = _asyncToGenerator2(_regeneratorRuntime2.mark(function _callee(dir) {
        var cwd, pkg, tool, manifest, lernaJson, root, relativeDirectories, directories, pkgJsonsMissingNameField, results;
        return _regeneratorRuntime2.wrap(function(_context) {
          for (; ; ) switch (_context.prev = _context.next) {
            case 0:
              return _context.next = 2, findRoot2.findRoot(dir);
            case 2:
              return cwd = _context.sent, _context.next = 5, fs5.readJson(path6.join(cwd, "package.json"));
            case 5:
              if (!(pkg = _context.sent).workspaces) {
                _context.next = 10;
                break;
              }
              Array.isArray(pkg.workspaces) ? tool = {
                type: "yarn",
                packageGlobs: pkg.workspaces
              } : pkg.workspaces.packages && (tool = {
                type: "yarn",
                packageGlobs: pkg.workspaces.packages
              }), _context.next = 37;
              break;
            case 10:
              if (!pkg.bolt || !pkg.bolt.workspaces) {
                _context.next = 14;
                break;
              }
              tool = {
                type: "bolt",
                packageGlobs: pkg.bolt.workspaces
              }, _context.next = 37;
              break;
            case 14:
              return _context.prev = 14, _context.next = 17, readYamlFile__default(path6.join(cwd, "pnpm-workspace.yaml"));
            case 17:
              (manifest = _context.sent) && manifest.packages && (tool = {
                type: "pnpm",
                packageGlobs: manifest.packages
              }), _context.next = 25;
              break;
            case 21:
              if (_context.prev = 21, _context.t0 = _context.catch(14), "ENOENT" === _context.t0.code) {
                _context.next = 25;
                break;
              }
              throw _context.t0;
            case 25:
              if (tool) {
                _context.next = 37;
                break;
              }
              return _context.prev = 26, _context.next = 29, fs5.readJson(path6.join(cwd, "lerna.json"));
            case 29:
              (lernaJson = _context.sent) && (tool = {
                type: "lerna",
                packageGlobs: lernaJson.packages || ["packages/*"]
              }), _context.next = 37;
              break;
            case 33:
              if (_context.prev = 33, _context.t1 = _context.catch(26), "ENOENT" === _context.t1.code) {
                _context.next = 37;
                break;
              }
              throw _context.t1;
            case 37:
              if (tool) {
                _context.next = 42;
                break;
              }
              if (root = {
                dir: cwd,
                packageJson: pkg
              }, pkg.name) {
                _context.next = 41;
                break;
              }
              throw new PackageJsonMissingNameError(["package.json"]);
            case 41:
              return _context.abrupt("return", {
                tool: "root",
                root,
                packages: [root]
              });
            case 42:
              return _context.next = 44, globby__default(tool.packageGlobs, {
                cwd,
                onlyDirectories: true,
                expandDirectories: false,
                ignore: ["**/node_modules"]
              });
            case 44:
              return relativeDirectories = _context.sent, directories = relativeDirectories.map(function(p) {
                return path6.resolve(cwd, p);
              }), pkgJsonsMissingNameField = [], _context.next = 49, Promise.all(directories.sort().map(function(dir2) {
                return fs5.readJson(path6.join(dir2, "package.json")).then(function(packageJson) {
                  return packageJson.name || pkgJsonsMissingNameField.push(path6.relative(cwd, path6.join(dir2, "package.json"))), {
                    packageJson,
                    dir: dir2
                  };
                }).catch(function(err) {
                  if ("ENOENT" === err.code) return null;
                  throw err;
                });
              }));
            case 49:
              if (_context.t2 = function(x) {
                return x;
              }, results = _context.sent.filter(_context.t2), 0 === pkgJsonsMissingNameField.length) {
                _context.next = 54;
                break;
              }
              throw pkgJsonsMissingNameField.sort(), new PackageJsonMissingNameError(pkgJsonsMissingNameField);
            case 54:
              return _context.abrupt("return", {
                tool: tool.type,
                root: {
                  dir: cwd,
                  packageJson: pkg
                },
                packages: results
              });
            case 55:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[14, 21], [26, 33]]);
      }))).apply(this, arguments);
    }
    function getPackagesSync(dir) {
      var tool, cwd = findRoot2.findRootSync(dir), pkg = fs5.readJsonSync(path6.join(cwd, "package.json"));
      if (pkg.workspaces) Array.isArray(pkg.workspaces) ? tool = {
        type: "yarn",
        packageGlobs: pkg.workspaces
      } : pkg.workspaces.packages && (tool = {
        type: "yarn",
        packageGlobs: pkg.workspaces.packages
      });
      else if (pkg.bolt && pkg.bolt.workspaces) tool = {
        type: "bolt",
        packageGlobs: pkg.bolt.workspaces
      };
      else {
        try {
          var manifest = readYamlFile.sync(path6.join(cwd, "pnpm-workspace.yaml"));
          manifest && manifest.packages && (tool = {
            type: "pnpm",
            packageGlobs: manifest.packages
          });
        } catch (err) {
          if ("ENOENT" !== err.code) throw err;
        }
        if (!tool) try {
          var lernaJson = fs5.readJsonSync(path6.join(cwd, "lerna.json"));
          lernaJson && (tool = {
            type: "lerna",
            packageGlobs: lernaJson.packages || ["packages/*"]
          });
        } catch (err) {
          if ("ENOENT" !== err.code) throw err;
        }
      }
      if (!tool) {
        var root = {
          dir: cwd,
          packageJson: pkg
        };
        if (!pkg.name) throw new PackageJsonMissingNameError(["package.json"]);
        return {
          tool: "root",
          root,
          packages: [root]
        };
      }
      var directories = globby.sync(tool.packageGlobs, {
        cwd,
        onlyDirectories: true,
        expandDirectories: false,
        ignore: ["**/node_modules"]
      }).map(function(p) {
        return path6.resolve(cwd, p);
      }), pkgJsonsMissingNameField = [], results = directories.sort().map(function(dir2) {
        try {
          var packageJson = fs5.readJsonSync(path6.join(dir2, "package.json"));
          return packageJson.name || pkgJsonsMissingNameField.push(path6.relative(cwd, path6.join(dir2, "package.json"))), {
            packageJson,
            dir: dir2
          };
        } catch (err) {
          if ("ENOENT" === err.code) return null;
          throw err;
        }
      }).filter(function(x) {
        return x;
      });
      if (0 !== pkgJsonsMissingNameField.length) throw pkgJsonsMissingNameField.sort(), new PackageJsonMissingNameError(pkgJsonsMissingNameField);
      return {
        tool: tool.type,
        root: {
          dir: cwd,
          packageJson: pkg
        },
        packages: results
      };
    }
    exports2.PackageJsonMissingNameError = PackageJsonMissingNameError, exports2.getPackages = getPackages2, exports2.getPackagesSync = getPackagesSync;
  }
});

// node_modules/.pnpm/@manypkg+get-packages@1.1.3/node_modules/@manypkg/get-packages/dist/get-packages.cjs.dev.js
var require_get_packages_cjs_dev = __commonJS({
  "node_modules/.pnpm/@manypkg+get-packages@1.1.3/node_modules/@manypkg/get-packages/dist/get-packages.cjs.dev.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function _interopDefault(ex) {
      return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
    }
    var _regeneratorRuntime2 = _interopDefault(require_regenerator());
    var _asyncToGenerator2 = _interopDefault(require_asyncToGenerator());
    var _classCallCheck2 = _interopDefault(require_classCallCheck());
    var _possibleConstructorReturn2 = _interopDefault(require_possibleConstructorReturn());
    var _getPrototypeOf2 = _interopDefault(require_getPrototypeOf());
    var _inherits2 = _interopDefault(require_inherits());
    var _wrapNativeSuper2 = _interopDefault(require_wrapNativeSuper());
    var fs5 = _interopDefault(require_lib2());
    var path6 = _interopDefault(require("path"));
    var globby = require_globby();
    var globby__default = _interopDefault(globby);
    var readYamlFile = require_read_yaml_file();
    var readYamlFile__default = _interopDefault(readYamlFile);
    var findRoot2 = (init_find_root_esm(), __toCommonJS(find_root_esm_exports));
    var PackageJsonMissingNameError = /* @__PURE__ */ (function(_Error) {
      _inherits2(PackageJsonMissingNameError2, _Error);
      function PackageJsonMissingNameError2(directories) {
        var _this;
        _classCallCheck2(this, PackageJsonMissingNameError2);
        _this = _possibleConstructorReturn2(this, _getPrototypeOf2(PackageJsonMissingNameError2).call(this, 'The following package.jsons are missing the "name" field:\n'.concat(directories.join("\n"))));
        _this.directories = directories;
        return _this;
      }
      return PackageJsonMissingNameError2;
    })(_wrapNativeSuper2(Error));
    function getPackages2(_x) {
      return _getPackages.apply(this, arguments);
    }
    function _getPackages() {
      _getPackages = _asyncToGenerator2(
        /* @__PURE__ */ _regeneratorRuntime2.mark(function _callee(dir) {
          var cwd, pkg, tool, manifest, lernaJson, root, relativeDirectories, directories, pkgJsonsMissingNameField, results;
          return _regeneratorRuntime2.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return findRoot2.findRoot(dir);
                case 2:
                  cwd = _context.sent;
                  _context.next = 5;
                  return fs5.readJson(path6.join(cwd, "package.json"));
                case 5:
                  pkg = _context.sent;
                  if (!pkg.workspaces) {
                    _context.next = 10;
                    break;
                  }
                  if (Array.isArray(pkg.workspaces)) {
                    tool = {
                      type: "yarn",
                      packageGlobs: pkg.workspaces
                    };
                  } else if (pkg.workspaces.packages) {
                    tool = {
                      type: "yarn",
                      packageGlobs: pkg.workspaces.packages
                    };
                  }
                  _context.next = 37;
                  break;
                case 10:
                  if (!(pkg.bolt && pkg.bolt.workspaces)) {
                    _context.next = 14;
                    break;
                  }
                  tool = {
                    type: "bolt",
                    packageGlobs: pkg.bolt.workspaces
                  };
                  _context.next = 37;
                  break;
                case 14:
                  _context.prev = 14;
                  _context.next = 17;
                  return readYamlFile__default(path6.join(cwd, "pnpm-workspace.yaml"));
                case 17:
                  manifest = _context.sent;
                  if (manifest && manifest.packages) {
                    tool = {
                      type: "pnpm",
                      packageGlobs: manifest.packages
                    };
                  }
                  _context.next = 25;
                  break;
                case 21:
                  _context.prev = 21;
                  _context.t0 = _context["catch"](14);
                  if (!(_context.t0.code !== "ENOENT")) {
                    _context.next = 25;
                    break;
                  }
                  throw _context.t0;
                case 25:
                  if (tool) {
                    _context.next = 37;
                    break;
                  }
                  _context.prev = 26;
                  _context.next = 29;
                  return fs5.readJson(path6.join(cwd, "lerna.json"));
                case 29:
                  lernaJson = _context.sent;
                  if (lernaJson) {
                    tool = {
                      type: "lerna",
                      packageGlobs: lernaJson.packages || ["packages/*"]
                    };
                  }
                  _context.next = 37;
                  break;
                case 33:
                  _context.prev = 33;
                  _context.t1 = _context["catch"](26);
                  if (!(_context.t1.code !== "ENOENT")) {
                    _context.next = 37;
                    break;
                  }
                  throw _context.t1;
                case 37:
                  if (tool) {
                    _context.next = 42;
                    break;
                  }
                  root = {
                    dir: cwd,
                    packageJson: pkg
                  };
                  if (pkg.name) {
                    _context.next = 41;
                    break;
                  }
                  throw new PackageJsonMissingNameError(["package.json"]);
                case 41:
                  return _context.abrupt("return", {
                    tool: "root",
                    root,
                    packages: [root]
                  });
                case 42:
                  _context.next = 44;
                  return globby__default(tool.packageGlobs, {
                    cwd,
                    onlyDirectories: true,
                    expandDirectories: false,
                    ignore: ["**/node_modules"]
                  });
                case 44:
                  relativeDirectories = _context.sent;
                  directories = relativeDirectories.map(function(p) {
                    return path6.resolve(cwd, p);
                  });
                  pkgJsonsMissingNameField = [];
                  _context.next = 49;
                  return Promise.all(directories.sort().map(function(dir2) {
                    return fs5.readJson(path6.join(dir2, "package.json")).then(function(packageJson) {
                      if (!packageJson.name) {
                        pkgJsonsMissingNameField.push(path6.relative(cwd, path6.join(dir2, "package.json")));
                      }
                      return {
                        packageJson,
                        dir: dir2
                      };
                    })["catch"](function(err) {
                      if (err.code === "ENOENT") {
                        return null;
                      }
                      throw err;
                    });
                  }));
                case 49:
                  _context.t2 = function(x) {
                    return x;
                  };
                  results = _context.sent.filter(_context.t2);
                  if (!(pkgJsonsMissingNameField.length !== 0)) {
                    _context.next = 54;
                    break;
                  }
                  pkgJsonsMissingNameField.sort();
                  throw new PackageJsonMissingNameError(pkgJsonsMissingNameField);
                case 54:
                  return _context.abrupt("return", {
                    tool: tool.type,
                    root: {
                      dir: cwd,
                      packageJson: pkg
                    },
                    packages: results
                  });
                case 55:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[14, 21], [26, 33]]);
        })
      );
      return _getPackages.apply(this, arguments);
    }
    function getPackagesSync(dir) {
      var cwd = findRoot2.findRootSync(dir);
      var pkg = fs5.readJsonSync(path6.join(cwd, "package.json"));
      var tool;
      if (pkg.workspaces) {
        if (Array.isArray(pkg.workspaces)) {
          tool = {
            type: "yarn",
            packageGlobs: pkg.workspaces
          };
        } else if (pkg.workspaces.packages) {
          tool = {
            type: "yarn",
            packageGlobs: pkg.workspaces.packages
          };
        }
      } else if (pkg.bolt && pkg.bolt.workspaces) {
        tool = {
          type: "bolt",
          packageGlobs: pkg.bolt.workspaces
        };
      } else {
        try {
          var manifest = readYamlFile.sync(path6.join(cwd, "pnpm-workspace.yaml"));
          if (manifest && manifest.packages) {
            tool = {
              type: "pnpm",
              packageGlobs: manifest.packages
            };
          }
        } catch (err) {
          if (err.code !== "ENOENT") {
            throw err;
          }
        }
        if (!tool) {
          try {
            var lernaJson = fs5.readJsonSync(path6.join(cwd, "lerna.json"));
            if (lernaJson) {
              tool = {
                type: "lerna",
                packageGlobs: lernaJson.packages || ["packages/*"]
              };
            }
          } catch (err) {
            if (err.code !== "ENOENT") {
              throw err;
            }
          }
        }
      }
      if (!tool) {
        var root = {
          dir: cwd,
          packageJson: pkg
        };
        if (!pkg.name) {
          throw new PackageJsonMissingNameError(["package.json"]);
        }
        return {
          tool: "root",
          root,
          packages: [root]
        };
      }
      var relativeDirectories = globby.sync(tool.packageGlobs, {
        cwd,
        onlyDirectories: true,
        expandDirectories: false,
        ignore: ["**/node_modules"]
      });
      var directories = relativeDirectories.map(function(p) {
        return path6.resolve(cwd, p);
      });
      var pkgJsonsMissingNameField = [];
      var results = directories.sort().map(function(dir2) {
        try {
          var packageJson = fs5.readJsonSync(path6.join(dir2, "package.json"));
          if (!packageJson.name) {
            pkgJsonsMissingNameField.push(path6.relative(cwd, path6.join(dir2, "package.json")));
          }
          return {
            packageJson,
            dir: dir2
          };
        } catch (err) {
          if (err.code === "ENOENT") return null;
          throw err;
        }
      }).filter(function(x) {
        return x;
      });
      if (pkgJsonsMissingNameField.length !== 0) {
        pkgJsonsMissingNameField.sort();
        throw new PackageJsonMissingNameError(pkgJsonsMissingNameField);
      }
      return {
        tool: tool.type,
        root: {
          dir: cwd,
          packageJson: pkg
        },
        packages: results
      };
    }
    exports2.PackageJsonMissingNameError = PackageJsonMissingNameError;
    exports2.getPackages = getPackages2;
    exports2.getPackagesSync = getPackagesSync;
  }
});

// node_modules/.pnpm/@manypkg+get-packages@1.1.3/node_modules/@manypkg/get-packages/dist/get-packages.cjs.js
var require_get_packages_cjs = __commonJS({
  "node_modules/.pnpm/@manypkg+get-packages@1.1.3/node_modules/@manypkg/get-packages/dist/get-packages.cjs.js"(exports2, module2) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module2.exports = require_get_packages_cjs_prod();
    } else {
      module2.exports = require_get_packages_cjs_dev();
    }
  }
});

// node_modules/.pnpm/extendable-error@0.1.7/node_modules/extendable-error/bld/index.js
var require_bld = __commonJS({
  "node_modules/.pnpm/extendable-error@0.1.7/node_modules/extendable-error/bld/index.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || (function() {
      var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
        d.__proto__ = b;
      } || function(d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    Object.defineProperty(exports2, "__esModule", { value: true });
    var ExtendableError2 = (
      /** @class */
      (function(_super) {
        __extends(ExtendableError3, _super);
        function ExtendableError3(message) {
          var _newTarget = this.constructor;
          if (message === void 0) {
            message = "";
          }
          var _this = _super.call(this, message) || this;
          _this.message = message;
          Object.setPrototypeOf(_this, _newTarget.prototype);
          delete _this.stack;
          _this.name = _newTarget.name;
          _this._error = new Error();
          return _this;
        }
        Object.defineProperty(ExtendableError3.prototype, "stack", {
          get: function() {
            if (this._stack) {
              return this._stack;
            }
            var prototype = Object.getPrototypeOf(this);
            var depth = 1;
            loop: while (prototype) {
              switch (prototype) {
                case ExtendableError3.prototype:
                  break loop;
                case Object.prototype:
                  depth = 1;
                  break loop;
                default:
                  depth++;
                  break;
              }
              prototype = Object.getPrototypeOf(prototype);
            }
            var stackLines = (this._error.stack || "").match(/.+/g) || [];
            var nameLine = this.name;
            if (this.message) {
              nameLine += ": " + this.message;
            }
            stackLines.splice(0, depth + 1, nameLine);
            return this._stack = stackLines.join("\n");
          },
          enumerable: true,
          configurable: true
        });
        return ExtendableError3;
      })(Error)
    );
    exports2.ExtendableError = ExtendableError2;
    exports2.default = ExtendableError2;
  }
});

// node_modules/.pnpm/is-windows@1.0.2/node_modules/is-windows/index.js
var require_is_windows = __commonJS({
  "node_modules/.pnpm/is-windows@1.0.2/node_modules/is-windows/index.js"(exports2, module2) {
    "use strict";
    (function(factory) {
      if (exports2 && typeof exports2 === "object" && typeof module2 !== "undefined") {
        module2.exports = factory();
      } else if (typeof define === "function" && define.amd) {
        define([], factory);
      } else if (typeof window !== "undefined") {
        window.isWindows = factory();
      } else if (typeof global !== "undefined") {
        global.isWindows = factory();
      } else if (typeof self !== "undefined") {
        self.isWindows = factory();
      } else {
        this.isWindows = factory();
      }
    })(function() {
      "use strict";
      return function isWindows() {
        return process && (process.platform === "win32" || /^(msys|cygwin)$/.test(process.env.OSTYPE));
      };
    });
  }
});

// node_modules/.pnpm/better-path-resolve@1.0.0/node_modules/better-path-resolve/index.js
var require_better_path_resolve = __commonJS({
  "node_modules/.pnpm/better-path-resolve@1.0.0/node_modules/better-path-resolve/index.js"(exports2, module2) {
    "use strict";
    var path6 = require("path");
    var isWindows = require_is_windows();
    module2.exports = isWindows() ? winResolve : path6.resolve;
    function winResolve(p) {
      if (arguments.length === 0) return path6.resolve();
      if (typeof p !== "string") {
        return path6.resolve(p);
      }
      if (p[1] === ":") {
        const cc = p[0].charCodeAt();
        if (cc < 65 || cc > 90) {
          p = `${p[0].toUpperCase()}${p.substr(1)}`;
        }
      }
      if (p.endsWith(":")) {
        return p;
      }
      return path6.resolve(p);
    }
  }
});

// node_modules/.pnpm/is-subdir@1.2.0/node_modules/is-subdir/index.js
var require_is_subdir = __commonJS({
  "node_modules/.pnpm/is-subdir@1.2.0/node_modules/is-subdir/index.js"(exports2, module2) {
    "use strict";
    var betterPathResolve = require_better_path_resolve();
    var path6 = require("path");
    function isSubdir2(parentDir, subdir) {
      const rParent = `${betterPathResolve(parentDir)}${path6.sep}`;
      const rDir = `${betterPathResolve(subdir)}${path6.sep}`;
      return rDir.startsWith(rParent);
    }
    isSubdir2.strict = function isSubdirStrict(parentDir, subdir) {
      const rParent = `${betterPathResolve(parentDir)}${path6.sep}`;
      const rDir = `${betterPathResolve(subdir)}${path6.sep}`;
      return rDir !== rParent && rDir.startsWith(rParent);
    };
    module2.exports = isSubdir2;
  }
});

// node_modules/.pnpm/picocolors@1.1.0/node_modules/picocolors/picocolors.js
var require_picocolors = __commonJS({
  "node_modules/.pnpm/picocolors@1.1.0/node_modules/picocolors/picocolors.js"(exports2, module2) {
    "use strict";
    var argv = process.argv || [];
    var env = process.env;
    var isColorSupported = !("NO_COLOR" in env || argv.includes("--no-color")) && ("FORCE_COLOR" in env || argv.includes("--color") || process.platform === "win32" || require != null && require("tty").isatty(1) && env.TERM !== "dumb" || "CI" in env);
    var formatter = (open, close, replace = open) => (input) => {
      let string = "" + input;
      let index = string.indexOf(close, open.length);
      return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close;
    };
    var replaceClose = (string, close, replace, index) => {
      let result = "";
      let cursor = 0;
      do {
        result += string.substring(cursor, index) + replace;
        cursor = index + close.length;
        index = string.indexOf(close, cursor);
      } while (~index);
      return result + string.substring(cursor);
    };
    var createColors = (enabled = isColorSupported) => {
      let init = enabled ? formatter : () => String;
      return {
        isColorSupported: enabled,
        reset: init("\x1B[0m", "\x1B[0m"),
        bold: init("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"),
        dim: init("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"),
        italic: init("\x1B[3m", "\x1B[23m"),
        underline: init("\x1B[4m", "\x1B[24m"),
        inverse: init("\x1B[7m", "\x1B[27m"),
        hidden: init("\x1B[8m", "\x1B[28m"),
        strikethrough: init("\x1B[9m", "\x1B[29m"),
        black: init("\x1B[30m", "\x1B[39m"),
        red: init("\x1B[31m", "\x1B[39m"),
        green: init("\x1B[32m", "\x1B[39m"),
        yellow: init("\x1B[33m", "\x1B[39m"),
        blue: init("\x1B[34m", "\x1B[39m"),
        magenta: init("\x1B[35m", "\x1B[39m"),
        cyan: init("\x1B[36m", "\x1B[39m"),
        white: init("\x1B[37m", "\x1B[39m"),
        gray: init("\x1B[90m", "\x1B[39m"),
        bgBlack: init("\x1B[40m", "\x1B[49m"),
        bgRed: init("\x1B[41m", "\x1B[49m"),
        bgGreen: init("\x1B[42m", "\x1B[49m"),
        bgYellow: init("\x1B[43m", "\x1B[49m"),
        bgBlue: init("\x1B[44m", "\x1B[49m"),
        bgMagenta: init("\x1B[45m", "\x1B[49m"),
        bgCyan: init("\x1B[46m", "\x1B[49m"),
        bgWhite: init("\x1B[47m", "\x1B[49m"),
        blackBright: init("\x1B[90m", "\x1B[39m"),
        redBright: init("\x1B[91m", "\x1B[39m"),
        greenBright: init("\x1B[92m", "\x1B[39m"),
        yellowBright: init("\x1B[93m", "\x1B[39m"),
        blueBright: init("\x1B[94m", "\x1B[39m"),
        magentaBright: init("\x1B[95m", "\x1B[39m"),
        cyanBright: init("\x1B[96m", "\x1B[39m"),
        whiteBright: init("\x1B[97m", "\x1B[39m"),
        bgBlackBright: init("\x1B[100m", "\x1B[49m"),
        bgRedBright: init("\x1B[101m", "\x1B[49m"),
        bgGreenBright: init("\x1B[102m", "\x1B[49m"),
        bgYellowBright: init("\x1B[103m", "\x1B[49m"),
        bgBlueBright: init("\x1B[104m", "\x1B[49m"),
        bgMagentaBright: init("\x1B[105m", "\x1B[49m"),
        bgCyanBright: init("\x1B[106m", "\x1B[49m"),
        bgWhiteBright: init("\x1B[107m", "\x1B[49m")
      };
    };
    module2.exports = createColors();
    module2.exports.createColors = createColors;
  }
});

// node_modules/.pnpm/p-map@2.1.0/node_modules/p-map/index.js
var require_p_map = __commonJS({
  "node_modules/.pnpm/p-map@2.1.0/node_modules/p-map/index.js"(exports2, module2) {
    "use strict";
    var pMap = (iterable, mapper, options) => new Promise((resolve, reject) => {
      options = Object.assign({
        concurrency: Infinity
      }, options);
      if (typeof mapper !== "function") {
        throw new TypeError("Mapper function is required");
      }
      const { concurrency } = options;
      if (!(typeof concurrency === "number" && concurrency >= 1)) {
        throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${concurrency}\` (${typeof concurrency})`);
      }
      const ret = [];
      const iterator = iterable[Symbol.iterator]();
      let isRejected = false;
      let isIterableDone = false;
      let resolvingCount = 0;
      let currentIndex = 0;
      const next = () => {
        if (isRejected) {
          return;
        }
        const nextItem = iterator.next();
        const i = currentIndex;
        currentIndex++;
        if (nextItem.done) {
          isIterableDone = true;
          if (resolvingCount === 0) {
            resolve(ret);
          }
          return;
        }
        resolvingCount++;
        Promise.resolve(nextItem.value).then((element) => mapper(element, i)).then(
          (value) => {
            ret[i] = value;
            resolvingCount--;
            next();
          },
          (error) => {
            isRejected = true;
            reject(error);
          }
        );
      };
      for (let i = 0; i < concurrency; i++) {
        next();
        if (isIterableDone) {
          break;
        }
      }
    });
    module2.exports = pMap;
    module2.exports.default = pMap;
  }
});

// node_modules/.pnpm/p-filter@2.1.0/node_modules/p-filter/index.js
var require_p_filter = __commonJS({
  "node_modules/.pnpm/p-filter@2.1.0/node_modules/p-filter/index.js"(exports2, module2) {
    "use strict";
    var pMap = require_p_map();
    var pFilter2 = async (iterable, filterer, options) => {
      const values = await pMap(
        iterable,
        (element, index) => Promise.all([filterer(element, index), element]),
        options
      );
      return values.filter((value) => Boolean(value[0])).map((value) => value[1]);
    };
    module2.exports = pFilter2;
    module2.exports.default = pFilter2;
  }
});

// .github/actions/changeset-release-notes/main.ts
var main_exports = {};
__export(main_exports, {
  main: () => main
});
module.exports = __toCommonJS(main_exports);
var core = __toESM(require("@actions/core"));

// node_modules/.pnpm/@changesets+read@0.6.1/node_modules/@changesets/read/dist/changesets-read.esm.js
var fs2 = __toESM(require_lib());
var import_fs_extra2 = __toESM(require_lib());
var import_path2 = __toESM(require("path"));

// node_modules/.pnpm/@changesets+parse@0.4.0/node_modules/@changesets/parse/dist/changesets-parse.esm.js
var import_js_yaml = __toESM(require("js-yaml"));
var mdRegex = /\s*---([^]*?)\n\s*---(\s*(?:\n|$)[^]*)/;
function parseChangesetFile(contents) {
  const execResult = mdRegex.exec(contents);
  if (!execResult) {
    throw new Error(`could not parse changeset - invalid frontmatter: ${contents}`);
  }
  let [, roughReleases, roughSummary] = execResult;
  let summary = roughSummary.trim();
  let releases;
  try {
    const yamlStuff = import_js_yaml.default.safeLoad(roughReleases);
    if (yamlStuff) {
      releases = Object.entries(yamlStuff).map(([name, type]) => ({
        name,
        type
      }));
    } else {
      releases = [];
    }
  } catch (e) {
    throw new Error(`could not parse changeset - invalid frontmatter: ${contents}`);
  }
  if (!releases) {
    throw new Error(`could not parse changeset - unknown error: ${contents}`);
  }
  return {
    releases,
    summary
  };
}

// node_modules/.pnpm/@changesets+git@3.0.1/node_modules/@changesets/git/dist/changesets-git.esm.js
var import_spawndamnit = __toESM(require_spawndamnit());
var import_get_packages = __toESM(require_get_packages_cjs());

// node_modules/.pnpm/@changesets+errors@0.2.0/node_modules/@changesets/errors/dist/changesets-errors.esm.js
var import_extendable_error = __toESM(require_bld());
var GitError = class extends import_extendable_error.default {
  constructor(code, message) {
    super(`${message}, exit code: ${code}`);
    this.code = code;
  }
};

// node_modules/.pnpm/@changesets+git@3.0.1/node_modules/@changesets/git/dist/changesets-git.esm.js
var import_is_subdir = __toESM(require_is_subdir());
var import_micromatch = __toESM(require_micromatch());
async function getDivergedCommit(cwd, ref) {
  const cmd = await (0, import_spawndamnit.default)("git", ["merge-base", ref, "HEAD"], {
    cwd
  });
  if (cmd.code !== 0) {
    throw new Error(`Failed to find where HEAD diverged from ${ref}. Does ${ref} exist?`);
  }
  return cmd.stdout.toString().trim();
}
async function getChangedChangesetFilesSinceRef({
  cwd,
  ref
}) {
  try {
    const divergedAt = await getDivergedCommit(cwd, ref);
    const cmd = await (0, import_spawndamnit.default)("git", ["diff", "--name-only", "--diff-filter=d", divergedAt], {
      cwd
    });
    let tester = /.changeset\/[^/]+\.md$/;
    const files = cmd.stdout.toString().trim().split("\n").filter((file) => tester.test(file));
    return files;
  } catch (err) {
    if (err instanceof GitError) return [];
    throw err;
  }
}

// node_modules/.pnpm/@changesets+read@0.6.1/node_modules/@changesets/read/dist/changesets-read.esm.js
var import_picocolors2 = __toESM(require_picocolors());
var import_p_filter = __toESM(require_p_filter());

// node_modules/.pnpm/@changesets+logger@0.1.1/node_modules/@changesets/logger/dist/changesets-logger.esm.js
var import_picocolors = __toESM(require_picocolors());
var import_util = __toESM(require("util"));
var prefix = "\u{1F98B} ";
function format(args, customPrefix) {
  let fullPrefix = prefix + (customPrefix === void 0 ? "" : " " + customPrefix);
  return fullPrefix + import_util.default.format("", ...args).split("\n").join("\n" + fullPrefix + " ");
}
function warn(...args) {
  console.warn(format(args, import_picocolors.default.yellow("warn")));
}

// node_modules/.pnpm/@changesets+read@0.6.1/node_modules/@changesets/read/dist/changesets-read.esm.js
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
var importantSeparator = import_picocolors2.default.red("===============================IMPORTANT!===============================");
var importantEnd = import_picocolors2.default.red("----------------------------------------------------------------------");
async function getOldChangesets(changesetBase, dirs) {
  let changesets = await (0, import_p_filter.default)(dirs, async (dir) => (await fs2.lstat(import_path2.default.join(changesetBase, dir))).isDirectory());
  const changesetContents = changesets.map(async (changesetDir) => {
    const jsonPath = import_path2.default.join(changesetBase, changesetDir, "changes.json");
    const [summary, json] = await Promise.all([fs2.readFile(import_path2.default.join(changesetBase, changesetDir, "changes.md"), "utf-8"), fs2.readJson(jsonPath)]);
    return {
      releases: json.releases,
      summary,
      id: changesetDir
    };
  });
  return Promise.all(changesetContents);
}
async function getOldChangesetsAndWarn(changesetBase, dirs) {
  let oldChangesets = await getOldChangesets(changesetBase, dirs);
  if (oldChangesets.length === 0) {
    return [];
  }
  warn(importantSeparator);
  warn("There were old changesets from version 1 found");
  warn("These are being applied now but the dependents graph may have changed");
  warn("Make sure you validate all your dependencies");
  warn("In a future major version, we will no longer apply these old changesets, and will instead throw here");
  warn(importantEnd);
  return oldChangesets;
}
async function filterChangesetsSinceRef(changesets, changesetBase, sinceRef) {
  const newChangesets = await getChangedChangesetFilesSinceRef({
    cwd: changesetBase,
    ref: sinceRef
  });
  const newHashes = newChangesets.map((c) => c.split("/")[1]);
  return changesets.filter((dir) => newHashes.includes(dir));
}
async function getChangesets(cwd, sinceRef) {
  let changesetBase = import_path2.default.join(cwd, ".changeset");
  let contents;
  try {
    contents = await import_fs_extra2.default.readdir(changesetBase);
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error("There is no .changeset directory in this project");
    }
    throw err;
  }
  if (sinceRef !== void 0) {
    contents = await filterChangesetsSinceRef(contents, changesetBase, sinceRef);
  }
  let oldChangesetsPromise = getOldChangesetsAndWarn(changesetBase, contents);
  let changesets = contents.filter((file) => !file.startsWith(".") && file.endsWith(".md") && file !== "README.md");
  const changesetContents = changesets.map(async (file) => {
    const changeset = await import_fs_extra2.default.readFile(import_path2.default.join(changesetBase, file), "utf-8");
    return _objectSpread2(_objectSpread2({}, parseChangesetFile(changeset)), {}, {
      id: file.replace(".md", "")
    });
  });
  return [...await oldChangesetsPromise, ...await Promise.all(changesetContents)];
}

// node_modules/.pnpm/balanced-match@4.0.4/node_modules/balanced-match/dist/esm/index.js
var balanced = (a, b, str) => {
  const ma = a instanceof RegExp ? maybeMatch(a, str) : a;
  const mb = b instanceof RegExp ? maybeMatch(b, str) : b;
  const r = ma !== null && mb != null && range(ma, mb, str);
  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + ma.length, r[1]),
    post: str.slice(r[1] + mb.length)
  };
};
var maybeMatch = (reg, str) => {
  const m = str.match(reg);
  return m ? m[0] : null;
};
var range = (a, b, str) => {
  let begs, beg, left, right = void 0, result;
  let ai = str.indexOf(a);
  let bi = str.indexOf(b, ai + 1);
  let i = ai;
  if (ai >= 0 && bi > 0) {
    if (a === b) {
      return [ai, bi];
    }
    begs = [];
    left = str.length;
    while (i >= 0 && !result) {
      if (i === ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length === 1) {
        const r = begs.pop();
        if (r !== void 0)
          result = [r, bi];
      } else {
        beg = begs.pop();
        if (beg !== void 0 && beg < left) {
          left = beg;
          right = bi;
        }
        bi = str.indexOf(b, i + 1);
      }
      i = ai < bi && ai >= 0 ? ai : bi;
    }
    if (begs.length && right !== void 0) {
      result = [left, right];
    }
  }
  return result;
};

// node_modules/.pnpm/brace-expansion@5.0.6/node_modules/brace-expansion/dist/esm/index.js
var escSlash = "\0SLASH" + Math.random() + "\0";
var escOpen = "\0OPEN" + Math.random() + "\0";
var escClose = "\0CLOSE" + Math.random() + "\0";
var escComma = "\0COMMA" + Math.random() + "\0";
var escPeriod = "\0PERIOD" + Math.random() + "\0";
var escSlashPattern = new RegExp(escSlash, "g");
var escOpenPattern = new RegExp(escOpen, "g");
var escClosePattern = new RegExp(escClose, "g");
var escCommaPattern = new RegExp(escComma, "g");
var escPeriodPattern = new RegExp(escPeriod, "g");
var slashPattern = /\\\\/g;
var openPattern = /\\{/g;
var closePattern = /\\}/g;
var commaPattern = /\\,/g;
var periodPattern = /\\\./g;
var EXPANSION_MAX = 1e5;
function numeric(str) {
  return !isNaN(str) ? parseInt(str, 10) : str.charCodeAt(0);
}
function escapeBraces(str) {
  return str.replace(slashPattern, escSlash).replace(openPattern, escOpen).replace(closePattern, escClose).replace(commaPattern, escComma).replace(periodPattern, escPeriod);
}
function unescapeBraces(str) {
  return str.replace(escSlashPattern, "\\").replace(escOpenPattern, "{").replace(escClosePattern, "}").replace(escCommaPattern, ",").replace(escPeriodPattern, ".");
}
function parseCommaParts(str) {
  if (!str) {
    return [""];
  }
  const parts = [];
  const m = balanced("{", "}", str);
  if (!m) {
    return str.split(",");
  }
  const { pre, body, post } = m;
  const p = pre.split(",");
  p[p.length - 1] += "{" + body + "}";
  const postParts = parseCommaParts(post);
  if (post.length) {
    ;
    p[p.length - 1] += postParts.shift();
    p.push.apply(p, postParts);
  }
  parts.push.apply(parts, p);
  return parts;
}
function expand(str, options = {}) {
  if (!str) {
    return [];
  }
  const { max = EXPANSION_MAX } = options;
  if (str.slice(0, 2) === "{}") {
    str = "\\{\\}" + str.slice(2);
  }
  return expand_(escapeBraces(str), max, true).map(unescapeBraces);
}
function embrace(str) {
  return "{" + str + "}";
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}
function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}
function expand_(str, max, isTop) {
  const expansions = [];
  const m = balanced("{", "}", str);
  if (!m)
    return [str];
  const pre = m.pre;
  const post = m.post.length ? expand_(m.post, max, false) : [""];
  if (/\$$/.test(m.pre)) {
    for (let k = 0; k < post.length && k < max; k++) {
      const expansion = pre + "{" + m.body + "}" + post[k];
      expansions.push(expansion);
    }
  } else {
    const isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
    const isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
    const isSequence = isNumericSequence || isAlphaSequence;
    const isOptions = m.body.indexOf(",") >= 0;
    if (!isSequence && !isOptions) {
      if (m.post.match(/,(?!,).*\}/)) {
        str = m.pre + "{" + m.body + escClose + m.post;
        return expand_(str, max, true);
      }
      return [str];
    }
    let n;
    if (isSequence) {
      n = m.body.split(/\.\./);
    } else {
      n = parseCommaParts(m.body);
      if (n.length === 1 && n[0] !== void 0) {
        n = expand_(n[0], max, false).map(embrace);
        if (n.length === 1) {
          return post.map((p) => m.pre + n[0] + p);
        }
      }
    }
    let N;
    if (isSequence && n[0] !== void 0 && n[1] !== void 0) {
      const x = numeric(n[0]);
      const y = numeric(n[1]);
      const width = Math.max(n[0].length, n[1].length);
      let incr = n.length === 3 && n[2] !== void 0 ? Math.max(Math.abs(numeric(n[2])), 1) : 1;
      let test = lte;
      const reverse = y < x;
      if (reverse) {
        incr *= -1;
        test = gte;
      }
      const pad = n.some(isPadded);
      N = [];
      for (let i = x; test(i, y) && N.length < max; i += incr) {
        let c;
        if (isAlphaSequence) {
          c = String.fromCharCode(i);
          if (c === "\\") {
            c = "";
          }
        } else {
          c = String(i);
          if (pad) {
            const need = width - c.length;
            if (need > 0) {
              const z = new Array(need + 1).join("0");
              if (i < 0) {
                c = "-" + z + c.slice(1);
              } else {
                c = z + c;
              }
            }
          }
        }
        N.push(c);
      }
    } else {
      N = [];
      for (let j = 0; j < n.length; j++) {
        N.push.apply(N, expand_(n[j], max, false));
      }
    }
    for (let j = 0; j < N.length; j++) {
      for (let k = 0; k < post.length && expansions.length < max; k++) {
        const expansion = pre + N[j] + post[k];
        if (!isTop || isSequence || expansion) {
          expansions.push(expansion);
        }
      }
    }
  }
  return expansions;
}

// node_modules/.pnpm/minimatch@10.2.5/node_modules/minimatch/dist/esm/assert-valid-pattern.js
var MAX_PATTERN_LENGTH = 1024 * 64;
var assertValidPattern = (pattern) => {
  if (typeof pattern !== "string") {
    throw new TypeError("invalid pattern");
  }
  if (pattern.length > MAX_PATTERN_LENGTH) {
    throw new TypeError("pattern is too long");
  }
};

// node_modules/.pnpm/minimatch@10.2.5/node_modules/minimatch/dist/esm/brace-expressions.js
var posixClasses = {
  "[:alnum:]": ["\\p{L}\\p{Nl}\\p{Nd}", true],
  "[:alpha:]": ["\\p{L}\\p{Nl}", true],
  "[:ascii:]": ["\\x00-\\x7f", false],
  "[:blank:]": ["\\p{Zs}\\t", true],
  "[:cntrl:]": ["\\p{Cc}", true],
  "[:digit:]": ["\\p{Nd}", true],
  "[:graph:]": ["\\p{Z}\\p{C}", true, true],
  "[:lower:]": ["\\p{Ll}", true],
  "[:print:]": ["\\p{C}", true],
  "[:punct:]": ["\\p{P}", true],
  "[:space:]": ["\\p{Z}\\t\\r\\n\\v\\f", true],
  "[:upper:]": ["\\p{Lu}", true],
  "[:word:]": ["\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}", true],
  "[:xdigit:]": ["A-Fa-f0-9", false]
};
var braceEscape = (s) => s.replace(/[[\]\\-]/g, "\\$&");
var regexpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
var rangesToString = (ranges) => ranges.join("");
var parseClass = (glob2, position) => {
  const pos = position;
  if (glob2.charAt(pos) !== "[") {
    throw new Error("not in a brace expression");
  }
  const ranges = [];
  const negs = [];
  let i = pos + 1;
  let sawStart = false;
  let uflag = false;
  let escaping = false;
  let negate = false;
  let endPos = pos;
  let rangeStart = "";
  WHILE: while (i < glob2.length) {
    const c = glob2.charAt(i);
    if ((c === "!" || c === "^") && i === pos + 1) {
      negate = true;
      i++;
      continue;
    }
    if (c === "]" && sawStart && !escaping) {
      endPos = i + 1;
      break;
    }
    sawStart = true;
    if (c === "\\") {
      if (!escaping) {
        escaping = true;
        i++;
        continue;
      }
    }
    if (c === "[" && !escaping) {
      for (const [cls, [unip, u, neg]] of Object.entries(posixClasses)) {
        if (glob2.startsWith(cls, i)) {
          if (rangeStart) {
            return ["$.", false, glob2.length - pos, true];
          }
          i += cls.length;
          if (neg)
            negs.push(unip);
          else
            ranges.push(unip);
          uflag = uflag || u;
          continue WHILE;
        }
      }
    }
    escaping = false;
    if (rangeStart) {
      if (c > rangeStart) {
        ranges.push(braceEscape(rangeStart) + "-" + braceEscape(c));
      } else if (c === rangeStart) {
        ranges.push(braceEscape(c));
      }
      rangeStart = "";
      i++;
      continue;
    }
    if (glob2.startsWith("-]", i + 1)) {
      ranges.push(braceEscape(c + "-"));
      i += 2;
      continue;
    }
    if (glob2.startsWith("-", i + 1)) {
      rangeStart = c;
      i += 2;
      continue;
    }
    ranges.push(braceEscape(c));
    i++;
  }
  if (endPos < i) {
    return ["", false, 0, false];
  }
  if (!ranges.length && !negs.length) {
    return ["$.", false, glob2.length - pos, true];
  }
  if (negs.length === 0 && ranges.length === 1 && /^\\?.$/.test(ranges[0]) && !negate) {
    const r = ranges[0].length === 2 ? ranges[0].slice(-1) : ranges[0];
    return [regexpEscape(r), false, endPos - pos, false];
  }
  const sranges = "[" + (negate ? "^" : "") + rangesToString(ranges) + "]";
  const snegs = "[" + (negate ? "" : "^") + rangesToString(negs) + "]";
  const comb = ranges.length && negs.length ? "(" + sranges + "|" + snegs + ")" : ranges.length ? sranges : snegs;
  return [comb, uflag, endPos - pos, true];
};

// node_modules/.pnpm/minimatch@10.2.5/node_modules/minimatch/dist/esm/unescape.js
var unescape = (s, { windowsPathsNoEscape = false, magicalBraces = true } = {}) => {
  if (magicalBraces) {
    return windowsPathsNoEscape ? s.replace(/\[([^/\\])\]/g, "$1") : s.replace(/((?!\\).|^)\[([^/\\])\]/g, "$1$2").replace(/\\([^/])/g, "$1");
  }
  return windowsPathsNoEscape ? s.replace(/\[([^/\\{}])\]/g, "$1") : s.replace(/((?!\\).|^)\[([^/\\{}])\]/g, "$1$2").replace(/\\([^/{}])/g, "$1");
};

// node_modules/.pnpm/minimatch@10.2.5/node_modules/minimatch/dist/esm/ast.js
var _a;
var types = /* @__PURE__ */ new Set(["!", "?", "+", "*", "@"]);
var isExtglobType = (c) => types.has(c);
var isExtglobAST = (c) => isExtglobType(c.type);
var adoptionMap = /* @__PURE__ */ new Map([
  ["!", ["@"]],
  ["?", ["?", "@"]],
  ["@", ["@"]],
  ["*", ["*", "+", "?", "@"]],
  ["+", ["+", "@"]]
]);
var adoptionWithSpaceMap = /* @__PURE__ */ new Map([
  ["!", ["?"]],
  ["@", ["?"]],
  ["+", ["?", "*"]]
]);
var adoptionAnyMap = /* @__PURE__ */ new Map([
  ["!", ["?", "@"]],
  ["?", ["?", "@"]],
  ["@", ["?", "@"]],
  ["*", ["*", "+", "?", "@"]],
  ["+", ["+", "@", "?", "*"]]
]);
var usurpMap = /* @__PURE__ */ new Map([
  ["!", /* @__PURE__ */ new Map([["!", "@"]])],
  [
    "?",
    /* @__PURE__ */ new Map([
      ["*", "*"],
      ["+", "*"]
    ])
  ],
  [
    "@",
    /* @__PURE__ */ new Map([
      ["!", "!"],
      ["?", "?"],
      ["@", "@"],
      ["*", "*"],
      ["+", "+"]
    ])
  ],
  [
    "+",
    /* @__PURE__ */ new Map([
      ["?", "*"],
      ["*", "*"]
    ])
  ]
]);
var startNoTraversal = "(?!(?:^|/)\\.\\.?(?:$|/))";
var startNoDot = "(?!\\.)";
var addPatternStart = /* @__PURE__ */ new Set(["[", "."]);
var justDots = /* @__PURE__ */ new Set(["..", "."]);
var reSpecials = new Set("().*{}+?[]^$\\!");
var regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
var qmark = "[^/]";
var star = qmark + "*?";
var starNoEmpty = qmark + "+?";
var ID = 0;
var AST = class {
  type;
  #root;
  #hasMagic;
  #uflag = false;
  #parts = [];
  #parent;
  #parentIndex;
  #negs;
  #filledNegs = false;
  #options;
  #toString;
  // set to true if it's an extglob with no children
  // (which really means one child of '')
  #emptyExt = false;
  id = ++ID;
  get depth() {
    return (this.#parent?.depth ?? -1) + 1;
  }
  [/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")]() {
    return {
      "@@type": "AST",
      id: this.id,
      type: this.type,
      root: this.#root.id,
      parent: this.#parent?.id,
      depth: this.depth,
      partsLength: this.#parts.length,
      parts: this.#parts
    };
  }
  constructor(type, parent, options = {}) {
    this.type = type;
    if (type)
      this.#hasMagic = true;
    this.#parent = parent;
    this.#root = this.#parent ? this.#parent.#root : this;
    this.#options = this.#root === this ? options : this.#root.#options;
    this.#negs = this.#root === this ? [] : this.#root.#negs;
    if (type === "!" && !this.#root.#filledNegs)
      this.#negs.push(this);
    this.#parentIndex = this.#parent ? this.#parent.#parts.length : 0;
  }
  get hasMagic() {
    if (this.#hasMagic !== void 0)
      return this.#hasMagic;
    for (const p of this.#parts) {
      if (typeof p === "string")
        continue;
      if (p.type || p.hasMagic)
        return this.#hasMagic = true;
    }
    return this.#hasMagic;
  }
  // reconstructs the pattern
  toString() {
    return this.#toString !== void 0 ? this.#toString : !this.type ? this.#toString = this.#parts.map((p) => String(p)).join("") : this.#toString = this.type + "(" + this.#parts.map((p) => String(p)).join("|") + ")";
  }
  #fillNegs() {
    if (this !== this.#root)
      throw new Error("should only call on root");
    if (this.#filledNegs)
      return this;
    this.toString();
    this.#filledNegs = true;
    let n;
    while (n = this.#negs.pop()) {
      if (n.type !== "!")
        continue;
      let p = n;
      let pp = p.#parent;
      while (pp) {
        for (let i = p.#parentIndex + 1; !pp.type && i < pp.#parts.length; i++) {
          for (const part of n.#parts) {
            if (typeof part === "string") {
              throw new Error("string part in extglob AST??");
            }
            part.copyIn(pp.#parts[i]);
          }
        }
        p = pp;
        pp = p.#parent;
      }
    }
    return this;
  }
  push(...parts) {
    for (const p of parts) {
      if (p === "")
        continue;
      if (typeof p !== "string" && !(p instanceof _a && p.#parent === this)) {
        throw new Error("invalid part: " + p);
      }
      this.#parts.push(p);
    }
  }
  toJSON() {
    const ret = this.type === null ? this.#parts.slice().map((p) => typeof p === "string" ? p : p.toJSON()) : [this.type, ...this.#parts.map((p) => p.toJSON())];
    if (this.isStart() && !this.type)
      ret.unshift([]);
    if (this.isEnd() && (this === this.#root || this.#root.#filledNegs && this.#parent?.type === "!")) {
      ret.push({});
    }
    return ret;
  }
  isStart() {
    if (this.#root === this)
      return true;
    if (!this.#parent?.isStart())
      return false;
    if (this.#parentIndex === 0)
      return true;
    const p = this.#parent;
    for (let i = 0; i < this.#parentIndex; i++) {
      const pp = p.#parts[i];
      if (!(pp instanceof _a && pp.type === "!")) {
        return false;
      }
    }
    return true;
  }
  isEnd() {
    if (this.#root === this)
      return true;
    if (this.#parent?.type === "!")
      return true;
    if (!this.#parent?.isEnd())
      return false;
    if (!this.type)
      return this.#parent?.isEnd();
    const pl = this.#parent ? this.#parent.#parts.length : 0;
    return this.#parentIndex === pl - 1;
  }
  copyIn(part) {
    if (typeof part === "string")
      this.push(part);
    else
      this.push(part.clone(this));
  }
  clone(parent) {
    const c = new _a(this.type, parent);
    for (const p of this.#parts) {
      c.copyIn(p);
    }
    return c;
  }
  static #parseAST(str, ast, pos, opt, extDepth) {
    const maxDepth = opt.maxExtglobRecursion ?? 2;
    let escaping = false;
    let inBrace = false;
    let braceStart = -1;
    let braceNeg = false;
    if (ast.type === null) {
      let i2 = pos;
      let acc2 = "";
      while (i2 < str.length) {
        const c = str.charAt(i2++);
        if (escaping || c === "\\") {
          escaping = !escaping;
          acc2 += c;
          continue;
        }
        if (inBrace) {
          if (i2 === braceStart + 1) {
            if (c === "^" || c === "!") {
              braceNeg = true;
            }
          } else if (c === "]" && !(i2 === braceStart + 2 && braceNeg)) {
            inBrace = false;
          }
          acc2 += c;
          continue;
        } else if (c === "[") {
          inBrace = true;
          braceStart = i2;
          braceNeg = false;
          acc2 += c;
          continue;
        }
        const doRecurse = !opt.noext && isExtglobType(c) && str.charAt(i2) === "(" && extDepth <= maxDepth;
        if (doRecurse) {
          ast.push(acc2);
          acc2 = "";
          const ext2 = new _a(c, ast);
          i2 = _a.#parseAST(str, ext2, i2, opt, extDepth + 1);
          ast.push(ext2);
          continue;
        }
        acc2 += c;
      }
      ast.push(acc2);
      return i2;
    }
    let i = pos + 1;
    let part = new _a(null, ast);
    const parts = [];
    let acc = "";
    while (i < str.length) {
      const c = str.charAt(i++);
      if (escaping || c === "\\") {
        escaping = !escaping;
        acc += c;
        continue;
      }
      if (inBrace) {
        if (i === braceStart + 1) {
          if (c === "^" || c === "!") {
            braceNeg = true;
          }
        } else if (c === "]" && !(i === braceStart + 2 && braceNeg)) {
          inBrace = false;
        }
        acc += c;
        continue;
      } else if (c === "[") {
        inBrace = true;
        braceStart = i;
        braceNeg = false;
        acc += c;
        continue;
      }
      const doRecurse = !opt.noext && isExtglobType(c) && str.charAt(i) === "(" && /* c8 ignore start - the maxDepth is sufficient here */
      (extDepth <= maxDepth || ast && ast.#canAdoptType(c));
      if (doRecurse) {
        const depthAdd = ast && ast.#canAdoptType(c) ? 0 : 1;
        part.push(acc);
        acc = "";
        const ext2 = new _a(c, part);
        part.push(ext2);
        i = _a.#parseAST(str, ext2, i, opt, extDepth + depthAdd);
        continue;
      }
      if (c === "|") {
        part.push(acc);
        acc = "";
        parts.push(part);
        part = new _a(null, ast);
        continue;
      }
      if (c === ")") {
        if (acc === "" && ast.#parts.length === 0) {
          ast.#emptyExt = true;
        }
        part.push(acc);
        acc = "";
        ast.push(...parts, part);
        return i;
      }
      acc += c;
    }
    ast.type = null;
    ast.#hasMagic = void 0;
    ast.#parts = [str.substring(pos - 1)];
    return i;
  }
  #canAdoptWithSpace(child) {
    return this.#canAdopt(child, adoptionWithSpaceMap);
  }
  #canAdopt(child, map = adoptionMap) {
    if (!child || typeof child !== "object" || child.type !== null || child.#parts.length !== 1 || this.type === null) {
      return false;
    }
    const gc = child.#parts[0];
    if (!gc || typeof gc !== "object" || gc.type === null) {
      return false;
    }
    return this.#canAdoptType(gc.type, map);
  }
  #canAdoptType(c, map = adoptionAnyMap) {
    return !!map.get(this.type)?.includes(c);
  }
  #adoptWithSpace(child, index) {
    const gc = child.#parts[0];
    const blank = new _a(null, gc, this.options);
    blank.#parts.push("");
    gc.push(blank);
    this.#adopt(child, index);
  }
  #adopt(child, index) {
    const gc = child.#parts[0];
    this.#parts.splice(index, 1, ...gc.#parts);
    for (const p of gc.#parts) {
      if (typeof p === "object")
        p.#parent = this;
    }
    this.#toString = void 0;
  }
  #canUsurpType(c) {
    const m = usurpMap.get(this.type);
    return !!m?.has(c);
  }
  #canUsurp(child) {
    if (!child || typeof child !== "object" || child.type !== null || child.#parts.length !== 1 || this.type === null || this.#parts.length !== 1) {
      return false;
    }
    const gc = child.#parts[0];
    if (!gc || typeof gc !== "object" || gc.type === null) {
      return false;
    }
    return this.#canUsurpType(gc.type);
  }
  #usurp(child) {
    const m = usurpMap.get(this.type);
    const gc = child.#parts[0];
    const nt = m?.get(gc.type);
    if (!nt)
      return false;
    this.#parts = gc.#parts;
    for (const p of this.#parts) {
      if (typeof p === "object") {
        p.#parent = this;
      }
    }
    this.type = nt;
    this.#toString = void 0;
    this.#emptyExt = false;
  }
  static fromGlob(pattern, options = {}) {
    const ast = new _a(null, void 0, options);
    _a.#parseAST(pattern, ast, 0, options, 0);
    return ast;
  }
  // returns the regular expression if there's magic, or the unescaped
  // string if not.
  toMMPattern() {
    if (this !== this.#root)
      return this.#root.toMMPattern();
    const glob2 = this.toString();
    const [re, body, hasMagic2, uflag] = this.toRegExpSource();
    const anyMagic = hasMagic2 || this.#hasMagic || this.#options.nocase && !this.#options.nocaseMagicOnly && glob2.toUpperCase() !== glob2.toLowerCase();
    if (!anyMagic) {
      return body;
    }
    const flags = (this.#options.nocase ? "i" : "") + (uflag ? "u" : "");
    return Object.assign(new RegExp(`^${re}$`, flags), {
      _src: re,
      _glob: glob2
    });
  }
  get options() {
    return this.#options;
  }
  // returns the string match, the regexp source, whether there's magic
  // in the regexp (so a regular expression is required) and whether or
  // not the uflag is needed for the regular expression (for posix classes)
  // TODO: instead of injecting the start/end at this point, just return
  // the BODY of the regexp, along with the start/end portions suitable
  // for binding the start/end in either a joined full-path makeRe context
  // (where we bind to (^|/), or a standalone matchPart context (where
  // we bind to ^, and not /).  Otherwise slashes get duped!
  //
  // In part-matching mode, the start is:
  // - if not isStart: nothing
  // - if traversal possible, but not allowed: ^(?!\.\.?$)
  // - if dots allowed or not possible: ^
  // - if dots possible and not allowed: ^(?!\.)
  // end is:
  // - if not isEnd(): nothing
  // - else: $
  //
  // In full-path matching mode, we put the slash at the START of the
  // pattern, so start is:
  // - if first pattern: same as part-matching mode
  // - if not isStart(): nothing
  // - if traversal possible, but not allowed: /(?!\.\.?(?:$|/))
  // - if dots allowed or not possible: /
  // - if dots possible and not allowed: /(?!\.)
  // end is:
  // - if last pattern, same as part-matching mode
  // - else nothing
  //
  // Always put the (?:$|/) on negated tails, though, because that has to be
  // there to bind the end of the negated pattern portion, and it's easier to
  // just stick it in now rather than try to inject it later in the middle of
  // the pattern.
  //
  // We can just always return the same end, and leave it up to the caller
  // to know whether it's going to be used joined or in parts.
  // And, if the start is adjusted slightly, can do the same there:
  // - if not isStart: nothing
  // - if traversal possible, but not allowed: (?:/|^)(?!\.\.?$)
  // - if dots allowed or not possible: (?:/|^)
  // - if dots possible and not allowed: (?:/|^)(?!\.)
  //
  // But it's better to have a simpler binding without a conditional, for
  // performance, so probably better to return both start options.
  //
  // Then the caller just ignores the end if it's not the first pattern,
  // and the start always gets applied.
  //
  // But that's always going to be $ if it's the ending pattern, or nothing,
  // so the caller can just attach $ at the end of the pattern when building.
  //
  // So the todo is:
  // - better detect what kind of start is needed
  // - return both flavors of starting pattern
  // - attach $ at the end of the pattern when creating the actual RegExp
  //
  // Ah, but wait, no, that all only applies to the root when the first pattern
  // is not an extglob. If the first pattern IS an extglob, then we need all
  // that dot prevention biz to live in the extglob portions, because eg
  // +(*|.x*) can match .xy but not .yx.
  //
  // So, return the two flavors if it's #root and the first child is not an
  // AST, otherwise leave it to the child AST to handle it, and there,
  // use the (?:^|/) style of start binding.
  //
  // Even simplified further:
  // - Since the start for a join is eg /(?!\.) and the start for a part
  // is ^(?!\.), we can just prepend (?!\.) to the pattern (either root
  // or start or whatever) and prepend ^ or / at the Regexp construction.
  toRegExpSource(allowDot) {
    const dot = allowDot ?? !!this.#options.dot;
    if (this.#root === this) {
      this.#flatten();
      this.#fillNegs();
    }
    if (!isExtglobAST(this)) {
      const noEmpty = this.isStart() && this.isEnd() && !this.#parts.some((s) => typeof s !== "string");
      const src = this.#parts.map((p) => {
        const [re, _, hasMagic2, uflag] = typeof p === "string" ? _a.#parseGlob(p, this.#hasMagic, noEmpty) : p.toRegExpSource(allowDot);
        this.#hasMagic = this.#hasMagic || hasMagic2;
        this.#uflag = this.#uflag || uflag;
        return re;
      }).join("");
      let start2 = "";
      if (this.isStart()) {
        if (typeof this.#parts[0] === "string") {
          const dotTravAllowed = this.#parts.length === 1 && justDots.has(this.#parts[0]);
          if (!dotTravAllowed) {
            const aps = addPatternStart;
            const needNoTrav = (
              // dots are allowed, and the pattern starts with [ or .
              dot && aps.has(src.charAt(0)) || // the pattern starts with \., and then [ or .
              src.startsWith("\\.") && aps.has(src.charAt(2)) || // the pattern starts with \.\., and then [ or .
              src.startsWith("\\.\\.") && aps.has(src.charAt(4))
            );
            const needNoDot = !dot && !allowDot && aps.has(src.charAt(0));
            start2 = needNoTrav ? startNoTraversal : needNoDot ? startNoDot : "";
          }
        }
      }
      let end = "";
      if (this.isEnd() && this.#root.#filledNegs && this.#parent?.type === "!") {
        end = "(?:$|\\/)";
      }
      const final2 = start2 + src + end;
      return [
        final2,
        unescape(src),
        this.#hasMagic = !!this.#hasMagic,
        this.#uflag
      ];
    }
    const repeated = this.type === "*" || this.type === "+";
    const start = this.type === "!" ? "(?:(?!(?:" : "(?:";
    let body = this.#partsToRegExp(dot);
    if (this.isStart() && this.isEnd() && !body && this.type !== "!") {
      const s = this.toString();
      const me = this;
      me.#parts = [s];
      me.type = null;
      me.#hasMagic = void 0;
      return [s, unescape(this.toString()), false, false];
    }
    let bodyDotAllowed = !repeated || allowDot || dot || !startNoDot ? "" : this.#partsToRegExp(true);
    if (bodyDotAllowed === body) {
      bodyDotAllowed = "";
    }
    if (bodyDotAllowed) {
      body = `(?:${body})(?:${bodyDotAllowed})*?`;
    }
    let final = "";
    if (this.type === "!" && this.#emptyExt) {
      final = (this.isStart() && !dot ? startNoDot : "") + starNoEmpty;
    } else {
      const close = this.type === "!" ? (
        // !() must match something,but !(x) can match ''
        "))" + (this.isStart() && !dot && !allowDot ? startNoDot : "") + star + ")"
      ) : this.type === "@" ? ")" : this.type === "?" ? ")?" : this.type === "+" && bodyDotAllowed ? ")" : this.type === "*" && bodyDotAllowed ? `)?` : `)${this.type}`;
      final = start + body + close;
    }
    return [
      final,
      unescape(body),
      this.#hasMagic = !!this.#hasMagic,
      this.#uflag
    ];
  }
  #flatten() {
    if (!isExtglobAST(this)) {
      for (const p of this.#parts) {
        if (typeof p === "object") {
          p.#flatten();
        }
      }
    } else {
      let iterations = 0;
      let done = false;
      do {
        done = true;
        for (let i = 0; i < this.#parts.length; i++) {
          const c = this.#parts[i];
          if (typeof c === "object") {
            c.#flatten();
            if (this.#canAdopt(c)) {
              done = false;
              this.#adopt(c, i);
            } else if (this.#canAdoptWithSpace(c)) {
              done = false;
              this.#adoptWithSpace(c, i);
            } else if (this.#canUsurp(c)) {
              done = false;
              this.#usurp(c);
            }
          }
        }
      } while (!done && ++iterations < 10);
    }
    this.#toString = void 0;
  }
  #partsToRegExp(dot) {
    return this.#parts.map((p) => {
      if (typeof p === "string") {
        throw new Error("string type in extglob ast??");
      }
      const [re, _, _hasMagic, uflag] = p.toRegExpSource(dot);
      this.#uflag = this.#uflag || uflag;
      return re;
    }).filter((p) => !(this.isStart() && this.isEnd()) || !!p).join("|");
  }
  static #parseGlob(glob2, hasMagic2, noEmpty = false) {
    let escaping = false;
    let re = "";
    let uflag = false;
    let inStar = false;
    for (let i = 0; i < glob2.length; i++) {
      const c = glob2.charAt(i);
      if (escaping) {
        escaping = false;
        re += (reSpecials.has(c) ? "\\" : "") + c;
        continue;
      }
      if (c === "*") {
        if (inStar)
          continue;
        inStar = true;
        re += noEmpty && /^[*]+$/.test(glob2) ? starNoEmpty : star;
        hasMagic2 = true;
        continue;
      } else {
        inStar = false;
      }
      if (c === "\\") {
        if (i === glob2.length - 1) {
          re += "\\\\";
        } else {
          escaping = true;
        }
        continue;
      }
      if (c === "[") {
        const [src, needUflag, consumed, magic] = parseClass(glob2, i);
        if (consumed) {
          re += src;
          uflag = uflag || needUflag;
          i += consumed - 1;
          hasMagic2 = hasMagic2 || magic;
          continue;
        }
      }
      if (c === "?") {
        re += qmark;
        hasMagic2 = true;
        continue;
      }
      re += regExpEscape(c);
    }
    return [re, unescape(glob2), !!hasMagic2, uflag];
  }
};
_a = AST;

// node_modules/.pnpm/minimatch@10.2.5/node_modules/minimatch/dist/esm/escape.js
var escape = (s, { windowsPathsNoEscape = false, magicalBraces = false } = {}) => {
  if (magicalBraces) {
    return windowsPathsNoEscape ? s.replace(/[?*()[\]{}]/g, "[$&]") : s.replace(/[?*()[\]\\{}]/g, "\\$&");
  }
  return windowsPathsNoEscape ? s.replace(/[?*()[\]]/g, "[$&]") : s.replace(/[?*()[\]\\]/g, "\\$&");
};

// node_modules/.pnpm/minimatch@10.2.5/node_modules/minimatch/dist/esm/index.js
var minimatch = (p, pattern, options = {}) => {
  assertValidPattern(pattern);
  if (!options.nocomment && pattern.charAt(0) === "#") {
    return false;
  }
  return new Minimatch(pattern, options).match(p);
};
var starDotExtRE = /^\*+([^+@!?*[(]*)$/;
var starDotExtTest = (ext2) => (f) => !f.startsWith(".") && f.endsWith(ext2);
var starDotExtTestDot = (ext2) => (f) => f.endsWith(ext2);
var starDotExtTestNocase = (ext2) => {
  ext2 = ext2.toLowerCase();
  return (f) => !f.startsWith(".") && f.toLowerCase().endsWith(ext2);
};
var starDotExtTestNocaseDot = (ext2) => {
  ext2 = ext2.toLowerCase();
  return (f) => f.toLowerCase().endsWith(ext2);
};
var starDotStarRE = /^\*+\.\*+$/;
var starDotStarTest = (f) => !f.startsWith(".") && f.includes(".");
var starDotStarTestDot = (f) => f !== "." && f !== ".." && f.includes(".");
var dotStarRE = /^\.\*+$/;
var dotStarTest = (f) => f !== "." && f !== ".." && f.startsWith(".");
var starRE = /^\*+$/;
var starTest = (f) => f.length !== 0 && !f.startsWith(".");
var starTestDot = (f) => f.length !== 0 && f !== "." && f !== "..";
var qmarksRE = /^\?+([^+@!?*[(]*)?$/;
var qmarksTestNocase = ([$0, ext2 = ""]) => {
  const noext = qmarksTestNoExt([$0]);
  if (!ext2)
    return noext;
  ext2 = ext2.toLowerCase();
  return (f) => noext(f) && f.toLowerCase().endsWith(ext2);
};
var qmarksTestNocaseDot = ([$0, ext2 = ""]) => {
  const noext = qmarksTestNoExtDot([$0]);
  if (!ext2)
    return noext;
  ext2 = ext2.toLowerCase();
  return (f) => noext(f) && f.toLowerCase().endsWith(ext2);
};
var qmarksTestDot = ([$0, ext2 = ""]) => {
  const noext = qmarksTestNoExtDot([$0]);
  return !ext2 ? noext : (f) => noext(f) && f.endsWith(ext2);
};
var qmarksTest = ([$0, ext2 = ""]) => {
  const noext = qmarksTestNoExt([$0]);
  return !ext2 ? noext : (f) => noext(f) && f.endsWith(ext2);
};
var qmarksTestNoExt = ([$0]) => {
  const len = $0.length;
  return (f) => f.length === len && !f.startsWith(".");
};
var qmarksTestNoExtDot = ([$0]) => {
  const len = $0.length;
  return (f) => f.length === len && f !== "." && f !== "..";
};
var defaultPlatform = typeof process === "object" && process ? typeof process.env === "object" && process.env && process.env.__MINIMATCH_TESTING_PLATFORM__ || process.platform : "posix";
var path3 = {
  win32: { sep: "\\" },
  posix: { sep: "/" }
};
var sep = defaultPlatform === "win32" ? path3.win32.sep : path3.posix.sep;
minimatch.sep = sep;
var GLOBSTAR = /* @__PURE__ */ Symbol("globstar **");
minimatch.GLOBSTAR = GLOBSTAR;
var qmark2 = "[^/]";
var star2 = qmark2 + "*?";
var twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
var twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
var filter = (pattern, options = {}) => (p) => minimatch(p, pattern, options);
minimatch.filter = filter;
var ext = (a, b = {}) => Object.assign({}, a, b);
var defaults = (def) => {
  if (!def || typeof def !== "object" || !Object.keys(def).length) {
    return minimatch;
  }
  const orig = minimatch;
  const m = (p, pattern, options = {}) => orig(p, pattern, ext(def, options));
  return Object.assign(m, {
    Minimatch: class Minimatch extends orig.Minimatch {
      constructor(pattern, options = {}) {
        super(pattern, ext(def, options));
      }
      static defaults(options) {
        return orig.defaults(ext(def, options)).Minimatch;
      }
    },
    AST: class AST extends orig.AST {
      /* c8 ignore start */
      constructor(type, parent, options = {}) {
        super(type, parent, ext(def, options));
      }
      /* c8 ignore stop */
      static fromGlob(pattern, options = {}) {
        return orig.AST.fromGlob(pattern, ext(def, options));
      }
    },
    unescape: (s, options = {}) => orig.unescape(s, ext(def, options)),
    escape: (s, options = {}) => orig.escape(s, ext(def, options)),
    filter: (pattern, options = {}) => orig.filter(pattern, ext(def, options)),
    defaults: (options) => orig.defaults(ext(def, options)),
    makeRe: (pattern, options = {}) => orig.makeRe(pattern, ext(def, options)),
    braceExpand: (pattern, options = {}) => orig.braceExpand(pattern, ext(def, options)),
    match: (list, pattern, options = {}) => orig.match(list, pattern, ext(def, options)),
    sep: orig.sep,
    GLOBSTAR
  });
};
minimatch.defaults = defaults;
var braceExpand = (pattern, options = {}) => {
  assertValidPattern(pattern);
  if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
    return [pattern];
  }
  return expand(pattern, { max: options.braceExpandMax });
};
minimatch.braceExpand = braceExpand;
var makeRe = (pattern, options = {}) => new Minimatch(pattern, options).makeRe();
minimatch.makeRe = makeRe;
var match = (list, pattern, options = {}) => {
  const mm = new Minimatch(pattern, options);
  list = list.filter((f) => mm.match(f));
  if (mm.options.nonull && !list.length) {
    list.push(pattern);
  }
  return list;
};
minimatch.match = match;
var globMagic = /[?*]|[+@!]\(.*?\)|\[|\]/;
var regExpEscape2 = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
var Minimatch = class {
  options;
  set;
  pattern;
  windowsPathsNoEscape;
  nonegate;
  negate;
  comment;
  empty;
  preserveMultipleSlashes;
  partial;
  globSet;
  globParts;
  nocase;
  isWindows;
  platform;
  windowsNoMagicRoot;
  maxGlobstarRecursion;
  regexp;
  constructor(pattern, options = {}) {
    assertValidPattern(pattern);
    options = options || {};
    this.options = options;
    this.maxGlobstarRecursion = options.maxGlobstarRecursion ?? 200;
    this.pattern = pattern;
    this.platform = options.platform || defaultPlatform;
    this.isWindows = this.platform === "win32";
    const awe = "allowWindowsEscape";
    this.windowsPathsNoEscape = !!options.windowsPathsNoEscape || options[awe] === false;
    if (this.windowsPathsNoEscape) {
      this.pattern = this.pattern.replace(/\\/g, "/");
    }
    this.preserveMultipleSlashes = !!options.preserveMultipleSlashes;
    this.regexp = null;
    this.negate = false;
    this.nonegate = !!options.nonegate;
    this.comment = false;
    this.empty = false;
    this.partial = !!options.partial;
    this.nocase = !!this.options.nocase;
    this.windowsNoMagicRoot = options.windowsNoMagicRoot !== void 0 ? options.windowsNoMagicRoot : !!(this.isWindows && this.nocase);
    this.globSet = [];
    this.globParts = [];
    this.set = [];
    this.make();
  }
  hasMagic() {
    if (this.options.magicalBraces && this.set.length > 1) {
      return true;
    }
    for (const pattern of this.set) {
      for (const part of pattern) {
        if (typeof part !== "string")
          return true;
      }
    }
    return false;
  }
  debug(..._) {
  }
  make() {
    const pattern = this.pattern;
    const options = this.options;
    if (!options.nocomment && pattern.charAt(0) === "#") {
      this.comment = true;
      return;
    }
    if (!pattern) {
      this.empty = true;
      return;
    }
    this.parseNegate();
    this.globSet = [...new Set(this.braceExpand())];
    if (options.debug) {
      this.debug = (...args) => console.error(...args);
    }
    this.debug(this.pattern, this.globSet);
    const rawGlobParts = this.globSet.map((s) => this.slashSplit(s));
    this.globParts = this.preprocess(rawGlobParts);
    this.debug(this.pattern, this.globParts);
    let set = this.globParts.map((s, _, __) => {
      if (this.isWindows && this.windowsNoMagicRoot) {
        const isUNC = s[0] === "" && s[1] === "" && (s[2] === "?" || !globMagic.test(s[2])) && !globMagic.test(s[3]);
        const isDrive = /^[a-z]:/i.test(s[0]);
        if (isUNC) {
          return [
            ...s.slice(0, 4),
            ...s.slice(4).map((ss) => this.parse(ss))
          ];
        } else if (isDrive) {
          return [s[0], ...s.slice(1).map((ss) => this.parse(ss))];
        }
      }
      return s.map((ss) => this.parse(ss));
    });
    this.debug(this.pattern, set);
    this.set = set.filter((s) => s.indexOf(false) === -1);
    if (this.isWindows) {
      for (let i = 0; i < this.set.length; i++) {
        const p = this.set[i];
        if (p[0] === "" && p[1] === "" && this.globParts[i][2] === "?" && typeof p[3] === "string" && /^[a-z]:$/i.test(p[3])) {
          p[2] = "?";
        }
      }
    }
    this.debug(this.pattern, this.set);
  }
  // various transforms to equivalent pattern sets that are
  // faster to process in a filesystem walk.  The goal is to
  // eliminate what we can, and push all ** patterns as far
  // to the right as possible, even if it increases the number
  // of patterns that we have to process.
  preprocess(globParts) {
    if (this.options.noglobstar) {
      for (const partset of globParts) {
        for (let j = 0; j < partset.length; j++) {
          if (partset[j] === "**") {
            partset[j] = "*";
          }
        }
      }
    }
    const { optimizationLevel = 1 } = this.options;
    if (optimizationLevel >= 2) {
      globParts = this.firstPhasePreProcess(globParts);
      globParts = this.secondPhasePreProcess(globParts);
    } else if (optimizationLevel >= 1) {
      globParts = this.levelOneOptimize(globParts);
    } else {
      globParts = this.adjascentGlobstarOptimize(globParts);
    }
    return globParts;
  }
  // just get rid of adjascent ** portions
  adjascentGlobstarOptimize(globParts) {
    return globParts.map((parts) => {
      let gs = -1;
      while (-1 !== (gs = parts.indexOf("**", gs + 1))) {
        let i = gs;
        while (parts[i + 1] === "**") {
          i++;
        }
        if (i !== gs) {
          parts.splice(gs, i - gs);
        }
      }
      return parts;
    });
  }
  // get rid of adjascent ** and resolve .. portions
  levelOneOptimize(globParts) {
    return globParts.map((parts) => {
      parts = parts.reduce((set, part) => {
        const prev = set[set.length - 1];
        if (part === "**" && prev === "**") {
          return set;
        }
        if (part === "..") {
          if (prev && prev !== ".." && prev !== "." && prev !== "**") {
            set.pop();
            return set;
          }
        }
        set.push(part);
        return set;
      }, []);
      return parts.length === 0 ? [""] : parts;
    });
  }
  levelTwoFileOptimize(parts) {
    if (!Array.isArray(parts)) {
      parts = this.slashSplit(parts);
    }
    let didSomething = false;
    do {
      didSomething = false;
      if (!this.preserveMultipleSlashes) {
        for (let i = 1; i < parts.length - 1; i++) {
          const p = parts[i];
          if (i === 1 && p === "" && parts[0] === "")
            continue;
          if (p === "." || p === "") {
            didSomething = true;
            parts.splice(i, 1);
            i--;
          }
        }
        if (parts[0] === "." && parts.length === 2 && (parts[1] === "." || parts[1] === "")) {
          didSomething = true;
          parts.pop();
        }
      }
      let dd = 0;
      while (-1 !== (dd = parts.indexOf("..", dd + 1))) {
        const p = parts[dd - 1];
        if (p && p !== "." && p !== ".." && p !== "**" && !(this.isWindows && /^[a-z]:$/i.test(p))) {
          didSomething = true;
          parts.splice(dd - 1, 2);
          dd -= 2;
        }
      }
    } while (didSomething);
    return parts.length === 0 ? [""] : parts;
  }
  // First phase: single-pattern processing
  // <pre> is 1 or more portions
  // <rest> is 1 or more portions
  // <p> is any portion other than ., .., '', or **
  // <e> is . or ''
  //
  // **/.. is *brutal* for filesystem walking performance, because
  // it effectively resets the recursive walk each time it occurs,
  // and ** cannot be reduced out by a .. pattern part like a regexp
  // or most strings (other than .., ., and '') can be.
  //
  // <pre>/**/../<p>/<p>/<rest> -> {<pre>/../<p>/<p>/<rest>,<pre>/**/<p>/<p>/<rest>}
  // <pre>/<e>/<rest> -> <pre>/<rest>
  // <pre>/<p>/../<rest> -> <pre>/<rest>
  // **/**/<rest> -> **/<rest>
  //
  // **/*/<rest> -> */**/<rest> <== not valid because ** doesn't follow
  // this WOULD be allowed if ** did follow symlinks, or * didn't
  firstPhasePreProcess(globParts) {
    let didSomething = false;
    do {
      didSomething = false;
      for (let parts of globParts) {
        let gs = -1;
        while (-1 !== (gs = parts.indexOf("**", gs + 1))) {
          let gss = gs;
          while (parts[gss + 1] === "**") {
            gss++;
          }
          if (gss > gs) {
            parts.splice(gs + 1, gss - gs);
          }
          let next = parts[gs + 1];
          const p = parts[gs + 2];
          const p2 = parts[gs + 3];
          if (next !== "..")
            continue;
          if (!p || p === "." || p === ".." || !p2 || p2 === "." || p2 === "..") {
            continue;
          }
          didSomething = true;
          parts.splice(gs, 1);
          const other = parts.slice(0);
          other[gs] = "**";
          globParts.push(other);
          gs--;
        }
        if (!this.preserveMultipleSlashes) {
          for (let i = 1; i < parts.length - 1; i++) {
            const p = parts[i];
            if (i === 1 && p === "" && parts[0] === "")
              continue;
            if (p === "." || p === "") {
              didSomething = true;
              parts.splice(i, 1);
              i--;
            }
          }
          if (parts[0] === "." && parts.length === 2 && (parts[1] === "." || parts[1] === "")) {
            didSomething = true;
            parts.pop();
          }
        }
        let dd = 0;
        while (-1 !== (dd = parts.indexOf("..", dd + 1))) {
          const p = parts[dd - 1];
          if (p && p !== "." && p !== ".." && p !== "**") {
            didSomething = true;
            const needDot = dd === 1 && parts[dd + 1] === "**";
            const splin = needDot ? ["."] : [];
            parts.splice(dd - 1, 2, ...splin);
            if (parts.length === 0)
              parts.push("");
            dd -= 2;
          }
        }
      }
    } while (didSomething);
    return globParts;
  }
  // second phase: multi-pattern dedupes
  // {<pre>/*/<rest>,<pre>/<p>/<rest>} -> <pre>/*/<rest>
  // {<pre>/<rest>,<pre>/<rest>} -> <pre>/<rest>
  // {<pre>/**/<rest>,<pre>/<rest>} -> <pre>/**/<rest>
  //
  // {<pre>/**/<rest>,<pre>/**/<p>/<rest>} -> <pre>/**/<rest>
  // ^-- not valid because ** doens't follow symlinks
  secondPhasePreProcess(globParts) {
    for (let i = 0; i < globParts.length - 1; i++) {
      for (let j = i + 1; j < globParts.length; j++) {
        const matched = this.partsMatch(globParts[i], globParts[j], !this.preserveMultipleSlashes);
        if (matched) {
          globParts[i] = [];
          globParts[j] = matched;
          break;
        }
      }
    }
    return globParts.filter((gs) => gs.length);
  }
  partsMatch(a, b, emptyGSMatch = false) {
    let ai = 0;
    let bi = 0;
    let result = [];
    let which = "";
    while (ai < a.length && bi < b.length) {
      if (a[ai] === b[bi]) {
        result.push(which === "b" ? b[bi] : a[ai]);
        ai++;
        bi++;
      } else if (emptyGSMatch && a[ai] === "**" && b[bi] === a[ai + 1]) {
        result.push(a[ai]);
        ai++;
      } else if (emptyGSMatch && b[bi] === "**" && a[ai] === b[bi + 1]) {
        result.push(b[bi]);
        bi++;
      } else if (a[ai] === "*" && b[bi] && (this.options.dot || !b[bi].startsWith(".")) && b[bi] !== "**") {
        if (which === "b")
          return false;
        which = "a";
        result.push(a[ai]);
        ai++;
        bi++;
      } else if (b[bi] === "*" && a[ai] && (this.options.dot || !a[ai].startsWith(".")) && a[ai] !== "**") {
        if (which === "a")
          return false;
        which = "b";
        result.push(b[bi]);
        ai++;
        bi++;
      } else {
        return false;
      }
    }
    return a.length === b.length && result;
  }
  parseNegate() {
    if (this.nonegate)
      return;
    const pattern = this.pattern;
    let negate = false;
    let negateOffset = 0;
    for (let i = 0; i < pattern.length && pattern.charAt(i) === "!"; i++) {
      negate = !negate;
      negateOffset++;
    }
    if (negateOffset)
      this.pattern = pattern.slice(negateOffset);
    this.negate = negate;
  }
  // set partial to true to test if, for example,
  // "/a/b" matches the start of "/*/b/*/d"
  // Partial means, if you run out of file before you run
  // out of pattern, then that's fine, as long as all
  // the parts match.
  matchOne(file, pattern, partial = false) {
    let fileStartIndex = 0;
    let patternStartIndex = 0;
    if (this.isWindows) {
      const fileDrive = typeof file[0] === "string" && /^[a-z]:$/i.test(file[0]);
      const fileUNC = !fileDrive && file[0] === "" && file[1] === "" && file[2] === "?" && /^[a-z]:$/i.test(file[3]);
      const patternDrive = typeof pattern[0] === "string" && /^[a-z]:$/i.test(pattern[0]);
      const patternUNC = !patternDrive && pattern[0] === "" && pattern[1] === "" && pattern[2] === "?" && typeof pattern[3] === "string" && /^[a-z]:$/i.test(pattern[3]);
      const fdi = fileUNC ? 3 : fileDrive ? 0 : void 0;
      const pdi = patternUNC ? 3 : patternDrive ? 0 : void 0;
      if (typeof fdi === "number" && typeof pdi === "number") {
        const [fd, pd] = [
          file[fdi],
          pattern[pdi]
        ];
        if (fd.toLowerCase() === pd.toLowerCase()) {
          pattern[pdi] = fd;
          patternStartIndex = pdi;
          fileStartIndex = fdi;
        }
      }
    }
    const { optimizationLevel = 1 } = this.options;
    if (optimizationLevel >= 2) {
      file = this.levelTwoFileOptimize(file);
    }
    if (pattern.includes(GLOBSTAR)) {
      return this.#matchGlobstar(file, pattern, partial, fileStartIndex, patternStartIndex);
    }
    return this.#matchOne(file, pattern, partial, fileStartIndex, patternStartIndex);
  }
  #matchGlobstar(file, pattern, partial, fileIndex, patternIndex) {
    const firstgs = pattern.indexOf(GLOBSTAR, patternIndex);
    const lastgs = pattern.lastIndexOf(GLOBSTAR);
    const [head, body, tail] = partial ? [
      pattern.slice(patternIndex, firstgs),
      pattern.slice(firstgs + 1),
      []
    ] : [
      pattern.slice(patternIndex, firstgs),
      pattern.slice(firstgs + 1, lastgs),
      pattern.slice(lastgs + 1)
    ];
    if (head.length) {
      const fileHead = file.slice(fileIndex, fileIndex + head.length);
      if (!this.#matchOne(fileHead, head, partial, 0, 0)) {
        return false;
      }
      fileIndex += head.length;
      patternIndex += head.length;
    }
    let fileTailMatch = 0;
    if (tail.length) {
      if (tail.length + fileIndex > file.length)
        return false;
      let tailStart = file.length - tail.length;
      if (this.#matchOne(file, tail, partial, tailStart, 0)) {
        fileTailMatch = tail.length;
      } else {
        if (file[file.length - 1] !== "" || fileIndex + tail.length === file.length) {
          return false;
        }
        tailStart--;
        if (!this.#matchOne(file, tail, partial, tailStart, 0)) {
          return false;
        }
        fileTailMatch = tail.length + 1;
      }
    }
    if (!body.length) {
      let sawSome = !!fileTailMatch;
      for (let i2 = fileIndex; i2 < file.length - fileTailMatch; i2++) {
        const f = String(file[i2]);
        sawSome = true;
        if (f === "." || f === ".." || !this.options.dot && f.startsWith(".")) {
          return false;
        }
      }
      return partial || sawSome;
    }
    const bodySegments = [[[], 0]];
    let currentBody = bodySegments[0];
    let nonGsParts = 0;
    const nonGsPartsSums = [0];
    for (const b of body) {
      if (b === GLOBSTAR) {
        nonGsPartsSums.push(nonGsParts);
        currentBody = [[], 0];
        bodySegments.push(currentBody);
      } else {
        currentBody[0].push(b);
        nonGsParts++;
      }
    }
    let i = bodySegments.length - 1;
    const fileLength = file.length - fileTailMatch;
    for (const b of bodySegments) {
      b[1] = fileLength - (nonGsPartsSums[i--] + b[0].length);
    }
    return !!this.#matchGlobStarBodySections(file, bodySegments, fileIndex, 0, partial, 0, !!fileTailMatch);
  }
  // return false for "nope, not matching"
  // return null for "not matching, cannot keep trying"
  #matchGlobStarBodySections(file, bodySegments, fileIndex, bodyIndex, partial, globStarDepth, sawTail) {
    const bs = bodySegments[bodyIndex];
    if (!bs) {
      for (let i = fileIndex; i < file.length; i++) {
        sawTail = true;
        const f = file[i];
        if (f === "." || f === ".." || !this.options.dot && f.startsWith(".")) {
          return false;
        }
      }
      return sawTail;
    }
    const [body, after] = bs;
    while (fileIndex <= after) {
      const m = this.#matchOne(file.slice(0, fileIndex + body.length), body, partial, fileIndex, 0);
      if (m && globStarDepth < this.maxGlobstarRecursion) {
        const sub = this.#matchGlobStarBodySections(file, bodySegments, fileIndex + body.length, bodyIndex + 1, partial, globStarDepth + 1, sawTail);
        if (sub !== false) {
          return sub;
        }
      }
      const f = file[fileIndex];
      if (f === "." || f === ".." || !this.options.dot && f.startsWith(".")) {
        return false;
      }
      fileIndex++;
    }
    return partial || null;
  }
  #matchOne(file, pattern, partial, fileIndex, patternIndex) {
    let fi;
    let pi;
    let pl;
    let fl;
    for (fi = fileIndex, pi = patternIndex, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
      this.debug("matchOne loop");
      let p = pattern[pi];
      let f = file[fi];
      this.debug(pattern, p, f);
      if (p === false || p === GLOBSTAR) {
        return false;
      }
      let hit;
      if (typeof p === "string") {
        hit = f === p;
        this.debug("string match", p, f, hit);
      } else {
        hit = p.test(f);
        this.debug("pattern match", p, f, hit);
      }
      if (!hit)
        return false;
    }
    if (fi === fl && pi === pl) {
      return true;
    } else if (fi === fl) {
      return partial;
    } else if (pi === pl) {
      return fi === fl - 1 && file[fi] === "";
    } else {
      throw new Error("wtf?");
    }
  }
  braceExpand() {
    return braceExpand(this.pattern, this.options);
  }
  parse(pattern) {
    assertValidPattern(pattern);
    const options = this.options;
    if (pattern === "**")
      return GLOBSTAR;
    if (pattern === "")
      return "";
    let m;
    let fastTest = null;
    if (m = pattern.match(starRE)) {
      fastTest = options.dot ? starTestDot : starTest;
    } else if (m = pattern.match(starDotExtRE)) {
      fastTest = (options.nocase ? options.dot ? starDotExtTestNocaseDot : starDotExtTestNocase : options.dot ? starDotExtTestDot : starDotExtTest)(m[1]);
    } else if (m = pattern.match(qmarksRE)) {
      fastTest = (options.nocase ? options.dot ? qmarksTestNocaseDot : qmarksTestNocase : options.dot ? qmarksTestDot : qmarksTest)(m);
    } else if (m = pattern.match(starDotStarRE)) {
      fastTest = options.dot ? starDotStarTestDot : starDotStarTest;
    } else if (m = pattern.match(dotStarRE)) {
      fastTest = dotStarTest;
    }
    const re = AST.fromGlob(pattern, this.options).toMMPattern();
    if (fastTest && typeof re === "object") {
      Reflect.defineProperty(re, "test", { value: fastTest });
    }
    return re;
  }
  makeRe() {
    if (this.regexp || this.regexp === false)
      return this.regexp;
    const set = this.set;
    if (!set.length) {
      this.regexp = false;
      return this.regexp;
    }
    const options = this.options;
    const twoStar = options.noglobstar ? star2 : options.dot ? twoStarDot : twoStarNoDot;
    const flags = new Set(options.nocase ? ["i"] : []);
    let re = set.map((pattern) => {
      const pp = pattern.map((p) => {
        if (p instanceof RegExp) {
          for (const f of p.flags.split(""))
            flags.add(f);
        }
        return typeof p === "string" ? regExpEscape2(p) : p === GLOBSTAR ? GLOBSTAR : p._src;
      });
      pp.forEach((p, i) => {
        const next = pp[i + 1];
        const prev = pp[i - 1];
        if (p !== GLOBSTAR || prev === GLOBSTAR) {
          return;
        }
        if (prev === void 0) {
          if (next !== void 0 && next !== GLOBSTAR) {
            pp[i + 1] = "(?:\\/|" + twoStar + "\\/)?" + next;
          } else {
            pp[i] = twoStar;
          }
        } else if (next === void 0) {
          pp[i - 1] = prev + "(?:\\/|\\/" + twoStar + ")?";
        } else if (next !== GLOBSTAR) {
          pp[i - 1] = prev + "(?:\\/|\\/" + twoStar + "\\/)" + next;
          pp[i + 1] = GLOBSTAR;
        }
      });
      const filtered = pp.filter((p) => p !== GLOBSTAR);
      if (this.partial && filtered.length >= 1) {
        const prefixes = [];
        for (let i = 1; i <= filtered.length; i++) {
          prefixes.push(filtered.slice(0, i).join("/"));
        }
        return "(?:" + prefixes.join("|") + ")";
      }
      return filtered.join("/");
    }).join("|");
    const [open, close] = set.length > 1 ? ["(?:", ")"] : ["", ""];
    re = "^" + open + re + close + "$";
    if (this.partial) {
      re = "^(?:\\/|" + open + re.slice(1, -1) + close + ")$";
    }
    if (this.negate)
      re = "^(?!" + re + ").+$";
    try {
      this.regexp = new RegExp(re, [...flags].join(""));
    } catch {
      this.regexp = false;
    }
    return this.regexp;
  }
  slashSplit(p) {
    if (this.preserveMultipleSlashes) {
      return p.split("/");
    } else if (this.isWindows && /^\/\/[^/]+/.test(p)) {
      return ["", ...p.split(/\/+/)];
    } else {
      return p.split(/\/+/);
    }
  }
  match(f, partial = this.partial) {
    this.debug("match", f, this.pattern);
    if (this.comment) {
      return false;
    }
    if (this.empty) {
      return f === "";
    }
    if (f === "/" && partial) {
      return true;
    }
    const options = this.options;
    if (this.isWindows) {
      f = f.split("\\").join("/");
    }
    const ff = this.slashSplit(f);
    this.debug(this.pattern, "split", ff);
    const set = this.set;
    this.debug(this.pattern, "set", set);
    let filename = ff[ff.length - 1];
    if (!filename) {
      for (let i = ff.length - 2; !filename && i >= 0; i--) {
        filename = ff[i];
      }
    }
    for (const pattern of set) {
      let file = ff;
      if (options.matchBase && pattern.length === 1) {
        file = [filename];
      }
      const hit = this.matchOne(file, pattern, partial);
      if (hit) {
        if (options.flipNegate) {
          return true;
        }
        return !this.negate;
      }
    }
    if (options.flipNegate) {
      return false;
    }
    return this.negate;
  }
  static defaults(def) {
    return minimatch.defaults(def).Minimatch;
  }
};
minimatch.AST = AST;
minimatch.Minimatch = Minimatch;
minimatch.escape = escape;
minimatch.unescape = unescape;

// node_modules/.pnpm/glob@11.1.0/node_modules/glob/dist/esm/glob.js
var import_node_url2 = require("url");

// node_modules/.pnpm/lru-cache@11.0.1/node_modules/lru-cache/dist/esm/index.js
var perf = typeof performance === "object" && performance && typeof performance.now === "function" ? performance : Date;
var warned = /* @__PURE__ */ new Set();
var PROCESS = typeof process === "object" && !!process ? process : {};
var emitWarning = (msg, type, code, fn) => {
  typeof PROCESS.emitWarning === "function" ? PROCESS.emitWarning(msg, type, code, fn) : console.error(`[${code}] ${type}: ${msg}`);
};
var AC = globalThis.AbortController;
var AS = globalThis.AbortSignal;
if (typeof AC === "undefined") {
  AS = class AbortSignal {
    onabort;
    _onabort = [];
    reason;
    aborted = false;
    addEventListener(_, fn) {
      this._onabort.push(fn);
    }
  };
  AC = class AbortController {
    constructor() {
      warnACPolyfill();
    }
    signal = new AS();
    abort(reason) {
      if (this.signal.aborted)
        return;
      this.signal.reason = reason;
      this.signal.aborted = true;
      for (const fn of this.signal._onabort) {
        fn(reason);
      }
      this.signal.onabort?.(reason);
    }
  };
  let printACPolyfillWarning = PROCESS.env?.LRU_CACHE_IGNORE_AC_WARNING !== "1";
  const warnACPolyfill = () => {
    if (!printACPolyfillWarning)
      return;
    printACPolyfillWarning = false;
    emitWarning("AbortController is not defined. If using lru-cache in node 14, load an AbortController polyfill from the `node-abort-controller` package. A minimal polyfill is provided for use by LRUCache.fetch(), but it should not be relied upon in other contexts (eg, passing it to other APIs that use AbortController/AbortSignal might have undesirable effects). You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.", "NO_ABORT_CONTROLLER", "ENOTSUP", warnACPolyfill);
  };
}
var shouldWarn = (code) => !warned.has(code);
var isPosInt = (n) => n && n === Math.floor(n) && n > 0 && isFinite(n);
var getUintArray = (max) => !isPosInt(max) ? null : max <= Math.pow(2, 8) ? Uint8Array : max <= Math.pow(2, 16) ? Uint16Array : max <= Math.pow(2, 32) ? Uint32Array : max <= Number.MAX_SAFE_INTEGER ? ZeroArray : null;
var ZeroArray = class extends Array {
  constructor(size) {
    super(size);
    this.fill(0);
  }
};
var Stack = class _Stack {
  heap;
  length;
  // private constructor
  static #constructing = false;
  static create(max) {
    const HeapCls = getUintArray(max);
    if (!HeapCls)
      return [];
    _Stack.#constructing = true;
    const s = new _Stack(max, HeapCls);
    _Stack.#constructing = false;
    return s;
  }
  constructor(max, HeapCls) {
    if (!_Stack.#constructing) {
      throw new TypeError("instantiate Stack using Stack.create(n)");
    }
    this.heap = new HeapCls(max);
    this.length = 0;
  }
  push(n) {
    this.heap[this.length++] = n;
  }
  pop() {
    return this.heap[--this.length];
  }
};
var LRUCache = class _LRUCache {
  // options that cannot be changed without disaster
  #max;
  #maxSize;
  #dispose;
  #disposeAfter;
  #fetchMethod;
  #memoMethod;
  /**
   * {@link LRUCache.OptionsBase.ttl}
   */
  ttl;
  /**
   * {@link LRUCache.OptionsBase.ttlResolution}
   */
  ttlResolution;
  /**
   * {@link LRUCache.OptionsBase.ttlAutopurge}
   */
  ttlAutopurge;
  /**
   * {@link LRUCache.OptionsBase.updateAgeOnGet}
   */
  updateAgeOnGet;
  /**
   * {@link LRUCache.OptionsBase.updateAgeOnHas}
   */
  updateAgeOnHas;
  /**
   * {@link LRUCache.OptionsBase.allowStale}
   */
  allowStale;
  /**
   * {@link LRUCache.OptionsBase.noDisposeOnSet}
   */
  noDisposeOnSet;
  /**
   * {@link LRUCache.OptionsBase.noUpdateTTL}
   */
  noUpdateTTL;
  /**
   * {@link LRUCache.OptionsBase.maxEntrySize}
   */
  maxEntrySize;
  /**
   * {@link LRUCache.OptionsBase.sizeCalculation}
   */
  sizeCalculation;
  /**
   * {@link LRUCache.OptionsBase.noDeleteOnFetchRejection}
   */
  noDeleteOnFetchRejection;
  /**
   * {@link LRUCache.OptionsBase.noDeleteOnStaleGet}
   */
  noDeleteOnStaleGet;
  /**
   * {@link LRUCache.OptionsBase.allowStaleOnFetchAbort}
   */
  allowStaleOnFetchAbort;
  /**
   * {@link LRUCache.OptionsBase.allowStaleOnFetchRejection}
   */
  allowStaleOnFetchRejection;
  /**
   * {@link LRUCache.OptionsBase.ignoreFetchAbort}
   */
  ignoreFetchAbort;
  // computed properties
  #size;
  #calculatedSize;
  #keyMap;
  #keyList;
  #valList;
  #next;
  #prev;
  #head;
  #tail;
  #free;
  #disposed;
  #sizes;
  #starts;
  #ttls;
  #hasDispose;
  #hasFetchMethod;
  #hasDisposeAfter;
  /**
   * Do not call this method unless you need to inspect the
   * inner workings of the cache.  If anything returned by this
   * object is modified in any way, strange breakage may occur.
   *
   * These fields are private for a reason!
   *
   * @internal
   */
  static unsafeExposeInternals(c) {
    return {
      // properties
      starts: c.#starts,
      ttls: c.#ttls,
      sizes: c.#sizes,
      keyMap: c.#keyMap,
      keyList: c.#keyList,
      valList: c.#valList,
      next: c.#next,
      prev: c.#prev,
      get head() {
        return c.#head;
      },
      get tail() {
        return c.#tail;
      },
      free: c.#free,
      // methods
      isBackgroundFetch: (p) => c.#isBackgroundFetch(p),
      backgroundFetch: (k, index, options, context) => c.#backgroundFetch(k, index, options, context),
      moveToTail: (index) => c.#moveToTail(index),
      indexes: (options) => c.#indexes(options),
      rindexes: (options) => c.#rindexes(options),
      isStale: (index) => c.#isStale(index)
    };
  }
  // Protected read-only members
  /**
   * {@link LRUCache.OptionsBase.max} (read-only)
   */
  get max() {
    return this.#max;
  }
  /**
   * {@link LRUCache.OptionsBase.maxSize} (read-only)
   */
  get maxSize() {
    return this.#maxSize;
  }
  /**
   * The total computed size of items in the cache (read-only)
   */
  get calculatedSize() {
    return this.#calculatedSize;
  }
  /**
   * The number of items stored in the cache (read-only)
   */
  get size() {
    return this.#size;
  }
  /**
   * {@link LRUCache.OptionsBase.fetchMethod} (read-only)
   */
  get fetchMethod() {
    return this.#fetchMethod;
  }
  get memoMethod() {
    return this.#memoMethod;
  }
  /**
   * {@link LRUCache.OptionsBase.dispose} (read-only)
   */
  get dispose() {
    return this.#dispose;
  }
  /**
   * {@link LRUCache.OptionsBase.disposeAfter} (read-only)
   */
  get disposeAfter() {
    return this.#disposeAfter;
  }
  constructor(options) {
    const { max = 0, ttl, ttlResolution = 1, ttlAutopurge, updateAgeOnGet, updateAgeOnHas, allowStale, dispose, disposeAfter, noDisposeOnSet, noUpdateTTL, maxSize = 0, maxEntrySize = 0, sizeCalculation, fetchMethod, memoMethod, noDeleteOnFetchRejection, noDeleteOnStaleGet, allowStaleOnFetchRejection, allowStaleOnFetchAbort, ignoreFetchAbort } = options;
    if (max !== 0 && !isPosInt(max)) {
      throw new TypeError("max option must be a nonnegative integer");
    }
    const UintArray = max ? getUintArray(max) : Array;
    if (!UintArray) {
      throw new Error("invalid max value: " + max);
    }
    this.#max = max;
    this.#maxSize = maxSize;
    this.maxEntrySize = maxEntrySize || this.#maxSize;
    this.sizeCalculation = sizeCalculation;
    if (this.sizeCalculation) {
      if (!this.#maxSize && !this.maxEntrySize) {
        throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
      }
      if (typeof this.sizeCalculation !== "function") {
        throw new TypeError("sizeCalculation set to non-function");
      }
    }
    if (memoMethod !== void 0 && typeof memoMethod !== "function") {
      throw new TypeError("memoMethod must be a function if defined");
    }
    this.#memoMethod = memoMethod;
    if (fetchMethod !== void 0 && typeof fetchMethod !== "function") {
      throw new TypeError("fetchMethod must be a function if specified");
    }
    this.#fetchMethod = fetchMethod;
    this.#hasFetchMethod = !!fetchMethod;
    this.#keyMap = /* @__PURE__ */ new Map();
    this.#keyList = new Array(max).fill(void 0);
    this.#valList = new Array(max).fill(void 0);
    this.#next = new UintArray(max);
    this.#prev = new UintArray(max);
    this.#head = 0;
    this.#tail = 0;
    this.#free = Stack.create(max);
    this.#size = 0;
    this.#calculatedSize = 0;
    if (typeof dispose === "function") {
      this.#dispose = dispose;
    }
    if (typeof disposeAfter === "function") {
      this.#disposeAfter = disposeAfter;
      this.#disposed = [];
    } else {
      this.#disposeAfter = void 0;
      this.#disposed = void 0;
    }
    this.#hasDispose = !!this.#dispose;
    this.#hasDisposeAfter = !!this.#disposeAfter;
    this.noDisposeOnSet = !!noDisposeOnSet;
    this.noUpdateTTL = !!noUpdateTTL;
    this.noDeleteOnFetchRejection = !!noDeleteOnFetchRejection;
    this.allowStaleOnFetchRejection = !!allowStaleOnFetchRejection;
    this.allowStaleOnFetchAbort = !!allowStaleOnFetchAbort;
    this.ignoreFetchAbort = !!ignoreFetchAbort;
    if (this.maxEntrySize !== 0) {
      if (this.#maxSize !== 0) {
        if (!isPosInt(this.#maxSize)) {
          throw new TypeError("maxSize must be a positive integer if specified");
        }
      }
      if (!isPosInt(this.maxEntrySize)) {
        throw new TypeError("maxEntrySize must be a positive integer if specified");
      }
      this.#initializeSizeTracking();
    }
    this.allowStale = !!allowStale;
    this.noDeleteOnStaleGet = !!noDeleteOnStaleGet;
    this.updateAgeOnGet = !!updateAgeOnGet;
    this.updateAgeOnHas = !!updateAgeOnHas;
    this.ttlResolution = isPosInt(ttlResolution) || ttlResolution === 0 ? ttlResolution : 1;
    this.ttlAutopurge = !!ttlAutopurge;
    this.ttl = ttl || 0;
    if (this.ttl) {
      if (!isPosInt(this.ttl)) {
        throw new TypeError("ttl must be a positive integer if specified");
      }
      this.#initializeTTLTracking();
    }
    if (this.#max === 0 && this.ttl === 0 && this.#maxSize === 0) {
      throw new TypeError("At least one of max, maxSize, or ttl is required");
    }
    if (!this.ttlAutopurge && !this.#max && !this.#maxSize) {
      const code = "LRU_CACHE_UNBOUNDED";
      if (shouldWarn(code)) {
        warned.add(code);
        const msg = "TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.";
        emitWarning(msg, "UnboundedCacheWarning", code, _LRUCache);
      }
    }
  }
  /**
   * Return the number of ms left in the item's TTL. If item is not in cache,
   * returns `0`. Returns `Infinity` if item is in cache without a defined TTL.
   */
  getRemainingTTL(key) {
    return this.#keyMap.has(key) ? Infinity : 0;
  }
  #initializeTTLTracking() {
    const ttls = new ZeroArray(this.#max);
    const starts = new ZeroArray(this.#max);
    this.#ttls = ttls;
    this.#starts = starts;
    this.#setItemTTL = (index, ttl, start = perf.now()) => {
      starts[index] = ttl !== 0 ? start : 0;
      ttls[index] = ttl;
      if (ttl !== 0 && this.ttlAutopurge) {
        const t = setTimeout(() => {
          if (this.#isStale(index)) {
            this.#delete(this.#keyList[index], "expire");
          }
        }, ttl + 1);
        if (t.unref) {
          t.unref();
        }
      }
    };
    this.#updateItemAge = (index) => {
      starts[index] = ttls[index] !== 0 ? perf.now() : 0;
    };
    this.#statusTTL = (status, index) => {
      if (ttls[index]) {
        const ttl = ttls[index];
        const start = starts[index];
        if (!ttl || !start)
          return;
        status.ttl = ttl;
        status.start = start;
        status.now = cachedNow || getNow();
        const age = status.now - start;
        status.remainingTTL = ttl - age;
      }
    };
    let cachedNow = 0;
    const getNow = () => {
      const n = perf.now();
      if (this.ttlResolution > 0) {
        cachedNow = n;
        const t = setTimeout(() => cachedNow = 0, this.ttlResolution);
        if (t.unref) {
          t.unref();
        }
      }
      return n;
    };
    this.getRemainingTTL = (key) => {
      const index = this.#keyMap.get(key);
      if (index === void 0) {
        return 0;
      }
      const ttl = ttls[index];
      const start = starts[index];
      if (!ttl || !start) {
        return Infinity;
      }
      const age = (cachedNow || getNow()) - start;
      return ttl - age;
    };
    this.#isStale = (index) => {
      const s = starts[index];
      const t = ttls[index];
      return !!t && !!s && (cachedNow || getNow()) - s > t;
    };
  }
  // conditionally set private methods related to TTL
  #updateItemAge = () => {
  };
  #statusTTL = () => {
  };
  #setItemTTL = () => {
  };
  /* c8 ignore stop */
  #isStale = () => false;
  #initializeSizeTracking() {
    const sizes = new ZeroArray(this.#max);
    this.#calculatedSize = 0;
    this.#sizes = sizes;
    this.#removeItemSize = (index) => {
      this.#calculatedSize -= sizes[index];
      sizes[index] = 0;
    };
    this.#requireSize = (k, v, size, sizeCalculation) => {
      if (this.#isBackgroundFetch(v)) {
        return 0;
      }
      if (!isPosInt(size)) {
        if (sizeCalculation) {
          if (typeof sizeCalculation !== "function") {
            throw new TypeError("sizeCalculation must be a function");
          }
          size = sizeCalculation(v, k);
          if (!isPosInt(size)) {
            throw new TypeError("sizeCalculation return invalid (expect positive integer)");
          }
        } else {
          throw new TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
        }
      }
      return size;
    };
    this.#addItemSize = (index, size, status) => {
      sizes[index] = size;
      if (this.#maxSize) {
        const maxSize = this.#maxSize - sizes[index];
        while (this.#calculatedSize > maxSize) {
          this.#evict(true);
        }
      }
      this.#calculatedSize += sizes[index];
      if (status) {
        status.entrySize = size;
        status.totalCalculatedSize = this.#calculatedSize;
      }
    };
  }
  #removeItemSize = (_i) => {
  };
  #addItemSize = (_i, _s, _st) => {
  };
  #requireSize = (_k, _v, size, sizeCalculation) => {
    if (size || sizeCalculation) {
      throw new TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
    }
    return 0;
  };
  *#indexes({ allowStale = this.allowStale } = {}) {
    if (this.#size) {
      for (let i = this.#tail; true; ) {
        if (!this.#isValidIndex(i)) {
          break;
        }
        if (allowStale || !this.#isStale(i)) {
          yield i;
        }
        if (i === this.#head) {
          break;
        } else {
          i = this.#prev[i];
        }
      }
    }
  }
  *#rindexes({ allowStale = this.allowStale } = {}) {
    if (this.#size) {
      for (let i = this.#head; true; ) {
        if (!this.#isValidIndex(i)) {
          break;
        }
        if (allowStale || !this.#isStale(i)) {
          yield i;
        }
        if (i === this.#tail) {
          break;
        } else {
          i = this.#next[i];
        }
      }
    }
  }
  #isValidIndex(index) {
    return index !== void 0 && this.#keyMap.get(this.#keyList[index]) === index;
  }
  /**
   * Return a generator yielding `[key, value]` pairs,
   * in order from most recently used to least recently used.
   */
  *entries() {
    for (const i of this.#indexes()) {
      if (this.#valList[i] !== void 0 && this.#keyList[i] !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield [this.#keyList[i], this.#valList[i]];
      }
    }
  }
  /**
   * Inverse order version of {@link LRUCache.entries}
   *
   * Return a generator yielding `[key, value]` pairs,
   * in order from least recently used to most recently used.
   */
  *rentries() {
    for (const i of this.#rindexes()) {
      if (this.#valList[i] !== void 0 && this.#keyList[i] !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield [this.#keyList[i], this.#valList[i]];
      }
    }
  }
  /**
   * Return a generator yielding the keys in the cache,
   * in order from most recently used to least recently used.
   */
  *keys() {
    for (const i of this.#indexes()) {
      const k = this.#keyList[i];
      if (k !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield k;
      }
    }
  }
  /**
   * Inverse order version of {@link LRUCache.keys}
   *
   * Return a generator yielding the keys in the cache,
   * in order from least recently used to most recently used.
   */
  *rkeys() {
    for (const i of this.#rindexes()) {
      const k = this.#keyList[i];
      if (k !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield k;
      }
    }
  }
  /**
   * Return a generator yielding the values in the cache,
   * in order from most recently used to least recently used.
   */
  *values() {
    for (const i of this.#indexes()) {
      const v = this.#valList[i];
      if (v !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield this.#valList[i];
      }
    }
  }
  /**
   * Inverse order version of {@link LRUCache.values}
   *
   * Return a generator yielding the values in the cache,
   * in order from least recently used to most recently used.
   */
  *rvalues() {
    for (const i of this.#rindexes()) {
      const v = this.#valList[i];
      if (v !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield this.#valList[i];
      }
    }
  }
  /**
   * Iterating over the cache itself yields the same results as
   * {@link LRUCache.entries}
   */
  [Symbol.iterator]() {
    return this.entries();
  }
  /**
   * A String value that is used in the creation of the default string
   * description of an object. Called by the built-in method
   * `Object.prototype.toString`.
   */
  [Symbol.toStringTag] = "LRUCache";
  /**
   * Find a value for which the supplied fn method returns a truthy value,
   * similar to `Array.find()`. fn is called as `fn(value, key, cache)`.
   */
  find(fn, getOptions = {}) {
    for (const i of this.#indexes()) {
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === void 0)
        continue;
      if (fn(value, this.#keyList[i], this)) {
        return this.get(this.#keyList[i], getOptions);
      }
    }
  }
  /**
   * Call the supplied function on each item in the cache, in order from most
   * recently used to least recently used.
   *
   * `fn` is called as `fn(value, key, cache)`.
   *
   * If `thisp` is provided, function will be called in the `this`-context of
   * the provided object, or the cache if no `thisp` object is provided.
   *
   * Does not update age or recenty of use, or iterate over stale values.
   */
  forEach(fn, thisp = this) {
    for (const i of this.#indexes()) {
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === void 0)
        continue;
      fn.call(thisp, value, this.#keyList[i], this);
    }
  }
  /**
   * The same as {@link LRUCache.forEach} but items are iterated over in
   * reverse order.  (ie, less recently used items are iterated over first.)
   */
  rforEach(fn, thisp = this) {
    for (const i of this.#rindexes()) {
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === void 0)
        continue;
      fn.call(thisp, value, this.#keyList[i], this);
    }
  }
  /**
   * Delete any stale entries. Returns true if anything was removed,
   * false otherwise.
   */
  purgeStale() {
    let deleted = false;
    for (const i of this.#rindexes({ allowStale: true })) {
      if (this.#isStale(i)) {
        this.#delete(this.#keyList[i], "expire");
        deleted = true;
      }
    }
    return deleted;
  }
  /**
   * Get the extended info about a given entry, to get its value, size, and
   * TTL info simultaneously. Returns `undefined` if the key is not present.
   *
   * Unlike {@link LRUCache#dump}, which is designed to be portable and survive
   * serialization, the `start` value is always the current timestamp, and the
   * `ttl` is a calculated remaining time to live (negative if expired).
   *
   * Always returns stale values, if their info is found in the cache, so be
   * sure to check for expirations (ie, a negative {@link LRUCache.Entry#ttl})
   * if relevant.
   */
  info(key) {
    const i = this.#keyMap.get(key);
    if (i === void 0)
      return void 0;
    const v = this.#valList[i];
    const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
    if (value === void 0)
      return void 0;
    const entry = { value };
    if (this.#ttls && this.#starts) {
      const ttl = this.#ttls[i];
      const start = this.#starts[i];
      if (ttl && start) {
        const remain = ttl - (perf.now() - start);
        entry.ttl = remain;
        entry.start = Date.now();
      }
    }
    if (this.#sizes) {
      entry.size = this.#sizes[i];
    }
    return entry;
  }
  /**
   * Return an array of [key, {@link LRUCache.Entry}] tuples which can be
   * passed to {@link LRLUCache#load}.
   *
   * The `start` fields are calculated relative to a portable `Date.now()`
   * timestamp, even if `performance.now()` is available.
   *
   * Stale entries are always included in the `dump`, even if
   * {@link LRUCache.OptionsBase.allowStale} is false.
   *
   * Note: this returns an actual array, not a generator, so it can be more
   * easily passed around.
   */
  dump() {
    const arr = [];
    for (const i of this.#indexes({ allowStale: true })) {
      const key = this.#keyList[i];
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === void 0 || key === void 0)
        continue;
      const entry = { value };
      if (this.#ttls && this.#starts) {
        entry.ttl = this.#ttls[i];
        const age = perf.now() - this.#starts[i];
        entry.start = Math.floor(Date.now() - age);
      }
      if (this.#sizes) {
        entry.size = this.#sizes[i];
      }
      arr.unshift([key, entry]);
    }
    return arr;
  }
  /**
   * Reset the cache and load in the items in entries in the order listed.
   *
   * The shape of the resulting cache may be different if the same options are
   * not used in both caches.
   *
   * The `start` fields are assumed to be calculated relative to a portable
   * `Date.now()` timestamp, even if `performance.now()` is available.
   */
  load(arr) {
    this.clear();
    for (const [key, entry] of arr) {
      if (entry.start) {
        const age = Date.now() - entry.start;
        entry.start = perf.now() - age;
      }
      this.set(key, entry.value, entry);
    }
  }
  /**
   * Add a value to the cache.
   *
   * Note: if `undefined` is specified as a value, this is an alias for
   * {@link LRUCache#delete}
   *
   * Fields on the {@link LRUCache.SetOptions} options param will override
   * their corresponding values in the constructor options for the scope
   * of this single `set()` operation.
   *
   * If `start` is provided, then that will set the effective start
   * time for the TTL calculation. Note that this must be a previous
   * value of `performance.now()` if supported, or a previous value of
   * `Date.now()` if not.
   *
   * Options object may also include `size`, which will prevent
   * calling the `sizeCalculation` function and just use the specified
   * number if it is a positive integer, and `noDisposeOnSet` which
   * will prevent calling a `dispose` function in the case of
   * overwrites.
   *
   * If the `size` (or return value of `sizeCalculation`) for a given
   * entry is greater than `maxEntrySize`, then the item will not be
   * added to the cache.
   *
   * Will update the recency of the entry.
   *
   * If the value is `undefined`, then this is an alias for
   * `cache.delete(key)`. `undefined` is never stored in the cache.
   */
  set(k, v, setOptions = {}) {
    if (v === void 0) {
      this.delete(k);
      return this;
    }
    const { ttl = this.ttl, start, noDisposeOnSet = this.noDisposeOnSet, sizeCalculation = this.sizeCalculation, status } = setOptions;
    let { noUpdateTTL = this.noUpdateTTL } = setOptions;
    const size = this.#requireSize(k, v, setOptions.size || 0, sizeCalculation);
    if (this.maxEntrySize && size > this.maxEntrySize) {
      if (status) {
        status.set = "miss";
        status.maxEntrySizeExceeded = true;
      }
      this.#delete(k, "set");
      return this;
    }
    let index = this.#size === 0 ? void 0 : this.#keyMap.get(k);
    if (index === void 0) {
      index = this.#size === 0 ? this.#tail : this.#free.length !== 0 ? this.#free.pop() : this.#size === this.#max ? this.#evict(false) : this.#size;
      this.#keyList[index] = k;
      this.#valList[index] = v;
      this.#keyMap.set(k, index);
      this.#next[this.#tail] = index;
      this.#prev[index] = this.#tail;
      this.#tail = index;
      this.#size++;
      this.#addItemSize(index, size, status);
      if (status)
        status.set = "add";
      noUpdateTTL = false;
    } else {
      this.#moveToTail(index);
      const oldVal = this.#valList[index];
      if (v !== oldVal) {
        if (this.#hasFetchMethod && this.#isBackgroundFetch(oldVal)) {
          oldVal.__abortController.abort(new Error("replaced"));
          const { __staleWhileFetching: s } = oldVal;
          if (s !== void 0 && !noDisposeOnSet) {
            if (this.#hasDispose) {
              this.#dispose?.(s, k, "set");
            }
            if (this.#hasDisposeAfter) {
              this.#disposed?.push([s, k, "set"]);
            }
          }
        } else if (!noDisposeOnSet) {
          if (this.#hasDispose) {
            this.#dispose?.(oldVal, k, "set");
          }
          if (this.#hasDisposeAfter) {
            this.#disposed?.push([oldVal, k, "set"]);
          }
        }
        this.#removeItemSize(index);
        this.#addItemSize(index, size, status);
        this.#valList[index] = v;
        if (status) {
          status.set = "replace";
          const oldValue = oldVal && this.#isBackgroundFetch(oldVal) ? oldVal.__staleWhileFetching : oldVal;
          if (oldValue !== void 0)
            status.oldValue = oldValue;
        }
      } else if (status) {
        status.set = "update";
      }
    }
    if (ttl !== 0 && !this.#ttls) {
      this.#initializeTTLTracking();
    }
    if (this.#ttls) {
      if (!noUpdateTTL) {
        this.#setItemTTL(index, ttl, start);
      }
      if (status)
        this.#statusTTL(status, index);
    }
    if (!noDisposeOnSet && this.#hasDisposeAfter && this.#disposed) {
      const dt = this.#disposed;
      let task;
      while (task = dt?.shift()) {
        this.#disposeAfter?.(...task);
      }
    }
    return this;
  }
  /**
   * Evict the least recently used item, returning its value or
   * `undefined` if cache is empty.
   */
  pop() {
    try {
      while (this.#size) {
        const val = this.#valList[this.#head];
        this.#evict(true);
        if (this.#isBackgroundFetch(val)) {
          if (val.__staleWhileFetching) {
            return val.__staleWhileFetching;
          }
        } else if (val !== void 0) {
          return val;
        }
      }
    } finally {
      if (this.#hasDisposeAfter && this.#disposed) {
        const dt = this.#disposed;
        let task;
        while (task = dt?.shift()) {
          this.#disposeAfter?.(...task);
        }
      }
    }
  }
  #evict(free) {
    const head = this.#head;
    const k = this.#keyList[head];
    const v = this.#valList[head];
    if (this.#hasFetchMethod && this.#isBackgroundFetch(v)) {
      v.__abortController.abort(new Error("evicted"));
    } else if (this.#hasDispose || this.#hasDisposeAfter) {
      if (this.#hasDispose) {
        this.#dispose?.(v, k, "evict");
      }
      if (this.#hasDisposeAfter) {
        this.#disposed?.push([v, k, "evict"]);
      }
    }
    this.#removeItemSize(head);
    if (free) {
      this.#keyList[head] = void 0;
      this.#valList[head] = void 0;
      this.#free.push(head);
    }
    if (this.#size === 1) {
      this.#head = this.#tail = 0;
      this.#free.length = 0;
    } else {
      this.#head = this.#next[head];
    }
    this.#keyMap.delete(k);
    this.#size--;
    return head;
  }
  /**
   * Check if a key is in the cache, without updating the recency of use.
   * Will return false if the item is stale, even though it is technically
   * in the cache.
   *
   * Check if a key is in the cache, without updating the recency of
   * use. Age is updated if {@link LRUCache.OptionsBase.updateAgeOnHas} is set
   * to `true` in either the options or the constructor.
   *
   * Will return `false` if the item is stale, even though it is technically in
   * the cache. The difference can be determined (if it matters) by using a
   * `status` argument, and inspecting the `has` field.
   *
   * Will not update item age unless
   * {@link LRUCache.OptionsBase.updateAgeOnHas} is set.
   */
  has(k, hasOptions = {}) {
    const { updateAgeOnHas = this.updateAgeOnHas, status } = hasOptions;
    const index = this.#keyMap.get(k);
    if (index !== void 0) {
      const v = this.#valList[index];
      if (this.#isBackgroundFetch(v) && v.__staleWhileFetching === void 0) {
        return false;
      }
      if (!this.#isStale(index)) {
        if (updateAgeOnHas) {
          this.#updateItemAge(index);
        }
        if (status) {
          status.has = "hit";
          this.#statusTTL(status, index);
        }
        return true;
      } else if (status) {
        status.has = "stale";
        this.#statusTTL(status, index);
      }
    } else if (status) {
      status.has = "miss";
    }
    return false;
  }
  /**
   * Like {@link LRUCache#get} but doesn't update recency or delete stale
   * items.
   *
   * Returns `undefined` if the item is stale, unless
   * {@link LRUCache.OptionsBase.allowStale} is set.
   */
  peek(k, peekOptions = {}) {
    const { allowStale = this.allowStale } = peekOptions;
    const index = this.#keyMap.get(k);
    if (index === void 0 || !allowStale && this.#isStale(index)) {
      return;
    }
    const v = this.#valList[index];
    return this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
  }
  #backgroundFetch(k, index, options, context) {
    const v = index === void 0 ? void 0 : this.#valList[index];
    if (this.#isBackgroundFetch(v)) {
      return v;
    }
    const ac = new AC();
    const { signal } = options;
    signal?.addEventListener("abort", () => ac.abort(signal.reason), {
      signal: ac.signal
    });
    const fetchOpts = {
      signal: ac.signal,
      options,
      context
    };
    const cb = (v2, updateCache = false) => {
      const { aborted } = ac.signal;
      const ignoreAbort = options.ignoreFetchAbort && v2 !== void 0;
      if (options.status) {
        if (aborted && !updateCache) {
          options.status.fetchAborted = true;
          options.status.fetchError = ac.signal.reason;
          if (ignoreAbort)
            options.status.fetchAbortIgnored = true;
        } else {
          options.status.fetchResolved = true;
        }
      }
      if (aborted && !ignoreAbort && !updateCache) {
        return fetchFail(ac.signal.reason);
      }
      const bf2 = p;
      if (this.#valList[index] === p) {
        if (v2 === void 0) {
          if (bf2.__staleWhileFetching) {
            this.#valList[index] = bf2.__staleWhileFetching;
          } else {
            this.#delete(k, "fetch");
          }
        } else {
          if (options.status)
            options.status.fetchUpdated = true;
          this.set(k, v2, fetchOpts.options);
        }
      }
      return v2;
    };
    const eb = (er) => {
      if (options.status) {
        options.status.fetchRejected = true;
        options.status.fetchError = er;
      }
      return fetchFail(er);
    };
    const fetchFail = (er) => {
      const { aborted } = ac.signal;
      const allowStaleAborted = aborted && options.allowStaleOnFetchAbort;
      const allowStale = allowStaleAborted || options.allowStaleOnFetchRejection;
      const noDelete = allowStale || options.noDeleteOnFetchRejection;
      const bf2 = p;
      if (this.#valList[index] === p) {
        const del = !noDelete || bf2.__staleWhileFetching === void 0;
        if (del) {
          this.#delete(k, "fetch");
        } else if (!allowStaleAborted) {
          this.#valList[index] = bf2.__staleWhileFetching;
        }
      }
      if (allowStale) {
        if (options.status && bf2.__staleWhileFetching !== void 0) {
          options.status.returnedStale = true;
        }
        return bf2.__staleWhileFetching;
      } else if (bf2.__returned === bf2) {
        throw er;
      }
    };
    const pcall = (res, rej) => {
      const fmp = this.#fetchMethod?.(k, v, fetchOpts);
      if (fmp && fmp instanceof Promise) {
        fmp.then((v2) => res(v2 === void 0 ? void 0 : v2), rej);
      }
      ac.signal.addEventListener("abort", () => {
        if (!options.ignoreFetchAbort || options.allowStaleOnFetchAbort) {
          res(void 0);
          if (options.allowStaleOnFetchAbort) {
            res = (v2) => cb(v2, true);
          }
        }
      });
    };
    if (options.status)
      options.status.fetchDispatched = true;
    const p = new Promise(pcall).then(cb, eb);
    const bf = Object.assign(p, {
      __abortController: ac,
      __staleWhileFetching: v,
      __returned: void 0
    });
    if (index === void 0) {
      this.set(k, bf, { ...fetchOpts.options, status: void 0 });
      index = this.#keyMap.get(k);
    } else {
      this.#valList[index] = bf;
    }
    return bf;
  }
  #isBackgroundFetch(p) {
    if (!this.#hasFetchMethod)
      return false;
    const b = p;
    return !!b && b instanceof Promise && b.hasOwnProperty("__staleWhileFetching") && b.__abortController instanceof AC;
  }
  async fetch(k, fetchOptions = {}) {
    const {
      // get options
      allowStale = this.allowStale,
      updateAgeOnGet = this.updateAgeOnGet,
      noDeleteOnStaleGet = this.noDeleteOnStaleGet,
      // set options
      ttl = this.ttl,
      noDisposeOnSet = this.noDisposeOnSet,
      size = 0,
      sizeCalculation = this.sizeCalculation,
      noUpdateTTL = this.noUpdateTTL,
      // fetch exclusive options
      noDeleteOnFetchRejection = this.noDeleteOnFetchRejection,
      allowStaleOnFetchRejection = this.allowStaleOnFetchRejection,
      ignoreFetchAbort = this.ignoreFetchAbort,
      allowStaleOnFetchAbort = this.allowStaleOnFetchAbort,
      context,
      forceRefresh = false,
      status,
      signal
    } = fetchOptions;
    if (!this.#hasFetchMethod) {
      if (status)
        status.fetch = "get";
      return this.get(k, {
        allowStale,
        updateAgeOnGet,
        noDeleteOnStaleGet,
        status
      });
    }
    const options = {
      allowStale,
      updateAgeOnGet,
      noDeleteOnStaleGet,
      ttl,
      noDisposeOnSet,
      size,
      sizeCalculation,
      noUpdateTTL,
      noDeleteOnFetchRejection,
      allowStaleOnFetchRejection,
      allowStaleOnFetchAbort,
      ignoreFetchAbort,
      status,
      signal
    };
    let index = this.#keyMap.get(k);
    if (index === void 0) {
      if (status)
        status.fetch = "miss";
      const p = this.#backgroundFetch(k, index, options, context);
      return p.__returned = p;
    } else {
      const v = this.#valList[index];
      if (this.#isBackgroundFetch(v)) {
        const stale = allowStale && v.__staleWhileFetching !== void 0;
        if (status) {
          status.fetch = "inflight";
          if (stale)
            status.returnedStale = true;
        }
        return stale ? v.__staleWhileFetching : v.__returned = v;
      }
      const isStale = this.#isStale(index);
      if (!forceRefresh && !isStale) {
        if (status)
          status.fetch = "hit";
        this.#moveToTail(index);
        if (updateAgeOnGet) {
          this.#updateItemAge(index);
        }
        if (status)
          this.#statusTTL(status, index);
        return v;
      }
      const p = this.#backgroundFetch(k, index, options, context);
      const hasStale = p.__staleWhileFetching !== void 0;
      const staleVal = hasStale && allowStale;
      if (status) {
        status.fetch = isStale ? "stale" : "refresh";
        if (staleVal && isStale)
          status.returnedStale = true;
      }
      return staleVal ? p.__staleWhileFetching : p.__returned = p;
    }
  }
  async forceFetch(k, fetchOptions = {}) {
    const v = await this.fetch(k, fetchOptions);
    if (v === void 0)
      throw new Error("fetch() returned undefined");
    return v;
  }
  memo(k, memoOptions = {}) {
    const memoMethod = this.#memoMethod;
    if (!memoMethod) {
      throw new Error("no memoMethod provided to constructor");
    }
    const { context, forceRefresh, ...options } = memoOptions;
    const v = this.get(k, options);
    if (!forceRefresh && v !== void 0)
      return v;
    const vv = memoMethod(k, v, {
      options,
      context
    });
    this.set(k, vv, options);
    return vv;
  }
  /**
   * Return a value from the cache. Will update the recency of the cache
   * entry found.
   *
   * If the key is not found, get() will return `undefined`.
   */
  get(k, getOptions = {}) {
    const { allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet, status } = getOptions;
    const index = this.#keyMap.get(k);
    if (index !== void 0) {
      const value = this.#valList[index];
      const fetching = this.#isBackgroundFetch(value);
      if (status)
        this.#statusTTL(status, index);
      if (this.#isStale(index)) {
        if (status)
          status.get = "stale";
        if (!fetching) {
          if (!noDeleteOnStaleGet) {
            this.#delete(k, "expire");
          }
          if (status && allowStale)
            status.returnedStale = true;
          return allowStale ? value : void 0;
        } else {
          if (status && allowStale && value.__staleWhileFetching !== void 0) {
            status.returnedStale = true;
          }
          return allowStale ? value.__staleWhileFetching : void 0;
        }
      } else {
        if (status)
          status.get = "hit";
        if (fetching) {
          return value.__staleWhileFetching;
        }
        this.#moveToTail(index);
        if (updateAgeOnGet) {
          this.#updateItemAge(index);
        }
        return value;
      }
    } else if (status) {
      status.get = "miss";
    }
  }
  #connect(p, n) {
    this.#prev[n] = p;
    this.#next[p] = n;
  }
  #moveToTail(index) {
    if (index !== this.#tail) {
      if (index === this.#head) {
        this.#head = this.#next[index];
      } else {
        this.#connect(this.#prev[index], this.#next[index]);
      }
      this.#connect(this.#tail, index);
      this.#tail = index;
    }
  }
  /**
   * Deletes a key out of the cache.
   *
   * Returns true if the key was deleted, false otherwise.
   */
  delete(k) {
    return this.#delete(k, "delete");
  }
  #delete(k, reason) {
    let deleted = false;
    if (this.#size !== 0) {
      const index = this.#keyMap.get(k);
      if (index !== void 0) {
        deleted = true;
        if (this.#size === 1) {
          this.#clear(reason);
        } else {
          this.#removeItemSize(index);
          const v = this.#valList[index];
          if (this.#isBackgroundFetch(v)) {
            v.__abortController.abort(new Error("deleted"));
          } else if (this.#hasDispose || this.#hasDisposeAfter) {
            if (this.#hasDispose) {
              this.#dispose?.(v, k, reason);
            }
            if (this.#hasDisposeAfter) {
              this.#disposed?.push([v, k, reason]);
            }
          }
          this.#keyMap.delete(k);
          this.#keyList[index] = void 0;
          this.#valList[index] = void 0;
          if (index === this.#tail) {
            this.#tail = this.#prev[index];
          } else if (index === this.#head) {
            this.#head = this.#next[index];
          } else {
            const pi = this.#prev[index];
            this.#next[pi] = this.#next[index];
            const ni = this.#next[index];
            this.#prev[ni] = this.#prev[index];
          }
          this.#size--;
          this.#free.push(index);
        }
      }
    }
    if (this.#hasDisposeAfter && this.#disposed?.length) {
      const dt = this.#disposed;
      let task;
      while (task = dt?.shift()) {
        this.#disposeAfter?.(...task);
      }
    }
    return deleted;
  }
  /**
   * Clear the cache entirely, throwing away all values.
   */
  clear() {
    return this.#clear("delete");
  }
  #clear(reason) {
    for (const index of this.#rindexes({ allowStale: true })) {
      const v = this.#valList[index];
      if (this.#isBackgroundFetch(v)) {
        v.__abortController.abort(new Error("deleted"));
      } else {
        const k = this.#keyList[index];
        if (this.#hasDispose) {
          this.#dispose?.(v, k, reason);
        }
        if (this.#hasDisposeAfter) {
          this.#disposed?.push([v, k, reason]);
        }
      }
    }
    this.#keyMap.clear();
    this.#valList.fill(void 0);
    this.#keyList.fill(void 0);
    if (this.#ttls && this.#starts) {
      this.#ttls.fill(0);
      this.#starts.fill(0);
    }
    if (this.#sizes) {
      this.#sizes.fill(0);
    }
    this.#head = 0;
    this.#tail = 0;
    this.#free.length = 0;
    this.#calculatedSize = 0;
    this.#size = 0;
    if (this.#hasDisposeAfter && this.#disposed) {
      const dt = this.#disposed;
      let task;
      while (task = dt?.shift()) {
        this.#disposeAfter?.(...task);
      }
    }
  }
};

// node_modules/.pnpm/path-scurry@2.0.0/node_modules/path-scurry/dist/esm/index.js
var import_node_path = require("path");
var import_node_url = require("url");
var import_fs = require("fs");
var actualFS = __toESM(require("fs"), 1);
var import_promises = require("fs/promises");

// node_modules/.pnpm/minipass@7.1.2/node_modules/minipass/dist/esm/index.js
var import_node_events = require("events");
var import_node_stream = __toESM(require("stream"), 1);
var import_node_string_decoder = require("string_decoder");
var proc = typeof process === "object" && process ? process : {
  stdout: null,
  stderr: null
};
var isStream = (s) => !!s && typeof s === "object" && (s instanceof Minipass || s instanceof import_node_stream.default || isReadable(s) || isWritable(s));
var isReadable = (s) => !!s && typeof s === "object" && s instanceof import_node_events.EventEmitter && typeof s.pipe === "function" && // node core Writable streams have a pipe() method, but it throws
s.pipe !== import_node_stream.default.Writable.prototype.pipe;
var isWritable = (s) => !!s && typeof s === "object" && s instanceof import_node_events.EventEmitter && typeof s.write === "function" && typeof s.end === "function";
var EOF = /* @__PURE__ */ Symbol("EOF");
var MAYBE_EMIT_END = /* @__PURE__ */ Symbol("maybeEmitEnd");
var EMITTED_END = /* @__PURE__ */ Symbol("emittedEnd");
var EMITTING_END = /* @__PURE__ */ Symbol("emittingEnd");
var EMITTED_ERROR = /* @__PURE__ */ Symbol("emittedError");
var CLOSED = /* @__PURE__ */ Symbol("closed");
var READ = /* @__PURE__ */ Symbol("read");
var FLUSH = /* @__PURE__ */ Symbol("flush");
var FLUSHCHUNK = /* @__PURE__ */ Symbol("flushChunk");
var ENCODING = /* @__PURE__ */ Symbol("encoding");
var DECODER = /* @__PURE__ */ Symbol("decoder");
var FLOWING = /* @__PURE__ */ Symbol("flowing");
var PAUSED = /* @__PURE__ */ Symbol("paused");
var RESUME = /* @__PURE__ */ Symbol("resume");
var BUFFER = /* @__PURE__ */ Symbol("buffer");
var PIPES = /* @__PURE__ */ Symbol("pipes");
var BUFFERLENGTH = /* @__PURE__ */ Symbol("bufferLength");
var BUFFERPUSH = /* @__PURE__ */ Symbol("bufferPush");
var BUFFERSHIFT = /* @__PURE__ */ Symbol("bufferShift");
var OBJECTMODE = /* @__PURE__ */ Symbol("objectMode");
var DESTROYED = /* @__PURE__ */ Symbol("destroyed");
var ERROR = /* @__PURE__ */ Symbol("error");
var EMITDATA = /* @__PURE__ */ Symbol("emitData");
var EMITEND = /* @__PURE__ */ Symbol("emitEnd");
var EMITEND2 = /* @__PURE__ */ Symbol("emitEnd2");
var ASYNC = /* @__PURE__ */ Symbol("async");
var ABORT = /* @__PURE__ */ Symbol("abort");
var ABORTED = /* @__PURE__ */ Symbol("aborted");
var SIGNAL = /* @__PURE__ */ Symbol("signal");
var DATALISTENERS = /* @__PURE__ */ Symbol("dataListeners");
var DISCARDED = /* @__PURE__ */ Symbol("discarded");
var defer = (fn) => Promise.resolve().then(fn);
var nodefer = (fn) => fn();
var isEndish = (ev) => ev === "end" || ev === "finish" || ev === "prefinish";
var isArrayBufferLike = (b) => b instanceof ArrayBuffer || !!b && typeof b === "object" && b.constructor && b.constructor.name === "ArrayBuffer" && b.byteLength >= 0;
var isArrayBufferView = (b) => !Buffer.isBuffer(b) && ArrayBuffer.isView(b);
var Pipe = class {
  src;
  dest;
  opts;
  ondrain;
  constructor(src, dest, opts) {
    this.src = src;
    this.dest = dest;
    this.opts = opts;
    this.ondrain = () => src[RESUME]();
    this.dest.on("drain", this.ondrain);
  }
  unpipe() {
    this.dest.removeListener("drain", this.ondrain);
  }
  // only here for the prototype
  /* c8 ignore start */
  proxyErrors(_er) {
  }
  /* c8 ignore stop */
  end() {
    this.unpipe();
    if (this.opts.end)
      this.dest.end();
  }
};
var PipeProxyErrors = class extends Pipe {
  unpipe() {
    this.src.removeListener("error", this.proxyErrors);
    super.unpipe();
  }
  constructor(src, dest, opts) {
    super(src, dest, opts);
    this.proxyErrors = (er) => dest.emit("error", er);
    src.on("error", this.proxyErrors);
  }
};
var isObjectModeOptions = (o) => !!o.objectMode;
var isEncodingOptions = (o) => !o.objectMode && !!o.encoding && o.encoding !== "buffer";
var Minipass = class extends import_node_events.EventEmitter {
  [FLOWING] = false;
  [PAUSED] = false;
  [PIPES] = [];
  [BUFFER] = [];
  [OBJECTMODE];
  [ENCODING];
  [ASYNC];
  [DECODER];
  [EOF] = false;
  [EMITTED_END] = false;
  [EMITTING_END] = false;
  [CLOSED] = false;
  [EMITTED_ERROR] = null;
  [BUFFERLENGTH] = 0;
  [DESTROYED] = false;
  [SIGNAL];
  [ABORTED] = false;
  [DATALISTENERS] = 0;
  [DISCARDED] = false;
  /**
   * true if the stream can be written
   */
  writable = true;
  /**
   * true if the stream can be read
   */
  readable = true;
  /**
   * If `RType` is Buffer, then options do not need to be provided.
   * Otherwise, an options object must be provided to specify either
   * {@link Minipass.SharedOptions.objectMode} or
   * {@link Minipass.SharedOptions.encoding}, as appropriate.
   */
  constructor(...args) {
    const options = args[0] || {};
    super();
    if (options.objectMode && typeof options.encoding === "string") {
      throw new TypeError("Encoding and objectMode may not be used together");
    }
    if (isObjectModeOptions(options)) {
      this[OBJECTMODE] = true;
      this[ENCODING] = null;
    } else if (isEncodingOptions(options)) {
      this[ENCODING] = options.encoding;
      this[OBJECTMODE] = false;
    } else {
      this[OBJECTMODE] = false;
      this[ENCODING] = null;
    }
    this[ASYNC] = !!options.async;
    this[DECODER] = this[ENCODING] ? new import_node_string_decoder.StringDecoder(this[ENCODING]) : null;
    if (options && options.debugExposeBuffer === true) {
      Object.defineProperty(this, "buffer", { get: () => this[BUFFER] });
    }
    if (options && options.debugExposePipes === true) {
      Object.defineProperty(this, "pipes", { get: () => this[PIPES] });
    }
    const { signal } = options;
    if (signal) {
      this[SIGNAL] = signal;
      if (signal.aborted) {
        this[ABORT]();
      } else {
        signal.addEventListener("abort", () => this[ABORT]());
      }
    }
  }
  /**
   * The amount of data stored in the buffer waiting to be read.
   *
   * For Buffer strings, this will be the total byte length.
   * For string encoding streams, this will be the string character length,
   * according to JavaScript's `string.length` logic.
   * For objectMode streams, this is a count of the items waiting to be
   * emitted.
   */
  get bufferLength() {
    return this[BUFFERLENGTH];
  }
  /**
   * The `BufferEncoding` currently in use, or `null`
   */
  get encoding() {
    return this[ENCODING];
  }
  /**
   * @deprecated - This is a read only property
   */
  set encoding(_enc) {
    throw new Error("Encoding must be set at instantiation time");
  }
  /**
   * @deprecated - Encoding may only be set at instantiation time
   */
  setEncoding(_enc) {
    throw new Error("Encoding must be set at instantiation time");
  }
  /**
   * True if this is an objectMode stream
   */
  get objectMode() {
    return this[OBJECTMODE];
  }
  /**
   * @deprecated - This is a read-only property
   */
  set objectMode(_om) {
    throw new Error("objectMode must be set at instantiation time");
  }
  /**
   * true if this is an async stream
   */
  get ["async"]() {
    return this[ASYNC];
  }
  /**
   * Set to true to make this stream async.
   *
   * Once set, it cannot be unset, as this would potentially cause incorrect
   * behavior.  Ie, a sync stream can be made async, but an async stream
   * cannot be safely made sync.
   */
  set ["async"](a) {
    this[ASYNC] = this[ASYNC] || !!a;
  }
  // drop everything and get out of the flow completely
  [ABORT]() {
    this[ABORTED] = true;
    this.emit("abort", this[SIGNAL]?.reason);
    this.destroy(this[SIGNAL]?.reason);
  }
  /**
   * True if the stream has been aborted.
   */
  get aborted() {
    return this[ABORTED];
  }
  /**
   * No-op setter. Stream aborted status is set via the AbortSignal provided
   * in the constructor options.
   */
  set aborted(_) {
  }
  write(chunk, encoding, cb) {
    if (this[ABORTED])
      return false;
    if (this[EOF])
      throw new Error("write after end");
    if (this[DESTROYED]) {
      this.emit("error", Object.assign(new Error("Cannot call write after a stream was destroyed"), { code: "ERR_STREAM_DESTROYED" }));
      return true;
    }
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = "utf8";
    }
    if (!encoding)
      encoding = "utf8";
    const fn = this[ASYNC] ? defer : nodefer;
    if (!this[OBJECTMODE] && !Buffer.isBuffer(chunk)) {
      if (isArrayBufferView(chunk)) {
        chunk = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
      } else if (isArrayBufferLike(chunk)) {
        chunk = Buffer.from(chunk);
      } else if (typeof chunk !== "string") {
        throw new Error("Non-contiguous data written to non-objectMode stream");
      }
    }
    if (this[OBJECTMODE]) {
      if (this[FLOWING] && this[BUFFERLENGTH] !== 0)
        this[FLUSH](true);
      if (this[FLOWING])
        this.emit("data", chunk);
      else
        this[BUFFERPUSH](chunk);
      if (this[BUFFERLENGTH] !== 0)
        this.emit("readable");
      if (cb)
        fn(cb);
      return this[FLOWING];
    }
    if (!chunk.length) {
      if (this[BUFFERLENGTH] !== 0)
        this.emit("readable");
      if (cb)
        fn(cb);
      return this[FLOWING];
    }
    if (typeof chunk === "string" && // unless it is a string already ready for us to use
    !(encoding === this[ENCODING] && !this[DECODER]?.lastNeed)) {
      chunk = Buffer.from(chunk, encoding);
    }
    if (Buffer.isBuffer(chunk) && this[ENCODING]) {
      chunk = this[DECODER].write(chunk);
    }
    if (this[FLOWING] && this[BUFFERLENGTH] !== 0)
      this[FLUSH](true);
    if (this[FLOWING])
      this.emit("data", chunk);
    else
      this[BUFFERPUSH](chunk);
    if (this[BUFFERLENGTH] !== 0)
      this.emit("readable");
    if (cb)
      fn(cb);
    return this[FLOWING];
  }
  /**
   * Low-level explicit read method.
   *
   * In objectMode, the argument is ignored, and one item is returned if
   * available.
   *
   * `n` is the number of bytes (or in the case of encoding streams,
   * characters) to consume. If `n` is not provided, then the entire buffer
   * is returned, or `null` is returned if no data is available.
   *
   * If `n` is greater that the amount of data in the internal buffer,
   * then `null` is returned.
   */
  read(n) {
    if (this[DESTROYED])
      return null;
    this[DISCARDED] = false;
    if (this[BUFFERLENGTH] === 0 || n === 0 || n && n > this[BUFFERLENGTH]) {
      this[MAYBE_EMIT_END]();
      return null;
    }
    if (this[OBJECTMODE])
      n = null;
    if (this[BUFFER].length > 1 && !this[OBJECTMODE]) {
      this[BUFFER] = [
        this[ENCODING] ? this[BUFFER].join("") : Buffer.concat(this[BUFFER], this[BUFFERLENGTH])
      ];
    }
    const ret = this[READ](n || null, this[BUFFER][0]);
    this[MAYBE_EMIT_END]();
    return ret;
  }
  [READ](n, chunk) {
    if (this[OBJECTMODE])
      this[BUFFERSHIFT]();
    else {
      const c = chunk;
      if (n === c.length || n === null)
        this[BUFFERSHIFT]();
      else if (typeof c === "string") {
        this[BUFFER][0] = c.slice(n);
        chunk = c.slice(0, n);
        this[BUFFERLENGTH] -= n;
      } else {
        this[BUFFER][0] = c.subarray(n);
        chunk = c.subarray(0, n);
        this[BUFFERLENGTH] -= n;
      }
    }
    this.emit("data", chunk);
    if (!this[BUFFER].length && !this[EOF])
      this.emit("drain");
    return chunk;
  }
  end(chunk, encoding, cb) {
    if (typeof chunk === "function") {
      cb = chunk;
      chunk = void 0;
    }
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = "utf8";
    }
    if (chunk !== void 0)
      this.write(chunk, encoding);
    if (cb)
      this.once("end", cb);
    this[EOF] = true;
    this.writable = false;
    if (this[FLOWING] || !this[PAUSED])
      this[MAYBE_EMIT_END]();
    return this;
  }
  // don't let the internal resume be overwritten
  [RESUME]() {
    if (this[DESTROYED])
      return;
    if (!this[DATALISTENERS] && !this[PIPES].length) {
      this[DISCARDED] = true;
    }
    this[PAUSED] = false;
    this[FLOWING] = true;
    this.emit("resume");
    if (this[BUFFER].length)
      this[FLUSH]();
    else if (this[EOF])
      this[MAYBE_EMIT_END]();
    else
      this.emit("drain");
  }
  /**
   * Resume the stream if it is currently in a paused state
   *
   * If called when there are no pipe destinations or `data` event listeners,
   * this will place the stream in a "discarded" state, where all data will
   * be thrown away. The discarded state is removed if a pipe destination or
   * data handler is added, if pause() is called, or if any synchronous or
   * asynchronous iteration is started.
   */
  resume() {
    return this[RESUME]();
  }
  /**
   * Pause the stream
   */
  pause() {
    this[FLOWING] = false;
    this[PAUSED] = true;
    this[DISCARDED] = false;
  }
  /**
   * true if the stream has been forcibly destroyed
   */
  get destroyed() {
    return this[DESTROYED];
  }
  /**
   * true if the stream is currently in a flowing state, meaning that
   * any writes will be immediately emitted.
   */
  get flowing() {
    return this[FLOWING];
  }
  /**
   * true if the stream is currently in a paused state
   */
  get paused() {
    return this[PAUSED];
  }
  [BUFFERPUSH](chunk) {
    if (this[OBJECTMODE])
      this[BUFFERLENGTH] += 1;
    else
      this[BUFFERLENGTH] += chunk.length;
    this[BUFFER].push(chunk);
  }
  [BUFFERSHIFT]() {
    if (this[OBJECTMODE])
      this[BUFFERLENGTH] -= 1;
    else
      this[BUFFERLENGTH] -= this[BUFFER][0].length;
    return this[BUFFER].shift();
  }
  [FLUSH](noDrain = false) {
    do {
    } while (this[FLUSHCHUNK](this[BUFFERSHIFT]()) && this[BUFFER].length);
    if (!noDrain && !this[BUFFER].length && !this[EOF])
      this.emit("drain");
  }
  [FLUSHCHUNK](chunk) {
    this.emit("data", chunk);
    return this[FLOWING];
  }
  /**
   * Pipe all data emitted by this stream into the destination provided.
   *
   * Triggers the flow of data.
   */
  pipe(dest, opts) {
    if (this[DESTROYED])
      return dest;
    this[DISCARDED] = false;
    const ended = this[EMITTED_END];
    opts = opts || {};
    if (dest === proc.stdout || dest === proc.stderr)
      opts.end = false;
    else
      opts.end = opts.end !== false;
    opts.proxyErrors = !!opts.proxyErrors;
    if (ended) {
      if (opts.end)
        dest.end();
    } else {
      this[PIPES].push(!opts.proxyErrors ? new Pipe(this, dest, opts) : new PipeProxyErrors(this, dest, opts));
      if (this[ASYNC])
        defer(() => this[RESUME]());
      else
        this[RESUME]();
    }
    return dest;
  }
  /**
   * Fully unhook a piped destination stream.
   *
   * If the destination stream was the only consumer of this stream (ie,
   * there are no other piped destinations or `'data'` event listeners)
   * then the flow of data will stop until there is another consumer or
   * {@link Minipass#resume} is explicitly called.
   */
  unpipe(dest) {
    const p = this[PIPES].find((p2) => p2.dest === dest);
    if (p) {
      if (this[PIPES].length === 1) {
        if (this[FLOWING] && this[DATALISTENERS] === 0) {
          this[FLOWING] = false;
        }
        this[PIPES] = [];
      } else
        this[PIPES].splice(this[PIPES].indexOf(p), 1);
      p.unpipe();
    }
  }
  /**
   * Alias for {@link Minipass#on}
   */
  addListener(ev, handler) {
    return this.on(ev, handler);
  }
  /**
   * Mostly identical to `EventEmitter.on`, with the following
   * behavior differences to prevent data loss and unnecessary hangs:
   *
   * - Adding a 'data' event handler will trigger the flow of data
   *
   * - Adding a 'readable' event handler when there is data waiting to be read
   *   will cause 'readable' to be emitted immediately.
   *
   * - Adding an 'endish' event handler ('end', 'finish', etc.) which has
   *   already passed will cause the event to be emitted immediately and all
   *   handlers removed.
   *
   * - Adding an 'error' event handler after an error has been emitted will
   *   cause the event to be re-emitted immediately with the error previously
   *   raised.
   */
  on(ev, handler) {
    const ret = super.on(ev, handler);
    if (ev === "data") {
      this[DISCARDED] = false;
      this[DATALISTENERS]++;
      if (!this[PIPES].length && !this[FLOWING]) {
        this[RESUME]();
      }
    } else if (ev === "readable" && this[BUFFERLENGTH] !== 0) {
      super.emit("readable");
    } else if (isEndish(ev) && this[EMITTED_END]) {
      super.emit(ev);
      this.removeAllListeners(ev);
    } else if (ev === "error" && this[EMITTED_ERROR]) {
      const h = handler;
      if (this[ASYNC])
        defer(() => h.call(this, this[EMITTED_ERROR]));
      else
        h.call(this, this[EMITTED_ERROR]);
    }
    return ret;
  }
  /**
   * Alias for {@link Minipass#off}
   */
  removeListener(ev, handler) {
    return this.off(ev, handler);
  }
  /**
   * Mostly identical to `EventEmitter.off`
   *
   * If a 'data' event handler is removed, and it was the last consumer
   * (ie, there are no pipe destinations or other 'data' event listeners),
   * then the flow of data will stop until there is another consumer or
   * {@link Minipass#resume} is explicitly called.
   */
  off(ev, handler) {
    const ret = super.off(ev, handler);
    if (ev === "data") {
      this[DATALISTENERS] = this.listeners("data").length;
      if (this[DATALISTENERS] === 0 && !this[DISCARDED] && !this[PIPES].length) {
        this[FLOWING] = false;
      }
    }
    return ret;
  }
  /**
   * Mostly identical to `EventEmitter.removeAllListeners`
   *
   * If all 'data' event handlers are removed, and they were the last consumer
   * (ie, there are no pipe destinations), then the flow of data will stop
   * until there is another consumer or {@link Minipass#resume} is explicitly
   * called.
   */
  removeAllListeners(ev) {
    const ret = super.removeAllListeners(ev);
    if (ev === "data" || ev === void 0) {
      this[DATALISTENERS] = 0;
      if (!this[DISCARDED] && !this[PIPES].length) {
        this[FLOWING] = false;
      }
    }
    return ret;
  }
  /**
   * true if the 'end' event has been emitted
   */
  get emittedEnd() {
    return this[EMITTED_END];
  }
  [MAYBE_EMIT_END]() {
    if (!this[EMITTING_END] && !this[EMITTED_END] && !this[DESTROYED] && this[BUFFER].length === 0 && this[EOF]) {
      this[EMITTING_END] = true;
      this.emit("end");
      this.emit("prefinish");
      this.emit("finish");
      if (this[CLOSED])
        this.emit("close");
      this[EMITTING_END] = false;
    }
  }
  /**
   * Mostly identical to `EventEmitter.emit`, with the following
   * behavior differences to prevent data loss and unnecessary hangs:
   *
   * If the stream has been destroyed, and the event is something other
   * than 'close' or 'error', then `false` is returned and no handlers
   * are called.
   *
   * If the event is 'end', and has already been emitted, then the event
   * is ignored. If the stream is in a paused or non-flowing state, then
   * the event will be deferred until data flow resumes. If the stream is
   * async, then handlers will be called on the next tick rather than
   * immediately.
   *
   * If the event is 'close', and 'end' has not yet been emitted, then
   * the event will be deferred until after 'end' is emitted.
   *
   * If the event is 'error', and an AbortSignal was provided for the stream,
   * and there are no listeners, then the event is ignored, matching the
   * behavior of node core streams in the presense of an AbortSignal.
   *
   * If the event is 'finish' or 'prefinish', then all listeners will be
   * removed after emitting the event, to prevent double-firing.
   */
  emit(ev, ...args) {
    const data = args[0];
    if (ev !== "error" && ev !== "close" && ev !== DESTROYED && this[DESTROYED]) {
      return false;
    } else if (ev === "data") {
      return !this[OBJECTMODE] && !data ? false : this[ASYNC] ? (defer(() => this[EMITDATA](data)), true) : this[EMITDATA](data);
    } else if (ev === "end") {
      return this[EMITEND]();
    } else if (ev === "close") {
      this[CLOSED] = true;
      if (!this[EMITTED_END] && !this[DESTROYED])
        return false;
      const ret2 = super.emit("close");
      this.removeAllListeners("close");
      return ret2;
    } else if (ev === "error") {
      this[EMITTED_ERROR] = data;
      super.emit(ERROR, data);
      const ret2 = !this[SIGNAL] || this.listeners("error").length ? super.emit("error", data) : false;
      this[MAYBE_EMIT_END]();
      return ret2;
    } else if (ev === "resume") {
      const ret2 = super.emit("resume");
      this[MAYBE_EMIT_END]();
      return ret2;
    } else if (ev === "finish" || ev === "prefinish") {
      const ret2 = super.emit(ev);
      this.removeAllListeners(ev);
      return ret2;
    }
    const ret = super.emit(ev, ...args);
    this[MAYBE_EMIT_END]();
    return ret;
  }
  [EMITDATA](data) {
    for (const p of this[PIPES]) {
      if (p.dest.write(data) === false)
        this.pause();
    }
    const ret = this[DISCARDED] ? false : super.emit("data", data);
    this[MAYBE_EMIT_END]();
    return ret;
  }
  [EMITEND]() {
    if (this[EMITTED_END])
      return false;
    this[EMITTED_END] = true;
    this.readable = false;
    return this[ASYNC] ? (defer(() => this[EMITEND2]()), true) : this[EMITEND2]();
  }
  [EMITEND2]() {
    if (this[DECODER]) {
      const data = this[DECODER].end();
      if (data) {
        for (const p of this[PIPES]) {
          p.dest.write(data);
        }
        if (!this[DISCARDED])
          super.emit("data", data);
      }
    }
    for (const p of this[PIPES]) {
      p.end();
    }
    const ret = super.emit("end");
    this.removeAllListeners("end");
    return ret;
  }
  /**
   * Return a Promise that resolves to an array of all emitted data once
   * the stream ends.
   */
  async collect() {
    const buf = Object.assign([], {
      dataLength: 0
    });
    if (!this[OBJECTMODE])
      buf.dataLength = 0;
    const p = this.promise();
    this.on("data", (c) => {
      buf.push(c);
      if (!this[OBJECTMODE])
        buf.dataLength += c.length;
    });
    await p;
    return buf;
  }
  /**
   * Return a Promise that resolves to the concatenation of all emitted data
   * once the stream ends.
   *
   * Not allowed on objectMode streams.
   */
  async concat() {
    if (this[OBJECTMODE]) {
      throw new Error("cannot concat in objectMode");
    }
    const buf = await this.collect();
    return this[ENCODING] ? buf.join("") : Buffer.concat(buf, buf.dataLength);
  }
  /**
   * Return a void Promise that resolves once the stream ends.
   */
  async promise() {
    return new Promise((resolve, reject) => {
      this.on(DESTROYED, () => reject(new Error("stream destroyed")));
      this.on("error", (er) => reject(er));
      this.on("end", () => resolve());
    });
  }
  /**
   * Asynchronous `for await of` iteration.
   *
   * This will continue emitting all chunks until the stream terminates.
   */
  [Symbol.asyncIterator]() {
    this[DISCARDED] = false;
    let stopped = false;
    const stop = async () => {
      this.pause();
      stopped = true;
      return { value: void 0, done: true };
    };
    const next = () => {
      if (stopped)
        return stop();
      const res = this.read();
      if (res !== null)
        return Promise.resolve({ done: false, value: res });
      if (this[EOF])
        return stop();
      let resolve;
      let reject;
      const onerr = (er) => {
        this.off("data", ondata);
        this.off("end", onend);
        this.off(DESTROYED, ondestroy);
        stop();
        reject(er);
      };
      const ondata = (value) => {
        this.off("error", onerr);
        this.off("end", onend);
        this.off(DESTROYED, ondestroy);
        this.pause();
        resolve({ value, done: !!this[EOF] });
      };
      const onend = () => {
        this.off("error", onerr);
        this.off("data", ondata);
        this.off(DESTROYED, ondestroy);
        stop();
        resolve({ done: true, value: void 0 });
      };
      const ondestroy = () => onerr(new Error("stream destroyed"));
      return new Promise((res2, rej) => {
        reject = rej;
        resolve = res2;
        this.once(DESTROYED, ondestroy);
        this.once("error", onerr);
        this.once("end", onend);
        this.once("data", ondata);
      });
    };
    return {
      next,
      throw: stop,
      return: stop,
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }
  /**
   * Synchronous `for of` iteration.
   *
   * The iteration will terminate when the internal buffer runs out, even
   * if the stream has not yet terminated.
   */
  [Symbol.iterator]() {
    this[DISCARDED] = false;
    let stopped = false;
    const stop = () => {
      this.pause();
      this.off(ERROR, stop);
      this.off(DESTROYED, stop);
      this.off("end", stop);
      stopped = true;
      return { done: true, value: void 0 };
    };
    const next = () => {
      if (stopped)
        return stop();
      const value = this.read();
      return value === null ? stop() : { done: false, value };
    };
    this.once("end", stop);
    this.once(ERROR, stop);
    this.once(DESTROYED, stop);
    return {
      next,
      throw: stop,
      return: stop,
      [Symbol.iterator]() {
        return this;
      }
    };
  }
  /**
   * Destroy a stream, preventing it from being used for any further purpose.
   *
   * If the stream has a `close()` method, then it will be called on
   * destruction.
   *
   * After destruction, any attempt to write data, read data, or emit most
   * events will be ignored.
   *
   * If an error argument is provided, then it will be emitted in an
   * 'error' event.
   */
  destroy(er) {
    if (this[DESTROYED]) {
      if (er)
        this.emit("error", er);
      else
        this.emit(DESTROYED);
      return this;
    }
    this[DESTROYED] = true;
    this[DISCARDED] = true;
    this[BUFFER].length = 0;
    this[BUFFERLENGTH] = 0;
    const wc = this;
    if (typeof wc.close === "function" && !this[CLOSED])
      wc.close();
    if (er)
      this.emit("error", er);
    else
      this.emit(DESTROYED);
    return this;
  }
  /**
   * Alias for {@link isStream}
   *
   * Former export location, maintained for backwards compatibility.
   *
   * @deprecated
   */
  static get isStream() {
    return isStream;
  }
};

// node_modules/.pnpm/path-scurry@2.0.0/node_modules/path-scurry/dist/esm/index.js
var realpathSync = import_fs.realpathSync.native;
var defaultFS = {
  lstatSync: import_fs.lstatSync,
  readdir: import_fs.readdir,
  readdirSync: import_fs.readdirSync,
  readlinkSync: import_fs.readlinkSync,
  realpathSync,
  promises: {
    lstat: import_promises.lstat,
    readdir: import_promises.readdir,
    readlink: import_promises.readlink,
    realpath: import_promises.realpath
  }
};
var fsFromOption = (fsOption) => !fsOption || fsOption === defaultFS || fsOption === actualFS ? defaultFS : {
  ...defaultFS,
  ...fsOption,
  promises: {
    ...defaultFS.promises,
    ...fsOption.promises || {}
  }
};
var uncDriveRegexp = /^\\\\\?\\([a-z]:)\\?$/i;
var uncToDrive = (rootPath) => rootPath.replace(/\//g, "\\").replace(uncDriveRegexp, "$1\\");
var eitherSep = /[\\\/]/;
var UNKNOWN = 0;
var IFIFO = 1;
var IFCHR = 2;
var IFDIR = 4;
var IFBLK = 6;
var IFREG = 8;
var IFLNK = 10;
var IFSOCK = 12;
var IFMT = 15;
var IFMT_UNKNOWN = ~IFMT;
var READDIR_CALLED = 16;
var LSTAT_CALLED = 32;
var ENOTDIR = 64;
var ENOENT = 128;
var ENOREADLINK = 256;
var ENOREALPATH = 512;
var ENOCHILD = ENOTDIR | ENOENT | ENOREALPATH;
var TYPEMASK = 1023;
var entToType = (s) => s.isFile() ? IFREG : s.isDirectory() ? IFDIR : s.isSymbolicLink() ? IFLNK : s.isCharacterDevice() ? IFCHR : s.isBlockDevice() ? IFBLK : s.isSocket() ? IFSOCK : s.isFIFO() ? IFIFO : UNKNOWN;
var normalizeCache = /* @__PURE__ */ new Map();
var normalize = (s) => {
  const c = normalizeCache.get(s);
  if (c)
    return c;
  const n = s.normalize("NFKD");
  normalizeCache.set(s, n);
  return n;
};
var normalizeNocaseCache = /* @__PURE__ */ new Map();
var normalizeNocase = (s) => {
  const c = normalizeNocaseCache.get(s);
  if (c)
    return c;
  const n = normalize(s.toLowerCase());
  normalizeNocaseCache.set(s, n);
  return n;
};
var ResolveCache = class extends LRUCache {
  constructor() {
    super({ max: 256 });
  }
};
var ChildrenCache = class extends LRUCache {
  constructor(maxSize = 16 * 1024) {
    super({
      maxSize,
      // parent + children
      sizeCalculation: (a) => a.length + 1
    });
  }
};
var setAsCwd = /* @__PURE__ */ Symbol("PathScurry setAsCwd");
var PathBase = class {
  /**
   * the basename of this path
   *
   * **Important**: *always* test the path name against any test string
   * usingthe {@link isNamed} method, and not by directly comparing this
   * string. Otherwise, unicode path strings that the system sees as identical
   * will not be properly treated as the same path, leading to incorrect
   * behavior and possible security issues.
   */
  name;
  /**
   * the Path entry corresponding to the path root.
   *
   * @internal
   */
  root;
  /**
   * All roots found within the current PathScurry family
   *
   * @internal
   */
  roots;
  /**
   * a reference to the parent path, or undefined in the case of root entries
   *
   * @internal
   */
  parent;
  /**
   * boolean indicating whether paths are compared case-insensitively
   * @internal
   */
  nocase;
  /**
   * boolean indicating that this path is the current working directory
   * of the PathScurry collection that contains it.
   */
  isCWD = false;
  // potential default fs override
  #fs;
  // Stats fields
  #dev;
  get dev() {
    return this.#dev;
  }
  #mode;
  get mode() {
    return this.#mode;
  }
  #nlink;
  get nlink() {
    return this.#nlink;
  }
  #uid;
  get uid() {
    return this.#uid;
  }
  #gid;
  get gid() {
    return this.#gid;
  }
  #rdev;
  get rdev() {
    return this.#rdev;
  }
  #blksize;
  get blksize() {
    return this.#blksize;
  }
  #ino;
  get ino() {
    return this.#ino;
  }
  #size;
  get size() {
    return this.#size;
  }
  #blocks;
  get blocks() {
    return this.#blocks;
  }
  #atimeMs;
  get atimeMs() {
    return this.#atimeMs;
  }
  #mtimeMs;
  get mtimeMs() {
    return this.#mtimeMs;
  }
  #ctimeMs;
  get ctimeMs() {
    return this.#ctimeMs;
  }
  #birthtimeMs;
  get birthtimeMs() {
    return this.#birthtimeMs;
  }
  #atime;
  get atime() {
    return this.#atime;
  }
  #mtime;
  get mtime() {
    return this.#mtime;
  }
  #ctime;
  get ctime() {
    return this.#ctime;
  }
  #birthtime;
  get birthtime() {
    return this.#birthtime;
  }
  #matchName;
  #depth;
  #fullpath;
  #fullpathPosix;
  #relative;
  #relativePosix;
  #type;
  #children;
  #linkTarget;
  #realpath;
  /**
   * This property is for compatibility with the Dirent class as of
   * Node v20, where Dirent['parentPath'] refers to the path of the
   * directory that was passed to readdir. For root entries, it's the path
   * to the entry itself.
   */
  get parentPath() {
    return (this.parent || this).fullpath();
  }
  /**
   * Deprecated alias for Dirent['parentPath'] Somewhat counterintuitively,
   * this property refers to the *parent* path, not the path object itself.
   *
   * @deprecated
   */
  get path() {
    return this.parentPath;
  }
  /**
   * Do not create new Path objects directly.  They should always be accessed
   * via the PathScurry class or other methods on the Path class.
   *
   * @internal
   */
  constructor(name, type = UNKNOWN, root, roots, nocase, children, opts) {
    this.name = name;
    this.#matchName = nocase ? normalizeNocase(name) : normalize(name);
    this.#type = type & TYPEMASK;
    this.nocase = nocase;
    this.roots = roots;
    this.root = root || this;
    this.#children = children;
    this.#fullpath = opts.fullpath;
    this.#relative = opts.relative;
    this.#relativePosix = opts.relativePosix;
    this.parent = opts.parent;
    if (this.parent) {
      this.#fs = this.parent.#fs;
    } else {
      this.#fs = fsFromOption(opts.fs);
    }
  }
  /**
   * Returns the depth of the Path object from its root.
   *
   * For example, a path at `/foo/bar` would have a depth of 2.
   */
  depth() {
    if (this.#depth !== void 0)
      return this.#depth;
    if (!this.parent)
      return this.#depth = 0;
    return this.#depth = this.parent.depth() + 1;
  }
  /**
   * @internal
   */
  childrenCache() {
    return this.#children;
  }
  /**
   * Get the Path object referenced by the string path, resolved from this Path
   */
  resolve(path6) {
    if (!path6) {
      return this;
    }
    const rootPath = this.getRootString(path6);
    const dir = path6.substring(rootPath.length);
    const dirParts = dir.split(this.splitSep);
    const result = rootPath ? this.getRoot(rootPath).#resolveParts(dirParts) : this.#resolveParts(dirParts);
    return result;
  }
  #resolveParts(dirParts) {
    let p = this;
    for (const part of dirParts) {
      p = p.child(part);
    }
    return p;
  }
  /**
   * Returns the cached children Path objects, if still available.  If they
   * have fallen out of the cache, then returns an empty array, and resets the
   * READDIR_CALLED bit, so that future calls to readdir() will require an fs
   * lookup.
   *
   * @internal
   */
  children() {
    const cached = this.#children.get(this);
    if (cached) {
      return cached;
    }
    const children = Object.assign([], { provisional: 0 });
    this.#children.set(this, children);
    this.#type &= ~READDIR_CALLED;
    return children;
  }
  /**
   * Resolves a path portion and returns or creates the child Path.
   *
   * Returns `this` if pathPart is `''` or `'.'`, or `parent` if pathPart is
   * `'..'`.
   *
   * This should not be called directly.  If `pathPart` contains any path
   * separators, it will lead to unsafe undefined behavior.
   *
   * Use `Path.resolve()` instead.
   *
   * @internal
   */
  child(pathPart, opts) {
    if (pathPart === "" || pathPart === ".") {
      return this;
    }
    if (pathPart === "..") {
      return this.parent || this;
    }
    const children = this.children();
    const name = this.nocase ? normalizeNocase(pathPart) : normalize(pathPart);
    for (const p of children) {
      if (p.#matchName === name) {
        return p;
      }
    }
    const s = this.parent ? this.sep : "";
    const fullpath = this.#fullpath ? this.#fullpath + s + pathPart : void 0;
    const pchild = this.newChild(pathPart, UNKNOWN, {
      ...opts,
      parent: this,
      fullpath
    });
    if (!this.canReaddir()) {
      pchild.#type |= ENOENT;
    }
    children.push(pchild);
    return pchild;
  }
  /**
   * The relative path from the cwd. If it does not share an ancestor with
   * the cwd, then this ends up being equivalent to the fullpath()
   */
  relative() {
    if (this.isCWD)
      return "";
    if (this.#relative !== void 0) {
      return this.#relative;
    }
    const name = this.name;
    const p = this.parent;
    if (!p) {
      return this.#relative = this.name;
    }
    const pv = p.relative();
    return pv + (!pv || !p.parent ? "" : this.sep) + name;
  }
  /**
   * The relative path from the cwd, using / as the path separator.
   * If it does not share an ancestor with
   * the cwd, then this ends up being equivalent to the fullpathPosix()
   * On posix systems, this is identical to relative().
   */
  relativePosix() {
    if (this.sep === "/")
      return this.relative();
    if (this.isCWD)
      return "";
    if (this.#relativePosix !== void 0)
      return this.#relativePosix;
    const name = this.name;
    const p = this.parent;
    if (!p) {
      return this.#relativePosix = this.fullpathPosix();
    }
    const pv = p.relativePosix();
    return pv + (!pv || !p.parent ? "" : "/") + name;
  }
  /**
   * The fully resolved path string for this Path entry
   */
  fullpath() {
    if (this.#fullpath !== void 0) {
      return this.#fullpath;
    }
    const name = this.name;
    const p = this.parent;
    if (!p) {
      return this.#fullpath = this.name;
    }
    const pv = p.fullpath();
    const fp = pv + (!p.parent ? "" : this.sep) + name;
    return this.#fullpath = fp;
  }
  /**
   * On platforms other than windows, this is identical to fullpath.
   *
   * On windows, this is overridden to return the forward-slash form of the
   * full UNC path.
   */
  fullpathPosix() {
    if (this.#fullpathPosix !== void 0)
      return this.#fullpathPosix;
    if (this.sep === "/")
      return this.#fullpathPosix = this.fullpath();
    if (!this.parent) {
      const p2 = this.fullpath().replace(/\\/g, "/");
      if (/^[a-z]:\//i.test(p2)) {
        return this.#fullpathPosix = `//?/${p2}`;
      } else {
        return this.#fullpathPosix = p2;
      }
    }
    const p = this.parent;
    const pfpp = p.fullpathPosix();
    const fpp = pfpp + (!pfpp || !p.parent ? "" : "/") + this.name;
    return this.#fullpathPosix = fpp;
  }
  /**
   * Is the Path of an unknown type?
   *
   * Note that we might know *something* about it if there has been a previous
   * filesystem operation, for example that it does not exist, or is not a
   * link, or whether it has child entries.
   */
  isUnknown() {
    return (this.#type & IFMT) === UNKNOWN;
  }
  isType(type) {
    return this[`is${type}`]();
  }
  getType() {
    return this.isUnknown() ? "Unknown" : this.isDirectory() ? "Directory" : this.isFile() ? "File" : this.isSymbolicLink() ? "SymbolicLink" : this.isFIFO() ? "FIFO" : this.isCharacterDevice() ? "CharacterDevice" : this.isBlockDevice() ? "BlockDevice" : (
      /* c8 ignore start */
      this.isSocket() ? "Socket" : "Unknown"
    );
  }
  /**
   * Is the Path a regular file?
   */
  isFile() {
    return (this.#type & IFMT) === IFREG;
  }
  /**
   * Is the Path a directory?
   */
  isDirectory() {
    return (this.#type & IFMT) === IFDIR;
  }
  /**
   * Is the path a character device?
   */
  isCharacterDevice() {
    return (this.#type & IFMT) === IFCHR;
  }
  /**
   * Is the path a block device?
   */
  isBlockDevice() {
    return (this.#type & IFMT) === IFBLK;
  }
  /**
   * Is the path a FIFO pipe?
   */
  isFIFO() {
    return (this.#type & IFMT) === IFIFO;
  }
  /**
   * Is the path a socket?
   */
  isSocket() {
    return (this.#type & IFMT) === IFSOCK;
  }
  /**
   * Is the path a symbolic link?
   */
  isSymbolicLink() {
    return (this.#type & IFLNK) === IFLNK;
  }
  /**
   * Return the entry if it has been subject of a successful lstat, or
   * undefined otherwise.
   *
   * Does not read the filesystem, so an undefined result *could* simply
   * mean that we haven't called lstat on it.
   */
  lstatCached() {
    return this.#type & LSTAT_CALLED ? this : void 0;
  }
  /**
   * Return the cached link target if the entry has been the subject of a
   * successful readlink, or undefined otherwise.
   *
   * Does not read the filesystem, so an undefined result *could* just mean we
   * don't have any cached data. Only use it if you are very sure that a
   * readlink() has been called at some point.
   */
  readlinkCached() {
    return this.#linkTarget;
  }
  /**
   * Returns the cached realpath target if the entry has been the subject
   * of a successful realpath, or undefined otherwise.
   *
   * Does not read the filesystem, so an undefined result *could* just mean we
   * don't have any cached data. Only use it if you are very sure that a
   * realpath() has been called at some point.
   */
  realpathCached() {
    return this.#realpath;
  }
  /**
   * Returns the cached child Path entries array if the entry has been the
   * subject of a successful readdir(), or [] otherwise.
   *
   * Does not read the filesystem, so an empty array *could* just mean we
   * don't have any cached data. Only use it if you are very sure that a
   * readdir() has been called recently enough to still be valid.
   */
  readdirCached() {
    const children = this.children();
    return children.slice(0, children.provisional);
  }
  /**
   * Return true if it's worth trying to readlink.  Ie, we don't (yet) have
   * any indication that readlink will definitely fail.
   *
   * Returns false if the path is known to not be a symlink, if a previous
   * readlink failed, or if the entry does not exist.
   */
  canReadlink() {
    if (this.#linkTarget)
      return true;
    if (!this.parent)
      return false;
    const ifmt = this.#type & IFMT;
    return !(ifmt !== UNKNOWN && ifmt !== IFLNK || this.#type & ENOREADLINK || this.#type & ENOENT);
  }
  /**
   * Return true if readdir has previously been successfully called on this
   * path, indicating that cachedReaddir() is likely valid.
   */
  calledReaddir() {
    return !!(this.#type & READDIR_CALLED);
  }
  /**
   * Returns true if the path is known to not exist. That is, a previous lstat
   * or readdir failed to verify its existence when that would have been
   * expected, or a parent entry was marked either enoent or enotdir.
   */
  isENOENT() {
    return !!(this.#type & ENOENT);
  }
  /**
   * Return true if the path is a match for the given path name.  This handles
   * case sensitivity and unicode normalization.
   *
   * Note: even on case-sensitive systems, it is **not** safe to test the
   * equality of the `.name` property to determine whether a given pathname
   * matches, due to unicode normalization mismatches.
   *
   * Always use this method instead of testing the `path.name` property
   * directly.
   */
  isNamed(n) {
    return !this.nocase ? this.#matchName === normalize(n) : this.#matchName === normalizeNocase(n);
  }
  /**
   * Return the Path object corresponding to the target of a symbolic link.
   *
   * If the Path is not a symbolic link, or if the readlink call fails for any
   * reason, `undefined` is returned.
   *
   * Result is cached, and thus may be outdated if the filesystem is mutated.
   */
  async readlink() {
    const target = this.#linkTarget;
    if (target) {
      return target;
    }
    if (!this.canReadlink()) {
      return void 0;
    }
    if (!this.parent) {
      return void 0;
    }
    try {
      const read = await this.#fs.promises.readlink(this.fullpath());
      const linkTarget = (await this.parent.realpath())?.resolve(read);
      if (linkTarget) {
        return this.#linkTarget = linkTarget;
      }
    } catch (er) {
      this.#readlinkFail(er.code);
      return void 0;
    }
  }
  /**
   * Synchronous {@link PathBase.readlink}
   */
  readlinkSync() {
    const target = this.#linkTarget;
    if (target) {
      return target;
    }
    if (!this.canReadlink()) {
      return void 0;
    }
    if (!this.parent) {
      return void 0;
    }
    try {
      const read = this.#fs.readlinkSync(this.fullpath());
      const linkTarget = this.parent.realpathSync()?.resolve(read);
      if (linkTarget) {
        return this.#linkTarget = linkTarget;
      }
    } catch (er) {
      this.#readlinkFail(er.code);
      return void 0;
    }
  }
  #readdirSuccess(children) {
    this.#type |= READDIR_CALLED;
    for (let p = children.provisional; p < children.length; p++) {
      const c = children[p];
      if (c)
        c.#markENOENT();
    }
  }
  #markENOENT() {
    if (this.#type & ENOENT)
      return;
    this.#type = (this.#type | ENOENT) & IFMT_UNKNOWN;
    this.#markChildrenENOENT();
  }
  #markChildrenENOENT() {
    const children = this.children();
    children.provisional = 0;
    for (const p of children) {
      p.#markENOENT();
    }
  }
  #markENOREALPATH() {
    this.#type |= ENOREALPATH;
    this.#markENOTDIR();
  }
  // save the information when we know the entry is not a dir
  #markENOTDIR() {
    if (this.#type & ENOTDIR)
      return;
    let t = this.#type;
    if ((t & IFMT) === IFDIR)
      t &= IFMT_UNKNOWN;
    this.#type = t | ENOTDIR;
    this.#markChildrenENOENT();
  }
  #readdirFail(code = "") {
    if (code === "ENOTDIR" || code === "EPERM") {
      this.#markENOTDIR();
    } else if (code === "ENOENT") {
      this.#markENOENT();
    } else {
      this.children().provisional = 0;
    }
  }
  #lstatFail(code = "") {
    if (code === "ENOTDIR") {
      const p = this.parent;
      p.#markENOTDIR();
    } else if (code === "ENOENT") {
      this.#markENOENT();
    }
  }
  #readlinkFail(code = "") {
    let ter = this.#type;
    ter |= ENOREADLINK;
    if (code === "ENOENT")
      ter |= ENOENT;
    if (code === "EINVAL" || code === "UNKNOWN") {
      ter &= IFMT_UNKNOWN;
    }
    this.#type = ter;
    if (code === "ENOTDIR" && this.parent) {
      this.parent.#markENOTDIR();
    }
  }
  #readdirAddChild(e, c) {
    return this.#readdirMaybePromoteChild(e, c) || this.#readdirAddNewChild(e, c);
  }
  #readdirAddNewChild(e, c) {
    const type = entToType(e);
    const child = this.newChild(e.name, type, { parent: this });
    const ifmt = child.#type & IFMT;
    if (ifmt !== IFDIR && ifmt !== IFLNK && ifmt !== UNKNOWN) {
      child.#type |= ENOTDIR;
    }
    c.unshift(child);
    c.provisional++;
    return child;
  }
  #readdirMaybePromoteChild(e, c) {
    for (let p = c.provisional; p < c.length; p++) {
      const pchild = c[p];
      const name = this.nocase ? normalizeNocase(e.name) : normalize(e.name);
      if (name !== pchild.#matchName) {
        continue;
      }
      return this.#readdirPromoteChild(e, pchild, p, c);
    }
  }
  #readdirPromoteChild(e, p, index, c) {
    const v = p.name;
    p.#type = p.#type & IFMT_UNKNOWN | entToType(e);
    if (v !== e.name)
      p.name = e.name;
    if (index !== c.provisional) {
      if (index === c.length - 1)
        c.pop();
      else
        c.splice(index, 1);
      c.unshift(p);
    }
    c.provisional++;
    return p;
  }
  /**
   * Call lstat() on this Path, and update all known information that can be
   * determined.
   *
   * Note that unlike `fs.lstat()`, the returned value does not contain some
   * information, such as `mode`, `dev`, `nlink`, and `ino`.  If that
   * information is required, you will need to call `fs.lstat` yourself.
   *
   * If the Path refers to a nonexistent file, or if the lstat call fails for
   * any reason, `undefined` is returned.  Otherwise the updated Path object is
   * returned.
   *
   * Results are cached, and thus may be out of date if the filesystem is
   * mutated.
   */
  async lstat() {
    if ((this.#type & ENOENT) === 0) {
      try {
        this.#applyStat(await this.#fs.promises.lstat(this.fullpath()));
        return this;
      } catch (er) {
        this.#lstatFail(er.code);
      }
    }
  }
  /**
   * synchronous {@link PathBase.lstat}
   */
  lstatSync() {
    if ((this.#type & ENOENT) === 0) {
      try {
        this.#applyStat(this.#fs.lstatSync(this.fullpath()));
        return this;
      } catch (er) {
        this.#lstatFail(er.code);
      }
    }
  }
  #applyStat(st) {
    const { atime, atimeMs, birthtime, birthtimeMs, blksize, blocks, ctime, ctimeMs, dev, gid, ino, mode, mtime, mtimeMs, nlink, rdev, size, uid } = st;
    this.#atime = atime;
    this.#atimeMs = atimeMs;
    this.#birthtime = birthtime;
    this.#birthtimeMs = birthtimeMs;
    this.#blksize = blksize;
    this.#blocks = blocks;
    this.#ctime = ctime;
    this.#ctimeMs = ctimeMs;
    this.#dev = dev;
    this.#gid = gid;
    this.#ino = ino;
    this.#mode = mode;
    this.#mtime = mtime;
    this.#mtimeMs = mtimeMs;
    this.#nlink = nlink;
    this.#rdev = rdev;
    this.#size = size;
    this.#uid = uid;
    const ifmt = entToType(st);
    this.#type = this.#type & IFMT_UNKNOWN | ifmt | LSTAT_CALLED;
    if (ifmt !== UNKNOWN && ifmt !== IFDIR && ifmt !== IFLNK) {
      this.#type |= ENOTDIR;
    }
  }
  #onReaddirCB = [];
  #readdirCBInFlight = false;
  #callOnReaddirCB(children) {
    this.#readdirCBInFlight = false;
    const cbs = this.#onReaddirCB.slice();
    this.#onReaddirCB.length = 0;
    cbs.forEach((cb) => cb(null, children));
  }
  /**
   * Standard node-style callback interface to get list of directory entries.
   *
   * If the Path cannot or does not contain any children, then an empty array
   * is returned.
   *
   * Results are cached, and thus may be out of date if the filesystem is
   * mutated.
   *
   * @param cb The callback called with (er, entries).  Note that the `er`
   * param is somewhat extraneous, as all readdir() errors are handled and
   * simply result in an empty set of entries being returned.
   * @param allowZalgo Boolean indicating that immediately known results should
   * *not* be deferred with `queueMicrotask`. Defaults to `false`. Release
   * zalgo at your peril, the dark pony lord is devious and unforgiving.
   */
  readdirCB(cb, allowZalgo = false) {
    if (!this.canReaddir()) {
      if (allowZalgo)
        cb(null, []);
      else
        queueMicrotask(() => cb(null, []));
      return;
    }
    const children = this.children();
    if (this.calledReaddir()) {
      const c = children.slice(0, children.provisional);
      if (allowZalgo)
        cb(null, c);
      else
        queueMicrotask(() => cb(null, c));
      return;
    }
    this.#onReaddirCB.push(cb);
    if (this.#readdirCBInFlight) {
      return;
    }
    this.#readdirCBInFlight = true;
    const fullpath = this.fullpath();
    this.#fs.readdir(fullpath, { withFileTypes: true }, (er, entries) => {
      if (er) {
        this.#readdirFail(er.code);
        children.provisional = 0;
      } else {
        for (const e of entries) {
          this.#readdirAddChild(e, children);
        }
        this.#readdirSuccess(children);
      }
      this.#callOnReaddirCB(children.slice(0, children.provisional));
      return;
    });
  }
  #asyncReaddirInFlight;
  /**
   * Return an array of known child entries.
   *
   * If the Path cannot or does not contain any children, then an empty array
   * is returned.
   *
   * Results are cached, and thus may be out of date if the filesystem is
   * mutated.
   */
  async readdir() {
    if (!this.canReaddir()) {
      return [];
    }
    const children = this.children();
    if (this.calledReaddir()) {
      return children.slice(0, children.provisional);
    }
    const fullpath = this.fullpath();
    if (this.#asyncReaddirInFlight) {
      await this.#asyncReaddirInFlight;
    } else {
      let resolve = () => {
      };
      this.#asyncReaddirInFlight = new Promise((res) => resolve = res);
      try {
        for (const e of await this.#fs.promises.readdir(fullpath, {
          withFileTypes: true
        })) {
          this.#readdirAddChild(e, children);
        }
        this.#readdirSuccess(children);
      } catch (er) {
        this.#readdirFail(er.code);
        children.provisional = 0;
      }
      this.#asyncReaddirInFlight = void 0;
      resolve();
    }
    return children.slice(0, children.provisional);
  }
  /**
   * synchronous {@link PathBase.readdir}
   */
  readdirSync() {
    if (!this.canReaddir()) {
      return [];
    }
    const children = this.children();
    if (this.calledReaddir()) {
      return children.slice(0, children.provisional);
    }
    const fullpath = this.fullpath();
    try {
      for (const e of this.#fs.readdirSync(fullpath, {
        withFileTypes: true
      })) {
        this.#readdirAddChild(e, children);
      }
      this.#readdirSuccess(children);
    } catch (er) {
      this.#readdirFail(er.code);
      children.provisional = 0;
    }
    return children.slice(0, children.provisional);
  }
  canReaddir() {
    if (this.#type & ENOCHILD)
      return false;
    const ifmt = IFMT & this.#type;
    if (!(ifmt === UNKNOWN || ifmt === IFDIR || ifmt === IFLNK)) {
      return false;
    }
    return true;
  }
  shouldWalk(dirs, walkFilter) {
    return (this.#type & IFDIR) === IFDIR && !(this.#type & ENOCHILD) && !dirs.has(this) && (!walkFilter || walkFilter(this));
  }
  /**
   * Return the Path object corresponding to path as resolved
   * by realpath(3).
   *
   * If the realpath call fails for any reason, `undefined` is returned.
   *
   * Result is cached, and thus may be outdated if the filesystem is mutated.
   * On success, returns a Path object.
   */
  async realpath() {
    if (this.#realpath)
      return this.#realpath;
    if ((ENOREALPATH | ENOREADLINK | ENOENT) & this.#type)
      return void 0;
    try {
      const rp = await this.#fs.promises.realpath(this.fullpath());
      return this.#realpath = this.resolve(rp);
    } catch (_) {
      this.#markENOREALPATH();
    }
  }
  /**
   * Synchronous {@link realpath}
   */
  realpathSync() {
    if (this.#realpath)
      return this.#realpath;
    if ((ENOREALPATH | ENOREADLINK | ENOENT) & this.#type)
      return void 0;
    try {
      const rp = this.#fs.realpathSync(this.fullpath());
      return this.#realpath = this.resolve(rp);
    } catch (_) {
      this.#markENOREALPATH();
    }
  }
  /**
   * Internal method to mark this Path object as the scurry cwd,
   * called by {@link PathScurry#chdir}
   *
   * @internal
   */
  [setAsCwd](oldCwd) {
    if (oldCwd === this)
      return;
    oldCwd.isCWD = false;
    this.isCWD = true;
    const changed = /* @__PURE__ */ new Set([]);
    let rp = [];
    let p = this;
    while (p && p.parent) {
      changed.add(p);
      p.#relative = rp.join(this.sep);
      p.#relativePosix = rp.join("/");
      p = p.parent;
      rp.push("..");
    }
    p = oldCwd;
    while (p && p.parent && !changed.has(p)) {
      p.#relative = void 0;
      p.#relativePosix = void 0;
      p = p.parent;
    }
  }
};
var PathWin32 = class _PathWin32 extends PathBase {
  /**
   * Separator for generating path strings.
   */
  sep = "\\";
  /**
   * Separator for parsing path strings.
   */
  splitSep = eitherSep;
  /**
   * Do not create new Path objects directly.  They should always be accessed
   * via the PathScurry class or other methods on the Path class.
   *
   * @internal
   */
  constructor(name, type = UNKNOWN, root, roots, nocase, children, opts) {
    super(name, type, root, roots, nocase, children, opts);
  }
  /**
   * @internal
   */
  newChild(name, type = UNKNOWN, opts = {}) {
    return new _PathWin32(name, type, this.root, this.roots, this.nocase, this.childrenCache(), opts);
  }
  /**
   * @internal
   */
  getRootString(path6) {
    return import_node_path.win32.parse(path6).root;
  }
  /**
   * @internal
   */
  getRoot(rootPath) {
    rootPath = uncToDrive(rootPath.toUpperCase());
    if (rootPath === this.root.name) {
      return this.root;
    }
    for (const [compare, root] of Object.entries(this.roots)) {
      if (this.sameRoot(rootPath, compare)) {
        return this.roots[rootPath] = root;
      }
    }
    return this.roots[rootPath] = new PathScurryWin32(rootPath, this).root;
  }
  /**
   * @internal
   */
  sameRoot(rootPath, compare = this.root.name) {
    rootPath = rootPath.toUpperCase().replace(/\//g, "\\").replace(uncDriveRegexp, "$1\\");
    return rootPath === compare;
  }
};
var PathPosix = class _PathPosix extends PathBase {
  /**
   * separator for parsing path strings
   */
  splitSep = "/";
  /**
   * separator for generating path strings
   */
  sep = "/";
  /**
   * Do not create new Path objects directly.  They should always be accessed
   * via the PathScurry class or other methods on the Path class.
   *
   * @internal
   */
  constructor(name, type = UNKNOWN, root, roots, nocase, children, opts) {
    super(name, type, root, roots, nocase, children, opts);
  }
  /**
   * @internal
   */
  getRootString(path6) {
    return path6.startsWith("/") ? "/" : "";
  }
  /**
   * @internal
   */
  getRoot(_rootPath) {
    return this.root;
  }
  /**
   * @internal
   */
  newChild(name, type = UNKNOWN, opts = {}) {
    return new _PathPosix(name, type, this.root, this.roots, this.nocase, this.childrenCache(), opts);
  }
};
var PathScurryBase = class {
  /**
   * The root Path entry for the current working directory of this Scurry
   */
  root;
  /**
   * The string path for the root of this Scurry's current working directory
   */
  rootPath;
  /**
   * A collection of all roots encountered, referenced by rootPath
   */
  roots;
  /**
   * The Path entry corresponding to this PathScurry's current working directory.
   */
  cwd;
  #resolveCache;
  #resolvePosixCache;
  #children;
  /**
   * Perform path comparisons case-insensitively.
   *
   * Defaults true on Darwin and Windows systems, false elsewhere.
   */
  nocase;
  #fs;
  /**
   * This class should not be instantiated directly.
   *
   * Use PathScurryWin32, PathScurryDarwin, PathScurryPosix, or PathScurry
   *
   * @internal
   */
  constructor(cwd = process.cwd(), pathImpl, sep2, { nocase, childrenCacheSize = 16 * 1024, fs: fs5 = defaultFS } = {}) {
    this.#fs = fsFromOption(fs5);
    if (cwd instanceof URL || cwd.startsWith("file://")) {
      cwd = (0, import_node_url.fileURLToPath)(cwd);
    }
    const cwdPath = pathImpl.resolve(cwd);
    this.roots = /* @__PURE__ */ Object.create(null);
    this.rootPath = this.parseRootPath(cwdPath);
    this.#resolveCache = new ResolveCache();
    this.#resolvePosixCache = new ResolveCache();
    this.#children = new ChildrenCache(childrenCacheSize);
    const split = cwdPath.substring(this.rootPath.length).split(sep2);
    if (split.length === 1 && !split[0]) {
      split.pop();
    }
    if (nocase === void 0) {
      throw new TypeError("must provide nocase setting to PathScurryBase ctor");
    }
    this.nocase = nocase;
    this.root = this.newRoot(this.#fs);
    this.roots[this.rootPath] = this.root;
    let prev = this.root;
    let len = split.length - 1;
    const joinSep = pathImpl.sep;
    let abs = this.rootPath;
    let sawFirst = false;
    for (const part of split) {
      const l = len--;
      prev = prev.child(part, {
        relative: new Array(l).fill("..").join(joinSep),
        relativePosix: new Array(l).fill("..").join("/"),
        fullpath: abs += (sawFirst ? "" : joinSep) + part
      });
      sawFirst = true;
    }
    this.cwd = prev;
  }
  /**
   * Get the depth of a provided path, string, or the cwd
   */
  depth(path6 = this.cwd) {
    if (typeof path6 === "string") {
      path6 = this.cwd.resolve(path6);
    }
    return path6.depth();
  }
  /**
   * Return the cache of child entries.  Exposed so subclasses can create
   * child Path objects in a platform-specific way.
   *
   * @internal
   */
  childrenCache() {
    return this.#children;
  }
  /**
   * Resolve one or more path strings to a resolved string
   *
   * Same interface as require('path').resolve.
   *
   * Much faster than path.resolve() when called multiple times for the same
   * path, because the resolved Path objects are cached.  Much slower
   * otherwise.
   */
  resolve(...paths) {
    let r = "";
    for (let i = paths.length - 1; i >= 0; i--) {
      const p = paths[i];
      if (!p || p === ".")
        continue;
      r = r ? `${p}/${r}` : p;
      if (this.isAbsolute(p)) {
        break;
      }
    }
    const cached = this.#resolveCache.get(r);
    if (cached !== void 0) {
      return cached;
    }
    const result = this.cwd.resolve(r).fullpath();
    this.#resolveCache.set(r, result);
    return result;
  }
  /**
   * Resolve one or more path strings to a resolved string, returning
   * the posix path.  Identical to .resolve() on posix systems, but on
   * windows will return a forward-slash separated UNC path.
   *
   * Same interface as require('path').resolve.
   *
   * Much faster than path.resolve() when called multiple times for the same
   * path, because the resolved Path objects are cached.  Much slower
   * otherwise.
   */
  resolvePosix(...paths) {
    let r = "";
    for (let i = paths.length - 1; i >= 0; i--) {
      const p = paths[i];
      if (!p || p === ".")
        continue;
      r = r ? `${p}/${r}` : p;
      if (this.isAbsolute(p)) {
        break;
      }
    }
    const cached = this.#resolvePosixCache.get(r);
    if (cached !== void 0) {
      return cached;
    }
    const result = this.cwd.resolve(r).fullpathPosix();
    this.#resolvePosixCache.set(r, result);
    return result;
  }
  /**
   * find the relative path from the cwd to the supplied path string or entry
   */
  relative(entry = this.cwd) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    }
    return entry.relative();
  }
  /**
   * find the relative path from the cwd to the supplied path string or
   * entry, using / as the path delimiter, even on Windows.
   */
  relativePosix(entry = this.cwd) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    }
    return entry.relativePosix();
  }
  /**
   * Return the basename for the provided string or Path object
   */
  basename(entry = this.cwd) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    }
    return entry.name;
  }
  /**
   * Return the dirname for the provided string or Path object
   */
  dirname(entry = this.cwd) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    }
    return (entry.parent || entry).fullpath();
  }
  async readdir(entry = this.cwd, opts = {
    withFileTypes: true
  }) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      opts = entry;
      entry = this.cwd;
    }
    const { withFileTypes } = opts;
    if (!entry.canReaddir()) {
      return [];
    } else {
      const p = await entry.readdir();
      return withFileTypes ? p : p.map((e) => e.name);
    }
  }
  readdirSync(entry = this.cwd, opts = {
    withFileTypes: true
  }) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      opts = entry;
      entry = this.cwd;
    }
    const { withFileTypes = true } = opts;
    if (!entry.canReaddir()) {
      return [];
    } else if (withFileTypes) {
      return entry.readdirSync();
    } else {
      return entry.readdirSync().map((e) => e.name);
    }
  }
  /**
   * Call lstat() on the string or Path object, and update all known
   * information that can be determined.
   *
   * Note that unlike `fs.lstat()`, the returned value does not contain some
   * information, such as `mode`, `dev`, `nlink`, and `ino`.  If that
   * information is required, you will need to call `fs.lstat` yourself.
   *
   * If the Path refers to a nonexistent file, or if the lstat call fails for
   * any reason, `undefined` is returned.  Otherwise the updated Path object is
   * returned.
   *
   * Results are cached, and thus may be out of date if the filesystem is
   * mutated.
   */
  async lstat(entry = this.cwd) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    }
    return entry.lstat();
  }
  /**
   * synchronous {@link PathScurryBase.lstat}
   */
  lstatSync(entry = this.cwd) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    }
    return entry.lstatSync();
  }
  async readlink(entry = this.cwd, { withFileTypes } = {
    withFileTypes: false
  }) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      withFileTypes = entry.withFileTypes;
      entry = this.cwd;
    }
    const e = await entry.readlink();
    return withFileTypes ? e : e?.fullpath();
  }
  readlinkSync(entry = this.cwd, { withFileTypes } = {
    withFileTypes: false
  }) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      withFileTypes = entry.withFileTypes;
      entry = this.cwd;
    }
    const e = entry.readlinkSync();
    return withFileTypes ? e : e?.fullpath();
  }
  async realpath(entry = this.cwd, { withFileTypes } = {
    withFileTypes: false
  }) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      withFileTypes = entry.withFileTypes;
      entry = this.cwd;
    }
    const e = await entry.realpath();
    return withFileTypes ? e : e?.fullpath();
  }
  realpathSync(entry = this.cwd, { withFileTypes } = {
    withFileTypes: false
  }) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      withFileTypes = entry.withFileTypes;
      entry = this.cwd;
    }
    const e = entry.realpathSync();
    return withFileTypes ? e : e?.fullpath();
  }
  async walk(entry = this.cwd, opts = {}) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      opts = entry;
      entry = this.cwd;
    }
    const { withFileTypes = true, follow = false, filter: filter2, walkFilter } = opts;
    const results = [];
    if (!filter2 || filter2(entry)) {
      results.push(withFileTypes ? entry : entry.fullpath());
    }
    const dirs = /* @__PURE__ */ new Set();
    const walk = (dir, cb) => {
      dirs.add(dir);
      dir.readdirCB((er, entries) => {
        if (er) {
          return cb(er);
        }
        let len = entries.length;
        if (!len)
          return cb();
        const next = () => {
          if (--len === 0) {
            cb();
          }
        };
        for (const e of entries) {
          if (!filter2 || filter2(e)) {
            results.push(withFileTypes ? e : e.fullpath());
          }
          if (follow && e.isSymbolicLink()) {
            e.realpath().then((r) => r?.isUnknown() ? r.lstat() : r).then((r) => r?.shouldWalk(dirs, walkFilter) ? walk(r, next) : next());
          } else {
            if (e.shouldWalk(dirs, walkFilter)) {
              walk(e, next);
            } else {
              next();
            }
          }
        }
      }, true);
    };
    const start = entry;
    return new Promise((res, rej) => {
      walk(start, (er) => {
        if (er)
          return rej(er);
        res(results);
      });
    });
  }
  walkSync(entry = this.cwd, opts = {}) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      opts = entry;
      entry = this.cwd;
    }
    const { withFileTypes = true, follow = false, filter: filter2, walkFilter } = opts;
    const results = [];
    if (!filter2 || filter2(entry)) {
      results.push(withFileTypes ? entry : entry.fullpath());
    }
    const dirs = /* @__PURE__ */ new Set([entry]);
    for (const dir of dirs) {
      const entries = dir.readdirSync();
      for (const e of entries) {
        if (!filter2 || filter2(e)) {
          results.push(withFileTypes ? e : e.fullpath());
        }
        let r = e;
        if (e.isSymbolicLink()) {
          if (!(follow && (r = e.realpathSync())))
            continue;
          if (r.isUnknown())
            r.lstatSync();
        }
        if (r.shouldWalk(dirs, walkFilter)) {
          dirs.add(r);
        }
      }
    }
    return results;
  }
  /**
   * Support for `for await`
   *
   * Alias for {@link PathScurryBase.iterate}
   *
   * Note: As of Node 19, this is very slow, compared to other methods of
   * walking.  Consider using {@link PathScurryBase.stream} if memory overhead
   * and backpressure are concerns, or {@link PathScurryBase.walk} if not.
   */
  [Symbol.asyncIterator]() {
    return this.iterate();
  }
  iterate(entry = this.cwd, options = {}) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      options = entry;
      entry = this.cwd;
    }
    return this.stream(entry, options)[Symbol.asyncIterator]();
  }
  /**
   * Iterating over a PathScurry performs a synchronous walk.
   *
   * Alias for {@link PathScurryBase.iterateSync}
   */
  [Symbol.iterator]() {
    return this.iterateSync();
  }
  *iterateSync(entry = this.cwd, opts = {}) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      opts = entry;
      entry = this.cwd;
    }
    const { withFileTypes = true, follow = false, filter: filter2, walkFilter } = opts;
    if (!filter2 || filter2(entry)) {
      yield withFileTypes ? entry : entry.fullpath();
    }
    const dirs = /* @__PURE__ */ new Set([entry]);
    for (const dir of dirs) {
      const entries = dir.readdirSync();
      for (const e of entries) {
        if (!filter2 || filter2(e)) {
          yield withFileTypes ? e : e.fullpath();
        }
        let r = e;
        if (e.isSymbolicLink()) {
          if (!(follow && (r = e.realpathSync())))
            continue;
          if (r.isUnknown())
            r.lstatSync();
        }
        if (r.shouldWalk(dirs, walkFilter)) {
          dirs.add(r);
        }
      }
    }
  }
  stream(entry = this.cwd, opts = {}) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      opts = entry;
      entry = this.cwd;
    }
    const { withFileTypes = true, follow = false, filter: filter2, walkFilter } = opts;
    const results = new Minipass({ objectMode: true });
    if (!filter2 || filter2(entry)) {
      results.write(withFileTypes ? entry : entry.fullpath());
    }
    const dirs = /* @__PURE__ */ new Set();
    const queue = [entry];
    let processing = 0;
    const process2 = () => {
      let paused = false;
      while (!paused) {
        const dir = queue.shift();
        if (!dir) {
          if (processing === 0)
            results.end();
          return;
        }
        processing++;
        dirs.add(dir);
        const onReaddir = (er, entries, didRealpaths = false) => {
          if (er)
            return results.emit("error", er);
          if (follow && !didRealpaths) {
            const promises = [];
            for (const e of entries) {
              if (e.isSymbolicLink()) {
                promises.push(e.realpath().then((r) => r?.isUnknown() ? r.lstat() : r));
              }
            }
            if (promises.length) {
              Promise.all(promises).then(() => onReaddir(null, entries, true));
              return;
            }
          }
          for (const e of entries) {
            if (e && (!filter2 || filter2(e))) {
              if (!results.write(withFileTypes ? e : e.fullpath())) {
                paused = true;
              }
            }
          }
          processing--;
          for (const e of entries) {
            const r = e.realpathCached() || e;
            if (r.shouldWalk(dirs, walkFilter)) {
              queue.push(r);
            }
          }
          if (paused && !results.flowing) {
            results.once("drain", process2);
          } else if (!sync3) {
            process2();
          }
        };
        let sync3 = true;
        dir.readdirCB(onReaddir, true);
        sync3 = false;
      }
    };
    process2();
    return results;
  }
  streamSync(entry = this.cwd, opts = {}) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      opts = entry;
      entry = this.cwd;
    }
    const { withFileTypes = true, follow = false, filter: filter2, walkFilter } = opts;
    const results = new Minipass({ objectMode: true });
    const dirs = /* @__PURE__ */ new Set();
    if (!filter2 || filter2(entry)) {
      results.write(withFileTypes ? entry : entry.fullpath());
    }
    const queue = [entry];
    let processing = 0;
    const process2 = () => {
      let paused = false;
      while (!paused) {
        const dir = queue.shift();
        if (!dir) {
          if (processing === 0)
            results.end();
          return;
        }
        processing++;
        dirs.add(dir);
        const entries = dir.readdirSync();
        for (const e of entries) {
          if (!filter2 || filter2(e)) {
            if (!results.write(withFileTypes ? e : e.fullpath())) {
              paused = true;
            }
          }
        }
        processing--;
        for (const e of entries) {
          let r = e;
          if (e.isSymbolicLink()) {
            if (!(follow && (r = e.realpathSync())))
              continue;
            if (r.isUnknown())
              r.lstatSync();
          }
          if (r.shouldWalk(dirs, walkFilter)) {
            queue.push(r);
          }
        }
      }
      if (paused && !results.flowing)
        results.once("drain", process2);
    };
    process2();
    return results;
  }
  chdir(path6 = this.cwd) {
    const oldCwd = this.cwd;
    this.cwd = typeof path6 === "string" ? this.cwd.resolve(path6) : path6;
    this.cwd[setAsCwd](oldCwd);
  }
};
var PathScurryWin32 = class extends PathScurryBase {
  /**
   * separator for generating path strings
   */
  sep = "\\";
  constructor(cwd = process.cwd(), opts = {}) {
    const { nocase = true } = opts;
    super(cwd, import_node_path.win32, "\\", { ...opts, nocase });
    this.nocase = nocase;
    for (let p = this.cwd; p; p = p.parent) {
      p.nocase = this.nocase;
    }
  }
  /**
   * @internal
   */
  parseRootPath(dir) {
    return import_node_path.win32.parse(dir).root.toUpperCase();
  }
  /**
   * @internal
   */
  newRoot(fs5) {
    return new PathWin32(this.rootPath, IFDIR, void 0, this.roots, this.nocase, this.childrenCache(), { fs: fs5 });
  }
  /**
   * Return true if the provided path string is an absolute path
   */
  isAbsolute(p) {
    return p.startsWith("/") || p.startsWith("\\") || /^[a-z]:(\/|\\)/i.test(p);
  }
};
var PathScurryPosix = class extends PathScurryBase {
  /**
   * separator for generating path strings
   */
  sep = "/";
  constructor(cwd = process.cwd(), opts = {}) {
    const { nocase = false } = opts;
    super(cwd, import_node_path.posix, "/", { ...opts, nocase });
    this.nocase = nocase;
  }
  /**
   * @internal
   */
  parseRootPath(_dir) {
    return "/";
  }
  /**
   * @internal
   */
  newRoot(fs5) {
    return new PathPosix(this.rootPath, IFDIR, void 0, this.roots, this.nocase, this.childrenCache(), { fs: fs5 });
  }
  /**
   * Return true if the provided path string is an absolute path
   */
  isAbsolute(p) {
    return p.startsWith("/");
  }
};
var PathScurryDarwin = class extends PathScurryPosix {
  constructor(cwd = process.cwd(), opts = {}) {
    const { nocase = true } = opts;
    super(cwd, { ...opts, nocase });
  }
};
var Path = process.platform === "win32" ? PathWin32 : PathPosix;
var PathScurry = process.platform === "win32" ? PathScurryWin32 : process.platform === "darwin" ? PathScurryDarwin : PathScurryPosix;

// node_modules/.pnpm/glob@11.1.0/node_modules/glob/dist/esm/pattern.js
var isPatternList = (pl) => pl.length >= 1;
var isGlobList = (gl) => gl.length >= 1;
var Pattern = class _Pattern {
  #patternList;
  #globList;
  #index;
  length;
  #platform;
  #rest;
  #globString;
  #isDrive;
  #isUNC;
  #isAbsolute;
  #followGlobstar = true;
  constructor(patternList, globList, index, platform) {
    if (!isPatternList(patternList)) {
      throw new TypeError("empty pattern list");
    }
    if (!isGlobList(globList)) {
      throw new TypeError("empty glob list");
    }
    if (globList.length !== patternList.length) {
      throw new TypeError("mismatched pattern list and glob list lengths");
    }
    this.length = patternList.length;
    if (index < 0 || index >= this.length) {
      throw new TypeError("index out of range");
    }
    this.#patternList = patternList;
    this.#globList = globList;
    this.#index = index;
    this.#platform = platform;
    if (this.#index === 0) {
      if (this.isUNC()) {
        const [p0, p1, p2, p3, ...prest] = this.#patternList;
        const [g0, g1, g2, g3, ...grest] = this.#globList;
        if (prest[0] === "") {
          prest.shift();
          grest.shift();
        }
        const p = [p0, p1, p2, p3, ""].join("/");
        const g = [g0, g1, g2, g3, ""].join("/");
        this.#patternList = [p, ...prest];
        this.#globList = [g, ...grest];
        this.length = this.#patternList.length;
      } else if (this.isDrive() || this.isAbsolute()) {
        const [p1, ...prest] = this.#patternList;
        const [g1, ...grest] = this.#globList;
        if (prest[0] === "") {
          prest.shift();
          grest.shift();
        }
        const p = p1 + "/";
        const g = g1 + "/";
        this.#patternList = [p, ...prest];
        this.#globList = [g, ...grest];
        this.length = this.#patternList.length;
      }
    }
  }
  /**
   * The first entry in the parsed list of patterns
   */
  pattern() {
    return this.#patternList[this.#index];
  }
  /**
   * true of if pattern() returns a string
   */
  isString() {
    return typeof this.#patternList[this.#index] === "string";
  }
  /**
   * true of if pattern() returns GLOBSTAR
   */
  isGlobstar() {
    return this.#patternList[this.#index] === GLOBSTAR;
  }
  /**
   * true if pattern() returns a regexp
   */
  isRegExp() {
    return this.#patternList[this.#index] instanceof RegExp;
  }
  /**
   * The /-joined set of glob parts that make up this pattern
   */
  globString() {
    return this.#globString = this.#globString || (this.#index === 0 ? this.isAbsolute() ? this.#globList[0] + this.#globList.slice(1).join("/") : this.#globList.join("/") : this.#globList.slice(this.#index).join("/"));
  }
  /**
   * true if there are more pattern parts after this one
   */
  hasMore() {
    return this.length > this.#index + 1;
  }
  /**
   * The rest of the pattern after this part, or null if this is the end
   */
  rest() {
    if (this.#rest !== void 0)
      return this.#rest;
    if (!this.hasMore())
      return this.#rest = null;
    this.#rest = new _Pattern(this.#patternList, this.#globList, this.#index + 1, this.#platform);
    this.#rest.#isAbsolute = this.#isAbsolute;
    this.#rest.#isUNC = this.#isUNC;
    this.#rest.#isDrive = this.#isDrive;
    return this.#rest;
  }
  /**
   * true if the pattern represents a //unc/path/ on windows
   */
  isUNC() {
    const pl = this.#patternList;
    return this.#isUNC !== void 0 ? this.#isUNC : this.#isUNC = this.#platform === "win32" && this.#index === 0 && pl[0] === "" && pl[1] === "" && typeof pl[2] === "string" && !!pl[2] && typeof pl[3] === "string" && !!pl[3];
  }
  // pattern like C:/...
  // split = ['C:', ...]
  // XXX: would be nice to handle patterns like `c:*` to test the cwd
  // in c: for *, but I don't know of a way to even figure out what that
  // cwd is without actually chdir'ing into it?
  /**
   * True if the pattern starts with a drive letter on Windows
   */
  isDrive() {
    const pl = this.#patternList;
    return this.#isDrive !== void 0 ? this.#isDrive : this.#isDrive = this.#platform === "win32" && this.#index === 0 && this.length > 1 && typeof pl[0] === "string" && /^[a-z]:$/i.test(pl[0]);
  }
  // pattern = '/' or '/...' or '/x/...'
  // split = ['', ''] or ['', ...] or ['', 'x', ...]
  // Drive and UNC both considered absolute on windows
  /**
   * True if the pattern is rooted on an absolute path
   */
  isAbsolute() {
    const pl = this.#patternList;
    return this.#isAbsolute !== void 0 ? this.#isAbsolute : this.#isAbsolute = pl[0] === "" && pl.length > 1 || this.isDrive() || this.isUNC();
  }
  /**
   * consume the root of the pattern, and return it
   */
  root() {
    const p = this.#patternList[0];
    return typeof p === "string" && this.isAbsolute() && this.#index === 0 ? p : "";
  }
  /**
   * Check to see if the current globstar pattern is allowed to follow
   * a symbolic link.
   */
  checkFollowGlobstar() {
    return !(this.#index === 0 || !this.isGlobstar() || !this.#followGlobstar);
  }
  /**
   * Mark that the current globstar pattern is following a symbolic link
   */
  markFollowGlobstar() {
    if (this.#index === 0 || !this.isGlobstar() || !this.#followGlobstar)
      return false;
    this.#followGlobstar = false;
    return true;
  }
};

// node_modules/.pnpm/glob@11.1.0/node_modules/glob/dist/esm/ignore.js
var defaultPlatform2 = typeof process === "object" && process && typeof process.platform === "string" ? process.platform : "linux";
var Ignore = class {
  relative;
  relativeChildren;
  absolute;
  absoluteChildren;
  platform;
  mmopts;
  constructor(ignored, { nobrace, nocase, noext, noglobstar, platform = defaultPlatform2 }) {
    this.relative = [];
    this.absolute = [];
    this.relativeChildren = [];
    this.absoluteChildren = [];
    this.platform = platform;
    this.mmopts = {
      dot: true,
      nobrace,
      nocase,
      noext,
      noglobstar,
      optimizationLevel: 2,
      platform,
      nocomment: true,
      nonegate: true
    };
    for (const ign of ignored)
      this.add(ign);
  }
  add(ign) {
    const mm = new Minimatch(ign, this.mmopts);
    for (let i = 0; i < mm.set.length; i++) {
      const parsed = mm.set[i];
      const globParts = mm.globParts[i];
      if (!parsed || !globParts) {
        throw new Error("invalid pattern object");
      }
      while (parsed[0] === "." && globParts[0] === ".") {
        parsed.shift();
        globParts.shift();
      }
      const p = new Pattern(parsed, globParts, 0, this.platform);
      const m = new Minimatch(p.globString(), this.mmopts);
      const children = globParts[globParts.length - 1] === "**";
      const absolute = p.isAbsolute();
      if (absolute)
        this.absolute.push(m);
      else
        this.relative.push(m);
      if (children) {
        if (absolute)
          this.absoluteChildren.push(m);
        else
          this.relativeChildren.push(m);
      }
    }
  }
  ignored(p) {
    const fullpath = p.fullpath();
    const fullpaths = `${fullpath}/`;
    const relative = p.relative() || ".";
    const relatives = `${relative}/`;
    for (const m of this.relative) {
      if (m.match(relative) || m.match(relatives))
        return true;
    }
    for (const m of this.absolute) {
      if (m.match(fullpath) || m.match(fullpaths))
        return true;
    }
    return false;
  }
  childrenIgnored(p) {
    const fullpath = p.fullpath() + "/";
    const relative = (p.relative() || ".") + "/";
    for (const m of this.relativeChildren) {
      if (m.match(relative))
        return true;
    }
    for (const m of this.absoluteChildren) {
      if (m.match(fullpath))
        return true;
    }
    return false;
  }
};

// node_modules/.pnpm/glob@11.1.0/node_modules/glob/dist/esm/processor.js
var HasWalkedCache = class _HasWalkedCache {
  store;
  constructor(store = /* @__PURE__ */ new Map()) {
    this.store = store;
  }
  copy() {
    return new _HasWalkedCache(new Map(this.store));
  }
  hasWalked(target, pattern) {
    return this.store.get(target.fullpath())?.has(pattern.globString());
  }
  storeWalked(target, pattern) {
    const fullpath = target.fullpath();
    const cached = this.store.get(fullpath);
    if (cached)
      cached.add(pattern.globString());
    else
      this.store.set(fullpath, /* @__PURE__ */ new Set([pattern.globString()]));
  }
};
var MatchRecord = class {
  store = /* @__PURE__ */ new Map();
  add(target, absolute, ifDir) {
    const n = (absolute ? 2 : 0) | (ifDir ? 1 : 0);
    const current = this.store.get(target);
    this.store.set(target, current === void 0 ? n : n & current);
  }
  // match, absolute, ifdir
  entries() {
    return [...this.store.entries()].map(([path6, n]) => [
      path6,
      !!(n & 2),
      !!(n & 1)
    ]);
  }
};
var SubWalks = class {
  store = /* @__PURE__ */ new Map();
  add(target, pattern) {
    if (!target.canReaddir()) {
      return;
    }
    const subs = this.store.get(target);
    if (subs) {
      if (!subs.find((p) => p.globString() === pattern.globString())) {
        subs.push(pattern);
      }
    } else
      this.store.set(target, [pattern]);
  }
  get(target) {
    const subs = this.store.get(target);
    if (!subs) {
      throw new Error("attempting to walk unknown path");
    }
    return subs;
  }
  entries() {
    return this.keys().map((k) => [k, this.store.get(k)]);
  }
  keys() {
    return [...this.store.keys()].filter((t) => t.canReaddir());
  }
};
var Processor = class _Processor {
  hasWalkedCache;
  matches = new MatchRecord();
  subwalks = new SubWalks();
  patterns;
  follow;
  dot;
  opts;
  constructor(opts, hasWalkedCache) {
    this.opts = opts;
    this.follow = !!opts.follow;
    this.dot = !!opts.dot;
    this.hasWalkedCache = hasWalkedCache ? hasWalkedCache.copy() : new HasWalkedCache();
  }
  processPatterns(target, patterns) {
    this.patterns = patterns;
    const processingSet = patterns.map((p) => [target, p]);
    for (let [t, pattern] of processingSet) {
      this.hasWalkedCache.storeWalked(t, pattern);
      const root = pattern.root();
      const absolute = pattern.isAbsolute() && this.opts.absolute !== false;
      if (root) {
        t = t.resolve(root === "/" && this.opts.root !== void 0 ? this.opts.root : root);
        const rest2 = pattern.rest();
        if (!rest2) {
          this.matches.add(t, true, false);
          continue;
        } else {
          pattern = rest2;
        }
      }
      if (t.isENOENT())
        continue;
      let p;
      let rest;
      let changed = false;
      while (typeof (p = pattern.pattern()) === "string" && (rest = pattern.rest())) {
        const c = t.resolve(p);
        t = c;
        pattern = rest;
        changed = true;
      }
      p = pattern.pattern();
      rest = pattern.rest();
      if (changed) {
        if (this.hasWalkedCache.hasWalked(t, pattern))
          continue;
        this.hasWalkedCache.storeWalked(t, pattern);
      }
      if (typeof p === "string") {
        const ifDir = p === ".." || p === "" || p === ".";
        this.matches.add(t.resolve(p), absolute, ifDir);
        continue;
      } else if (p === GLOBSTAR) {
        if (!t.isSymbolicLink() || this.follow || pattern.checkFollowGlobstar()) {
          this.subwalks.add(t, pattern);
        }
        const rp = rest?.pattern();
        const rrest = rest?.rest();
        if (!rest || (rp === "" || rp === ".") && !rrest) {
          this.matches.add(t, absolute, rp === "" || rp === ".");
        } else {
          if (rp === "..") {
            const tp = t.parent || t;
            if (!rrest)
              this.matches.add(tp, absolute, true);
            else if (!this.hasWalkedCache.hasWalked(tp, rrest)) {
              this.subwalks.add(tp, rrest);
            }
          }
        }
      } else if (p instanceof RegExp) {
        this.subwalks.add(t, pattern);
      }
    }
    return this;
  }
  subwalkTargets() {
    return this.subwalks.keys();
  }
  child() {
    return new _Processor(this.opts, this.hasWalkedCache);
  }
  // return a new Processor containing the subwalks for each
  // child entry, and a set of matches, and
  // a hasWalkedCache that's a copy of this one
  // then we're going to call
  filterEntries(parent, entries) {
    const patterns = this.subwalks.get(parent);
    const results = this.child();
    for (const e of entries) {
      for (const pattern of patterns) {
        const absolute = pattern.isAbsolute();
        const p = pattern.pattern();
        const rest = pattern.rest();
        if (p === GLOBSTAR) {
          results.testGlobstar(e, pattern, rest, absolute);
        } else if (p instanceof RegExp) {
          results.testRegExp(e, p, rest, absolute);
        } else {
          results.testString(e, p, rest, absolute);
        }
      }
    }
    return results;
  }
  testGlobstar(e, pattern, rest, absolute) {
    if (this.dot || !e.name.startsWith(".")) {
      if (!pattern.hasMore()) {
        this.matches.add(e, absolute, false);
      }
      if (e.canReaddir()) {
        if (this.follow || !e.isSymbolicLink()) {
          this.subwalks.add(e, pattern);
        } else if (e.isSymbolicLink()) {
          if (rest && pattern.checkFollowGlobstar()) {
            this.subwalks.add(e, rest);
          } else if (pattern.markFollowGlobstar()) {
            this.subwalks.add(e, pattern);
          }
        }
      }
    }
    if (rest) {
      const rp = rest.pattern();
      if (typeof rp === "string" && // dots and empty were handled already
      rp !== ".." && rp !== "" && rp !== ".") {
        this.testString(e, rp, rest.rest(), absolute);
      } else if (rp === "..") {
        const ep = e.parent || e;
        this.subwalks.add(ep, rest);
      } else if (rp instanceof RegExp) {
        this.testRegExp(e, rp, rest.rest(), absolute);
      }
    }
  }
  testRegExp(e, p, rest, absolute) {
    if (!p.test(e.name))
      return;
    if (!rest) {
      this.matches.add(e, absolute, false);
    } else {
      this.subwalks.add(e, rest);
    }
  }
  testString(e, p, rest, absolute) {
    if (!e.isNamed(p))
      return;
    if (!rest) {
      this.matches.add(e, absolute, false);
    } else {
      this.subwalks.add(e, rest);
    }
  }
};

// node_modules/.pnpm/glob@11.1.0/node_modules/glob/dist/esm/walker.js
var makeIgnore = (ignore, opts) => typeof ignore === "string" ? new Ignore([ignore], opts) : Array.isArray(ignore) ? new Ignore(ignore, opts) : ignore;
var GlobUtil = class {
  path;
  patterns;
  opts;
  seen = /* @__PURE__ */ new Set();
  paused = false;
  aborted = false;
  #onResume = [];
  #ignore;
  #sep;
  signal;
  maxDepth;
  includeChildMatches;
  constructor(patterns, path6, opts) {
    this.patterns = patterns;
    this.path = path6;
    this.opts = opts;
    this.#sep = !opts.posix && opts.platform === "win32" ? "\\" : "/";
    this.includeChildMatches = opts.includeChildMatches !== false;
    if (opts.ignore || !this.includeChildMatches) {
      this.#ignore = makeIgnore(opts.ignore ?? [], opts);
      if (!this.includeChildMatches && typeof this.#ignore.add !== "function") {
        const m = "cannot ignore child matches, ignore lacks add() method.";
        throw new Error(m);
      }
    }
    this.maxDepth = opts.maxDepth || Infinity;
    if (opts.signal) {
      this.signal = opts.signal;
      this.signal.addEventListener("abort", () => {
        this.#onResume.length = 0;
      });
    }
  }
  #ignored(path6) {
    return this.seen.has(path6) || !!this.#ignore?.ignored?.(path6);
  }
  #childrenIgnored(path6) {
    return !!this.#ignore?.childrenIgnored?.(path6);
  }
  // backpressure mechanism
  pause() {
    this.paused = true;
  }
  resume() {
    if (this.signal?.aborted)
      return;
    this.paused = false;
    let fn = void 0;
    while (!this.paused && (fn = this.#onResume.shift())) {
      fn();
    }
  }
  onResume(fn) {
    if (this.signal?.aborted)
      return;
    if (!this.paused) {
      fn();
    } else {
      this.#onResume.push(fn);
    }
  }
  // do the requisite realpath/stat checking, and return the path
  // to add or undefined to filter it out.
  async matchCheck(e, ifDir) {
    if (ifDir && this.opts.nodir)
      return void 0;
    let rpc;
    if (this.opts.realpath) {
      rpc = e.realpathCached() || await e.realpath();
      if (!rpc)
        return void 0;
      e = rpc;
    }
    const needStat = e.isUnknown() || this.opts.stat;
    const s = needStat ? await e.lstat() : e;
    if (this.opts.follow && this.opts.nodir && s?.isSymbolicLink()) {
      const target = await s.realpath();
      if (target && (target.isUnknown() || this.opts.stat)) {
        await target.lstat();
      }
    }
    return this.matchCheckTest(s, ifDir);
  }
  matchCheckTest(e, ifDir) {
    return e && (this.maxDepth === Infinity || e.depth() <= this.maxDepth) && (!ifDir || e.canReaddir()) && (!this.opts.nodir || !e.isDirectory()) && (!this.opts.nodir || !this.opts.follow || !e.isSymbolicLink() || !e.realpathCached()?.isDirectory()) && !this.#ignored(e) ? e : void 0;
  }
  matchCheckSync(e, ifDir) {
    if (ifDir && this.opts.nodir)
      return void 0;
    let rpc;
    if (this.opts.realpath) {
      rpc = e.realpathCached() || e.realpathSync();
      if (!rpc)
        return void 0;
      e = rpc;
    }
    const needStat = e.isUnknown() || this.opts.stat;
    const s = needStat ? e.lstatSync() : e;
    if (this.opts.follow && this.opts.nodir && s?.isSymbolicLink()) {
      const target = s.realpathSync();
      if (target && (target?.isUnknown() || this.opts.stat)) {
        target.lstatSync();
      }
    }
    return this.matchCheckTest(s, ifDir);
  }
  matchFinish(e, absolute) {
    if (this.#ignored(e))
      return;
    if (!this.includeChildMatches && this.#ignore?.add) {
      const ign = `${e.relativePosix()}/**`;
      this.#ignore.add(ign);
    }
    const abs = this.opts.absolute === void 0 ? absolute : this.opts.absolute;
    this.seen.add(e);
    const mark = this.opts.mark && e.isDirectory() ? this.#sep : "";
    if (this.opts.withFileTypes) {
      this.matchEmit(e);
    } else if (abs) {
      const abs2 = this.opts.posix ? e.fullpathPosix() : e.fullpath();
      this.matchEmit(abs2 + mark);
    } else {
      const rel = this.opts.posix ? e.relativePosix() : e.relative();
      const pre = this.opts.dotRelative && !rel.startsWith(".." + this.#sep) ? "." + this.#sep : "";
      this.matchEmit(!rel ? "." + mark : pre + rel + mark);
    }
  }
  async match(e, absolute, ifDir) {
    const p = await this.matchCheck(e, ifDir);
    if (p)
      this.matchFinish(p, absolute);
  }
  matchSync(e, absolute, ifDir) {
    const p = this.matchCheckSync(e, ifDir);
    if (p)
      this.matchFinish(p, absolute);
  }
  walkCB(target, patterns, cb) {
    if (this.signal?.aborted)
      cb();
    this.walkCB2(target, patterns, new Processor(this.opts), cb);
  }
  walkCB2(target, patterns, processor, cb) {
    if (this.#childrenIgnored(target))
      return cb();
    if (this.signal?.aborted)
      cb();
    if (this.paused) {
      this.onResume(() => this.walkCB2(target, patterns, processor, cb));
      return;
    }
    processor.processPatterns(target, patterns);
    let tasks = 1;
    const next = () => {
      if (--tasks === 0)
        cb();
    };
    for (const [m, absolute, ifDir] of processor.matches.entries()) {
      if (this.#ignored(m))
        continue;
      tasks++;
      this.match(m, absolute, ifDir).then(() => next());
    }
    for (const t of processor.subwalkTargets()) {
      if (this.maxDepth !== Infinity && t.depth() >= this.maxDepth) {
        continue;
      }
      tasks++;
      const childrenCached = t.readdirCached();
      if (t.calledReaddir())
        this.walkCB3(t, childrenCached, processor, next);
      else {
        t.readdirCB((_, entries) => this.walkCB3(t, entries, processor, next), true);
      }
    }
    next();
  }
  walkCB3(target, entries, processor, cb) {
    processor = processor.filterEntries(target, entries);
    let tasks = 1;
    const next = () => {
      if (--tasks === 0)
        cb();
    };
    for (const [m, absolute, ifDir] of processor.matches.entries()) {
      if (this.#ignored(m))
        continue;
      tasks++;
      this.match(m, absolute, ifDir).then(() => next());
    }
    for (const [target2, patterns] of processor.subwalks.entries()) {
      tasks++;
      this.walkCB2(target2, patterns, processor.child(), next);
    }
    next();
  }
  walkCBSync(target, patterns, cb) {
    if (this.signal?.aborted)
      cb();
    this.walkCB2Sync(target, patterns, new Processor(this.opts), cb);
  }
  walkCB2Sync(target, patterns, processor, cb) {
    if (this.#childrenIgnored(target))
      return cb();
    if (this.signal?.aborted)
      cb();
    if (this.paused) {
      this.onResume(() => this.walkCB2Sync(target, patterns, processor, cb));
      return;
    }
    processor.processPatterns(target, patterns);
    let tasks = 1;
    const next = () => {
      if (--tasks === 0)
        cb();
    };
    for (const [m, absolute, ifDir] of processor.matches.entries()) {
      if (this.#ignored(m))
        continue;
      this.matchSync(m, absolute, ifDir);
    }
    for (const t of processor.subwalkTargets()) {
      if (this.maxDepth !== Infinity && t.depth() >= this.maxDepth) {
        continue;
      }
      tasks++;
      const children = t.readdirSync();
      this.walkCB3Sync(t, children, processor, next);
    }
    next();
  }
  walkCB3Sync(target, entries, processor, cb) {
    processor = processor.filterEntries(target, entries);
    let tasks = 1;
    const next = () => {
      if (--tasks === 0)
        cb();
    };
    for (const [m, absolute, ifDir] of processor.matches.entries()) {
      if (this.#ignored(m))
        continue;
      this.matchSync(m, absolute, ifDir);
    }
    for (const [target2, patterns] of processor.subwalks.entries()) {
      tasks++;
      this.walkCB2Sync(target2, patterns, processor.child(), next);
    }
    next();
  }
};
var GlobWalker = class extends GlobUtil {
  matches = /* @__PURE__ */ new Set();
  constructor(patterns, path6, opts) {
    super(patterns, path6, opts);
  }
  matchEmit(e) {
    this.matches.add(e);
  }
  async walk() {
    if (this.signal?.aborted)
      throw this.signal.reason;
    if (this.path.isUnknown()) {
      await this.path.lstat();
    }
    await new Promise((res, rej) => {
      this.walkCB(this.path, this.patterns, () => {
        if (this.signal?.aborted) {
          rej(this.signal.reason);
        } else {
          res(this.matches);
        }
      });
    });
    return this.matches;
  }
  walkSync() {
    if (this.signal?.aborted)
      throw this.signal.reason;
    if (this.path.isUnknown()) {
      this.path.lstatSync();
    }
    this.walkCBSync(this.path, this.patterns, () => {
      if (this.signal?.aborted)
        throw this.signal.reason;
    });
    return this.matches;
  }
};
var GlobStream = class extends GlobUtil {
  results;
  constructor(patterns, path6, opts) {
    super(patterns, path6, opts);
    this.results = new Minipass({
      signal: this.signal,
      objectMode: true
    });
    this.results.on("drain", () => this.resume());
    this.results.on("resume", () => this.resume());
  }
  matchEmit(e) {
    this.results.write(e);
    if (!this.results.flowing)
      this.pause();
  }
  stream() {
    const target = this.path;
    if (target.isUnknown()) {
      target.lstat().then(() => {
        this.walkCB(target, this.patterns, () => this.results.end());
      });
    } else {
      this.walkCB(target, this.patterns, () => this.results.end());
    }
    return this.results;
  }
  streamSync() {
    if (this.path.isUnknown()) {
      this.path.lstatSync();
    }
    this.walkCBSync(this.path, this.patterns, () => this.results.end());
    return this.results;
  }
};

// node_modules/.pnpm/glob@11.1.0/node_modules/glob/dist/esm/glob.js
var defaultPlatform3 = typeof process === "object" && process && typeof process.platform === "string" ? process.platform : "linux";
var Glob = class {
  absolute;
  cwd;
  root;
  dot;
  dotRelative;
  follow;
  ignore;
  magicalBraces;
  mark;
  matchBase;
  maxDepth;
  nobrace;
  nocase;
  nodir;
  noext;
  noglobstar;
  pattern;
  platform;
  realpath;
  scurry;
  stat;
  signal;
  windowsPathsNoEscape;
  withFileTypes;
  includeChildMatches;
  /**
   * The options provided to the constructor.
   */
  opts;
  /**
   * An array of parsed immutable {@link Pattern} objects.
   */
  patterns;
  /**
   * All options are stored as properties on the `Glob` object.
   *
   * See {@link GlobOptions} for full options descriptions.
   *
   * Note that a previous `Glob` object can be passed as the
   * `GlobOptions` to another `Glob` instantiation to re-use settings
   * and caches with a new pattern.
   *
   * Traversal functions can be called multiple times to run the walk
   * again.
   */
  constructor(pattern, opts) {
    if (!opts)
      throw new TypeError("glob options required");
    this.withFileTypes = !!opts.withFileTypes;
    this.signal = opts.signal;
    this.follow = !!opts.follow;
    this.dot = !!opts.dot;
    this.dotRelative = !!opts.dotRelative;
    this.nodir = !!opts.nodir;
    this.mark = !!opts.mark;
    if (!opts.cwd) {
      this.cwd = "";
    } else if (opts.cwd instanceof URL || opts.cwd.startsWith("file://")) {
      opts.cwd = (0, import_node_url2.fileURLToPath)(opts.cwd);
    }
    this.cwd = opts.cwd || "";
    this.root = opts.root;
    this.magicalBraces = !!opts.magicalBraces;
    this.nobrace = !!opts.nobrace;
    this.noext = !!opts.noext;
    this.realpath = !!opts.realpath;
    this.absolute = opts.absolute;
    this.includeChildMatches = opts.includeChildMatches !== false;
    this.noglobstar = !!opts.noglobstar;
    this.matchBase = !!opts.matchBase;
    this.maxDepth = typeof opts.maxDepth === "number" ? opts.maxDepth : Infinity;
    this.stat = !!opts.stat;
    this.ignore = opts.ignore;
    if (this.withFileTypes && this.absolute !== void 0) {
      throw new Error("cannot set absolute and withFileTypes:true");
    }
    if (typeof pattern === "string") {
      pattern = [pattern];
    }
    this.windowsPathsNoEscape = !!opts.windowsPathsNoEscape || opts.allowWindowsEscape === false;
    if (this.windowsPathsNoEscape) {
      pattern = pattern.map((p) => p.replace(/\\/g, "/"));
    }
    if (this.matchBase) {
      if (opts.noglobstar) {
        throw new TypeError("base matching requires globstar");
      }
      pattern = pattern.map((p) => p.includes("/") ? p : `./**/${p}`);
    }
    this.pattern = pattern;
    this.platform = opts.platform || defaultPlatform3;
    this.opts = { ...opts, platform: this.platform };
    if (opts.scurry) {
      this.scurry = opts.scurry;
      if (opts.nocase !== void 0 && opts.nocase !== opts.scurry.nocase) {
        throw new Error("nocase option contradicts provided scurry option");
      }
    } else {
      const Scurry = opts.platform === "win32" ? PathScurryWin32 : opts.platform === "darwin" ? PathScurryDarwin : opts.platform ? PathScurryPosix : PathScurry;
      this.scurry = new Scurry(this.cwd, {
        nocase: opts.nocase,
        fs: opts.fs
      });
    }
    this.nocase = this.scurry.nocase;
    const nocaseMagicOnly = this.platform === "darwin" || this.platform === "win32";
    const mmo = {
      // default nocase based on platform
      ...opts,
      dot: this.dot,
      matchBase: this.matchBase,
      nobrace: this.nobrace,
      nocase: this.nocase,
      nocaseMagicOnly,
      nocomment: true,
      noext: this.noext,
      nonegate: true,
      optimizationLevel: 2,
      platform: this.platform,
      windowsPathsNoEscape: this.windowsPathsNoEscape,
      debug: !!this.opts.debug
    };
    const mms = this.pattern.map((p) => new Minimatch(p, mmo));
    const [matchSet, globParts] = mms.reduce((set, m) => {
      set[0].push(...m.set);
      set[1].push(...m.globParts);
      return set;
    }, [[], []]);
    this.patterns = matchSet.map((set, i) => {
      const g = globParts[i];
      if (!g)
        throw new Error("invalid pattern object");
      return new Pattern(set, g, 0, this.platform);
    });
  }
  async walk() {
    return [
      ...await new GlobWalker(this.patterns, this.scurry.cwd, {
        ...this.opts,
        maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
        platform: this.platform,
        nocase: this.nocase,
        includeChildMatches: this.includeChildMatches
      }).walk()
    ];
  }
  walkSync() {
    return [
      ...new GlobWalker(this.patterns, this.scurry.cwd, {
        ...this.opts,
        maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
        platform: this.platform,
        nocase: this.nocase,
        includeChildMatches: this.includeChildMatches
      }).walkSync()
    ];
  }
  stream() {
    return new GlobStream(this.patterns, this.scurry.cwd, {
      ...this.opts,
      maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
      platform: this.platform,
      nocase: this.nocase,
      includeChildMatches: this.includeChildMatches
    }).stream();
  }
  streamSync() {
    return new GlobStream(this.patterns, this.scurry.cwd, {
      ...this.opts,
      maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
      platform: this.platform,
      nocase: this.nocase,
      includeChildMatches: this.includeChildMatches
    }).streamSync();
  }
  /**
   * Default sync iteration function. Returns a Generator that
   * iterates over the results.
   */
  iterateSync() {
    return this.streamSync()[Symbol.iterator]();
  }
  [Symbol.iterator]() {
    return this.iterateSync();
  }
  /**
   * Default async iteration function. Returns an AsyncGenerator that
   * iterates over the results.
   */
  iterate() {
    return this.stream()[Symbol.asyncIterator]();
  }
  [Symbol.asyncIterator]() {
    return this.iterate();
  }
};

// node_modules/.pnpm/glob@11.1.0/node_modules/glob/dist/esm/has-magic.js
var hasMagic = (pattern, options = {}) => {
  if (!Array.isArray(pattern)) {
    pattern = [pattern];
  }
  for (const p of pattern) {
    if (new Minimatch(p, options).hasMagic())
      return true;
  }
  return false;
};

// node_modules/.pnpm/glob@11.1.0/node_modules/glob/dist/esm/index.js
function globStreamSync(pattern, options = {}) {
  return new Glob(pattern, options).streamSync();
}
function globStream(pattern, options = {}) {
  return new Glob(pattern, options).stream();
}
function globSync(pattern, options = {}) {
  return new Glob(pattern, options).walkSync();
}
async function glob_(pattern, options = {}) {
  return new Glob(pattern, options).walk();
}
function globIterateSync(pattern, options = {}) {
  return new Glob(pattern, options).iterateSync();
}
function globIterate(pattern, options = {}) {
  return new Glob(pattern, options).iterate();
}
var streamSync = globStreamSync;
var stream = Object.assign(globStream, { sync: globStreamSync });
var iterateSync = globIterateSync;
var iterate = Object.assign(globIterate, {
  sync: globIterateSync
});
var sync2 = Object.assign(globSync, {
  stream: globStreamSync,
  iterate: globIterateSync
});
var glob = Object.assign(glob_, {
  glob: glob_,
  globSync,
  sync: sync2,
  globStream,
  stream,
  globStreamSync,
  streamSync,
  globIterate,
  iterate,
  globIterateSync,
  iterateSync,
  Glob,
  hasMagic,
  escape,
  unescape
});
glob.glob = glob;

// .github/actions/changeset-release-notes/changelog.ts
var fs3 = __toESM(require("fs"));
var path4 = __toESM(require("path"));
function listProjects(changesets, cwd = process.cwd()) {
  const ids = new Set(
    ...changesets.map((c) => {
      return c.releases.map((r) => {
        return r.name;
      });
    })
  );
  console.info("Project names", Array.from(ids));
  const packageJsons = sync2("**/package.json", {
    ignore: ["**/node_modules/**"],
    cwd
  });
  console.info("Packages", packageJsons);
  const projects = /* @__PURE__ */ new Map();
  packageJsons.forEach((packageJsonPath) => {
    try {
      packageJsonPath = path4.join(cwd, packageJsonPath);
      const packageJson = JSON.parse(fs3.readFileSync(packageJsonPath, "utf-8"));
      if (!ids.has(packageJson.name)) {
        return;
      }
      console.info(`Found ${packageJson.name} in ${packageJsonPath}`);
      const rootPath = path4.dirname(packageJsonPath);
      const changelogPath = path4.join(rootPath, "CHANGELOG.md");
      projects.set(packageJson.name, {
        version: packageJson.version,
        changelogPath,
        rootPath
      });
    } catch (e) {
      console.error(`Failed to get project info for ${packageJsonPath}`, e);
    }
  });
  return projects;
}
function listChangesForAllProjects(changesets, cwd = process.cwd()) {
  const notes = [];
  const changelogs = listProjects(changesets, cwd);
  changelogs.forEach((project, projectName) => {
    const changelog = fs3.readFileSync(project.changelogPath, "utf-8");
    notes.push({
      changes: getChangesForVersion(project.version, changelog),
      projectName,
      currentVersion: project.version
    });
  });
  return notes;
}
function getChangesForVersion(version, changelog) {
  const lines = changelog.split("\n");
  let currentVersion = "";
  let changes = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    if (/^## \[\d+\.\d+\.\d+.*]/.test(trimmedLine)) {
      currentVersion = "";
      continue;
    }
    const versionMatch = trimmedLine.match(/^## (\d+\.\d+\.\d+.*)/);
    if (versionMatch) {
      currentVersion = versionMatch[1];
      if (currentVersion === version) {
        continue;
      } else if (changes.length > 0) {
        break;
      }
    }
    if (currentVersion === version) {
      changes += `${line}
`;
    }
  }
  return changes;
}

// .github/actions/changeset-release-notes/notes.ts
function getReleaseNotes(changesets, cwd = process.cwd()) {
  let result = "";
  const changes = listChangesForAllProjects(changesets, cwd);
  changes.forEach((change) => {
    result += `## ${change.projectName}@${change.currentVersion}

`;
    result += `${change.changes}

`;
  });
  return result;
}

// .github/actions/changeset-release-notes/version.ts
var fs4 = __toESM(require("fs"));
var path5 = __toESM(require("path"));
var cp = __toESM(require("child_process"));
function getCurrentVersion(project) {
  const pkg = JSON.parse(fs4.readFileSync(path5.join(project.rootPath, "package.json"), "utf-8"));
  return pkg.version;
}
function detectPackageManager(cwd) {
  if (fs4.existsSync(path5.join(cwd, "yarn.lock"))) {
    return "yarn";
  }
  return "pnpm";
}
function doVersion(projects, cwd = process.cwd()) {
  const oldVersions = projects.map((project) => getCurrentVersion(project));
  const packageManager = detectPackageManager(cwd);
  console.info(`Updating version using ${packageManager}`);
  const command = packageManager === "yarn" ? "yarn changeset version" : "pnpm exec changeset version";
  cp.execSync(command, {
    cwd,
    stdio: "inherit"
  });
  console.info("Version updated");
  return projects.some((project, i) => {
    const lastVersion = oldVersions[i];
    const nextVersion = getCurrentVersion(project);
    return lastVersion !== nextVersion;
  });
}

// .github/actions/changeset-release-notes/changeset-release-notes.ts
async function changesetReleaseNotes(cwd = process.cwd()) {
  const changesets = await getChangesets(cwd);
  if (!changesets.length) {
    return;
  }
  console.info("Found changesets", JSON.stringify(changesets, null, 2));
  const projects = Array.from(listProjects(changesets, cwd).values());
  console.info("Found projects", JSON.stringify(projects, null, 2));
  if (!doVersion(projects, cwd)) {
    console.info("No changes found for all projects");
    return;
  }
  console.info("Changelogs generated successfully");
  return getReleaseNotes(changesets, cwd);
}

// .github/actions/changeset-release-notes/main.ts
async function main() {
  const notes = await changesetReleaseNotes();
  if (notes) {
    core.setOutput("release-notes", notes);
  }
}
main().catch((err) => {
  core.setFailed(err);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  main
});
/*! Bundled license information:

@babel/runtime/helpers/regeneratorRuntime.js:
  (*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE *)

is-extglob/index.js:
  (*!
   * is-extglob <https://github.com/jonschlinkert/is-extglob>
   *
   * Copyright (c) 2014-2016, Jon Schlinkert.
   * Licensed under the MIT License.
   *)

is-glob/index.js:
  (*!
   * is-glob <https://github.com/jonschlinkert/is-glob>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   *)

is-number/index.js:
  (*!
   * is-number <https://github.com/jonschlinkert/is-number>
   *
   * Copyright (c) 2014-present, Jon Schlinkert.
   * Released under the MIT License.
   *)

to-regex-range/index.js:
  (*!
   * to-regex-range <https://github.com/micromatch/to-regex-range>
   *
   * Copyright (c) 2015-present, Jon Schlinkert.
   * Released under the MIT License.
   *)

fill-range/index.js:
  (*!
   * fill-range <https://github.com/jonschlinkert/fill-range>
   *
   * Copyright (c) 2014-present, Jon Schlinkert.
   * Licensed under the MIT License.
   *)

queue-microtask/index.js:
  (*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)

run-parallel/index.js:
  (*! run-parallel. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)

is-windows/index.js:
  (*!
   * is-windows <https://github.com/jonschlinkert/is-windows>
   *
   * Copyright © 2015-2018, Jon Schlinkert.
   * Released under the MIT License.
   *)
*/
