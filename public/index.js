// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"utils/helpers.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.access = exports.convertTag = exports.focusableSelectors = void 0;
exports.focusableSelectors = ['a[href]:not([tabindex^="-"])', 'area[href]:not([tabindex^="-"])', 'input:not([type="hidden"]):not([type="radio"]):not([disabled]):not([tabindex^="-"])', 'input[type="radio"]:not([disabled]):not([tabindex^="-"]):checked', 'select:not([disabled]):not([tabindex^="-"])', 'textarea:not([disabled]):not([tabindex^="-"])', 'button:not([disabled]):not([tabindex^="-"])', 'iframe:not([tabindex^="-"])', 'audio[controls]:not([tabindex^="-"])', 'video[controls]:not([tabindex^="-"])', '[contenteditable]:not([tabindex^="-"])', '[tabindex]:not([tabindex^="-"])'];

var convertTag = function convertTag(el, tag) {
  var _a;

  var newElement = document.createElement(tag);
  newElement.innerHTML = el.innerHTML;
  Array.from(el.attributes).forEach(function (attr) {
    newElement.setAttribute(attr.name, attr.value);
  });
  (_a = el.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(newElement, el);
  return newElement;
};

exports.convertTag = convertTag; // https://gist.github.com/patrickfox/ee5a0d093e0ab9f76441f8339ab4b8e1

var access = function access(el, place_focus_before) {
  var focus_el, focus_method, ogti, onblur_el, onblur_temp_el, temp_el;

  onblur_el = function onblur_el(e) {
    if (el.getAttribute('data-ogti')) {
      el.setAttribute('tabindex', ogti);
    } else {
      el.removeAttribute('tabindex');
    }

    el.removeAttribute('data-ogti');
    el.removeEventListener('focusout', focus_method);
  };

  onblur_temp_el = function onblur_temp_el(e) {
    temp_el.removeEventListener('focusout', focus_method);
    temp_el.parentNode.removeChild(temp_el);
  };

  focus_el = function focus_el(the_el) {
    the_el.setAttribute('tabindex', '-1');
    the_el.addEventListener('focusout', focus_method);
    the_el.focus();
  };

  focus_method = onblur_el;

  if (place_focus_before) {
    temp_el = document.createElement('span');

    if (typeof place_focus_before === 'string') {
      temp_el.innerHTML = place_focus_before;
    }

    temp_el.setAttribute('style', 'position: absolute;height: 1px;width: 1px;margin: -1px;padding: 0;overflow: hidden;clip: rect(0 0 0 0);border: 0;');
    temp_el = el.parentNode.insertBefore(temp_el, el);
    focus_method = onblur_temp_el;
    focus_el(temp_el);
  } else {
    ogti = el.getAttribute('tabindex');

    if (ogti) {
      el.setAttribute('data-ogti', ogti);
    }

    focus_el(el);
  }
};

exports.access = access;
},{}],"modules/convertTags.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helpers_1 = require("../utils/helpers");

var ConvertTags = function ConvertTags() {
  var nodesToConvert = document.querySelectorAll('[dk-convert-tag]');

  for (var i = 0; i < nodesToConvert.length; i++) {
    var thisItem = nodesToConvert[i];
    var desiredTag = thisItem.getAttribute('dk-convert-tag');

    if (desiredTag !== '#' && desiredTag !== null) {
      thisItem = helpers_1.convertTag(thisItem, desiredTag);
    }

    if (desiredTag === 'button') {
      thisItem.setAttribute('type', 'button');
    }
  }

  Array.from(document.querySelectorAll('.a-playbutton')).concat(Array.from(document.querySelectorAll('.m-athleteheader__videocta'))).forEach(function (buttonToBe) {
    buttonToBe = helpers_1.convertTag(buttonToBe, 'button');
    buttonToBe.setAttribute('type', 'button');
  });
};

exports.default = ConvertTags;
},{"../utils/helpers":"utils/helpers.ts"}],"node_modules/js-cookie/src/js.cookie.js":[function(require,module,exports) {
var define;
/*!
 * JavaScript Cookie v2.2.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function decode (s) {
		return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
	}

	function init (converter) {
		function api() {}

		function set (key, value, attributes) {
			if (typeof document === 'undefined') {
				return;
			}

			attributes = extend({
				path: '/'
			}, api.defaults, attributes);

			if (typeof attributes.expires === 'number') {
				attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
			}

			// We're using "expires" because "max-age" is not supported by IE
			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

			try {
				var result = JSON.stringify(value);
				if (/^[\{\[]/.test(result)) {
					value = result;
				}
			} catch (e) {}

			value = converter.write ?
				converter.write(value, key) :
				encodeURIComponent(String(value))
					.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

			key = encodeURIComponent(String(key))
				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
				.replace(/[\(\)]/g, escape);

			var stringifiedAttributes = '';
			for (var attributeName in attributes) {
				if (!attributes[attributeName]) {
					continue;
				}
				stringifiedAttributes += '; ' + attributeName;
				if (attributes[attributeName] === true) {
					continue;
				}

				// Considers RFC 6265 section 5.2:
				// ...
				// 3.  If the remaining unparsed-attributes contains a %x3B (";")
				//     character:
				// Consume the characters of the unparsed-attributes up to,
				// not including, the first %x3B (";") character.
				// ...
				stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
			}

			return (document.cookie = key + '=' + value + stringifiedAttributes);
		}

		function get (key, json) {
			if (typeof document === 'undefined') {
				return;
			}

			var jar = {};
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all.
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = decode(parts[0]);
					cookie = (converter.read || converter)(cookie, name) ||
						decode(cookie);

					if (json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					jar[name] = cookie;

					if (key === name) {
						break;
					}
				} catch (e) {}
			}

			return key ? jar[key] : jar;
		}

		api.set = set;
		api.get = function (key) {
			return get(key, false /* read as raw */);
		};
		api.getJSON = function (key) {
			return get(key, true /* read as json */);
		};
		api.remove = function (key, attributes) {
			set(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.defaults = {};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

},{}],"modules/dk_dialog.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helpers_1 = require("../utils/helpers");

