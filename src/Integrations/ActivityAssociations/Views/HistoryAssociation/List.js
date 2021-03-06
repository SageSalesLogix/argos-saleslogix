/* Copyright 2020 Infor
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
import MODEL_NAMES from '../../Models/Names';
import getResource from 'argos/I18n';

const resource = getResource('historyAssociationList');

const __class = declare('crm.Integrations.ActivityAssociations.Views.HistoryAssociation.List', [List], {
  // Localization
  titleText: resource.titleText,
  primaryText: resource.primaryText,

  // Templates
  itemTemplate: new Simplate([
    '<p class="micro-text">{%: $.EntityType %} | {%: $.EntityName %}</p>',
    '<p class="micro-text">{%: $$.primaryText %} {%: $.IsPrimary %}</p>',
  ]),

  // View Properties
  id: 'history_association_list',
  security: null,
  enableActions: true,
  pageSize: 105,
  resourceKind: 'historyAssociations',
  modelName: MODEL_NAMES.HISTORYASSOCIATION,

  formatSearchQuery: function formatSearchQuery(searchQuery) {
    return `upper(EntityName) like "%${this.escapeSearchQuery(searchQuery.toUpperCase())}%"`;
  },
  getTitle: function getTitle(entry) {
    if (!entry) {
      return '';
    }

    return (this._model && this._model.getEntityDescription(entry)) || entry.EntityName;
  },
  createToolLayout: function createToolLayout() {
    return this.tools || (this.tools = {
      tbar: [],
    });
  },
});

export default __class;
