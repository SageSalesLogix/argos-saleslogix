import declare from 'dojo/_base/declare';
import _ModelBase from 'argos/Models/_ModelBase';
import MODEL_NAMES from './Names';
import ACTIVITY_TYPE_TEXT from './ActivityTypeText';
import ACTIVITY_TYPE_ICON from './ActivityTypeIcon';

const resource = window.localeContext.getEntitySync('activityModel').attributes;

const __class = declare('crm.Models.ActivityBase', [_ModelBase], {
  modelName: MODEL_NAMES.ACTIVITY,
  entityName: 'Activity',
  entityDisplayName: resource.entityDisplayName,
  entityDisplayNamePlural: resource.entityDisplayNamePlural,
  iconClass: 'fa fa-list-ul fa-2x',
  resourceKind: 'activities',
  contractName: 'system',
  recurringActivityIdSeparator: ';',

  createRelationships: function createRelationships() {
    let rel;
    rel = this.relationships || (this.relationships = [ {
      name: 'Account',
      displayName: 'Account',
      // propertyName: 'Account',
      type: 'ManyToOne',
     // parentEntity: 'Activity',
      parentProperty: 'AccountId',
      childEntity: 'Account',
      // childProperty: 'AccountId',
      queryModelName: 'detail',
    }, {
      name: 'Contact',
      displayName: 'Contacts',
      // propertyName: 'Contact',
      type: 'ManyToOne',
      // parentEntity: 'Activity',
      parentProperty: 'ContactId',
      childEntity: 'Contact',
      // childProperty: 'ContactId',
      queryModelName: 'detail',
    }, {
      name: 'Ticket',
      displayName: 'Ticket',
     // propertyName: 'Ticket',
      type: 'ManyToOne',
      // parentEntity: 'Activity',
      parentProperty: 'TicketId',
      childEntity: 'Ticket',
      // childProperty: 'TicketId',
      queryModelName: 'detail',
    }, {
      name: 'Opportunity',
      displayName: 'Opportunity',
      // propertyName: 'Opportunnity',
      type: 'ManyToOne',
      // parentEntity: 'Activity',
      parentProperty: 'OpportunityId',
      childEntity: 'OpportunityId',
      // childProperty: 'OpportunityId',
      queryModelName: 'detail',
    }, {
      name: 'Lead',
      displayName: 'Lead',
     // propertyName: 'Lead',
      type: 'ManyToOne',
      // parentEntity: 'Activity',
      parentProperty: 'LeadId',
      childEntity: 'Lead',
      // childProperty: 'LeadId',
      queryModelName: 'detail',
    }]);
    return rel;
  },
  getIconClass: function getIconClass(entry) {
    let cls = this.iconClass;
    if (entry && entry.Type) {
      cls = ACTIVITY_TYPE_ICON[entry.Type];
      if (cls) {
        cls = cls + ' fa-2x';
      }
    }
    return cls;
  },
  getTypeText: function getTypeText(entry) {
    let name = '';
    if (entry && entry.Type) {
      name = ACTIVITY_TYPE_TEXT[entry.Type];
    }
    return name;
  },
});
export default __class;