var TAB_KEY = 'Tab';
var ESCAPE_KEY = 'Escape';
var SPACE_KEY = ' ';
var ENTER_KEY = 'Enter';

var DKDialog =
/** @class */
function () {
  function DKDialog(_a) {
    var _this = this;

    var element = _a.element,
        focusTrapQuery = _a.focusTrapQuery;
    /**
     * Show the dialog element, disable all the targets (siblings), trap the
     * current focus within it, listen for some specific key presses and fire all
     * registered callbacks for `show` event
     */

    this.show = function (event) {
      // If the dialog is already open, abort
      if (_this.shown) {
        return _this;
      } // Keep a reference to the currently focused element to be able to restore
      // it later


      _this._previouslyFocused = document.activeElement;
      _this.shown = true;
      setFocusToFirstItem(_this.$el); // Bind a focus event listener to the body element to make sure the focus
      // stays trapped inside the dialog while open, and start listening for some
      // specific key presses (TAB and ESC)

      document.body.addEventListener('focus', _this._maintainFocus, true);
      document.addEventListener('keydown', _this._bindKeypress); // Execute all callbacks registered for the `show` event

      _this._fire('show', event);

      return _this;
    };
    /**
     * Hide the dialog element, enable all the targets (siblings), restore the
     * focus to the previously active element, stop listening for some specific
     * key presses and fire all registered callbacks for `hide` event
     */


    this.hide = function (event) {
      // If the dialog is already closed, abort
      if (!_this.shown) {
        return _this;
      }

      _this.shown = false; // If there was a focused element before the dialog was opened (and it has a
      // `focus` method), restore the focus back to it
      // See: https://github.com/KittyGiraudel/a11y-dialog/issues/108

      if (_this._previouslyFocused && _this._previouslyFocused.focus) {
        _this._previouslyFocused.focus();
      } // Remove the focus event listener to the body element and stop listening
      // for specific key presses


      document.body.removeEventListener('focus', _this._maintainFocus, true);
      document.removeEventListener('keydown', _this._bindKeypress); // Execute all callbacks registered for the `hide` event

      _this._fire('hide', event);

      return _this;
    };
    /**
     * Event handler used when treating links as buttons
     */


    this.bindButtonKeypress = function (event) {
      if (event.key === SPACE_KEY || event.key === ENTER_KEY) {
        event.preventDefault();

        if (!_this.shown) {
          _this.show(event);
        } else if (_this.shown) {
          _this.hide(event);
        }
      }
    };
    /**
     * Private event handler used when listening to some specific key presses
     * (namely ESCAPE and TAB)
     */


    this._bindKeypress = function (event) {
      // This is an escape hatch in case there are nested dialogs, so the keypresses
      // are only reacted to for the most recent one
      // if (!this.$el.contains(document.activeElement)) {
      //   console.log('whoops')
      //   return
      // }
      // If the dialog is shown and the ESCAPE key is being pressed, prevent any
      // further effects from the ESCAPE key and hide the dialog, unless its role
      // is 'alertdialog', which should be modal
      if (_this.shown && event.key === ESCAPE_KEY && _this.$el.getAttribute('role') !== 'alertdialog') {
        event.preventDefault();

        _this.hide(event);
      } // If the dialog is shown and the TAB key is being pressed, make sure the
      // focus stays trapped within the dialog element


      if (_this.shown && event.key === TAB_KEY) {
        trapTabKey(_this.$el, event);
      }
    };
    /**
     * Private event handler used when making sure the focus stays within the
     * currently open dialog
     */


    this._maintainFocus = function (event) {
      var target = event.target; // If the dialog is shown and the focus is not within a dialog element (either
      // this one or another one in case of nested dialogs) or within an element
      // with the `dk-dialog-focus-trap-ignore` attribute, move it back to
      // its first focusable child.
      // See: https://github.com/KittyGiraudel/a11y-dialog/issues/177

      if (_this.shown && !target.closest(_this._focusTrapQuery) && !target.closest('[dk-dialog-ignore-focus-trap]')) {
        setFocusToFirstItem(_this.$el);
      }
    };

    this.$el = element;
    this.shown = false;
    this._focusTrapQuery = focusTrapQuery;
    this._previouslyFocused = null;
    this._listeners = {};
  }
  /**
   * Set up everything necessary for the dialog to be functioning
   * @return {this}
   */


  DKDialog.prototype.create = function () {
    // Execute all callbacks registered for the `create` event
    this._fire('create', null);

    return this;
  };
  /**
   * Register a new callback for the given event type
   */


  DKDialog.prototype.on = function (type, handler) {
    if (typeof this._listeners[type] === 'undefined') {
      this._listeners[type] = [];
    }

    this._listeners[type].push(handler);

    return this;
  };
  /**
   * Unregister an existing callback for the given event type
   */


  DKDialog.prototype.off = function (type, handler) {
    var index = (this._listeners[type] || []).indexOf(handler);

    if (index > -1) {
      this._listeners[type].splice(index, 1);
    }

    return this;
  };
  /**
   * Iterate over all registered handlers for given type and call them all with
   * the dialog element as first argument, event as second argument (if any).
   */


  DKDialog.prototype._fire = function (type, event) {
    var listeners = this._listeners[type] || [];
    listeners.forEach(function (listener) {
      listener(this.$el, event);
    }.bind(this));
  };

  return DKDialog;
}();
/**
 * Convert a NodeList into an array
 */


