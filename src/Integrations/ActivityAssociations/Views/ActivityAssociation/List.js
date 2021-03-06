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
import connect from 'dojo/_base/connect';
import List from 'argos/List';
import MODEL_NAMES from '../../Models/Names';
import getResource from 'argos/I18n';

const resource = getResource('activityAssociationList');

const __class = declare('crm.Integrations.ActivityAssociations.Views.ActivityAssociation.List', [List], {
  // Localization
  titleText: resource.titleText,
  primaryText: resource.primaryText,
  deleteText: resource.deleteText,
  confirmDeleteText: resource.confirmDeleteText,

  // Templates
  itemTemplate: new Simplate([
    '<p class="micro-text">{%: $.EntityType %} | {%: $.EntityName %}</p>',
    '<p class="micro-text">{%: $$.primaryText %} {%: $.IsPrimary %}</p>',
  ]),

  // View Properties
  id: 'activity_association_list',
  security: null,
  detailView: 'activity_association_detail',
  enableActions: true,
  pageSize: 105,
  resourceKind: 'activityAssociations',
  modelName: MODEL_NAMES.ACTIVITYASSOCIATION,

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
  deleteAssociation: function deleteAssociation(_, selection) {
    App.modal.createSimpleDialog({
      title: 'alert',
      content: this.confirmDeleteText,
      getContent: () => { },
    }).then(() => {
      const entry = selection && selection.data;
      const model = this.getModel();
      model.deleteEntry(entry.$key).then(() => {
        connect.publish('/app/refresh', [{
          resourceKind: this.resourceKind,
        }]);
        this.forceRefresh();
      });
    });
  },
  createActionLayout: function createActionLayout() {
    return this.actions || (this.actions = [{
      id: 'deleteAssociation',
      cls: 'delete',
      label: this.deleteText,
      fn: this.deleteAssociation.bind(this),
    }]);
  },
});

export default __class;
