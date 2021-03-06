/* Copyright 2017 Infor
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import declare from 'dojo/_base/declare';
import List from 'argos/List';
import getResource from 'argos/I18n';

const resource = getResource('eventList');
const dtFormatResource = getResource('eventListDateTimeFormat');

const __class = declare('crm.Views.Event.List', [List], {
  // Localization
  titleText: resource.titleText,
  eventDateFormatText: dtFormatResource.eventDateFormatText,
  eventDateFormatText24: dtFormatResource.eventDateFormatText24,
  eventText: resource.eventText,

  // Templates
  itemTemplate: new Simplate([
    '<p class="listview-heading">{%= $.Description %}</p>',
    '<p class="micro-text">',
    '{%: crm.Format.date($.StartDate, (App.is24HourClock()) ? $$.eventDateFormatText24 : $$.eventDateFormatText) %}',
    '&nbsp;-&nbsp;',
    '{%: crm.Format.date($.EndDate, (App.is24HourClock()) ? $$.eventDateFormatText24 : $$.eventDateFormatText) %}',
    '</p>',
  ]),

  // View Properties
  id: 'event_list',
  security: null, // 'Entities/Event/View',
  detailView: 'event_detail',
  insertView: 'event_edit',
  queryOrderBy: 'StartDate asc',
  queryWhere: null,
  querySelect: [
    'Description',
    'StartDate',
    'EndDate',
    'UserId',
    'Type',
  ],
  resourceKind: 'events',

  formatSearchQuery: function formatSearchQuery(searchQuery) {
    const q = this.escapeSearchQuery(searchQuery.toUpperCase());
    return `upper(Description) like "%${q}%"`;
  },
});

export default __class;