function toArray(collection) {
  return Array.from(collection);
}
/**
 * Query the DOM for nodes matching the given selector, scoped to context (or
 * the whole document)
 */


function $$(selector, context) {
  return toArray((context || document).querySelectorAll(selector));
}
/**
 * Set the focus to the first element with `autofocus` or the first focusable
 * child of the given element
 */


function setFocusToFirstItem(node) {
  var focusableChildren = getFocusableChildren(node);
  var focused = node.querySelector('[autofocus]') || focusableChildren[0];

  if (focused instanceof HTMLElement) {
    // timeout added to counteract css visibility transition length
    setTimeout(function () {
      return focused.focus();
    }, 300);
  }
}
/**
 * Get the focusable children of the given element
 */


function getFocusableChildren(node) {
  return $$(helpers_1.focusableSelectors.join(','), node).filter(function (child) {
    return !!(child.offsetWidth || child.offsetHeight || child.getClientRects().length);
  });
}
/**
 * Trap the focus inside the given element
 *
 * @param {Element} node
 * @param {Event} event
 */


function trapTabKey(node, event) {
  var focusableChildren = getFocusableChildren(node);
  var focusedItemIndex = document.activeElement ? focusableChildren.indexOf(document.activeElement) : null; // If the SHIFT key is being pressed while tabbing (moving backwards) and
  // the currently focused item is the first one, move the focus to the last
  // focusable item from the dialog element

  if (event.shiftKey && focusedItemIndex === 0) {
    focusableChildren[focusableChildren.length - 1].focus();
    event.preventDefault(); // If the SHIFT key is not being pressed (moving forwards) and the currently
    // focused item is the last one, move the focus to the first focusable item
    // from the dialog element
  } else if (!event.shiftKey && focusedItemIndex === focusableChildren.length - 1) {
    focusableChildren[0].focus();
    event.preventDefault();
  }
}

exports.default = DKDialog;
},{"../utils/helpers":"utils/helpers.ts"}],"modules/dialog.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var js_cookie_1 = __importDefault(require("js-cookie"));

var dk_dialog_1 = __importDefault(require("./dk_dialog"));

