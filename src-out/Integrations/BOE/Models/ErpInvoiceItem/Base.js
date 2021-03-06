define('crm/Integrations/BOE/Models/ErpInvoiceItem/Base', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', 'argos/Models/_ModelBase', '../Names', 'argos/I18n'], function (module, exports, _declare, _lang, _ModelBase2, _Names, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _ModelBase3 = _interopRequireDefault(_ModelBase2);

  var _Names2 = _interopRequireDefault(_Names);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var resource = (0, _I18n2.default)('erpInvoiceItemModel'); /* Copyright 2017 Infor
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

  var invoiceResource = (0, _I18n2.default)('erpInvoiceModel');
  var salesOrderResource = (0, _I18n2.default)('saleOrderModel');

  var __class = (0, _declare2.default)('crm.Integrations.BOE.Models.ErpInvoiceItem.Base', [_ModelBase3.default], {
    contractName: 'dynamic',
    resourceKind: 'erpInvoiceItems',
    entityName: 'ERPInvoiceItem',
    entityDisplayName: resource.entityDisplayName,
    entityDisplayNamePlural: resource.entityDisplayNamePlural,
    modelName: _Names2.default.ERPINVOICEITEM,
    iconClass: 'bullet-list',
    detailViewId: 'invoice_item_detail',
    listViewId: 'invoice_item_list',
    editViewId: '',
    createRelationships: function createRelationships() {
      var rel = this.relationships || (this.relationships = [{
        name: 'Invoice',
        displayName: invoiceResource.entityDisplayName,
        type: 'ManyToOne',
        parentProperty: 'ErpInvoice',
        parentPropertyType: 'object',
        relatedEntity: 'ERPInvoice'
      }, {
        name: 'SalesOrder',
        displayName: salesOrderResource.entityDisplayName,
        type: 'ManyToOne',
        parentProperty: 'SalesOrder',
        parentPropertyType: 'object',
        relatedEntity: 'SalesOrder'
      }]);
      return rel;
    }
  });
  _lang2.default.setObject('icboe.Models.ErpInvoiceItem.Base', __class);
  exports.default = __class;
  module.exports = exports['default'];
});