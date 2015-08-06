define('crm/GroupUtility', ['exports', 'module', 'dojo/_base/lang', 'dojo/_base/array', './Format', 'argos/Format', 'moment'], function (exports, module, _dojo_baseLang, _dojo_baseArray, _Format, _argosFormat, _moment) {
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var _array = _interopRequireDefault(_dojo_baseArray);

  var _format = _interopRequireDefault(_Format);

  var _sdkFormat = _interopRequireDefault(_argosFormat);

  var _moment2 = _interopRequireDefault(_moment);

  function _createGroupRequest(o) {
    var defaultOptions = {
      connection: App.getService(false),
      groupId: '',
      resourceKind: 'groups',
      contractName: 'system',
      queryName: 'execute',
      queryArgs: null
    };

    var options = _lang['default'].mixin(defaultOptions, o);

    var request = new Sage.SData.Client.SDataNamedQueryRequest(options.connection);
    request.setQueryName(options.queryName);
    request.setResourceKind(options.resourceKind);
    request.setContractName(options.contractName);
    request.getUri().setCollectionPredicate("'" + options.groupId + "'");

    for (var arg in options.queryArgs) {
      if (options.queryArgs.hasOwnProperty(arg)) {
        request.setQueryArg(arg, options.queryArgs[arg]);
      }
    }

    return request;
  }

  /**
   * @class crm.GroupUtility
   *
   * Saleslogix group based utils
   *
   * @singleton
   *
   */
  var __class = _lang['default'].setObject('crm.GroupUtility', {
    groupDateFormatText: 'M/D/YYYY h:mm:ss a',
    /**
     * Returns an SDataNamedQueryRequest setup for groups
     * @param {Object} options Options for creating the request
     * @param {String} options.groupId The id of the group the request should execute on
     * @param {Object} [options.queryArgs] Additional query arguments to set on the request
     * @param {Object} [options.connection] SData connection. Defaults to use App.getService(false)
     *
     */
    createGroupRequest: function createGroupRequest(options) {
      var defaults = {
        queryName: 'execute'
      };

      return _createGroupRequest(_lang['default'].mixin(defaults, options));
    },

    /**
     * Returns an SDataNamedQueryRequest setup for group metrics
     * @param {Object} options Options for creating the request
     * @param {String} options.groupId The id of the group the request should execute on
     * @param {Object} [options.queryArgs] Additional query arguments to set on the request
     * @param {Object} [options.connection] SData connection. Defaults to use App.getService(false)
     *
     */
    createGroupMetricRequest: function createGroupMetricRequest(options) {
      var defaults = {
        queryName: 'executeMetric'
      };

      return _createGroupRequest(_lang['default'].mixin(defaults, options));
    },
    /**
     * Array of functions that will filter out group layout
     */
    groupFilters: [function groupFilter(layoutItem) {
      return layoutItem.visible;
    }],
    groupFormatters: [{
      name: 'None',
      test: function testNone(layoutItem) {
        return layoutItem.format === 'None';
      },
      formatter: function formatNone(value) {
        return value;
      }
    }, {
      name: 'Phone',
      test: function testPhone(layoutItem) {
        return layoutItem.format === 'Phone';
      },
      formatter: function formatPhone(value) {
        return _format['default'].phone(value);
      }
    }, {
      name: 'Fixed',
      options: {
        clss: 'group-fixed'
      },
      test: function testFixed(layoutItem) {
        return layoutItem.format === 'Fixed';
      },
      formatter: function formatFixed(value) {
        return _format['default'].fixedLocale(value, 2);
      }
    }, {
      name: 'Percent',
      options: {
        clss: 'group-percent'
      },
      test: function testPercent(layoutItem) {
        return layoutItem.format === 'Percent';
      },
      formatter: function formatPercent(value) {
        return _format['default'].percent(value, 0);
      }
    }, {
      name: 'Integer',
      test: function testInteger(layoutItem) {
        return layoutItem.format === 'Integer';
      },
      formatter: function formatInteger(value) {
        return _format['default'].fixedLocale(value, 0);
      }
    }, {
      name: 'Currency',
      test: function testCurrency(layoutItem) {
        return layoutItem.format === 'Currency';
      },
      options: {
        clss: 'group-currency'
      },
      formatter: function formatCurrency(value) {
        return _format['default'].currency(value);
      }
    }, {
      name: 'DateTime',
      options: {
        useRelative: true
      },
      test: function testDate(layoutItem) {
        return layoutItem.format === 'DateTime';
      },
      formatter: function formatDate(value, formatString, formatOptions) {
        if (typeof value === 'string') {
          var dateValue = (0, _moment2['default'])(value);
          if (dateValue.isValid()) {
            if (formatOptions && formatOptions.useRelative) {
              return _format['default'].relativeDate(dateValue);
            }

            return dateValue.format(formatString);
          }
        }

        return value;
      }
    }, {
      name: 'Boolean',
      test: function testBoolean(layoutItem) {
        return layoutItem.format === 'Boolean';
      },
      formatter: function formatBoolean(value) {
        var truthy = ['T', 't', 'Y', '1', '+'];

        return _array['default'].indexOf(truthy, value) === -1 ? _sdkFormat['default'].noText : _sdkFormat['default'].yesText;
      }
    }],
    transformDateFormatString: function transformDateFormatString(gf, defaultFormat) {
      var groupFormat = gf;
      if (groupFormat) {
        groupFormat = groupFormat.replace('MM', 'M');
        groupFormat = groupFormat.replace('mm', 'M');
        groupFormat = groupFormat.replace('m', 'M');
        groupFormat = groupFormat.replace('DD', 'D');
        groupFormat = groupFormat.replace('dd', 'D');
        groupFormat = groupFormat.replace('d', 'D');
        groupFormat = groupFormat.replace('yyyy', 'YYYY');
        groupFormat = groupFormat.replace('yy', 'YYYY');
        return groupFormat;
      }
      return defaultFormat;
    },
    formatTypeByField: {
      'DateTime': {
        name: 'DateTime'
      },
      'Date': {
        name: 'DateTime'
      },
      'Time': {
        name: 'DateTime'
      },
      'Boolean': {
        name: 'Boolean'
      },
      'BCD': {
        name: 'Currency'
      },
      'Fixed': {
        name: 'Fixed'
      },
      'Float': {
        name: 'Fixed'
      },
      'Integer': {
        name: 'Integer'
      },
      'Smallint': {
        name: 'Integer'
      },
      'Largeint': {
        name: 'Integer'
      }
    },
    getFormatterByLayout: function getFormatterByLayout(layoutItem) {
      var _this = this;

      var results = undefined;
      if (layoutItem.format && layoutItem.format !== 'None') {
        results = _array['default'].filter(this.groupFormatters, function filter(formatter) {
          return formatter.name === layoutItem.format;
        });
        if (results.length === 0) {
          results = _array['default'].filter(this.groupFormatters, function filter(formatter) {
            return formatter.name === 'None';
          });
        }
      } else {
        (function () {
          var fieldFormatType = _this.formatTypeByField[layoutItem.fieldType];
          if (!fieldFormatType) {
            fieldFormatType = {
              name: 'None',
              formatString: ''
            };
          }
          results = _array['default'].filter(_this.groupFormatters, function filter(formatter) {
            return formatter.name === fieldFormatType.name;
          });
        })();
      }
      // this means there are no formatters defined.
      if (results.length === 0) {
        results.push({
          name: 'NoFormat',
          formatString: '',
          formatter: function noFormatter(value) {
            return value;
          }
        });
      }

      var fieldFormatter = {
        name: results[0].name,
        options: results[0].options,
        formatter: results[0].formatter.bind(this)
      };

      if (fieldFormatter.name === 'DateTime') {
        fieldFormatter.formatString = this.transformDateFormatString(layoutItem.formatString, this.groupDateFormatText);
      } else {
        fieldFormatter.formatString = layoutItem.formatString;
      }
      return fieldFormatter;
    },
    getLayout: function getLayout(group) {
      var i = 0;
      var layout = _array['default'].filter(group.layout, function filterLayout(item) {
        item.index = i++;
        return _array['default'].every(this.groupFilters, function every(filter) {
          return filter(item);
        });
      }, this);
      return layout;
    },
    getColumnNames: function getColumnNames(layout) {
      var extraSelectColumns = [];
      var columns = _array['default'].map(layout, function mapLayout(item) {
        if (item.format === 'PickList Item') {
          extraSelectColumns.push(item.alias + 'TEXT');
        }

        if (item.format === 'User' || item.format === 'Owner') {
          extraSelectColumns.push(item.alias + 'NAME');
        }

        return item.alias;
      });
      return columns.concat(extraSelectColumns);
    },
    setDefaultGroupPreference: function setDefaultGroupPreference(entityName, groupName) {
      App.preferences['default-group-' + entityName] = groupName;
      App.persistPreferences();
    },
    getDefaultGroupPreference: function getDefaultGroupPreference(entityName) {
      var defaultGroupName = App.preferences['default-group-' + entityName];
      if (!defaultGroupName) {
        defaultGroupName = this.getDefaultGroupUserPreference(entityName);
      }
      return defaultGroupName;
    },
    getDefaultGroupUserPreference: function getDefaultGroupUserPreference(entityName) {
      var defaultGroupName = App.context.userOptions['DefaultGroup:' + entityName.toUpperCase()];
      if (defaultGroupName) {
        defaultGroupName = defaultGroupName.split(':')[1];
      }
      return defaultGroupName;
    },
    getDefaultGroup: function getDefaultGroup(entityName) {
      var groupList = App.preferences['groups-' + entityName];
      var defaultGroup = null;
      var defaultGroupName = null;

      defaultGroupName = this.getDefaultGroupPreference(entityName);

      if (groupList && groupList.length > 0) {
        _array['default'].forEach(groupList, function forEach(group) {
          if (group.name === defaultGroupName) {
            defaultGroup = group;
          }
        });

        if (!defaultGroup) {
          defaultGroup = groupList[0];
        }
        return defaultGroup;
      }
    },
    addToGroupPreferences: function addToGroupPreferences(items, entityName, overwrite) {
      var found = undefined;
      var groupList = this.getGroupPreferences(entityName);
      if (!overwrite && groupList && groupList.length > 0) {
        if (items && items.length > 0) {
          _array['default'].forEach(items, function forEachItem(item) {
            found = -1;
            _array['default'].forEach(groupList, function forEachList(group, i) {
              if (group.$key === item.$key) {
                found = i;
              }
            });

            if (found > -1) {
              groupList[found] = item;
            } else {
              groupList.push(item);
            }
          });
        }
      } else {
        groupList = items;
      }

      App.preferences['groups-' + entityName] = groupList;
      App.persistPreferences();
    },
    removeGroupPreferences: function removeGroupPreferences(itemKey, entityName) {
      var found = -1;
      var groupList = this.getGroupPreferences(entityName);
      if (groupList && groupList.length > 0) {
        _array['default'].forEach(groupList, function forEach(group, i) {
          if (group.$key === itemKey) {
            found = i;
          }
        });
      }

      if (found > -1) {
        groupList.splice(found, 1);
        App.preferences['groups-' + entityName] = groupList;
        App.persistPreferences();
      }
    },
    getGroupPreferences: function getGroupPreferences(entityName) {
      var groupList = App.preferences['groups-' + entityName];
      return groupList;
    },
    groupFieldNames: [{
      name: 'PickList',
      test: function testPickList(layoutItem) {
        return layoutItem.format === 'PickList Item';
      },
      fieldName: function pickListFieldName(layoutItem) {
        return layoutItem.alias.toUpperCase() + 'TEXT';
      }
    }, {
      name: 'OwnerOrUser',
      test: function testOwnerOrUser(layoutItem) {
        return layoutItem.format === 'Owner' || layoutItem.format === 'User';
      },
      fieldName: function ownerOrUserFieldName(layoutItem) {
        return layoutItem.alias.toUpperCase() + 'NAME';
      }
    }],
    getFieldNameByLayout: function getFieldNameByLayout(layoutItem) {
      // Determines what field/property name should be used in the feed for a layout item.
      // This is usually just the layout item's alias in upper case, however there are some exceptions:
      // Picklist layout items need to select the alias + 'TEXT',
      // Owner and user items need to select the alias + 'NAME'
      var results = _array['default'].filter(this.groupFieldNames, function filterFields(name) {
        return name.test(layoutItem);
      });

      if (results.length === 0) {
        results.push({
          fieldName: function fieldName(item) {
            return item.alias.toUpperCase();
          }
        });
      }

      return results[0].fieldName(layoutItem);
    },
    getSelectedGroupLayoutTemplate: function getSelectedGroupLayoutTemplate(entityName) {
      return App.preferences['groups-selected-template-name' + entityName];
    },
    setSelectedGroupLayoutTemplate: function setSelectedGroupLayoutTemplate(entityName, name) {
      App.preferences['groups-selected-template-name' + entityName] = name;
      App.persistPreferences();
    }
  });

  _lang['default'].setObject('Mobile.SalesLogix.GroupUtility', __class);
  module.exports = __class;
});