var Dialog =
/** @class */
function () {
  function Dialog(element) {
    var _this = this;

    this.modalConstruction = function () {
      _this.modal = _this.element.hasAttribute('dk-dialog-modal');

      if (_this.modal) {
        _this.modalItself = document.querySelector('[dk-modal-itself]') || null;

        _this.element.setAttribute('aria-modal', 'false'); // document.body.setAttribute('style', 'overflow:hidden; cursor:pointer;')

      } // if (!this.modal) return


      _this.element.setAttribute('aria-hidden', 'true');
    };

    this.checkCookie = function () {
      if (!_this.cookie) return;

      if (js_cookie_1.default.get('CookieConsent')) {
        _this.dkDialog.shown = true;

        _this.dkDialog.hide(null);
      } else {
        _this.dkDialog.shown = false;

        _this.dkDialog.show(null);
      }
    };

    this.ensureRole = function () {
      if (_this.element.hasAttribute('role')) return;

      _this.element.setAttribute('role', 'dialog');
    };

    this.handleNormalOpeners = function () {
      Array.from(document.querySelectorAll("[dk-dialog-show=\"" + _this._id + "\"]")).forEach(function (opener) {
        // console.log(this._id)
        opener.addEventListener('click', _this.dkDialog.show);
      });
    };

    this.handleLinkOpeners = function () {
      Array.from(document.querySelectorAll("a[href=\"#" + _this._id + "\"]")).forEach(function (linkOpener) {
        linkOpener.addEventListener('click', _this._linkShow);
      });
    };

    this.handleClosers = function () {
      Array.from(_this.element.querySelectorAll('[dk-dialog-hide]')).concat(Array.from(document.querySelectorAll("[dk-dialog-hide=\"" + _this._id + "\"]"))).forEach(function (closer) {
        closer.addEventListener('click', _this.dkDialog.hide);

        if (_this.cookie === true) {
          closer.addEventListener('click', function (event) {
            js_cookie_1.default.set('CookieConsent', true, {
              expires: 365 * 40
            });

            _this.dkDialog.hide(event);
          });
        }

        if (closer.getAttribute('role') !== 'button') return;
        closer.addEventListener('keydown', _this.dkDialog.bindButtonKeypress);
      });
    };

    this.handleDialogShow = function () {
      if (_this.modal) {
        _this.element.setAttribute('aria-modal', 'true');

        document.body.setAttribute('style', 'overflow: hidden; cursor: pointer;');
        document.addEventListener('click', _this.closeOnOutsideClick, true);
      }

      _this.element.classList.add('open');

      _this.element.removeAttribute('aria-hidden');
    };

    this.handleDialogHide = function () {
      if (_this.modal) {
        _this.element.setAttribute('aria-modal', 'false');

        document.body.removeAttribute('style');
        document.removeEventListener('click', _this.closeOnOutsideClick, true);
      }

      var videoplayer = document.querySelector(".videoiframe");

      if (videoplayer !== null) {
        videoplayer.removeAttribute('src');
      }

      _this.element.classList.remove('open');

      _this.element.setAttribute('aria-hidden', 'true');
    };

    this._linkShow = function (event) {
      event.stopPropagation();
      console.log('hey');

      _this.dkDialog.show(event);

      return _this;
    };

    this.closeOnOutsideClick = function (event) {
      var isClickInside = event.target instanceof HTMLElement ? _this.modalItself.contains(event.target) : null;

      if (!isClickInside) {
        _this.dkDialog.hide(event);
      }
    };

    this.element = element;
    this.dkDialog = new dk_dialog_1.default({
      element: element,
      focusTrapQuery: '[dk-dialog]'
    });
    this.cookie = this.element.hasAttribute('dk-dialog-cookies'); // this._id = this.element.getAttribute('dk-dialog') || this.element.id

    this._id = this.element.id;
    this.dkDialog.on('create', this.modalConstruction);
    this.dkDialog.on('create', this.checkCookie);
    this.dkDialog.on('create', this.ensureRole);
    this.dkDialog.on('create', this.handleNormalOpeners);
    this.dkDialog.on('create', this.handleLinkOpeners);
    this.dkDialog.on('create', this.handleClosers);
    this.dkDialog.on('show', this.handleDialogShow);
    this.dkDialog.on('hide', this.handleDialogHide);
    this.dkDialog.create();
  }

  return Dialog;
}();

function DialogCreator() {
  Array.from(document.querySelectorAll('[dk-dialog]')).forEach(function (element) {
    new Dialog(element);
  });
}

exports.default = DialogCreator;
},{"js-cookie":"node_modules/js-cookie/src/js.cookie.js","./dk_dialog":"modules/dk_dialog.ts"}],"modules/nav.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var dk_dialog_1 = __importDefault(require("./dk_dialog"));

var helpers_1 = require("../utils/helpers");

