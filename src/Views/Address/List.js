import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import query from 'dojo/query';
import format from '../../Format';
import List from 'argos/List';
import getResource from 'argos/I18n';
import $ from 'jquery';

const resource = getResource('addressList');

/**
 * @class crm.Views.Address.List
 *
 * @extends argos.List
 *
 * @requires argos.List
 *
 * @requires crm.Format
 *
 */
const __class = declare('crm.Views.Address.List', [List], {
  // Templates
  itemTemplate: new Simplate([
    '<p class="listview-heading">{%: $.$descriptor %}</p>',
    '<p class="micro-text">{%= crm.Format.address($, true) %}</p>',
  ]),

  // Localization
  titleText: resource.titleText,

  // View Properties
  detailView: null,
  id: 'address_list',
  security: null, // 'Entities/Address/View',
  insertSecurity: 'Entities/Address/Add',
  insertView: 'address_edit',
  resourceKind: 'addresses',
  allowSelection: true,
  enableActions: true,

  formatSearchQuery: function formatSearchQuery(searchQuery) {
    const q = this.escapeSearchQuery(searchQuery.toUpperCase());
    return `(Description like "${q}%" or City like "${q}%")`;
  },
  // Disable Add/Insert on toolbar
  createToolLayout: function createToolLayout() {
    return this.tools || (this.tools = {
      tbar: [],
    });
  },
  selectEntry: function selectEntry(params) {
    const row = query(params.$source).closest('[data-key]')[0];
    const key = row ? $(row).attr('data-key') : false;

    if (this._selectionModel && key) {
      App.showMapForAddress(format.address(this.entries[key], true, ' '));
    }
  },
});

lang.setObject('Mobile.SalesLogix.Views.Address.List', __class);
export default __class;
