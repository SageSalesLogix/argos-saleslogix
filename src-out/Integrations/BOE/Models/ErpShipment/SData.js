define('crm/Integrations/BOE/Models/ErpShipment/SData', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', './Base', 'argos/Models/_SDataModelBase', 'argos/Models/Manager', 'argos/Models/Types', '../Names'], function (module, exports, _declare, _lang, _Base, _SDataModelBase2, _Manager, _Types, _Names) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _Base2 = _interopRequireDefault(_Base);

  var _SDataModelBase3 = _interopRequireDefault(_SDataModelBase2);

  var _Manager2 = _interopRequireDefault(_Manager);

  var _Types2 = _interopRequireDefault(_Types);

  var _Names2 = _interopRequireDefault(_Names);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var __class = (0, _declare2.default)('crm.Integrations.BOE.Models.ErpShipment.SData', [_Base2.default, _SDataModelBase3.default], {
    id: 'erpshipment_sdata_model',
    createQueryModels: function createQueryModels() {
      return [{
        name: 'list',
        queryOrderBy: 'ErpDocumentDate desc, CreateDate desc',
        querySelect: ['ErpExtId', 'ErpShipTo/Name', 'ErpStatus', 'ErpCarrierParty', 'ErpDeclaredValue', 'DatePromised', 'ErpActualShipDate', 'ErpActualDeliveryDate', 'ErpPartialShipAllowed', 'Account/AccountName', 'CreateDate', 'ShipmentTotalBaseAmount', 'ShipmentTotalAmount', 'BaseCurrencyCode', 'CurrencyCode', 'ErpDocumentDate']
      }, {
        name: 'detail',
        querySelect: ['ErpExtId', 'Account/AccountName', 'DatePromised', 'ErpActualShipDate', 'ErpActualDeliveryDate', 'ErpCarrierParty', 'ErpStatus', 'ErpStatusDate', 'ErpDocumentDate', 'SlxLocation/Name', 'ErpPartialShipAllowed', 'ErpGrossWeight', 'ErpGrossWeightUnit', 'ErpDeclaredValue', 'ShipmentTotalAmount', 'ErpIncoTerm', 'ErpShipTo/Name', 'ErpShipTo/Address/*', 'CurrencyCode', 'BaseCurrencyCode', 'ShipmentTotalBaseAmount'],
        queryInclude: ['$permissions']
      }];
    }
  }); /* Copyright 2017 Infor
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

  _Manager2.default.register(_Names2.default.ERPSHIPMENT, _Types2.default.SDATA, __class);
  _lang2.default.setObject('icboe.Models.ErpShipment.SData', __class);
  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9JbnRlZ3JhdGlvbnMvQk9FL01vZGVscy9FcnBTaGlwbWVudC9TRGF0YS5qcyJdLCJuYW1lcyI6WyJfX2NsYXNzIiwiaWQiLCJjcmVhdGVRdWVyeU1vZGVscyIsIm5hbWUiLCJxdWVyeU9yZGVyQnkiLCJxdWVyeVNlbGVjdCIsInF1ZXJ5SW5jbHVkZSIsInJlZ2lzdGVyIiwiRVJQU0hJUE1FTlQiLCJTREFUQSIsInNldE9iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCQSxNQUFNQSxVQUFVLHVCQUFRLCtDQUFSLEVBQXlELDBDQUF6RCxFQUFrRjtBQUNoR0MsUUFBSSx5QkFENEY7QUFFaEdDLHVCQUFtQixTQUFTQSxpQkFBVCxHQUE2QjtBQUM5QyxhQUFPLENBQUM7QUFDTkMsY0FBTSxNQURBO0FBRU5DLHNCQUFjLHVDQUZSO0FBR05DLHFCQUFhLENBQ1gsVUFEVyxFQUVYLGdCQUZXLEVBR1gsV0FIVyxFQUlYLGlCQUpXLEVBS1gsa0JBTFcsRUFNWCxjQU5XLEVBT1gsbUJBUFcsRUFRWCx1QkFSVyxFQVNYLHVCQVRXLEVBVVgscUJBVlcsRUFXWCxZQVhXLEVBWVgseUJBWlcsRUFhWCxxQkFiVyxFQWNYLGtCQWRXLEVBZVgsY0FmVyxFQWdCWCxpQkFoQlc7QUFIUCxPQUFELEVBcUJKO0FBQ0RGLGNBQU0sUUFETDtBQUVERSxxQkFBYSxDQUNYLFVBRFcsRUFFWCxxQkFGVyxFQUdYLGNBSFcsRUFJWCxtQkFKVyxFQUtYLHVCQUxXLEVBTVgsaUJBTlcsRUFPWCxXQVBXLEVBUVgsZUFSVyxFQVNYLGlCQVRXLEVBVVgsa0JBVlcsRUFXWCx1QkFYVyxFQVlYLGdCQVpXLEVBYVgsb0JBYlcsRUFjWCxrQkFkVyxFQWVYLHFCQWZXLEVBZ0JYLGFBaEJXLEVBaUJYLGdCQWpCVyxFQWtCWCxxQkFsQlcsRUFtQlgsY0FuQlcsRUFvQlgsa0JBcEJXLEVBcUJYLHlCQXJCVyxDQUZaO0FBeUJEQyxzQkFBYyxDQUNaLGNBRFk7QUF6QmIsT0FyQkksQ0FBUDtBQW1ERDtBQXREK0YsR0FBbEYsQ0FBaEIsQyxDQXZCQTs7Ozs7Ozs7Ozs7Ozs7O0FBZ0ZBLG9CQUFRQyxRQUFSLENBQWlCLGdCQUFZQyxXQUE3QixFQUEwQyxnQkFBWUMsS0FBdEQsRUFBNkRULE9BQTdEO0FBQ0EsaUJBQUtVLFNBQUwsQ0FBZSxnQ0FBZixFQUFpRFYsT0FBakQ7b0JBQ2VBLE8iLCJmaWxlIjoiU0RhdGEuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IDIwMTcgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgbGFuZyBmcm9tICdkb2pvL19iYXNlL2xhbmcnO1xyXG5pbXBvcnQgQmFzZSBmcm9tICcuL0Jhc2UnO1xyXG5pbXBvcnQgX1NEYXRhTW9kZWxCYXNlIGZyb20gJ2FyZ29zL01vZGVscy9fU0RhdGFNb2RlbEJhc2UnO1xyXG5pbXBvcnQgTWFuYWdlciBmcm9tICdhcmdvcy9Nb2RlbHMvTWFuYWdlcic7XHJcbmltcG9ydCBNT0RFTF9UWVBFUyBmcm9tICdhcmdvcy9Nb2RlbHMvVHlwZXMnO1xyXG5pbXBvcnQgTU9ERUxfTkFNRVMgZnJvbSAnLi4vTmFtZXMnO1xyXG5cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2NybS5JbnRlZ3JhdGlvbnMuQk9FLk1vZGVscy5FcnBTaGlwbWVudC5TRGF0YScsIFtCYXNlLCBfU0RhdGFNb2RlbEJhc2VdLCB7XHJcbiAgaWQ6ICdlcnBzaGlwbWVudF9zZGF0YV9tb2RlbCcsXHJcbiAgY3JlYXRlUXVlcnlNb2RlbHM6IGZ1bmN0aW9uIGNyZWF0ZVF1ZXJ5TW9kZWxzKCkge1xyXG4gICAgcmV0dXJuIFt7XHJcbiAgICAgIG5hbWU6ICdsaXN0JyxcclxuICAgICAgcXVlcnlPcmRlckJ5OiAnRXJwRG9jdW1lbnREYXRlIGRlc2MsIENyZWF0ZURhdGUgZGVzYycsXHJcbiAgICAgIHF1ZXJ5U2VsZWN0OiBbXHJcbiAgICAgICAgJ0VycEV4dElkJyxcclxuICAgICAgICAnRXJwU2hpcFRvL05hbWUnLFxyXG4gICAgICAgICdFcnBTdGF0dXMnLFxyXG4gICAgICAgICdFcnBDYXJyaWVyUGFydHknLFxyXG4gICAgICAgICdFcnBEZWNsYXJlZFZhbHVlJyxcclxuICAgICAgICAnRGF0ZVByb21pc2VkJyxcclxuICAgICAgICAnRXJwQWN0dWFsU2hpcERhdGUnLFxyXG4gICAgICAgICdFcnBBY3R1YWxEZWxpdmVyeURhdGUnLFxyXG4gICAgICAgICdFcnBQYXJ0aWFsU2hpcEFsbG93ZWQnLFxyXG4gICAgICAgICdBY2NvdW50L0FjY291bnROYW1lJyxcclxuICAgICAgICAnQ3JlYXRlRGF0ZScsXHJcbiAgICAgICAgJ1NoaXBtZW50VG90YWxCYXNlQW1vdW50JyxcclxuICAgICAgICAnU2hpcG1lbnRUb3RhbEFtb3VudCcsXHJcbiAgICAgICAgJ0Jhc2VDdXJyZW5jeUNvZGUnLFxyXG4gICAgICAgICdDdXJyZW5jeUNvZGUnLFxyXG4gICAgICAgICdFcnBEb2N1bWVudERhdGUnLFxyXG4gICAgICBdLFxyXG4gICAgfSwge1xyXG4gICAgICBuYW1lOiAnZGV0YWlsJyxcclxuICAgICAgcXVlcnlTZWxlY3Q6IFtcclxuICAgICAgICAnRXJwRXh0SWQnLFxyXG4gICAgICAgICdBY2NvdW50L0FjY291bnROYW1lJyxcclxuICAgICAgICAnRGF0ZVByb21pc2VkJyxcclxuICAgICAgICAnRXJwQWN0dWFsU2hpcERhdGUnLFxyXG4gICAgICAgICdFcnBBY3R1YWxEZWxpdmVyeURhdGUnLFxyXG4gICAgICAgICdFcnBDYXJyaWVyUGFydHknLFxyXG4gICAgICAgICdFcnBTdGF0dXMnLFxyXG4gICAgICAgICdFcnBTdGF0dXNEYXRlJyxcclxuICAgICAgICAnRXJwRG9jdW1lbnREYXRlJyxcclxuICAgICAgICAnU2x4TG9jYXRpb24vTmFtZScsXHJcbiAgICAgICAgJ0VycFBhcnRpYWxTaGlwQWxsb3dlZCcsXHJcbiAgICAgICAgJ0VycEdyb3NzV2VpZ2h0JyxcclxuICAgICAgICAnRXJwR3Jvc3NXZWlnaHRVbml0JyxcclxuICAgICAgICAnRXJwRGVjbGFyZWRWYWx1ZScsXHJcbiAgICAgICAgJ1NoaXBtZW50VG90YWxBbW91bnQnLFxyXG4gICAgICAgICdFcnBJbmNvVGVybScsXHJcbiAgICAgICAgJ0VycFNoaXBUby9OYW1lJyxcclxuICAgICAgICAnRXJwU2hpcFRvL0FkZHJlc3MvKicsXHJcbiAgICAgICAgJ0N1cnJlbmN5Q29kZScsXHJcbiAgICAgICAgJ0Jhc2VDdXJyZW5jeUNvZGUnLFxyXG4gICAgICAgICdTaGlwbWVudFRvdGFsQmFzZUFtb3VudCcsXHJcbiAgICAgIF0sXHJcbiAgICAgIHF1ZXJ5SW5jbHVkZTogW1xyXG4gICAgICAgICckcGVybWlzc2lvbnMnLFxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuICAgIF07XHJcbiAgfSxcclxufSk7XHJcblxyXG5NYW5hZ2VyLnJlZ2lzdGVyKE1PREVMX05BTUVTLkVSUFNISVBNRU5ULCBNT0RFTF9UWVBFUy5TREFUQSwgX19jbGFzcyk7XHJcbmxhbmcuc2V0T2JqZWN0KCdpY2JvZS5Nb2RlbHMuRXJwU2hpcG1lbnQuU0RhdGEnLCBfX2NsYXNzKTtcclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19