import path from "path";
import MutationObserver from "@sheerun/mutationobserver-shim";

const dotEnvPath = path.resolve(".env");

require("dotenv").config({
  path: dotEnvPath,
});

const { JSDOM } = require("jsdom");

const jsdom = new JSDOM("<!doctype html><html><body></body></html>", {
  pretendToBeVisual: true,
});
const { window } = jsdom;

const copyProps = (src, target) => {
  const props = Object.getOwnPropertyNames(src)
    .filter((prop) => {
      return typeof target[prop] === "undefined";
    })
    .map((prop) => {
      return Object.getOwnPropertyDescriptor(src, prop);
    });
  Object.defineProperties(target, props);
};

function localStorage() {
  let storage = {};
  return {
    getItem: function (key) {
      return key in storage ? storage[key] : null;
    },
    setItem: function (key, value) {
      storage[key] = value || "";
    },
  };
}

global.HTMLElement = window.HTMLElement;
global.localStorage = localStorage();
global.XMLHttpRequest = window.XMLHttpRequest;

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: "node.js",
};
global.cancelAnimationFrame = function () {};
global.requestAnimationFrame = function () {};
global.MutationObserver = MutationObserver;

class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

window.HTMLDialogElement.prototype.showModal = () => {};
window.HTMLDialogElement.prototype.show = () => {};
window.HTMLDialogElement.prototype.close = () => {};

copyProps(window, global);
