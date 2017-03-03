import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import string from 'dojo/string';
import List from 'argos/List';
import format from 'crm/Format';
import MODEL_NAMES from '../../Models/Names';
import getResource from 'argos/I18n';

const resource = getResource('syncResultsList');
const dtFormatResource = getResource('syncResultsListDateTimeFormat');

const __class = declare('crm.Integrations.BOE.Views.SyncResults.List', [List], {
  formatter: format,
  // Templates
  itemTemplate: new Simplate([
    '<p class="listview-heading"><label class="group-label">{%: $$.directionText %}: </label>{%: $.RunName %}</p>',
    '<p class="listview-subheading"><label class="group-label">{%: $$.statusText %}: </label>{%: $.HttpStatus %}</p>',
    '{% if ($.ErrorMessage) { %}',
    '<p class="listview-subheading"><label class="group-label">{%: $$.errorMessageText %}: </label>{%: $.ErrorMessage %}</p>',
    '{% } %}',
    '{% if ($.SyncedFrom) { %}',
    '<p class="listview-subheading"><label class="group-label">{%: $$.sentFromText %}: </label>{%: $.SyncedFrom.Name %}</p>',
    '{% } %}',
    '{% if ($.SyncedTo) { %}',
    '<p class="listview-subheading"><label class="group-label">{%: $$.processedByText %}: </label>{%: $.SyncedTo.Name %}</p>',
    '{% } %}',
    '<p class="listview-subheading"><label class="group-label">{%: $$.loggedText %}: </label>{%: $$.formatter.date($.Stamp, $$.dateFormatText) %}</p>',
  ]),

  // Localization
  titleText: resource.titleText,
  directionText: resource.directionText,
  userText: resource.userText,
  sentFromText: resource.sentFromText,
  processedByText: resource.processedByText,
  loggedText: resource.loggedText,
  statusText: resource.statusText,
  errorMessageText: resource.errorMessageText,
  dateFormatText: dtFormatResource.dateFormatText,

  // View Properties
  id: 'syncresult_list',
  detailView: '',
  modelName: MODEL_NAMES.SYNCRESULT,
  resourceKind: 'syncResults',
  enableActions: false,
  groupsEnabled: false,
  disableRightDrawer: true,
  expose: false,

  // Card layout
  itemIconClass: '',

  // Metrics
  entityName: 'SyncResult',

  createToolLayout: function createToolLayout() {
    return this.tools || (this.tools = {
    });
  },
  formatSearchQuery: function formatSearchQuery(searchQuery) {
    return string.substitute('upper(HttpStatus) like "${0}%"', [this.escapeSearchQuery(searchQuery.toUpperCase())]);
  },
});

lang.setObject('icboe.Views.SyncResults.List', __class);
export default __class;