var DKNav =
/** @class */
function () {
  function DKNav(element) {
    var _this = this;

    this.toggleCreation = function (_event) {
      var _a, _b, _c;

      helpers_1.convertTag(_this.element.querySelector('[dk-nav-toggle]'), 'button');
      (_a = _this.navToggle) === null || _a === void 0 ? void 0 : _a.setAttribute('type', 'button');
      (_b = _this.navToggle) === null || _b === void 0 ? void 0 : _b.addEventListener('click', _this.toggle);
      (_c = _this.navToggle) === null || _c === void 0 ? void 0 : _c.addEventListener('keyup', _this.dkDialog.bindButtonKeypress);
    };

    this.toggle = function (event) {
      if (_this.shown) {
        _this.hide(event);
      } else {
        _this.show(event);
      }
    };

    this.menuCreation = function (_event) {
      var _a;

      if (_this.mobile) {
        (_a = _this.menu) === null || _a === void 0 ? void 0 : _a.setAttribute('aria-hidden', 'true');
      }

      var timeoutFunctionId;
      window.addEventListener('resize', function (event) {
        clearTimeout(timeoutFunctionId);
        timeoutFunctionId = setTimeout(function () {
          var _a, _b, _c; // if not mobile and shown, hide then remove aria hidden


          if (!_this.mobile && _this.shown) {
            _this.hide(event);

            (_a = _this.menu) === null || _a === void 0 ? void 0 : _a.removeAttribute('aria-hidden');
          } // if not mobile, generally, make sure aria-hidden is gone


          if (!_this.mobile) {
            (_b = _this.menu) === null || _b === void 0 ? void 0 : _b.removeAttribute('aria-hidden');
          } // if mobile and not shown, make sure aria-hidden is true


          if (_this.mobile && !_this.shown) (_c = _this.menu) === null || _c === void 0 ? void 0 : _c.setAttribute('aria-hidden', 'true');
        }, 350);
      });
    };

    this.handleClosers = function () {
      Array.from(document.querySelectorAll('[dk-nav-hide]')).concat(Array.from(document.querySelectorAll("[dk-nav-hide=\"" + _this._id + "\"]"))).forEach(function (closer) {
        closer.setAttribute('aria-label', 'Close menu');
        closer.addEventListener('click', _this.dkDialog.hide); // if (closer.getAttribute('role') !== 'button') return
        // closer.addEventListener('keydown', this.dkDialog.bindButtonKeypress)
      });
    };

    this.handleShow = function (_event) {
      var _a, _b, _c;

      _this.element.classList.add('open');

      (_a = _this.menu) === null || _a === void 0 ? void 0 : _a.removeAttribute('aria-hidden');
      (_b = _this.navToggle) === null || _b === void 0 ? void 0 : _b.setAttribute('aria-expanded', 'true');
      (_c = _this.navToggle) === null || _c === void 0 ? void 0 : _c.setAttribute('aria-label', 'Close menu'); // Array.from(this.element.querySelectorAll('[dk-nav-hide]')).forEach((closer) => {
      // })

      document.body.setAttribute('style', 'overflow: hidden;');
      document.addEventListener('click', _this.closeOnOutsideClick, true);
    };

    this.handleHide = function (_event) {
      var _a, _b, _c;

      _this.element.classList.remove('open');

      (_a = _this.menu) === null || _a === void 0 ? void 0 : _a.setAttribute('aria-hidden', 'true');
      (_b = _this.navToggle) === null || _b === void 0 ? void 0 : _b.setAttribute('aria-expanded', 'false');
      (_c = _this.navToggle) === null || _c === void 0 ? void 0 : _c.setAttribute('aria-label', 'Open menu');
      document.body.removeAttribute('style');
      document.removeEventListener('click', _this.closeOnOutsideClick, true);
    };

    this.closeOnOutsideClick = function (event) {
      var isClickInside = event.target instanceof HTMLElement ? _this.dkDialog.$el.contains(event.target) : null;

      if (!isClickInside) {
        _this.dkDialog.hide(event);
      }
    };

    this.element = element;
    this.dkDialog = new dk_dialog_1.default({
      element: element,
      focusTrapQuery: '[dk-nav]'
    });
    this.menu = element.querySelector("#" + element.getAttribute('dk-nav'));
    this._id = this.element.getAttribute('dk-nav') || this.element.id;
    this.dkDialog.on('create', this.toggleCreation);
    this.dkDialog.on('create', this.menuCreation);
    this.dkDialog.on('create', this.handleClosers);
    this.dkDialog.on('show', this.handleShow);
    this.dkDialog.on('hide', this.handleHide);
    this.dkDialog.create();
  }

  DKNav.prototype.show = function (event) {
    this.dkDialog.show(event);
  };

  DKNav.prototype.hide = function (event) {
    this.dkDialog.hide(event);
  };

  Object.defineProperty(DKNav.prototype, "mobile", {
    get: function get() {
      var _a;

      if (this.element.getAttribute('dk-nav-mobile-always')) return true;
      return !((_a = this.mediaQuery) === null || _a === void 0 ? void 0 : _a.matches);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(DKNav.prototype, "mediaQuery", {
    // TODO: handle navs that should ALWAYS have toggle visible
    get: function get() {
      if (this._mediaQuery) return this._mediaQuery;
      var navBreakpoint = this.element.getAttribute('dk-nav-breakpoint');
      if (navBreakpoint === null) navBreakpoint = '991';
      var navBreakpointForMediaQuery = parseInt(navBreakpoint) + 1;
      this._mediaQuery = window.matchMedia("(min-width: " + navBreakpointForMediaQuery + "px)");
      return this._mediaQuery;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(DKNav.prototype, "shown", {
    get: function get() {
      return this.dkDialog.shown;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(DKNav.prototype, "menu", {
    get: function get() {
      return this._menu;
    },
    set: function set(menu) {
      this._menu = menu;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(DKNav.prototype, "navToggle", {
    get: function get() {
      if (this._navToggle) return this._navToggle;
      this._navToggle = document.querySelector('[dk-nav-toggle]');
      return this._navToggle;
    },
    enumerable: false,
    configurable: true
  });
  return DKNav;
}();

function Nav() {
  Array.from(document.querySelectorAll('[dk-nav]')).forEach(function (element) {
    new DKNav(element);
  });
}

exports.default = Nav;
},{"./dk_dialog":"modules/dk_dialog.ts","../utils/helpers":"utils/helpers.ts"}],"modules/tabs.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helpers_1 = require("../utils/helpers");

var keys = {
  end: 35,
  home: 36,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  delete: 46
};
var direction = {
  37: -1,
  38: -1,
  39: 1,
  40: 1
};

var DKTabs =
/** @class */
function () {
  function DKTabs(element) {
    var _this = this;

    this.create = function () {
      _this.tablist.setAttribute('role', 'tablist');

      _this.tabs.forEach(function (tab, index) {
        if (tab === void 0) {
          tab = {};
        }

        tab.index = index;
        tab.setAttribute('role', 'tab');
        var tabpanelId = tab.getAttribute('dk-tabpanel-id');
        tab.setAttribute('aria-controls', tabpanelId);
        tab.addEventListener('click', _this.clickEventListener);
        tab.addEventListener('keydown', _this.keydownEventListener);
        tab.addEventListener('keyup', _this.keyupEventListener);
        tab.addEventListener('focus', _this.checkTabFocus.bind(_this));

        if (index === 0) {
          _this.activateTab(tab, false);
        }
      });
    };

    this.clickEventListener = function (event) {
      var clickedTab = event.target;

      _this.activateTab(clickedTab, false);
    };

    this.keydownEventListener = function (event) {
      var key = event.keyCode;

      switch (key) {
        case keys.end:
          event.preventDefault();

          _this.activateTab(_this.tabs[_this.tabs.length - 1]);

          break;

        case keys.home:
          event.preventDefault();

          _this.activateTab(_this.tabs[0]);

          break;

        case keys.up:
        case keys.down:
          _this.determineOrientation(event);

          break;
      }
    };

    this.keyupEventListener = function (event) {
      var key = event.keyCode;

      switch (key) {
        case keys.left:
        case keys.right:
          _this.determineOrientation(event);

          break;
      }
    };

    this.determineOrientation = function (event) {
      var key = event.keyCode;
      var vertical = _this.tablist.getAttribute('aria-orientation') === 'vertical';
      var proceed = false;

      if (vertical) {
        if (key === keys.up || key === keys.down) {
          event.preventDefault();
          proceed = true;
        }
      } else {
        if (key === keys.left || key === keys.right) {
          proceed = true;
        }
      }

      if (proceed) {
        _this.switchTabOnArrowPress(event);
      }
    };

    this.switchTabOnArrowPress = function (event) {
      var pressedKey = event.keyCode; // this.tabs.forEach( (tab) => {
      //   tab.addEventListener('focus', this.focusEventHandler)
      // })

      if (direction[pressedKey]) {
        var target = event.target;

        var index = _this.tabs.indexOf(target); // console.log(this.tabs.indexOf(target))


        if (index !== undefined) {
          if (_this.tabs[index + direction[pressedKey]]) {
            _this.tabs[index + direction[pressedKey]].focus();
          } else if (pressedKey === keys.left || pressedKey === keys.up) {
            _this.focusLastTab();
          } else if (pressedKey === keys.right || pressedKey === keys.down) {
            _this.focusFirstTab();
          }
        } // if (target.index !== undefined) {
        //   if (this.tabs[target.index + direction[pressedKey]]) {
        //     this.tabs[target.index + direction[pressedKey]].focus()
        //   }
        //   else if (pressedKey === keys.left || pressedKey === keys.up) {
        //     this.focusLastTab()
        //   }
        //   else if (pressedKey === keys.right || pressedKey === keys.down) {
        //     this.focusFirstTab()
        //   }
        // }
        // this.tabs.forEach( (tab) => {
        //   console.log(tab)
        // })

      }
    };

    this.activateTab = function (tab, setFocus) {
      // setFocus = setFocus || true
      _this.deactivateTabs();

      tab.removeAttribute('tabindex');
      tab.setAttribute('aria-selected', 'true');
      var controls = tab.getAttribute('aria-controls');
      var controlledTabpanel = document.getElementById(controls);

      if (controlledTabpanel !== null) {
        controlledTabpanel.removeAttribute('hidden');
      }

      if (setFocus === true) {
        tab.focus();
      }
    };

    this.deactivateTabs = function () {
      _this.tabs.forEach(function (tab) {
        tab.setAttribute('tabindex', '-1');
        tab.setAttribute('aria-selected', 'false');
        tab.removeEventListener('focus', _this.checkTabFocus);
      });

      _this.panels.forEach(function (panel) {
        panel.setAttribute('hidden', 'hidden');
      });
    };

    this.focusFirstTab = function () {
      _this.tabs[0].focus();
    };

    this.focusLastTab = function () {
      _this.tabs[_this.tabs.length - 1].focus();
    };

    this.element = element;
    var originalTabs = this.element.querySelectorAll('[dk-tabpanel-id]');
    originalTabs.forEach(function (tab) {
      tab = helpers_1.convertTag(tab, 'button');
    });
    this.tabs = Array.from(this.element.querySelectorAll('[dk-tabpanel-id]'));
    this.panels = this.element.querySelectorAll('[dk-tab-id]');
    this.tablist = this.element.querySelector('[dk-tablist]');
    this.create();
  } // focusEventHandler(event: FocusEvent) {
  //   let target = event.target
  //   // setTimeout(this.checkTabFocus, 10, target)
  //   this.checkTabFocus(target)
  //   // DKTabs.activateTab(target)
  // }


  DKTabs.prototype.checkTabFocus = function (event) {
    var _this = this; // checkTabFocus(target: HTMLElement) {


    var focused = document.activeElement;
    var target = event.target; // console.log(focused)
    // this.activateTab(target as HTMLElement, false)
    // this.activateTab(event.target as HTMLElement, false)

    if (target === focused) {
      //   this.activateTab(target as HTMLElement, false)
      //   console.log('activated!')
      // }
      // this.deactivateTabs()
      this.tabs.forEach(function (tab) {
        tab.setAttribute('tabindex', '-1');
        tab.setAttribute('aria-selected', 'false');
        tab.removeEventListener('focus', _this.checkTabFocus);
      });
      this.panels.forEach(function (panel) {
        panel.setAttribute('hidden', 'hidden');
      }); // console.log(tab)

      event.target.removeAttribute('tabindex');
      event.target.setAttribute('aria-selected', 'true');
      var controls = event.target.getAttribute('aria-controls');
      var controlledTabpanel = document.getElementById(controls);

      if (controlledTabpanel !== null) {
        controlledTabpanel.removeAttribute('hidden');
      } // if (setFocus === true) {


      event.target.focus(); // }
    }
  };

  return DKTabs;
}();

var Tabs = function Tabs() {
  document.querySelectorAll('[dk-tabs]').forEach(function (tabgroup) {
    new DKTabs(tabgroup);
  });
};

exports.default = Tabs;
},{"../utils/helpers":"utils/helpers.ts"}],"modules/accordion.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helpers_1 = require("../utils/helpers");

var ENTER_KEY = 'Enter';

var adjustExpanded = function adjustExpanded(element, expanded) {
  element.setAttribute('aria-expanded', expanded);
};

var isExpanded = function isExpanded(element) {
  return element.getAttribute('aria-expanded') === 'true';
};

var initialToggleExpanded = function initialToggleExpanded(toggle) {
  if (toggle.hasAttribute('aria-expanded')) return;
  adjustExpanded(toggle, 'false');
};

var closeAccordion = function closeAccordion(toggle) {
  adjustExpanded(toggle, 'false');
};

var openAccordion = function openAccordion(toggle, group) {
  if (!group) {
    return adjustExpanded(toggle, 'true');
  }

  group.querySelectorAll('[aria-expanded="true"]').forEach(function (openItem) {
    adjustExpanded(openItem, 'false');
  });
  setTimeout(function () {
    adjustExpanded(toggle, 'true');
  }, 375);
};

var addToggleEventListener = function addToggleEventListener(toggle, group) {
  toggle.addEventListener('click', function (_event) {
    isExpanded(toggle) ? closeAccordion(toggle) : openAccordion(toggle, group);
  });
};

var addAccordionEventListener = function addAccordionEventListener(accordion, toggle, group) {
  accordion.addEventListener('keydown', function (event) {
    if (event.key === ENTER_KEY && event.target === toggle) {
      event.preventDefault();
      isExpanded(toggle) ? closeAccordion(toggle) : openAccordion(toggle, group);
    }
  });
};

var Accordion = function Accordion() {
  document.querySelectorAll('[dk-accordion]').forEach(function (accordion) {
    var toggle = helpers_1.convertTag(accordion.children[0], 'button');
    var group = accordion.closest('[dk-accordion-group]');
    initialToggleExpanded(toggle);
    addToggleEventListener(toggle, group);
    addAccordionEventListener(accordion, toggle, group);
  });
};

exports.default = Accordion;
},{"../utils/helpers":"utils/helpers.ts"}],"modules/anchors.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helpers_1 = require("../utils/helpers");

var Anchors = function Anchors() {
  document.querySelectorAll('[href^="#"]:not([href="#"])').forEach(function (anchorLink) {
    anchorLink.addEventListener('click', function () {
      var section = document.querySelector(anchorLink.getAttribute('href'));

      if (section) {
        var sectionHeading = section.querySelector('h1' || 'h2' || 'h3' || 'h4' || 'h5' || 'h6');

        if (sectionHeading) {
          helpers_1.access(sectionHeading, true);
        } else {
          helpers_1.access(section, true);
        }
      }
    });
  });
};

exports.default = Anchors;
},{"../utils/helpers":"utils/helpers.ts"}],"modules/cards.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helpers_1 = require("../utils/helpers");

var DKCard =
/** @class */
function () {
  function DKCard(card) {
    this.card = card; // each card should be a list item

    if (this.card.tagName !== 'LI') {
      console.warn('Cards must be list items');
    } // convert card FRONTS to buttons


    this.cardFront = card.querySelector('[dk-card-front]');

    if (!this.cardFront) {
      console.warn('Missing dk-card-front');
    }

    this.cardFront = helpers_1.convertTag(this.cardFront, 'button');
    this.cardFront.setAttribute('role', 'button');
    this.cardFront.setAttribute('tabindex', '0'); // give cardFront aria-label="Learn more about {card front content}"

    var cardFrontContent = this.cardFront.textContent || '';
    this.cardFront.setAttribute('aria-label', 'Learn more about how we help you ' + cardFrontContent); // cardFront is a button and receives keyboard focus

    this.cardFront.addEventListener('blur', this.blurEventListener.bind(this));
    this.cardFront.addEventListener('focus', this.focusEventListener.bind(this));
    this.card.addEventListener('click', this.clickEventListener.bind(this));
  }

  DKCard.prototype.clickEventListener = function () {
    toggleCardFlip(this.card);
  }; // cardFront is a button and receives keyboard focus
  // but card itself needs to get class of 'focused'
  // so we're passing in this.card instead of this.cardFront


  DKCard.prototype.focusEventListener = function () {
    handleCardFocus(this.card);
  };

  DKCard.prototype.blurEventListener = function () {
    handleCardBlur(this.card);
  };

  return DKCard;
}();

var toggleCardFlip = function toggleCardFlip(card) {
  card.classList.toggle('flipped');
};

var handleCardFocus = function handleCardFocus(element) {
  element.classList.add('focused');
};

var handleCardBlur = function handleCardBlur(element) {
  element.classList.remove('focused');

  if (element.classList.contains('flipped')) {
    element.classList.remove('flipped');
  }
};

var Cards = function Cards() {
  var notMobile = window.matchMedia('(min-width: 768px)');

  if (notMobile.matches) {
    document.querySelectorAll('[dk-card]').forEach(function (card) {
      new DKCard(card);
    });
  }
};

exports.default = Cards;
},{"../utils/helpers":"utils/helpers.ts"}],"modules/dropdowns.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helpers_1 = require("../utils/helpers");

var Dropdowns = function Dropdowns() {
  Array.from(document.querySelectorAll('[dk-dropdown-toggle]')).forEach(function (toggle) {
    var opened = false;
    var mobileOnly = false;

    if (!(toggle.getAttribute('dk-mobile-only') === null)) {
      mobileOnly = true;
      var mobileBreakpoint = toggle.getAttribute('dk-mobile-only');
      if (mobileBreakpoint === '#') mobileBreakpoint = '991';
      var mobileBreakpointForMediaQuery = parseInt(mobileBreakpoint) + 1;
      var mediaQuery_1 = window.matchMedia("(min-width: " + mobileBreakpointForMediaQuery + "px)");

      var isDesktop_1 = function isDesktop_1() {
        return mediaQuery_1.matches;
      };

      if (isDesktop_1) {
        toggle.removeAttribute('aria-expanded');
      } else {
        toggle.setAttribute('aria-expanded', 'false');
      }

      var timeoutFunctionId_1;
      window.addEventListener('resize', function () {
        clearTimeout(timeoutFunctionId_1);
        timeoutFunctionId_1 = setTimeout(function () {
          if (isDesktop_1 && opened) {
            closeDropdown();
            toggle.removeAttribute('aria-expanded');
          }

          if (isDesktop_1) toggle.removeAttribute('aria-expanded');

          if (!isDesktop_1 && opened) {
            toggle.setAttribute('aria-expanded', 'true');
          }
        }, 350);
      });
    }

    var dropdownID = toggle.getAttribute('dk-dropdown-toggle');

    if (!(dropdownID === '#') && !(dropdownID === null)) {
      var dropdown = document.getElementById(dropdownID);
      if (!dropdown) return;
      dropdown.setAttribute('role', 'menu');
      var menuLinks = dropdown.getElementsByTagName('a');
      Array.from(menuLinks).forEach(function (link) {
        link.setAttribute('role', 'menuitem');
      });
    }

    toggle = helpers_1.convertTag(toggle, 'button');
    toggle.setAttribute('type', 'button');
    if (!mobileOnly) toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', function (event) {
      handleToggleClick(event);
    });

    var handleToggleClick = function handleToggleClick(event) {
      event.preventDefault();

      if (!opened) {
        openDropdown();
      } else {
        closeDropdown();
      }
    };

    var openDropdown = function openDropdown() {
      var _a;

      toggle.setAttribute('aria-expanded', 'true');
      (_a = toggle.parentElement) === null || _a === void 0 ? void 0 : _a.classList.add('open');
      opened = true;
    };

    var closeDropdown = function closeDropdown() {
      var _a;

      toggle.setAttribute('aria-expanded', 'false');
      (_a = toggle.parentElement) === null || _a === void 0 ? void 0 : _a.classList.remove('open');
      opened = false;
    };
  });
};

