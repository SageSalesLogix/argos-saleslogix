define('crm/Views/RecentlyViewed/TotalMetricWidget', ['module', 'exports', '../MetricWidget', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/when', 'argos/Models/Types', 'dojo/Deferred', 'dojo/store/util/QueryResults'], function (module, exports, _MetricWidget, _declare, _lang, _when, _Types, _Deferred, _QueryResults) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _MetricWidget2 = _interopRequireDefault(_MetricWidget);

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _when2 = _interopRequireDefault(_when);

  var _Types2 = _interopRequireDefault(_Types);

  var _Deferred2 = _interopRequireDefault(_Deferred);

  var _QueryResults2 = _interopRequireDefault(_QueryResults);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _declare2.default)('crm.Views.RecentlyViewed.TotalMetricWidget', [_MetricWidget2.default], {
    navToReportView: function navToReportView() {},
    _buildQueryOptions: function _buildQueryOptions() {
      var filters = App.preferences && App.preferences.recentlyViewedEntityFilters ? App.preferences.recentlyViewedEntityFilters : [];
      return {
        returnQueryResults: true,
        filter: function filter(entity) {
          // If the user has entity filters stored in preferences, filter based on that
          if (filters) {
            return filters.some(function (filter) {
              return entity.entityName === filter.name && filter.enabled;
            });
          }

          // User has no entity filter preferences (from right drawer)
          return true;
        }
      };
    },
    _getData: function _getData() {
      var queryOptions = this._buildQueryOptions();
      var model = App.ModelManager.getModel('RecentlyViewed', _Types2.default.OFFLINE);
      var queryResults = model.getEntries(null, queryOptions);
      (0, _when2.default)(queryResults, _lang2.default.hitch(this, this._onQuerySuccessCount, queryResults), _lang2.default.hitch(this, this._onQueryError));
    },
    _onQuerySuccessCount: function _onQuerySuccessCount(results) {
      var def = new _Deferred2.default();
      (0, _when2.default)(results.total, function (total) {
        var metricResults = [{
          name: 'count',
          value: total
        }];
        def.resolve(metricResults);
      });
      this._onQuerySuccess((0, _QueryResults2.default)(def.promise)); // eslint-disable-line
    }
  });
  module.exports = exports['default'];
});