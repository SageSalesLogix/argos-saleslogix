/*
 * See copyright file.
 */
import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import string from 'dojo/string';
import convert from 'argos/Convert';
import RelatedViewManager from 'argos/RelatedViewManager';
import DashboardWidget from '../../DashboardWidget';
import getResource from 'argos/I18n';

const resource = getResource('salesDashboardWidget');

const __class = declare('icboe.Views.Account.SalesDashboardWidget', [DashboardWidget], {
  // Localization
  recentRevenueText: resource.recentRevenueText,
  recentCostText: resource.recentCostText,
  recentProfitText: resource.recentProfitText,
  recentMarginText: resource.recentMarginText,
  yoyRevenueText: resource.yoyRevenueText,
  yoyProfitText: resource.yoyProfitText,
  yoyMarginText: resource.yoyMarginText,
  titleText: resource.titleText,
  categoryText: resource.categoryText,

  // Override variables for _DashboardWidgetBase
  color: '#313236',
  selectedColor: '#50535a',
  dayValue: 90,
  yearDays: 365,
  queriedOnce: false,

  // Codes for the status picklist of the entity
  openCode: 'Open',
  pendingCode: 'Pending',
  partialPaidCode: 'PartialPaid',
  paidCode: 'Paid',
  closedCode: 'Closed',
  canceledCode: 'Canceled',

  /**
     * Values for the metrics
     * name: valueNeeded by the widget,
     * aggregate: function to aggregate the value,
     * aggregateModule: path to the file holding the aggregate function,
     * value: set to null (will hold the value once queried),
     * queryIndex: the index of the query based on how it was added to queryArgs in the setQueryArgs function,
     * dateDependent: bool to let the base know whether to refresh the value on a range change
     */
  values: [{
    name: 'revenue',
    aggregate: 'sum',
    aggregateModule: 'crm/Aggregate',
    value: null,
    queryIndex: 0,
    dateDependent: true,
  }, {
    name: 'cost',
    aggregate: 'sum',
    aggregateModule: 'crm/Aggregate',
    value: null,
    queryIndex: 1,
    dateDependent: true,
  }, {
    name: 'profit',
    aggregate: 'calcProfit',
    aggregateModule: 'icboe/Aggregate',
    value: null,
    queryIndex: [0, 1],
    dateDependent: true,
  }, {
    name: 'margin',
    aggregate: 'calcMargin',
    aggregateModule: 'icboe/Aggregate',
    value: null,
    queryIndex: [0, 1],
    dateDependent: true,
  }, {
    name: 'yoyRevenue',
    aggregate: 'calcYoYRevenue',
    aggregateModule: 'icboe/Aggregate',
    value: null,
    queryIndex: [2, 3],
    dateDependent: false,
  }, {
    name: 'yoyProfit',
    aggregate: 'calcYoYProfit',
    aggregateModule: 'icboe/Aggregate',
    value: null,
    queryIndex: [2, 3, 4, 5],
    dateDependent: false,
  }, {
    name: 'yoyMargin',
    aggregate: 'calcYoYMargin',
    aggregateModule: 'icboe/Aggregate',
    value: null,
    queryIndex: [2, 3, 4, 5],
    dateDependent: true,
  }],

  resourceKind: 'accounts',
  querySelect: [
    'AccountName',
  ],
  queryArgs: null,
  getWhere: function getWhere() {
    return "Id eq '" + this.parentEntry.$key + "'";
  },
  getBaseQuery: function getBaseQuery(entry) {
    const query = '(Account.Id eq "' + entry.$key + '" and (ErpStatus eq "' + this.openCode + '" or ErpStatus eq "' + this.partialPaidCode + '" or ErpStatus eq "' + this.pendingCode + '" or ErpStatus eq "' + this.paidCode + '"))';
    return query;
  },
  createRangeLayout: function createRangeLayout() {
    const rangeLayout = [{
      value: 30,
    }, {
      value: 60,
    }, {
      value: 90,
    }, {
      value: 180,
    }, {
      value: 365,
    }];
    return rangeLayout;
  },
  createMetricLayout: function createMetricLayout(entry) {
    this.setQueryArgs(entry);

    /**
       * Format of metric layout:
       * formatter: value,
       * formatModule: module to load that contains the value,
       * title: title of the widget,
       * valueNeeded: value that the widget consumes
     */
    const metricLayout = [{
      formatter: 'bigNumber',
      formatModule: 'crm/Format',
      title: this.recentRevenueText,
      valueNeeded: 'revenue',
      decorator: 'positiveTrend',
    }, {
      formatter: 'bigNumber',
      formatModule: 'crm/Format',
      title: this.recentProfitText,
      valueNeeded: 'profit',
      decorator: 'positiveTrend',
    }, {
      formatter: 'percent',
      formatModule: 'argos/Format',
      title: this.recentMarginText,
      valueNeeded: 'margin',
      decorator: 'positiveTrend',
    }, {
      formatter: 'percent',
      formatModule: 'argos/Format',
      title: this.yoyRevenueText,
      valueNeeded: 'yoyRevenue',
      decorator: 'positiveTrend',
    }, {
      formatter: 'percent',
      formatModule: 'argos/Format',
      title: this.yoyProfitText,
      valueNeeded: 'yoyProfit',
      decorator: 'positiveTrend',
    }, {
      formatter: 'percent',
      formatModule: 'argos/Format',
      title: this.yoyMarginText,
      valueNeeded: 'yoyMargin',
      decorator: 'positiveTrend',
    }];

    return metricLayout;
  },
  setQueryArgs: function setQueryArgs(entry) {
    // This function builds the query args array in an order that matches the queryIndex values needed by the values array
    this.queryArgs = [];
    this.queryArgs.push([
      'erpInvoices',
      {
        _activeFilter: this.getBaseQuery(entry) + ' and ' + this.pastDays('ErpDocumentDate', this.dayValue, null),
        _filterName: 'ErpStatus',
        _metricName: 'SumGrandTotal',
      },
    ], [
      'erpInvoices',
      {
        _activeFilter: this.getBaseQuery(entry) + ' and ' + this.pastDays('ErpDocumentDate', this.dayValue, null),
        _filterName: 'ErpStatus',
        _metricName: 'SumExtendedCost',
      },
    ]);

    if (!this.queriedOnce) {
      this.queryArgs.push([
        'erpInvoices',
        {
          _activeFilter: this.getBaseQuery(entry) + ' and ' + this.pastDays('ErpDocumentDate', this.yearDays, null),
          _filterName: 'ErpStatus',
          _metricName: 'SumGrandTotal',
        },
      ], [
        'erpInvoices',
        {
          _activeFilter: this.getBaseQuery(entry) + ' and ' + this.pastDays('ErpDocumentDate', 2 * this.yearDays, this.yearDays),
          _filterName: 'ErpStatus',
          _metricName: 'SumGrandTotal',
        },
      ], [
        'erpInvoices',
        {
          _activeFilter: this.getBaseQuery(entry) + ' and ' + this.pastDays('ErpDocumentDate', this.yearDays, null),
          _filterName: 'ErpStatus',
          _metricName: 'SumExtendedCost',
        },
      ], [
        'erpInvoices',
        {
          _activeFilter: this.getBaseQuery(entry) + ' and ' + this.pastDays('ErpDocumentDate', 2 * this.yearDays, this.yearDays),
          _filterName: 'ErpStatus',
          _metricName: 'SumExtendedCost',
        },
      ]);
    }
    this.queriedOnce = true;
  },
  pastDays: function pastDays(property, from, to) {
    const now = moment();

    const pastWeekStart = now.clone().subtract(from, 'days').startOf('day');
    let today;

    if (!to) {
      today = now.clone().endOf('day');
    } else {
      today = now.clone().subtract(to, 'days').endOf('day');
    }

    const query = string.substitute(
      '((' + property + ' between @${0}@ and @${1}@) or (' + property + ' between @${2}@ and @${3}@))',
      [
      convert.toIsoStringFromDate(pastWeekStart.toDate()),
      convert.toIsoStringFromDate(today.toDate()),
      pastWeekStart.format('YYYY-MM-DDT00:00:00[Z]'),
      today.format('YYYY-MM-DDT23:59:59[Z]'),
      ]
    );
    return query;
  },
});
const rvm = new RelatedViewManager();
rvm.registerType('account_sales_dashboard_widget', __class);
export default __class;
