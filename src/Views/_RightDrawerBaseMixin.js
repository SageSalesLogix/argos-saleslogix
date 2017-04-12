import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';

// Base Mixin for the right drawer/menu. This is responsible for creating the toggle button on the toolbar and managing the state of the right menu (loaded/unloaded).
//
// Lifecycles:
// -- Loading of the right menu --
// 1. Toggle button clicked
// 2. setupRightDrawer
// 3. loadRightDrawer
//
// -- Unloading of the right menu --
// 1. onBeforeTransitionAway
// 2. unloadRightDrawer
/**
 * @class crm.Views._RightDrawerBaseMixin
 *
 * The base mixin for the right drawer.
 *
 * @since 3.0
 *
 */
const __class = declare('crm.Views._RightDrawerBaseMixin', null, {
  drawerLoaded: false,
  /**
   * @property {Boolean}
   * Add a flag so the view can opt-out of the right drawer if the mixin is used (_related views)
   */
  // disableRightDrawer: false,
  toolsAdded: false,

  setupRightDrawer: function setupRightDrawer() {},
  loadRightDrawer: function loadRightDrawer() {
    // TODO: onTransitionAway is not called for "my schedule" nor is it called once local storage has group settings after first load
    // This avoid drawer refresh to happen which causes list from prev view to load
    // Aftter commenting out this code Drawer refresh is being called twice on each view change - find a way to call it once
    // if (this.drawerLoaded || this.disableRightDrawer) {
    if (this.disableRightDrawer) {
      return;
    }

    this.setupRightDrawer();
    const drawer = App.getView('right_drawer');
    if (drawer) {
      drawer.refresh();
      // this.drawerLoaded = true;
    }
  },
  show: function show(options) {
    this.ensureToolsCreated(options);
    this.inherited(arguments);
  },
  ensureToolsCreated: function ensureToolsCreated(options) {
    // Inject tools into options if it exists
    if (options && options.tools) {
      this._addTools(options.tools);
    }
  },
  onToolLayoutCreated: function onToolLayoutCreated(tools) {
    const theTools = tools || {
      tbar: [],
    };
    if (!this.toolsAdded) {
      this._addTools(theTools);
      this.toolsAdded = true;
    }
    this.inherited(arguments);
  },
  _addTools: function _addTools(tools) { // eslint-disable-line
    if (this.disableRightDrawer) {
      return;
    }
  },
  onTransitionTo: function onTransitionTo() {
    if (this.disableRightDrawer) {
      return;
    }

    this.loadRightDrawer();
  },
  onTransitionAway: function onTransitionAway() {
    if (this.disableRightDrawer) {
      return;
    }

    const drawer = App.getView('right_drawer');
    if (drawer) {
      this.unloadRightDrawer();
      drawer.clear();
      // this.drawerLoaded = false;
    }
  },
});

lang.setObject('Mobile.SalesLogix.Views._RightDrawerBaseMixin', __class);
export default __class;
