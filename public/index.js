(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // node_modules/js-cookie/src/js.cookie.js
  var require_js_cookie = __commonJS({
    "node_modules/js-cookie/src/js.cookie.js"(exports, module) {
      (function(factory) {
        var registeredInModuleLoader;
        if (typeof define === "function" && define.amd) {
          define(factory);
          registeredInModuleLoader = true;
        }
        if (typeof exports === "object") {
          module.exports = factory();
          registeredInModuleLoader = true;
        }
        if (!registeredInModuleLoader) {
          var OldCookies = window.Cookies;
          var api = window.Cookies = factory();
          api.noConflict = function() {
            window.Cookies = OldCookies;
            return api;
          };
        }
      })(function() {
        function extend() {
          var i = 0;
          var result = {};
          for (; i < arguments.length; i++) {
            var attributes = arguments[i];
            for (var key in attributes) {
              result[key] = attributes[key];
            }
          }
          return result;
        }
        function decode(s) {
          return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
        }
        function init(converter) {
          function api() {
          }
          function set(key, value, attributes) {
            if (typeof document === "undefined") {
              return;
            }
            attributes = extend({
              path: "/"
            }, api.defaults, attributes);
            if (typeof attributes.expires === "number") {
              attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e5);
            }
            attributes.expires = attributes.expires ? attributes.expires.toUTCString() : "";
            try {
              var result = JSON.stringify(value);
              if (/^[\{\[]/.test(result)) {
                value = result;
              }
            } catch (e) {
            }
            value = converter.write ? converter.write(value, key) : encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
            key = encodeURIComponent(String(key)).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/[\(\)]/g, escape);
            var stringifiedAttributes = "";
            for (var attributeName in attributes) {
              if (!attributes[attributeName]) {
                continue;
              }
              stringifiedAttributes += "; " + attributeName;
              if (attributes[attributeName] === true) {
                continue;
              }
              stringifiedAttributes += "=" + attributes[attributeName].split(";")[0];
            }
            return document.cookie = key + "=" + value + stringifiedAttributes;
          }
          function get(key, json) {
            if (typeof document === "undefined") {
              return;
            }
            var jar = {};
            var cookies = document.cookie ? document.cookie.split("; ") : [];
            var i = 0;
            for (; i < cookies.length; i++) {
              var parts = cookies[i].split("=");
              var cookie = parts.slice(1).join("=");
              if (!json && cookie.charAt(0) === '"') {
                cookie = cookie.slice(1, -1);
              }
              try {
                var name = decode(parts[0]);
                cookie = (converter.read || converter)(cookie, name) || decode(cookie);
                if (json) {
                  try {
                    cookie = JSON.parse(cookie);
                  } catch (e) {
                  }
                }
                jar[name] = cookie;
                if (key === name) {
                  break;
                }
              } catch (e) {
              }
            }
            return key ? jar[key] : jar;
          }
          api.set = set;
          api.get = function(key) {
            return get(key, false);
          };
          api.getJSON = function(key) {
            return get(key, true);
          };
          api.remove = function(key, attributes) {
            set(key, "", extend(attributes, {
              expires: -1
            }));
          };
          api.defaults = {};
          api.withConverter = init;
          return api;
        }
        return init(function() {
        });
      });
    }
  });

  // utils/helpers.ts
  var focusableSelectors = [
    'a[href]:not([tabindex^="-"])',
    'area[href]:not([tabindex^="-"])',
    'input:not([type="hidden"]):not([type="radio"]):not([disabled]):not([tabindex^="-"])',
    'input[type="radio"]:not([disabled]):not([tabindex^="-"]):checked',
    'select:not([disabled]):not([tabindex^="-"])',
    'textarea:not([disabled]):not([tabindex^="-"])',
    'button:not([disabled]):not([tabindex^="-"])',
    'iframe:not([tabindex^="-"])',
    'audio[controls]:not([tabindex^="-"])',
    'video[controls]:not([tabindex^="-"])',
    '[contenteditable]:not([tabindex^="-"])',
    '[tabindex]:not([tabindex^="-"])'
  ];
  var convertTag = (el, tag) => {
    const newElement = document.createElement(tag);
    newElement.innerHTML = el.innerHTML;
    Array.from(el.attributes).forEach((attr) => {
      newElement.setAttribute(attr.name, attr.value);
    });
    el.parentNode?.replaceChild(newElement, el);
    return newElement;
  };
  var access = (el, placeFocusBefore) => {
    let focusMethod, ogti, tempEl;
    const onblurEl = function(e) {
      if (el.getAttribute("data-ogti")) {
        el.setAttribute("tabindex", ogti);
      } else {
        el.removeAttribute("tabindex");
      }
      el.removeAttribute("data-ogti");
      el.removeEventListener("focusout", focusMethod);
    };
    const onblurTempEl = function(e) {
      tempEl.removeEventListener("focusout", focusMethod);
      tempEl.parentNode.removeChild(tempEl);
    };
    const focusEl = function(theEl) {
      theEl.setAttribute("tabindex", "-1");
      theEl.addEventListener("focusout", focusMethod);
      theEl.focus();
    };
    focusMethod = onblurEl;
    if (placeFocusBefore) {
      tempEl = document.createElement("span");
      if (typeof placeFocusBefore === "string") {
        tempEl.innerHTML = placeFocusBefore;
      }
      tempEl.setAttribute("style", "position: absolute;height: 1px;width: 1px;margin: -1px;padding: 0;overflow: hidden;clip: rect(0 0 0 0);border: 0;");
      tempEl = el.parentNode.insertBefore(tempEl, el);
      focusMethod = onblurTempEl;
      focusEl(tempEl);
    } else {
      ogti = el.getAttribute("tabindex");
      if (ogti) {
        el.setAttribute("data-ogti", ogti);
      }
      focusEl(el);
    }
  };

  // modules/convertTags.ts
  var ConvertTags = () => {
    Array.from(document.querySelectorAll("[dk-convert-tag]")).forEach((node) => {
      let desiredTag = node.getAttribute("dk-convert-tag");
      if (desiredTag !== "#" && desiredTag !== null) {
        node = convertTag(node, desiredTag);
      } else {
        console.warn("Please specify desired tag");
      }
      if (desiredTag === "button") {
        node.setAttribute("type", "button");
      }
    });
  };
  var convertTags_default = ConvertTags;

  // modules/dialog.ts
  var import_js_cookie = __toModule(require_js_cookie());

  // modules/dk_dialog.ts
  var TAB_KEY = "Tab";
  var ESCAPE_KEY = "Escape";
  var SPACE_KEY = " ";
  var ENTER_KEY = "Enter";
  var DKDialog = class {
    constructor({ element, focusTrapQuery }) {
      this.show = (event) => {
        if (this.shown) {
          return this;
        }
        this._previouslyFocused = document.activeElement;
        this.shown = true;
        setFocusToFirstItem(this.$el);
        document.body.addEventListener("focus", this._maintainFocus, true);
        document.addEventListener("keydown", this._bindKeypress);
        this._fire("show", event);
        return this;
      };
      this.hide = (event) => {
        if (!this.shown) {
          return this;
        }
        this.shown = false;
        if (this._previouslyFocused && this._previouslyFocused.focus) {
          this._previouslyFocused.focus();
        }
        document.body.removeEventListener("focus", this._maintainFocus, true);
        document.removeEventListener("keydown", this._bindKeypress);
        this._fire("hide", event);
        return this;
      };
      this.bindButtonKeypress = (event) => {
        if (event.key === SPACE_KEY || event.key === ENTER_KEY) {
          event.preventDefault();
          if (!this.shown) {
            this.show(event);
          } else if (this.shown) {
            this.hide(event);
          }
        }
      };
      this._bindKeypress = (event) => {
        if (this.shown && event.key === ESCAPE_KEY && this.$el.getAttribute("role") !== "alertdialog") {
          event.preventDefault();
          this.hide(event);
        }
        if (this.shown && event.key === TAB_KEY) {
          trapTabKey(this.$el, event);
        }
      };
      this._maintainFocus = (event) => {
        const target = event.target;
        if (this.shown && !target.closest(this._focusTrapQuery) && !target.closest("[dk-dialog-ignore-focus-trap]")) {
          setFocusToFirstItem(this.$el);
        }
      };
      this.$el = element;
      this.shown = false;
      this._focusTrapQuery = focusTrapQuery;
      this._previouslyFocused = null;
      this._listeners = {};
    }
    create() {
      this._fire("create", null);
      return this;
    }
    on(type, handler) {
      if (typeof this._listeners[type] === "undefined") {
        this._listeners[type] = [];
      }
      this._listeners[type].push(handler);
      return this;
    }
    off(type, handler) {
      var index = (this._listeners[type] || []).indexOf(handler);
      if (index > -1) {
        this._listeners[type].splice(index, 1);
      }
      return this;
    }
    _fire(type, event) {
      var listeners = this._listeners[type] || [];
      listeners.forEach(function(listener) {
        listener(this.$el, event);
      }.bind(this));
    }
  };
  function toArray(collection) {
    return Array.from(collection);
  }
  function $$(selector, context) {
    return toArray((context || document).querySelectorAll(selector));
  }
  function setFocusToFirstItem(node) {
    var focusableChildren = getFocusableChildren(node);
    var focused = node.querySelector("[autofocus]") || focusableChildren[0];
    if (focused instanceof HTMLElement) {
      setTimeout(() => focused.focus(), 300);
    }
  }
  function getFocusableChildren(node) {
    return $$(focusableSelectors.join(","), node).filter(function(child) {
      return !!(child.offsetWidth || child.offsetHeight || child.getClientRects().length);
    });
  }
  function trapTabKey(node, event) {
    const focusableChildren = getFocusableChildren(node);
    let focusedItemIndex = document.activeElement ? focusableChildren.indexOf(document.activeElement) : null;
    if (event.shiftKey && focusedItemIndex === 0) {
      focusableChildren[focusableChildren.length - 1].focus();
      event.preventDefault();
    } else if (!event.shiftKey && focusedItemIndex === focusableChildren.length - 1) {
      focusableChildren[0].focus();
      event.preventDefault();
    }
  }
  var dk_dialog_default = DKDialog;

  // modules/dialog.ts
  var Dialog = class {
    constructor(element) {
      this.modalConstruction = () => {
        this.modal = this.element.hasAttribute("dk-dialog-modal");
        if (this.modal) {
          this.modalItself = document.querySelector("[dk-modal-itself]") || null;
          this.element.setAttribute("aria-modal", "false");
        }
        this.element.setAttribute("aria-hidden", "true");
      };
      this.checkCookie = () => {
        if (!this.cookie)
          return;
        if (import_js_cookie.default.get("CookieConsent")) {
          this.dkDialog.shown = true;
          this.dkDialog.hide(null);
        } else {
          this.dkDialog.shown = false;
          this.dkDialog.show(null);
        }
      };
      this.ensureRole = () => {
        if (this.element.hasAttribute("role"))
          return;
        this.element.setAttribute("role", "dialog");
      };
      this.handleNormalOpeners = () => {
        Array.from(document.querySelectorAll(`[dk-dialog-show="${this._id}"]`)).forEach((opener) => {
          opener.addEventListener("click", this.dkDialog.show);
        });
      };
      this.handleLinkOpeners = () => {
        Array.from(document.querySelectorAll(`a[href="#${this._id}"]`)).forEach((linkOpener) => {
          linkOpener.addEventListener("click", this._linkShow);
        });
      };
      this.handleClosers = () => {
        Array.from(this.element.querySelectorAll("[dk-dialog-hide]")).concat(Array.from(document.querySelectorAll(`[dk-dialog-hide="${this._id}"]`))).forEach((closer) => {
          closer.addEventListener("click", this.dkDialog.hide);
          if (this.cookie === true) {
            closer.addEventListener("click", (event) => {
              import_js_cookie.default.set("CookieConsent", true, {
                expires: 365 * 40
              });
              this.dkDialog.hide(event);
            });
          }
        });
      };
      this.handleDialogShow = () => {
        if (this.modal) {
          this.element.setAttribute("aria-modal", "true");
          document.body.setAttribute("style", "overflow: hidden; cursor: pointer;");
          document.addEventListener("click", this.closeOnOutsideClick, true);
        }
        this.element.classList.add("open");
        this.element.removeAttribute("aria-hidden");
      };
      this.handleDialogHide = () => {
        if (this.modal) {
          this.element.setAttribute("aria-modal", "false");
          document.body.removeAttribute("style");
          document.removeEventListener("click", this.closeOnOutsideClick, true);
        }
        this.element.classList.remove("open");
        this.element.setAttribute("aria-hidden", "true");
      };
      this._linkShow = (event) => {
        event.stopPropagation();
        this.dkDialog.show(event);
        return this;
      };
      this.closeOnOutsideClick = (event) => {
        let isClickInside = event.target instanceof HTMLElement ? this.modalItself.contains(event.target) : null;
        if (!isClickInside) {
          this.dkDialog.hide(event);
        }
      };
      this.element = element;
      this.dkDialog = new dk_dialog_default({
        element,
        focusTrapQuery: "[dk-dialog]"
      });
      this.cookie = this.element.hasAttribute("dk-dialog-cookies");
      this._id = this.element.id;
      this.dkDialog.on("create", this.modalConstruction);
      this.dkDialog.on("create", this.checkCookie);
      this.dkDialog.on("create", this.ensureRole);
      this.dkDialog.on("create", this.handleNormalOpeners);
      this.dkDialog.on("create", this.handleLinkOpeners);
      this.dkDialog.on("create", this.handleClosers);
      this.dkDialog.on("show", this.handleDialogShow);
      this.dkDialog.on("hide", this.handleDialogHide);
      this.dkDialog.create();
    }
  };
  function DialogCreator() {
    Array.from(document.querySelectorAll("[dk-dialog]")).forEach((element) => {
      new Dialog(element);
    });
  }
  var dialog_default = DialogCreator;

  // modules/nav.ts
  var DKNav = class {
    constructor(element) {
      this.toggleCreation = (_event) => {
        convertTag(this.element.querySelector("[dk-nav-toggle]"), "button");
        this.navToggle?.setAttribute("type", "button");
        this.navToggle?.addEventListener("click", this.toggle);
      };
      this.toggle = (event) => {
        if (this.shown) {
          this.hide(event);
        } else {
          this.show(event);
        }
      };
      this.menuCreation = (_event) => {
        if (this.mobile) {
          this.menu?.setAttribute("aria-hidden", "true");
        }
        let timeoutFunctionId;
        window.addEventListener("resize", (event) => {
          clearTimeout(timeoutFunctionId);
          timeoutFunctionId = setTimeout(() => {
            if (!this.mobile && this.shown) {
              this.hide(event);
              this.menu?.removeAttribute("aria-hidden");
            }
            if (!this.mobile) {
              this.menu?.removeAttribute("aria-hidden");
            }
            if (this.mobile && !this.shown)
              this.menu?.setAttribute("aria-hidden", "true");
          }, 350);
        });
      };
      this.handleClosers = () => {
        Array.from(document.querySelectorAll("[dk-nav-hide]")).concat(Array.from(document.querySelectorAll(`[dk-nav-hide="${this._id}"]`))).forEach((closer) => {
          closer.setAttribute("aria-label", "Close menu");
          closer.addEventListener("click", this.dkDialog.hide);
        });
      };
      this.handleShow = (_event) => {
        this.element.classList.add("open");
        this.menu?.removeAttribute("aria-hidden");
        this.navToggle?.setAttribute("aria-expanded", "true");
        this.navToggle?.setAttribute("aria-label", "Close menu");
        document.body.setAttribute("style", "overflow: hidden;");
        document.addEventListener("click", this.closeOnOutsideClick, true);
      };
      this.handleHide = (_event) => {
        this.element.classList.remove("open");
        this.menu?.setAttribute("aria-hidden", "true");
        this.navToggle?.setAttribute("aria-expanded", "false");
        this.navToggle?.setAttribute("aria-label", "Open menu");
        document.body.removeAttribute("style");
        document.removeEventListener("click", this.closeOnOutsideClick, true);
      };
      this.closeOnOutsideClick = (event) => {
        let isClickInside = event.target instanceof HTMLElement ? this.dkDialog.$el.contains(event.target) : null;
        if (!isClickInside) {
          this.dkDialog.hide(event);
        }
      };
      this.element = element;
      this.dkDialog = new dk_dialog_default({
        element,
        focusTrapQuery: "[dk-nav]"
      });
      this.menu = element.querySelector(`#${element.getAttribute("dk-nav")}`);
      this._id = this.element.getAttribute("dk-nav") || this.element.id;
      this.dkDialog.on("create", this.toggleCreation);
      this.dkDialog.on("create", this.menuCreation);
      this.dkDialog.on("create", this.handleClosers);
      this.dkDialog.on("show", this.handleShow);
      this.dkDialog.on("hide", this.handleHide);
      this.dkDialog.create();
    }
    show(event) {
      this.dkDialog.show(event);
    }
    hide(event) {
      this.dkDialog.hide(event);
    }
    get mobile() {
      if (this.element.hasAttribute("dk-nav-mobile-always"))
        return true;
      return !this.mediaQuery?.matches;
    }
    get mediaQuery() {
      if (this._mediaQuery)
        return this._mediaQuery;
      let navBreakpoint = this.element.getAttribute("dk-nav-breakpoint");
      if (navBreakpoint === null)
        navBreakpoint = "991";
      const navBreakpointForMediaQuery = parseInt(navBreakpoint) + 1;
      this._mediaQuery = window.matchMedia(`(min-width: ${navBreakpointForMediaQuery}px)`);
      return this._mediaQuery;
    }
    get shown() {
      return this.dkDialog.shown;
    }
    get menu() {
      return this._menu;
    }
    set menu(menu) {
      this._menu = menu;
    }
    get navToggle() {
      if (this._navToggle)
        return this._navToggle;
      this._navToggle = this.element.querySelector("[dk-nav-toggle]");
      return this._navToggle;
    }
  };
  function Nav() {
    Array.from(document.querySelectorAll("[dk-nav]")).forEach((element) => {
      new DKNav(element);
    });
  }
  var nav_default = Nav;

  // modules/tabs.ts
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
  var DKTabs = class {
    constructor(element) {
      this.create = () => {
        this.tablist.setAttribute("role", "tablist");
        this.tabs.forEach((tab = {}, index) => {
          tab.index = index;
          tab.setAttribute("role", "tab");
          let tabpanelId = tab.getAttribute("dk-tabpanel-id");
          tab.setAttribute("aria-controls", tabpanelId);
          tab.addEventListener("click", this.clickEventListener);
          tab.addEventListener("keydown", this.keydownEventListener);
          tab.addEventListener("keyup", this.keyupEventListener);
          tab.addEventListener("focus", this.checkTabFocus.bind(this), true);
          if (index === 0) {
            this.activateTab(tab, false);
          }
        });
      };
      this.clickEventListener = (event) => {
        let clickedElement = event.target;
        this.tabs.forEach((tab) => {
          if (tab.contains(clickedElement)) {
            this.activateTab(tab);
          }
        });
      };
      this.keydownEventListener = (event) => {
        let key = event.keyCode;
        switch (key) {
          case keys.end:
            event.preventDefault();
            this.activateTab(this.tabs[this.tabs.length - 1]);
            break;
          case keys.home:
            event.preventDefault();
            this.activateTab(this.tabs[0]);
            break;
          case keys.up:
          case keys.down:
            this.determineOrientation(event);
            break;
        }
      };
      this.keyupEventListener = (event) => {
        let key = event.keyCode;
        switch (key) {
          case keys.left:
          case keys.right:
            this.determineOrientation(event);
            break;
        }
      };
      this.determineOrientation = (event) => {
        let key = event.keyCode;
        let vertical = this.tablist.getAttribute("aria-orientation") === "vertical";
        let proceed = false;
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
          this.switchTabOnArrowPress(event);
        }
      };
      this.switchTabOnArrowPress = (event) => {
        const pressedKey = event.keyCode;
        if (direction[pressedKey]) {
          let target = event.target;
          let index = this.tabs.indexOf(target);
          if (index !== void 0) {
            if (this.tabs[index + direction[pressedKey]]) {
              this.tabs[index + direction[pressedKey]].focus();
            } else if (pressedKey === keys.left || pressedKey === keys.up) {
              this.focusLastTab();
            } else if (pressedKey === keys.right || pressedKey === keys.down) {
              this.focusFirstTab();
            }
          }
        }
      };
      this.activateTab = (tab, setFocus) => {
        this.deactivateTabs();
        tab.removeAttribute("tabindex");
        tab.setAttribute("aria-selected", "true");
        let controls = tab.getAttribute("aria-controls");
        let controlledTabpanel = document.getElementById(controls);
        if (controlledTabpanel !== null) {
          controlledTabpanel.removeAttribute("hidden");
        }
        if (setFocus === true) {
          tab.focus();
        }
      };
      this.deactivateTabs = () => {
        this.tabs.forEach((tab) => {
          tab.setAttribute("tabindex", "-1");
          tab.setAttribute("aria-selected", "false");
          tab.removeEventListener("focus", this.checkTabFocus);
        });
        this.panels.forEach((panel) => {
          panel.setAttribute("hidden", "hidden");
        });
      };
      this.focusFirstTab = () => {
        this.tabs[0].focus();
      };
      this.focusLastTab = () => {
        this.tabs[this.tabs.length - 1].focus();
      };
      this.element = element;
      const originalTabs = this.element.querySelectorAll("[dk-tabpanel-id]");
      originalTabs.forEach((tab) => {
        tab = convertTag(tab, "button");
      });
      this.tabs = Array.from(this.element.querySelectorAll("[dk-tabpanel-id]"));
      this.panels = this.element.querySelectorAll("[dk-tab-id]");
      this.tablist = this.element.querySelector("[dk-tablist]");
      this.create();
    }
    checkTabFocus(event) {
      const focused = document.activeElement;
      let tgt = event.target;
      if (tgt === focused) {
        this.tabs.forEach((tab) => {
          tab.setAttribute("tabindex", "-1");
          tab.setAttribute("aria-selected", "false");
          tab.removeEventListener("focus", this.checkTabFocus);
        });
        this.panels.forEach((panel) => {
          panel.setAttribute("hidden", "hidden");
        });
        tgt.removeAttribute("tabindex");
        tgt.setAttribute("aria-selected", "true");
        let controls = tgt.getAttribute("aria-controls");
        let controlledTabpanel = document.getElementById(controls);
        if (controlledTabpanel !== null) {
          controlledTabpanel.removeAttribute("hidden");
        }
        tgt.focus();
      }
    }
  };
  var Tabs = () => {
    Array.from(document.querySelectorAll("[dk-tabs]")).forEach((tabgroup) => {
      new DKTabs(tabgroup);
    });
  };
  var tabs_default = Tabs;

  // modules/accordion.ts
  var ENTER_KEY2 = "Enter";
  var adjustExpanded = function(element, expanded) {
    element.setAttribute("aria-expanded", expanded);
  };
  var isExpanded = function(element) {
    return element.getAttribute("aria-expanded") === "true";
  };
  var initialToggleExpanded = function(toggle) {
    if (toggle.hasAttribute("aria-expanded"))
      return;
    adjustExpanded(toggle, "false");
  };
  var closeAccordion = function(toggle) {
    adjustExpanded(toggle, "false");
  };
  var openAccordion = function(toggle, group) {
    if (!group) {
      return adjustExpanded(toggle, "true");
    }
    group.querySelectorAll('[aria-expanded="true"]').forEach((openItem) => {
      adjustExpanded(openItem, "false");
    });
    setTimeout(() => {
      adjustExpanded(toggle, "true");
    }, 375);
  };
  var addToggleEventListener = function(toggle, group) {
    toggle.addEventListener("click", function(_event) {
      isExpanded(toggle) ? closeAccordion(toggle) : openAccordion(toggle, group);
    });
  };
  var addAccordionEventListener = function(accordion, toggle, group) {
    accordion.addEventListener("keydown", function(event) {
      if (event.key === ENTER_KEY2 && event.target === toggle) {
        event.preventDefault();
        isExpanded(toggle) ? closeAccordion(toggle) : openAccordion(toggle, group);
      }
    });
  };
  var Accordion = () => {
    Array.from(document.querySelectorAll("[dk-accordion]")).forEach((accordion) => {
      const toggle = convertTag(accordion.children[0], "button");
      const group = accordion.closest("[dk-accordion-group]");
      initialToggleExpanded(toggle);
      addToggleEventListener(toggle, group);
      addAccordionEventListener(accordion, toggle, group);
    });
  };
  var accordion_default = Accordion;

  // modules/anchors.ts
  var Anchors = () => {
    Array.from(document.querySelectorAll('[href^="#"]:not([href="#"])')).forEach((anchorLink) => {
      anchorLink.addEventListener("click", function() {
        const section = document.querySelector(anchorLink.getAttribute("href"));
        if (section) {
          const sectionHeading = section.querySelector("h1");
          if (sectionHeading) {
            access(sectionHeading, true);
          } else {
            access(section, true);
          }
        }
      });
    });
  };
  var anchors_default = Anchors;

  // modules/cards.ts
  var DKCard = class {
    constructor(card) {
      this.card = card;
      if (this.card.tagName !== "LI") {
        console.warn("Cards should be list items");
      }
      this.cardFront = card.querySelector("[dk-card-front]");
      if (!this.cardFront) {
        console.warn("Missing dk-card-front");
      }
      this.cardFront = convertTag(this.cardFront, "button");
      this.cardFront.setAttribute("type", "button");
      this.cardFront.setAttribute("tabindex", "0");
      let cardFrontContent = this.cardFront.textContent || "";
      this.cardFront.setAttribute("aria-label", "Learn more about " + cardFrontContent);
      this.cardFront.addEventListener("blur", this.blurEventListener.bind(this));
      this.cardFront.addEventListener("focus", this.focusEventListener.bind(this));
      this.card.addEventListener("click", this.clickEventListener.bind(this));
    }
    clickEventListener() {
      toggleCardFlip(this.card);
    }
    focusEventListener() {
      handleCardFocus(this.card);
    }
    blurEventListener() {
      handleCardBlur(this.card);
    }
  };
  var toggleCardFlip = (card) => {
    card.classList.toggle("flipped");
  };
  var handleCardFocus = (element) => {
    element.classList.add("focused");
  };
  var handleCardBlur = (element) => {
    element.classList.remove("focused");
    if (element.classList.contains("flipped")) {
      element.classList.remove("flipped");
    }
  };
  var Cards = () => {
    Array.from(document.querySelectorAll("[dk-card]")).forEach((card) => {
      new DKCard(card);
    });
  };
  var cards_default = Cards;

  // modules/dropdowns.ts
  var Dropdowns = () => {
    Array.from(document.querySelectorAll("[dk-dropdown-toggle]")).forEach((toggle) => {
      let opened = false;
      let mobileOnly = false;
      if (!(toggle.getAttribute("dk-mobile-only") === null)) {
        mobileOnly = true;
        let mobileBreakpoint = toggle.getAttribute("dk-mobile-only");
        if (mobileBreakpoint === "#")
          mobileBreakpoint = "991";
        const mobileBreakpointForMediaQuery = parseInt(mobileBreakpoint) + 1;
        const mediaQuery = window.matchMedia(`(min-width: ${mobileBreakpointForMediaQuery}px)`);
        const isDesktop = () => {
          return mediaQuery.matches;
        };
        if (isDesktop) {
          toggle.removeAttribute("aria-expanded");
        } else {
          toggle.setAttribute("aria-expanded", "false");
        }
        let timeoutFunctionId;
        window.addEventListener("resize", () => {
          clearTimeout(timeoutFunctionId);
          timeoutFunctionId = setTimeout(() => {
            if (isDesktop && opened) {
              closeDropdown();
              toggle.removeAttribute("aria-expanded");
            }
            if (isDesktop)
              toggle.removeAttribute("aria-expanded");
            if (!isDesktop && opened) {
              toggle.setAttribute("aria-expanded", "true");
            }
          }, 350);
        });
      }
      let dropdownID = toggle.getAttribute("dk-dropdown-toggle");
      if (!(dropdownID === "#") && !(dropdownID === null)) {
        let dropdown = document.getElementById(dropdownID);
        if (!dropdown)
          return;
        dropdown.setAttribute("role", "menu");
        let menuLinks = dropdown.getElementsByTagName("a");
        Array.from(menuLinks).forEach((link) => {
          link.setAttribute("role", "menuitem");
        });
      }
      toggle = convertTag(toggle, "button");
      toggle.setAttribute("type", "button");
      if (!mobileOnly)
        toggle.setAttribute("aria-expanded", "false");
      toggle.addEventListener("click", (event) => {
        handleToggleClick(event);
      });
      const handleToggleClick = (event) => {
        event.preventDefault();
        if (!opened) {
          openDropdown();
        } else {
          closeDropdown();
        }
      };
      const openDropdown = () => {
        toggle.setAttribute("aria-expanded", "true");
        toggle.parentElement?.classList.add("open");
        opened = true;
      };
      const closeDropdown = () => {
        toggle.setAttribute("aria-expanded", "false");
        toggle.parentElement?.classList.remove("open");
        opened = false;
      };
    });
  };
  var dropdowns_default = Dropdowns;

  // modules/audioPlayer.ts
  var AudioPlayer = () => {
  };
  var audioPlayer_default = AudioPlayer;

  // app.js
  var App = () => {
    convertTags_default();
    dialog_default();
    nav_default();
    tabs_default();
    accordion_default();
    anchors_default();
    cards_default();
    dropdowns_default();
    audioPlayer_default();
  };
  var app_default = App;

  // index.js
  var isStaging = window.location.host.match(/webflow.io/);
  if (isStaging && !window.__DK__) {
    const script = document.createElement("script");
    script.src = "http://localhost:1234/index.js";
    document.body.appendChild(script);
    window.__DK__ = true;
    script.onload = () => {
      console.log("\u{1F64A} DK Lite Started");
      document.getElementById("dk-script").remove();
    };
    script.onerror = app_default();
  } else {
    app_default();
  }
  var sumn_dk_lite_default = null;
})();
/*!
 * JavaScript Cookie v2.2.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
