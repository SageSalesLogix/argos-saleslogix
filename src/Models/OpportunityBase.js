import declare from 'dojo/_base/declare';
import _ModelBase from 'argos/Models/_ModelBase';
import MODEL_NAMES from './Names';

const resource = window.localeContext.getEntitySync('opportunityModel').attributes;

const __class = declare('crm.Models.OpportunityBase', [_ModelBase], {
  entityName: 'Opportunity',
  entityDisplayName: resource.entityDisplayName,
  entityDisplayNamePlural: resource.entityDisplayNamePlural,
  iconClass: 'fa fa-money fa-2x',
  resourceKind: 'opportunities',
  modelName: MODEL_NAMES.OPPORTUNITY,
  security: 'Entities/Opportunity/View',
});
export default __class;