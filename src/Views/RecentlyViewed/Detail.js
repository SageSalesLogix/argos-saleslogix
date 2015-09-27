/**
 * @class crm.Views.Offline.Detail
 *
 *
 * @extends argos._DetailBase
 * @requires argos._DetailBase
 *
 */
import declare from 'dojo/_base/declare';
import _DetailBase from 'argos/_DetailBase';
import array from 'dojo/_base/array';
import domConstruct from 'dojo/dom-construct';
import OfflineManager from 'argos/Offline/Manager';
import format from '../../Format';

export default declare('crm.Views.RecentyViewed.Detail', [_DetailBase], {
  id: 'recenty_viewed_detail',
  titleText: 'Recently Viewed Detail',
  offlineText: 'offline',
  idProperty: 'id',
  offlineDoc: null,
  detailHeaderTemplate: new Simplate([
    '<div class="detail-header">',
    '{%: $.value %}',
    '</div>',
    '<div class="detail-sub-header">',
    '{%: $.offlineDate %}',
    '</div>',
  ]),
  createStore: function createStore() {
    return OfflineManager.getStore();
  },
  _applyStateToGetOptions: function _applyStateToGetOptions() {},
  _buildGetExpression: function _buildGetExpression() {
    const options = this.options;
    return options && (options.id || options.key);
  },
  placeDetailHeader: function placeDetailHeader() {
    let value;
    let offlineDate = '';
    if (this.offlineDoc && this.offlineDoc.entityDisplayName) {
      value = this.offlineDoc.entityDisplayName + ' ' + this.informationText;
    } else {
      value = this.entityText + ' ' + this.informationText;
    }
    value = value + ' - ' + this.offlineText;
    if (this.offlineDoc && this.offlineDoc.modifyDate) {
      offlineDate = format.relativeDate(this.offlineDoc.modifyDate);
    }
    domConstruct.place(this.detailHeaderTemplate.apply({ value: value, offlineDate: offlineDate }, this), this.tabList, 'before');
  },
  preProcessEntry: function preProcessEntry(entry) {
    this.offlineDoc = entry;
    return entry.entity;
  },
  createLayout: function createLayout() {
    const views = App.getViews()
      .filter((view) => {
        return view.id === this.offlineDoc.viewId && view.createLayout;
      });

    const view = views[0];
    let layout = [];
    if (view) {
      view.entry = this.entry.entity;
      layout = view.createLayout.apply(view);
    }
    this.disableSections(layout);
    return layout;
  },
  disableSections: function disableSections(sections) {
    array.forEach(sections, (section) => {
      this.disableSection(section);
    }, this);
  },
  disableSection: function disableSection(section) {
    array.forEach(section.children, (property) => {
      this.disableProperty(section, property);
    }, this);
  },
  disableProperty: function disableProperty(section, property) {
    if (property.enableOffline) {
      return;
    }
    property.disabled = true;
  },
});