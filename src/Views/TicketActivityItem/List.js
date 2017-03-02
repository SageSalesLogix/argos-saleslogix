import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import string from 'dojo/string';
import List from 'argos/List';
import getResource from 'argos/I18n';

const resource = getResource('ticketActivityItemList');

/**
 * @class crm.Views.TicketActivityItem.List
 *
 * @extends argos.List
 *
 * @requires crm.Format
 */
const __class = declare('crm.Views.TicketActivityItem.List', [List], {
  // Templates
  itemTemplate: new Simplate([
    '<p class="listview-heading">{%: $.Product.Name %}</p>',
    '<p class="listview-subheading">{%: $.Product.ActualId %} - {%: crm.Format.currency($.ItemAmount) %}</p>',
    '<p class="listview-subheading">{%: $.ItemDescription %}</p>',
  ]),

  // Localization
  titleText: resource.titleText,

  // View Properties
  id: 'ticketactivityitem_list',
  detailView: 'ticketactivityitem_detail',
  expose: false,
  querySelect: [
    'Product/Name',
    'Product/ActualId',
    'ItemDescription',
    'ItemAmount',
  ],
  resourceKind: 'ticketActivityItems',

  createToolLayout: function createToolLayout() {
    return this.tools || (this.tools = {
      tbar: [],
    });
  },
  formatSearchQuery: function formatSearchQuery(searchQuery) {
    return string.substitute('(upper(Product.Name) like "${0}%" or upper(Product.Family) like "${0}%")', [this.escapeSearchQuery(searchQuery.toUpperCase())]);
  },
});

lang.setObject('Mobile.SalesLogix.Views.TicketActivityItem.List', __class);
export default __class;
