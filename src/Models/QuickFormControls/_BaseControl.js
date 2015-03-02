/* 
 * See copyright file.
 */
define('crm/Models/QuickFormControls/_BaseControl', [
    'dojo/_base/declare',
    'dojo/_base/lang'
], function(
    declare,
    lang
) {
    var control = declare('crm.Models.QucikFormControls._BaseControl', null, {
        type:'text',
        valueBindingProperty: 'Text',
        controlData: {},
        caption: null,
        _valuePropertyPath: null,
        _selectPropertyPath: null,
        _parentPropertyPath: null,
        _parentProperty: null,
        constructor: function (o) {
            var data = { controlData: o };
            lang.mixin(this, data);
            this.init();
        },
        getControlId: function () {
            return this.controlData.ControlId;
        },
        init: function () {
            this.caption = this.getCaption();
        },
        getCaption: function () {
            return this.controlData.Caption;
        },
        getValuePropertyPath: function () {
            if (!this._valuePropertyPath) {
                this.controlData.DataBindings.forEach(function (binding) {
                    if ((binding.BindingType === 'Property') && (binding.ControlItemName === this.valueBindingProperty)) {
                        this._valuePropertyPath = binding.DataItemName;
                    }

                }.bind(this));
            }

            return this._valuePropertyPath;
        },
        getParentProperty: function () {
            return this.getParentPropertyPath();
        },
        getParentPropertyPath: function () {
            var valuePath;
            if (!this._parentPropertyPath) {
                valuePath = this.getValuePropertyPath();
                if (valuePath) {
                    this._parentPropertyPath = valuePath.split('.')[0];
                }
            }
            return this._parentPropertyPath;
        },
        getSelectPropertyPath: function () {
            var valuePath = null;
            if (!this._selectPropertyPath) {
                valuePath = this.getValuePropertyPath();
                if (valuePath) {
                    if (Array.isArray(valuePath)) {
                        this._selectPropertyPath = [];
                        valuePath.forEach(function (path) {
                            this._selectPropertyPath.push(path.replace(/\./g, '/'));
                        }.bind(this));
                       
                    } else {
                        this._selectPropertyPath = valuePath.replace(/\./g, '/');
                    }
                }
            }
            return this._selectPropertyPath;
        },
        getRenderer: function () {
            return null;
        },
        getTemplate: function () {
            return null;
        },
        getFieldControlType: function () {
            return 'text';
        },
        getFieldControlOptions: function () {
            return {};           
        },
        getValidator: function () {
            return null;
        },
        getReadOnly: function () {
            return this.controlData ? this.controlData.IsReadOnly : false;
        }
    });

    return control;
});