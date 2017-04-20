import lang from 'dojo/_base/lang';
import declare from 'dojo/_base/declare';
import format from '../../Format';
import convert from 'argos/Convert';
import action from '../../Action';
import List from 'argos/List';
import _RightDrawerListMixin from '../_RightDrawerListMixin';
import _MetricListMixin from '../_MetricListMixin';
import getResource from 'argos/I18n';
import * as activityTypeIcons from '../../Models/Activity/ActivityTypeIcon';
import MODEL_NAMES from '../../Models/Names';


const resource = getResource('historyList');
const hashTagResource = getResource('historyListHashTags');
const dtFormatResource = getResource('historyListDateTimeFormat');

/**
 * @class crm.Views.History.List
 *
 * @extends argos.List
 * @mixins crm.Views._RightDrawerListMixin
 * @mixins crm.Views._MetricListMixin
 * @mixins crm.Views._GroupListMixin
 *
 * @requires argos.Convert
 *
 * @requires crm.Format
 * @requires crm.Action
 *
 * @requires moment
 */
const __class = declare('crm.Views.History.List', [List, _RightDrawerListMixin, _MetricListMixin], {
  format,
  // Templates
  itemTemplate: new Simplate([
    '<p class="listview-heading">',
    '{% if ($.Type === "atNote") { %}',
    '{%: $$.formatDate($.ModifyDate) %}',
    '{% } else { %}',
    '{%: $$.formatDate($.CompletedDate) %}',
    '{% } %}',
    '</p>',
    '<p class="micro-text">{%= $$.nameTemplate.apply($) %}</p>',
    '{% if($.Description) { %}',
    '<p class="micro-text">{%= $$.regardingText + $$.formatPicklist("Description")($.Description) %}</p>',
    '{% } %}',
    '<div class="note-text-item">',
    '<div class="note-text-wrap">',
    '{%: $.Notes %}',
    '</div>',
    '</div>',
  ]),
  nameTemplate: new Simplate([
    '{% if ($.LeadName && $.AccountName) { %}',
    '{%: $.LeadName %} | {%: $.AccountName %}',
    '{% } else if ($.LeadName) { %}',
    '{%: $.LeadName %}',
    '{% } else if ($.ContactName && $.AccountName) { %}',
    '{%: $.ContactName %} | {%: $.AccountName %}',
    '{% } else if ($.ContactName) { %}',
    '{%: $.ContactName %}',
    '{% } else { %}',
    '{%: $.AccountName %}',
    '{% } %}',
  ]),

  // Localization
  hourMinuteFormatText: dtFormatResource.hourMinuteFormatText,
  hourMinuteFormatText24: dtFormatResource.hourMinuteFormatText24,
  dateFormatText: dtFormatResource.dateFormatText,
  titleText: resource.titleText,
  viewAccountActionText: resource.viewAccountActionText,
  viewOpportunityActionText: resource.viewOpportunityActionText,
  viewContactActionText: resource.viewContactActionText,
  addAttachmentActionText: resource.addAttachmentActionText,
  regardingText: resource.regardingText,
  activityTypeText: {
    atToDo: resource.toDo,
    atPhoneCall: resource.phoneCall,
    atAppointment: resource.meeting,
    atLiterature: resource.literature,
    atPersonal: resource.personal,
    atQuestion: resource.question,
    atEMail: resource.email,
  },
  hashTagQueriesText: {
    'my-history': hashTagResource.myHistoryHash,
    note: hashTagResource.noteHash,
    phonecall: hashTagResource.phoneCallHash,
    meeting: hashTagResource.meetingHash,
    personal: hashTagResource.personalHash,
    email: hashTagResource.emailHash,
  },

  // View Properties
  detailView: 'history_detail',
  itemIconClass: 'fa fa-archive fa-2x',
  id: 'history_list',
  security: null, // 'Entities/History/View',
  existsRE: /^[\w]{12}$/,
  insertView: 'history_edit',
  queryOrderBy: null,
  querySelect: [],
  queryWhere: null,
  resourceKind: 'history',
  entityName: 'History',
  hashTagQueries: {
    'my-history': function myHistory() {
      return `UserId eq "${App.context.user.$key}"`;
    },
    note: 'Type eq "atNote"',
    phonecall: 'Type eq "atPhoneCall"',
    meeting: 'Type eq "atAppointment"',
    personal: 'Type eq "atPersonal"',
    email: 'Type eq "atEMail"',
  },
  activityTypeIcon: activityTypeIcons.default,
  allowSelection: true,
  enableActions: true,
  modelName: MODEL_NAMES.HISTORY,

  createActionLayout: function createActionLayout() {
    return this.actions || (this.actions = [{
      id: 'viewAccount',
      label: this.viewAccountActionText,
      enabled: action.hasProperty.bindDelegate(this, 'AccountId'),
      fn: action.navigateToEntity.bindDelegate(this, {
        view: 'account_detail',
        keyProperty: 'AccountId',
        textProperty: 'AccountName',
      }),
    }, {
      id: 'viewOpportunity',
      label: this.viewOpportunityActionText,
      enabled: action.hasProperty.bindDelegate(this, 'OpportunityId'),
      fn: action.navigateToEntity.bindDelegate(this, {
        view: 'opportunity_detail',
        keyProperty: 'OpportunityId',
        textProperty: 'OpportunityName',
      }),
    }, {
      id: 'viewContact',
      label: this.viewContactActionText,
      action: 'navigateToContactOrLead',
      enabled: this.hasContactOrLead,
    }, {
      id: 'addAttachment',
      cls: 'attach',
      label: this.addAttachmentActionText,
      fn: action.addAttachment.bindDelegate(this),
    }]);
  },
  hasContactOrLead: function hasContactOrLead(theAction, selection) {
    return (selection.data.ContactId) || (selection.data.LeadId);
  },
  navigateToContactOrLead: function navigateToContactOrLead(theAction, selection) {
    const entity = this.resolveContactOrLeadEntity(selection.data);
    let viewId;
    let options;

    switch (entity) {
      case 'Contact':
        viewId = 'contact_detail';
        options = {
          key: selection.data.ContactId,
          descriptor: selection.data.ContactName,
        };
        break;
      case 'Lead':
        viewId = 'lead_detail';
        options = {
          key: selection.data.LeadId,
          descriptor: selection.data.LeadName,
        };
        break;
      default:
    }

    const view = App.getView(viewId);

    if (view && options) {
      view.show(options);
    }
  },
  resolveContactOrLeadEntity: function resolveContactOrLeadEntity(entry) {
    const exists = this.existsRE;

    if (entry) {
      if (exists.test(entry.LeadId)) {
        return 'Lead';
      }
      if (exists.test(entry.ContactId)) {
        return 'Contact';
      }
    }
  },
  formatDate: function formatDate(date) {
    const startDate = moment(convert.toDateFromString(date));
    const nextDate = startDate.clone().add({
      hours: 24,
    });
    let fmt = this.dateFormatText;

    if (startDate.valueOf() < nextDate.valueOf() && startDate.valueOf() > moment().startOf('day').valueOf()) {
      fmt = (App.is24HourClock()) ? this.hourMinuteFormatText24 : this.hourMinuteFormatText;
    }

    return format.date(startDate.toDate(), fmt);
  },
  formatPicklist: function formatPicklist(property) {
    return format.picklist(this.app.picklistService, this._model, property);
  },
  formatSearchQuery: function formatSearchQuery(searchQuery) {
    return `upper(Description) like "%${this.escapeSearchQuery(searchQuery.toUpperCase())}%"`;
  },
  createIndicatorLayout: function createIndicatorLayout() {
    return this.itemIndicators || (this.itemIndicators = [{
      id: 'touched',
      cls: 'fa fa-hand-o-up fa-lg',
      label: 'Touched',
      onApply: function onApply(entry, parent) {
        this.isEnabled = parent.hasBeenTouched(entry);
      },
    }]);
  },
  getItemIconClass: function getItemIconClass(entry) {
    const type = entry && entry.Type;
    return this._getItemIconClass(type);
  },
  _getItemIconClass: function _getItemIconClass(type) {
    return this.activityTypeIcon[type];
  },
  init: function init() {
    this.inherited(arguments);
  },
});

lang.setObject('Mobile.SalesLogix.Views.History.List', __class);
export default __class;
