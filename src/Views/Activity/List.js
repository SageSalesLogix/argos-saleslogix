import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import connect from 'dojo/_base/connect';
import _RightDrawerListMixin from '../_RightDrawerListMixin';
import List from 'argos/List';
import convert from 'argos/Convert';
import action from '../../Action';
import format from '../../Format';
import environment from '../../Environment';
import ErrorManager from 'argos/ErrorManager';
import MODEL_NAMES from '../../Models/Names';
import MODEL_TYPES from 'argos/Models/Types';
import getResource from 'argos/I18n';
import * as activityTypeIcons from '../../Models/Activity/ActivityTypeIcon';
import { getPicklistByActivityType } from '../../Models/Activity/ActivityTypePicklists';


const resource = getResource('activityList');
const hashTagResource = getResource('activityListHashTags');

/**
 * @class crm.Views.Activity.List
 *
 * @extends argos.List
 * @mixins crm.Views._RightDrawerListMixin
 *
 * @requires argos.List
 * @requires argos.Utility
 * @requires argos.Convert
 * @requires argos.ErrorManager
 * @requires crm.Action
 * @requires crm.Environment
 * @requires crm.Format
 * @requires crm.Views._RightDrawerListMixin
 *
 */
const __class = declare('crm.Views.Activity.List', [List, _RightDrawerListMixin], {
  // Localization
  allDayText: resource.allDayText,
  completeActivityText: resource.completeActivityText,
  callText: resource.callText,
  calledText: resource.calledText,
  addAttachmentActionText: resource.addAttachmentActionText,
  overdueText: resource.overdueText,
  alarmText: resource.alarmText,
  touchedText: resource.touchedText,
  importantText: resource.importantText,
  recurringText: resource.recurringText,
  titleText: resource.titleText,
  hashTagQueriesText: {
    alarm: hashTagResource.alarmText,
    recurring: hashTagResource.recurringText,
    timeless: hashTagResource.timelessText,
    today: hashTagResource.todayText,
    'this-week': hashTagResource.thisWeekText,
    yesterday: hashTagResource.yesterdayText,
  },
  // Card View
  itemIcon: activityTypeIcons.default.atAppointment,
  format,
  getPicklistByActivityType,

  // Templates
  // Card View
  rowTemplate: new Simplate([
    `<div as data-action="activateEntry" data-key="{%= $$.getItemActionKey($) %}" data-descriptor="{%: $$.getItemDescriptor($) %}" data-activity-type="{%: $.Type %}">
      <div class="widget">
        <div class="widget-header">
          {%! $$.itemIconTemplate %}<h2 class="widget-title">{%: $$.getItemDescriptor($) %}</h2>
          <button class="btn-actions" type="button" data-action="selectEntry" data-key="{%= $$.getItemActionKey($) %}">
            <span class="audible">Actions</span>
            <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
              <use xlink:href="#icon-more"></use>
            </svg>
          </button>
          {%! $$.listActionTemplate %}
        </div>
        <div class="card-content">
          {%! $$.itemRowContentTemplate %}
        </div>
      </div>
    </div>`,
  ]),
  activityTimeTemplate: new Simplate([
    '{% if ($$.isTimelessToday($)) { %}',
    '{%: $$.allDayText %}',
    '{% } else { %}',
    '{%: $$.format.relativeDate($.StartDate, argos.Convert.toBoolean($.Timeless)) %}', // TODO: Avoid global
    '{% } %}',
  ]),
  itemTemplate: new Simplate([
    '<p class="listview-heading">',
    '<span class="p-description">{%: $$.format.picklist($$.app.picklistService, null, null, $$.getPicklistByActivityType($.Type, "Description"))($.Description) %}</span>',
    '</p>',
    '<p class="micro-text">',
    '{%! $$.activityTimeTemplate %}',
    '</p>',
    '<p class="micro-text">{%! $$.nameTemplate %}</p>',
  ]),
  nameTemplate: new Simplate([
    '{% if ($.ContactName) { %}',
    '{%: $.ContactName %} | {%: $.AccountName %}',
    '{% } else if ($.AccountName) { %}',
    '{%: $.AccountName %}',
    '{% } else { %}',
    '{%: $.LeadName %}',
    '{% } %}',
  ]),

  // View Properties
  id: 'activity_list',
  security: null, // 'Entities/Activity/View',
  iconClass: 'fa fa-check-square-o fa-lg',
  detailView: 'activity_detail',
  insertView: 'activity_types_list',
  historyEditView: 'history_edit',
  enableActions: true,
  pageSize: 105,
  resourceKind: 'activities',
  modelName: MODEL_NAMES.ACTIVITY,

  hashTagQueries: {
    alarm: 'Alarm eq true',
    recurring: 'Recurring eq true',
    timeless: 'Timeless eq true',
    yesterday: function computeYesterday() {
      const now = moment();
      const yesterdayStart = now.clone()
        .subtract(1, 'days')
        .startOf('day');
      const yesterdayEnd = yesterdayStart.clone()
        .endOf('day');

      const query = `((Timeless eq false and StartDate between @${convert.toIsoStringFromDate(yesterdayStart.toDate())}@ and @${convert.toIsoStringFromDate(yesterdayEnd.toDate())}@) or (Timeless eq true and StartDate between @${yesterdayStart.format('YYYY-MM-DDT00:00:00[Z]')}@ and @${yesterdayEnd.format('YYYY-MM-DDT23:59:59[Z]')}@))`;
      return query;
    },
    today: function computeToday() {
      const now = moment();
      const todayStart = now.clone()
        .startOf('day');
      const todayEnd = todayStart.clone()
        .endOf('day');

      const query = `((Timeless eq false and StartDate between @${convert.toIsoStringFromDate(todayStart.toDate())}@ and @${convert.toIsoStringFromDate(todayEnd.toDate())}@) or (Timeless eq true and StartDate between @${todayStart.format('YYYY-MM-DDT00:00:00[Z]')}@ and @${todayEnd.format('YYYY-MM-DDT23:59:59[Z]')}@))`;
      return query;
    },
    'this-week': function computeThisWeek() {
      const now = moment();
      const weekStartDate = now.clone()
        .startOf('week');
      const weekEndDate = weekStartDate.clone()
        .endOf('week');

      const query = `((Timeless eq false and StartDate between @${convert.toIsoStringFromDate(weekStartDate.toDate())}@ and @${convert.toIsoStringFromDate(weekEndDate.toDate())}@) or (Timeless eq true and StartDate between @${weekStartDate.format('YYYY-MM-DDT00:00:00[Z]')}@ and @${weekEndDate.format('YYYY-MM-DDT23:59:59[Z]')}@))`;
      return query;
    },
  },
  defaultSearchTerm: function defaultSearchTerm() {
    if (App.enableHashTags) {
      const hashtag = this.hashTagQueriesText['this-week'];
      if (typeof hashtag === 'string' && hashtag.startsWith('#')) {
        return hashtag;
      }

      return `#${hashtag}`;
    }

    return '';
  },
  formatSearchQuery: function formatSearchQuery(searchQuery) {
    return `upper(Description) like "%${this.escapeSearchQuery(searchQuery.toUpperCase())}%"`;
  },
  formatDateTime: function formatDateTime() {
    return 'StartTime';
  },
  getItemActionKey: function getItemActionKey(entry) {
    return entry.$key;
  },
  getItemDescriptor: function getItemDescriptor(entry) {
    return entry.$descriptor;
  },
  createIndicatorLayout: function createIndicatorLayout() {
    return this.itemIndicators || (this.itemIndicators = [{
      id: 'alarm',
      cls: 'fa fa-bell-o fa-lg',
      label: this.alarmText,
      onApply: function onApply(entry, parent) {
        this.isEnabled = parent.hasAlarm(entry);
      },
    }, {
      id: 'touched',
      cls: 'fa fa-hand-o-up fa-lg',
      label: this.touchedText,
      onApply: function onApply(entry, parent) {
        this.isEnabled = parent.hasBeenTouched(entry);
      },
    }, {
      id: 'important',
      cls: 'fa fa-exclamation fa-lg',
      label: this.importantText,
      onApply: function onApply(entry, parent) {
        this.isEnabled = parent.isImportant(entry);
      },
    }, {
      id: 'recurring',
      cls: 'fa fa-refresh fa-lg',
      label: this.recurringText,
      onApply: function onApply(entry, parent) {
        this.isEnabled = parent.isRecurring(entry, this);
      },
    }, {
      id: 'overdue',
      cls: 'fa fa-exclamation-circle fa-lg',
      label: this.overdueText,
      onApply: function onApply(entry, parent) {
        this.isEnabled = parent.isOverdue(entry);
      },
    }]);
  },
  hasBeenTouched: function hasBeenTouched(entry) {
    if (entry.ModifyDate) {
      const modifiedDate = moment(convert.toDateFromString(entry.ModifyDate));
      const currentDate = moment()
        .endOf('day');
      const weekAgo = moment()
        .subtract(1, 'weeks');

      return modifiedDate.isAfter(weekAgo) &&
        modifiedDate.isBefore(currentDate);
    }
    return false;
  },
  isImportant: function isImportant(entry) {
    if (entry.Priority) {
      if (entry.Priority === 'High') {
        return true;
      }
    }
    return false;
  },
  isOverdue: function isOverdue(entry) {
    if (entry.StartDate) {
      const startDate = convert.toDateFromString(entry.StartDate);
      const currentDate = new Date();
      const seconds = Math.round((currentDate - startDate) / 1000);
      const mins = seconds / 60;
      if (mins >= 1) {
        return true;
      }
    }
    return false;
  },
  isTimelessToday: function isTimelessToday(entry) {
    if (!entry || !entry.Timeless) {
      return false;
    }

    const start = moment(entry.StartDate);
    return this._isTimelessToday(start);
  },
  _isTimelessToday: function _isTimelessToday(start) {
    // Start is UTC, convert it to local time so we can compare it against "now"
    start.subtract({
      minutes: start.utcOffset(),
    });
    return start.isAfter(moment()
      .startOf('day')) && start.isBefore(moment()
      .endOf('day'));
  },
  isRecurring: function isRecurring(entry) {
    if (entry.RecurrenceState) {
      if (entry.RecurrenceState === 'rstOccurrence') {
        return true;
      }
    }
    return false;
  },
  hasAlarm: function hasAlarm(entry) {
    if (entry.Alarm === true) {
      return true;
    }
    return false;
  },
  getItemIconClass: function getItemIconClass(entry) {
    const type = entry && entry.Type;
    return this._getItemIconClass(type);
  },
  _getItemIconClass: function _getItemIconClass(type) {
    return activityTypeIcons.default[type];
  },
  createActionLayout: function createActionLayout() {
    return this.actions || (this.actions = [{
      id: 'complete',
      cls: 'fa fa-check-square fa-2x',
      label: this.completeActivityText,
      enabled: function enabled(theAction, selection) {
        const entry = selection && selection.data;
        if (!entry) {
          return false;
        }
        let recur = false;
        if (entry.RecurrenceState === 'rstOccurrence') {
          recur = true;
        }

        return entry.Leader.$key === App.context.user.$key && !recur;
      },
      fn: (function fn(theAction, selection) {
        const entry = selection && selection.data && selection.data;

        entry.CompletedDate = new Date();
        entry.Result = 'Complete';

        environment.refreshActivityLists();
        this.completeActivity(entry);
      })
        .bindDelegate(this),
    }, {
      id: 'call',
      cls: 'phone',
      label: this.callText,
      enabled: function enabled(theAction, selection) {
        const entry = selection && selection.data;
        return entry && entry.PhoneNumber;
      },
      fn: function fn(theAction, selection) {
        const entry = selection && selection.data;
        const phone = entry && entry.PhoneNumber;
        if (phone) {
          this.recordCallToHistory(function initiateCall() {
            App.initiateCall(phone);
          }.bindDelegate(this), entry);
        }
      }.bindDelegate(this),
    }, {
      id: 'addAttachment',
      cls: 'attach',
      label: this.addAttachmentActionText,
      fn: action.addAttachment.bindDelegate(this),
    }]);
  },
  recordCallToHistory: function recordCallToHistory(complete, entry) {
    const tempEntry = {
      $name: 'History',
      Type: 'atPhoneCall',
      ContactName: entry.ContactName,
      ContactId: entry.ContactId,
      AccountName: entry.AccountName,
      AccountId: entry.AccountId,
      Description: `${this.calledText} ${entry.ContactName || ''}`,
      UserId: App.context && App.context.user.$key,
      UserName: App.context && App.context.user.UserName,
      Duration: 15,
      CompletedDate: (new Date()),
    };

    this.navigateToHistoryInsert('atPhoneCall', tempEntry, complete);
  },
  navigateToHistoryInsert: function navigateToHistoryInsert(type, entry, complete) {
    action.navigateToHistoryInsert(entry, complete);
  },
  completeActivity: function completeActivity(entry) {
    const activityModel = App.ModelManager.getModel(MODEL_NAMES.ACTIVITY, MODEL_TYPES.SDATA);
    if (activityModel) {
      activityModel.completeActivity(entry).then(() => {
        connect.publish('/app/refresh', [{
          resourceKind: 'history',
        }]);

        this.clear();
        this.refresh();
      }, (err) => {
        this.onRequestFailure(err, this);
      });
    }
  },
  onRequestFailure: function onRequestFailure(response, o) {
    ErrorManager.addError(response, o, {}, 'failure');
  },
});

lang.setObject('Mobile.SalesLogix.Views.Activity.List', __class);
export default __class;
