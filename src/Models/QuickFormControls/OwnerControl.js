/* 
 * See copyright file.
 */
define('Mobile/SalesLogix/Models/QuickFormControls/OwnerControl', [
    'dojo/_base/declare',
    '../../Template',
    './_BaseControl',
    './ControlManager',
    '../../Validator'
], function(
    declare,
    template,
    _BaseControl,
    ControlManager,
    validator
) {
    var _type =  'Sage.SalesLogix.QuickForms.QFControls.QFSLXOwner, Sage.SalesLogix.QuickForms.QFControls';
    var control = declare('crm.Models.QuickFormControls.QwnerControl', [_BaseControl], {
        name: 'owner',
        type: _type,
        valueBindingProperty: 'LookupResultValue',
        textBindingProperty: 'Text',
        getValuePropertyPath: function () {
            var valuePath;
            if (!this._valuePropertyPath) {
                this.controlData.DataBindings.forEach(function (binding) {
                    if ((binding.BindingType === 'Property') && (binding.ControlItemName === this.valueBindingProperty)) {
                        this._valuePropertyPath = binding.DataItemName + '.OwnerDescription';
                    }
                }.bind(this));
            }
            return this._valuePropertyPath;
        },
        getFieldControlType: function () {
            return 'lookup';
        },
        getParentPropertyPath: function () {
            var valuePath;
            if (!this._parentPropertyPath) {
                valuePath = this.getValuePropertyPath();
                this._parentPropertyPath = valuePath.split('.')[0];
            }
            return this._parentPropertyPath;
        },
        getFieldControlOptions: function () {
            return {
                view: 'owner_list',
                textProperty: 'OwnerDescription'
            };
        }
    });

    ControlManager.register('owner', { type: _type, ctor: control });
    return control;
});