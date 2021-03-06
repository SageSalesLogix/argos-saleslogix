define('crm/Views/User/List', ['module', 'exports', 'dojo/_base/declare', 'argos/List', 'argos/I18n'], function (module, exports, _declare, _List, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _List2 = _interopRequireDefault(_List);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var resource = (0, _I18n2.default)('userList'); /* Copyright 2017 Infor
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

  var __class = (0, _declare2.default)('crm.Views.User.List', [_List2.default], {
    // Templates
    itemTemplate: new Simplate(['<p class="listview-heading">{%: $.UserInfo.LastName %}, {%: $.UserInfo.FirstName %}</p>', '<p class="micro-text">{%: $.UserInfo.Title %}</p>']),

    // Localization
    titleText: resource.titleText,

    // View Properties
    id: 'user_list',
    isCardView: false,
    queryOrderBy: 'UserInfo.LastName asc, UserInfo.FirstName asc',

    // Excluded types for the queryWhere
    // Type:
    // 3 - WebViewer
    // 5 - Retired
    // 6 - Template
    // 7 - AddOn
    queryWhere: 'Enabled eq true and (Type ne 3 AND Type ne 5 AND Type ne 6 AND Type ne 7)',
    querySelect: ['UserInfo/FirstName', 'UserInfo/LastName', 'UserInfo/Title', 'UserInfo/UserName'],
    resourceKind: 'users',

    formatSearchQuery: function formatSearchQuery(searchQuery) {
      var q = this.escapeSearchQuery(searchQuery.toUpperCase());
      return 'upper(UserInfo.UserName) like "%' + q + '%"';
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});