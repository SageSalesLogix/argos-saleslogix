import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import action from 'crm/Action';
import format from 'argos/Format';
import List from 'argos/List';
import _GroupListMixin from '../_GroupListMixin';
import _MetricListMixin from '../_MetricListMixin';
import _RightDrawerListMixin from '../_RightDrawerListMixin';
import getResource from 'argos/I18n';
import MODEL_NAMES from '../../Models/Names';

const resource = getResource('contactList');

/**
 * @class crm.Views.Contact.List
 *
 * @extends argos.List
 * @mixins crm.Views._RightDrawerListMixin
 * @mixins crm.Views._MetricListMixin
 *
 * @requires argos.List
 * @requires argos.Format
 * @requires argos.Convert
 * @requires crm.Views._RightDrawerListMixin
 * @requires crm.Views._GroupListMixin
 * @requires crm.Views._MetricListMixin
 * @requires crm.Action
 *
 */
const __class = declare('crm.Views.Contact.List', [List, _RightDrawerListMixin, _MetricListMixin, _GroupListMixin], {
  format,
  // Template
  // Card Layout
  itemIconClass: 'user',
  itemTemplate: new Simplate([
    '<p class="listview-heading">{%: $.NameLF %}</p>',
    '<p class="micro-text">{% if($.Title) { %} {%: $.Title %} | {% } %} {%: $.AccountName %}</p>',
    '<p class="micro-text">{%: $.WebAddress %}</p>',
    '{% if ($.WorkPhone) { %}',
    '<p class="micro-text">',
    '{%: $$.phoneAbbreviationText %} <span class="hyperlink" data-action="callWork" data-key="{%: $.$key %}">{%: $$.format.phone($.WorkPhone) %}</span>', // TODO: Avoid global
    '</p>',
    '{% } %}',
    '{% if ($.Mobile) { %}',
    '<p class="micro-text">',
    '{%: $$.mobileAbbreviationText %} <span class="hyperlink" data-action="callMobile" data-key="{%: $.$key %}">{%: $$.format.phone($.Mobile) %}</span>', // TODO: Avoid global
    '</p>',
    '{% } %}',
    '{% if ($.Email) { %}',
    '<p class="micro-text">',
    '<span class="hyperlink" data-action="sendEmail" data-key="{%: $.$key %}">{%: $.Email %}</span>',
    '</p>',
    '{% } %}',
  ]),

  // Localization
  titleText: resource.titleText,
  activitiesText: resource.activitiesText,
  notesText: resource.notesText,
  scheduleText: resource.scheduleText,
  editActionText: resource.editActionText,
  callMainActionText: resource.callMainActionText,
  callWorkActionText: resource.callWorkActionText,
  callMobileActionText: resource.callMobileActionText,
  sendEmailActionText: resource.sendEmailActionText,
  viewAccountActionText: resource.viewAccountActionText,
  addNoteActionText: resource.addNoteActionText,
  addActivityActionText: resource.addActivityActionText,
  addAttachmentActionText: resource.addAttachmentActionText,
  phoneAbbreviationText: resource.phoneAbbreviationText,
  mobileAbbreviationText: resource.mobileAbbreviationText,

  // View Properties
  detailView: 'contact_detail',
  iconClass: 'user',
  id: 'contact_list',
  security: 'Entities/Contact/View',
  insertView: 'contact_edit',
  queryOrderBy: null,
  querySelect: [],
  resourceKind: 'contacts',
  entityName: 'Contact',
  modelName: MODEL_NAMES.CONTACT,
  groupsEnabled: true,
  enableActions: true,
  callWork: function callWork(params) {
    this.invokeActionItemBy((theAction) => {
      return theAction.id === 'callWork';
    }, params.key);
  },
  callMobile: function callMobile(params) {
    this.invokeActionItemBy((theAction) => {
      return theAction.id === 'callMobile';
    }, params.key);
  },
  sendEmail: function sendEmail(params) {
    this.invokeActionItemBy((theAction) => {
      return theAction.id === 'sendEmail';
    }, params.key);
  },
  createActionLayout: function createActionLayout() {
    return this.actions || (this.actions = [{
      id: 'edit',
      cls: 'edit',
      label: this.editActionText,
      security: 'Entities/Contact/Edit',
      action: 'navigateToEditView',
    }, {
      id: 'callWork',
      cls: 'phone',
      label: this.callWorkActionText,
      enabled: action.hasProperty.bindDelegate(this, 'WorkPhone'),
      fn: action.callPhone.bindDelegate(this, 'WorkPhone'),
    }, {
      id: 'callMobile',
      cls: 'phone',
      label: this.callMobileActionText,
      enabled: action.hasProperty.bindDelegate(this, 'Mobile'),
      fn: action.callPhone.bindDelegate(this, 'Mobile'),
    }, {
      id: 'viewAccount',
      label: this.viewAccountActionText,
      enabled: action.hasProperty.bindDelegate(this, 'Account.$key'),
      fn: action.navigateToEntity.bindDelegate(this, {
        view: 'account_detail',
        keyProperty: 'Account.$key',
        textProperty: 'AccountName',
      }),
    }, {
      id: 'sendEmail',
      cls: 'mail',
      label: this.sendEmailActionText,
      enabled: action.hasProperty.bindDelegate(this, 'Email'),
      fn: action.sendEmail.bindDelegate(this, 'Email'),
    }, {
      id: 'addNote',
      cls: 'edit',
      label: this.addNoteActionText,
      fn: action.addNote.bindDelegate(this),
    }, {
      id: 'addActivity',
      cls: 'calendar',
      label: this.addActivityActionText,
      fn: action.addActivity.bindDelegate(this),
    }, {
      id: 'addAttachment',
      cls: 'attach',
      label: this.addAttachmentActionText,
      fn: action.addAttachment.bindDelegate(this),
    }]);
  },
  formatSearchQuery: function formatSearchQuery(searchQuery) {
    const q = this.escapeSearchQuery(searchQuery.toUpperCase());
    return `(LastNameUpper like "${q}%" or upper(FirstName) like "${q}%" or upper(NameLF) like "%${q}%") or (Account.AccountNameUpper like "%${q}%")`;
  },
});

lang.setObject('Mobile.SalesLogix.Views.Contact.List', __class);
export default __class;
