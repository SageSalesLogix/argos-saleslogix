import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import _RightDrawerBaseMixin from '../_RightDrawerBaseMixin';
import getResource from 'argos/I18n';


const resource = getResource('rightDrawerListMixin');

/**
 * @class crm.Views.RecentlyViewed._RightDrawerListMixin
 *
 *
 * @mixins crm.Views._RightDrawerBaseMixin
 *
 */
const __class = declare('crm.Views.RecentlyViewed._RightDrawerListMixin', [_RightDrawerBaseMixin], {

  // Dirty flags to refresh the mainview and/or widgets
  _hasChangedEntityPrefs: false,
  _hasChangedKPIPrefs: false,
  onShow: function onShow() {
    this.setDefaultEntityPreferences();
  },
  setDefaultEntityPreferences: function setDefaultEntityPreferences() {
    if (!App.preferences.recentlyViewedEntityFilters) {
      const defaults = this.getDefaultEntityPreferences();
      App.preferences.recentlyViewedEntityFilters = defaults;
      App.persistPreferences();
    }
  },
  getDefaultEntityPreferences: function getDefaultEntityPreferences() {
    return Object.keys(this.entityMappings)
      .map((name) => {
        return {
          name,
          enabled: true,
        };
      });
  },
  setupRightDrawer: function setupRightDrawer() {
    const drawer = App.getView('right_drawer');
    if (drawer) {
      lang.mixin(drawer, this._createActions());
      drawer.setLayout(this.createRightDrawerLayout());
      drawer.getGroupForEntry = lang.hitch(this, function getGroupForRightDrawerEntry(entry) {
        return this.getGroupForRightDrawerEntry(entry);
      });

      App.viewSettingsModal.element.on('close', () => {
        if (this._hasChangedEntityPrefs) {
          this.clear();
          this.refreshRequired = true;
          this.refresh();
          this._hasChangedEntityPrefs = false;
          this._hasChangedKPIPrefs = false;
        }

        if (this._hasChangedKPIPrefs && this.rebuildWidgets) {
          this.destroyWidgets();
          this.rebuildWidgets();
          this._hasChangedKPIPrefs = false;
        }
      });
    }
  },
  unloadRightDrawer: function unloadRightDrawer() {
    const drawer = App.getView('right_drawer');
    if (drawer) {
      drawer.setLayout([]);
      drawer.getGroupForEntry = function noop() {};
      App.viewSettingsModal.element.off('close');
    }
  },
  _onSearchExpression: function _onSearchExpression() {
    // TODO: Don't extend this private function - connect to the search widget onSearchExpression instead
    this.inherited(arguments);
  },
  _createActions: function _createActions() {
    // These actions will get mixed into the right drawer view.
    const actions = {
      entityFilterClicked: function onentityFilterClicked(params) {
        const prefs = App.preferences && App.preferences.recentlyViewedEntityFilters;

        const results = prefs.filter((pref) => {
          return pref.name === params.entityname;
        });

        if (results.length > 0) {
          const enabled = !!results[0].enabled;
          results[0].enabled = !enabled;
          App.persistPreferences();
          this._hasChangedEntityPrefs = true;
          $(params.$source).attr('data-enabled', (!enabled)
            .toString());
        }
      }.bind(this),
      kpiClicked: function kpiClicked(params) {
        const metrics = App.getMetricsByResourceKind(this.resourceKind);
        let results;

        if (metrics.length > 0) {
          results = metrics.filter((metric) => {
            return metric.title === params.title;
          });
        }

        if (results.length > 0) {
          const enabled = !!results[0].enabled;
          results[0].enabled = !enabled;
          App.persistPreferences();
          this._hasChangedKPIPrefs = true;

          $(params.$source).attr('data-enabled', (!enabled).toString());
        }
      }.bind(this),
    };

    return actions;
  },
  getGroupForRightDrawerEntry: function getGroupForRightDrawerEntry(entry) {
    if (entry.dataProps && entry.dataProps.entityname) {
      return {
        tag: 'view',
        title: resource.entitySectionText,
      };
    }

    return {
      tag: 'kpi',
      title: resource.kpiSectionText,
    };
  },
  createRightDrawerLayout: function createRightDrawerLayout() {
    const layout = [];
    const entitySection = {
      id: 'actions',
      children: Object.keys(this.entityMappings)
        .map((entityName) => {
          const prefs = App.preferences && App.preferences.recentlyViewedEntityFilters;
          const entityPref = prefs.filter((pref) => {
            return pref.name === entityName;
          });
          const {
            enabled,
          } = entityPref[0];
          return {
            name: entityName,
            action: 'entityFilterClicked',
            title: this.entityText[entityName] || entityName,
            dataProps: {
              entityname: entityName,
              enabled: !!enabled,
            },
          };
        }),
    };

    layout.push(entitySection);

    const metrics = App.getMetricsByResourceKind(this.resourceKind);

    const kpiSection = {
      id: 'kpi',
      children: metrics.filter(m => m.title).map((metric, i) => {
        return {
          name: `KPI${i}`,
          action: 'kpiClicked',
          title: metric.title,
          dataProps: {
            title: metric.title,
            enabled: !!metric.enabled,
          },
        };
      }),
    };

    layout.push(kpiSection);
    return layout;
  },
});

export default __class;