exports.default = Dropdowns;
},{"../utils/helpers":"utils/helpers.ts"}],"app.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _convertTags = _interopRequireDefault(require("./modules/convertTags.ts"));

var _dialog = _interopRequireDefault(require("./modules/dialog.ts"));

var _nav = _interopRequireDefault(require("./modules/nav.ts"));

var _tabs = _interopRequireDefault(require("./modules/tabs.ts"));

var _accordion = _interopRequireDefault(require("./modules/accordion.ts"));

var _anchors = _interopRequireDefault(require("./modules/anchors.ts"));

var _cards = _interopRequireDefault(require("./modules/cards.ts"));

var _dropdowns = _interopRequireDefault(require("./modules/dropdowns.ts"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = function App() {
  (0, _convertTags.default)();
  (0, _dialog.default)();
  (0, _nav.default)();
  (0, _tabs.default)();
  (0, _accordion.default)();
  (0, _anchors.default)();
  (0, _cards.default)();
  (0, _dropdowns.default)();
};

var _default = App;
exports.default = _default;
},{"./modules/convertTags.ts":"modules/convertTags.ts","./modules/dialog.ts":"modules/dialog.ts","./modules/nav.ts":"modules/nav.ts","./modules/tabs.ts":"modules/tabs.ts","./modules/accordion.ts":"modules/accordion.ts","./modules/anchors.ts":"modules/anchors.ts","./modules/cards.ts":"modules/cards.ts","./modules/dropdowns.ts":"modules/dropdowns.ts"}],"index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _app = _interopRequireDefault(require("./app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LOCAL_API_URL = 'http://localhost:1234';
var isStaging = window.location.host.match(/webflow.io/);

if (isStaging && !window.__DK__) {
  $.getScript("".concat(LOCAL_API_URL, "/index.js")).done(function () {
    "development" === 'production' || console.log('🙊 DK Lite Started');
    window.__DK__ = true;
  }).fail(_app.default);
} else {
  (0, _app.default)();
}

var _default = null;
exports.default = _default;
},{"./app":"app.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59977" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/index.js.map