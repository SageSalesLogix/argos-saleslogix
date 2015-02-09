/* 
 * See copyright file.
 */
define('Mobile/SalesLogix/Models/QuickFormControls/NumericControl', [
    'dojo/_base/declare',
    'Mobile/SalesLogix/Format',
    'Mobile/SalesLogix/Models/QuickFormControls/_BaseControl',
    'Mobile/SalesLogix/Models/QuickFormControls/ControlManager'
], function(
    declare,
    format,
    _BaseControl,
    ControlManager
) {
    var control = declare('Mobile.SalesLogix.Models.QuickFormControls.NumericControl', [_BaseControl], {
        name: 'numeric',
        type: 'Sage.SalesLogix.QuickForms.QFControls.QFSLXNumeric, Sage.SalesLogix.QuickForms.QFControls',
        valueBindingProperty: 'Text',
        getRenderer: function () {
            return format.bigNumber.bindDelegate(this, false);
        }
    });

    ControlManager.register('numeric', { type: 'Sage.SalesLogix.QuickForms.QFControls.QFSLXNumeric, Sage.SalesLogix.QuickForms.QFControls', ctor: control });
    return control;
});
