import declare from 'dojo/_base/declare';
import _EditBase from 'argos/_EditBase';
import MODEL_TYPES from 'argos/Models/Types';
import getResource from 'argos/I18n'; // eslint-disable-line
import MODEL_NAMES from '../../Models/Names';

const __class = declare('crm.Views.History.EditOffline', [_EditBase], {
  // Localization
  titleText: 'Offline Notes', // TODO: Localize

  // View Properties
  id: 'history_edit_offline',
  entityName: 'History',
  resourceKind: 'history',

  getModel: function getModel() {
    const model = App.ModelManager.getModel(MODEL_NAMES.HISTORY, MODEL_TYPES.OFFLINE);
    return model;
  },
  createLayout: function createLayout() {
    return this.layout || (this.layout = [{
      title: 'Notes', // TODO: Localize
      name: 'NotesSection',
      children: [{
        name: 'Text',
        property: 'Text',
        label: 'notes', // TODO: Localize
        cls: 'row-edit-text',
        type: 'textarea',
        autoFocus: true,
      }],
    }]);
  },
  beforeTransitionTo: function beforeTransitionTo() {
    this.inherited(arguments);
    $(this.domNode).removeClass('panel-loading');
  },
});

export default __class;
