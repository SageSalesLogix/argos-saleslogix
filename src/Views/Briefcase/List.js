/**
 * @class crm.Views.Offline.List
 *
 * @extends argos._ListBase
 * @requires argos._ListBase
 *
 *
 */
import declare from 'dojo/_base/declare';
import _ListBase from 'argos/_ListBase';
import _CardLayoutListMixin from '../_CardLayoutListMixin';
import lang from 'dojo/_base/lang';
import format from '../../Format';
import MODEL_TYPES from 'argos/Models/Types';
import OfflineManager from 'argos/Offline/Manager';
import Deferred from 'dojo/Deferred';
import OfflineDetail from '../Offline/Detail';

export default declare('crm.Views.Briefcase', [_ListBase, _CardLayoutListMixin], {
  id: 'briefcase_list',
  idProperty: 'id',
  detailView: 'offline_detail',
  enableSearch: false,
  enableActions: true,
  enableOfflineSupport: true,
  resourceKind: '',
  entityName: 'Briefcase',
  titleText: 'My Briefcase',

  itemTemplate: new Simplate([
    '<h3>{%: $$.getTitle($) %}</h3>',
    '<h4>{%: $$.getOfflineDate($) %}</h4>',
  ]),
  refreshRequiredFor: function refreshRequiredFor() {
    return true;
  },
  getModel: function getModel() {
    const model = App.ModelManager.getModel('Briefcase', MODEL_TYPES.OFFLINE);
    return model;
  },
  getTitle: function getTitle(entry) {
    return entry && entry.description;
  },
  getOfflineDate: function getOfflineDate(entry) {
    if (entry && entry.modifyDate) {
      return format.relativeDate(entry.modifyDate);
    }
    return '';
  },
  _hasValidOptions: function _hasValidOptions(options) {
    return options;
  },
  createIndicatorLayout: function createIndicatorLayout() {
    return [];
  },
  getItemIconClass: function getItemIconClass(entry) {
    let iconClass;
    iconClass = entry.iconClass;
    if (!iconClass) {
      iconClass = 'fa fa-cloud fa-2x';
    }
    return iconClass;
  },
  navigateToDetailView: function navigateToDetailView(key, descriptor, additionalOptions) {
    const entry = this.entries && this.entries[key];
    if (!App.onLine) {
      this.navigateToOnlineDetailView(entry, additionalOptions);
    } else {
      this.navigateToOfflineDetailView(entry, additionalOptions);
    }
  },
  navigateToOnlineDetailView: function navigateToDetailView(entry, additionalOptions) {
    const view = this.app.getView(entry.viewId);

    let options = {
      descriptor: entry.description, // keep for backwards compat
      title: entry.description,
      key: entry.entityId,
      fromContext: this,
    };

    if (additionalOptions) {
      options = lang.mixin(options, additionalOptions);
    }

    if (view) {
      view.show(options);
    }
  },
  navigateToOfflineDetailView: function navigateToOfflineDetailView(entry, additionalOptions) {
    const view = this.getDetailView(entry.entityName);
    let options = {
      descriptor: entry.description, // keep for backwards compat
      title: entry.description,
      key: entry.entityId,
      fromContext: this,
      offlineContext: {
        entityId: entry.entityId,
        entityName: entry.entityName,
        viewId: entry.viewId,
        source: entry,
      },
    };
    if (additionalOptions) {
      options = lang.mixin(options, additionalOptions);
    }

    if (view) {
      view.show(options);
    }
  },
  getDetailView: function getDetailView(entityName) {
    const viewId = this.detailView + '_' + entityName;
    let view = this.app.getView(viewId);

    if (view) {
      return view;
    }

    this.app.registerView(new OfflineDetail({id: viewId}));
    view = this.app.getView(viewId);
    return view;
  },
  createActionLayout: function createActionLayout() {
    return this.actions || (this.actions = [{
      id: 'remove',
      cls: 'fa fa-remove fa-2x',
      label: 'remove',
      action: 'removeItemAction',
    }, {
      id: 'resync',
      cls: 'fa fa-refresh fa-2x',
      label: 're sync',
      action: 'reSyncItemAction',
    }, {
      id: 'navToOnline',
      cls: 'fa fa-level-down fa-2x',
      label: 'go to online',
      action: 'navToOnlineView',
    }, {
      id: 'navToOffline',
      cls: 'fa fa-level-down fa-2x',
      label: 'go to offline',
      action: 'navToOfflineView',
    }]);
  },
  navToOnlineView: function navToOnlineVie(action, selection) {
    const briefcaseId = selection.tag.attributes['data-key'].value;
    const briefcase = this.entries[briefcaseId];
    this.navigateToOnlineDetailView(briefcase);
  },
  navToOfflineView: function navToOfflineView(action, selection) {
    const briefcaseId = selection.tag.attributes['data-key'].value;
    const briefcase = this.entries[briefcaseId];
    this.navigateToOfflineDetailView(briefcase);
  },
  removeItemAction: function removeItemAction(action, selection) { // eslint-disable-line
    const briefcaseId = selection.tag.attributes['data-key'].value;
    OfflineManager.removeBriefcase(briefcaseId).then(() => {
      this.clear();
      this.refreshRequired = true;
      this.refresh();
    }, (error) => {
      console.error(error);// eslint-disable-line
    });
  },
  reSyncItemAction: function reSynctItem(action, selection) { // eslint-disable-line
    const briefcaseId = selection.tag.attributes['data-key'].value;
    const briefcase = this.entries[briefcaseId];
    if (briefcase) {
      this.reSyncItem(briefcase).then(() => {
        this.clear();
        this.refreshRequired = true;
        this.refresh();
      });
    }
  },
  reSyncItem: function reSynctItem(briefcaseItem) { // eslint-disable-line
    const def = new Deferred();
    if (briefcaseItem) {
      const entityName = briefcaseItem.entityName;
      const entityId = briefcaseItem.entityId;
      const options = {
        includeRelated: true,
        iconClass: briefcaseItem.iconClass,
        viewId: briefcaseItem.viewId,
      };
      OfflineManager.briefCaseEntity(entityName, entityId, options).then(function success(result) {
        def.resolve(result);
      }, function err(error) {
        console.error(error);// eslint-disable-line
        def.reject(error);
      });
    }
    return def.promise;
  },
});
