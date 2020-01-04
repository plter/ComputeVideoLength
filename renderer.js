// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.


window.jQuery = window.$ = require("jquery/dist/jquery.min");
require("bootstrap/dist/js/bootstrap.bundle.min");
window.Vue = require("vue/dist/vue");
window.electron = require("electron");
window.util = require("util");
window.fs = require("fs");
window.fs_stat = util.promisify(fs.stat);
window.fs_readdir = util.promisify(fs.readdir);
window.path = require("path");
require("./app");