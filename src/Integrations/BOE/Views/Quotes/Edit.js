import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import string from 'dojo/string';
import utility from 'argos/Utility';
import Edit from 'argos/Edit';
import getResource from 'argos/I18n';
import Adapter from 'argos/Models/Adapter';
import BusyIndicator from 'argos/Dialogs/BusyIndicator';
import validator from 'crm/Validator';
import CRM_MODEL_NAMES from 'crm/Models/Names';
import MODEL_NAMES from '../../Models/Names';
import Utility from '../../Utility';

const resource = getResource('quoteEdit');
const contactResource = getResource('contactModel');
const dtFormatResource = getResource('quoteEditDateTimeFormat');

/**
 * @class crm.Views.Account.Edit
 *
 * @extends argos.Edit
 *
 * @requires argos.Edit
 * @requires crm.Format
 * @requires crm.Validator
 * @requires crm.Template
 *
 */
const __class = declare('crm.Integrations.BOE.Views.Quotes.Edit', [Edit], {
  // Localization
  titleText: resource.titleText,
  moreDetailsText: resource.moreDetailsText,
  quoteNumberText: resource.quoteNumberText,
  orderIdText: resource.orderIdText,
  accountText: resource.accountText,
  opportunityText: resource.opportunityText,
  dateCreatedText: resource.dateCreatedText,
  erpStatusText: resource.erpStatusText,
  subTotalText: resource.subTotalText,
  grandTotalText: resource.grandTotalText,
  billToText: resource.billToText,
  shipToText: resource.shipToText,
  payFromText: resource.payFromText,
  startDateText: resource.startDateText,
  endDateText: resource.endDateText,
  expectedDeliveryDateText: resource.expectedDeliveryDateText,
  dateFormat: dtFormatResource.dateFormat,
  commentsText: resource.commentsText,
  productsText: resource.productsText,
  accountProducts: resource.accountProducts,
  requestedByText: resource.requestedByText,
  dropShipmentText: resource.dropShipmentText,
  earlyShipmentText: resource.earlyShipmentText,
  partialShipText: resource.partialShipText,
  statusText: resource.statusText,
  statusTitle: resource.statusTitle,
  typeText: resource.typeText,
  typeTitle: resource.typeTitle,
  customerRFQText: resource.customerRFQText,
  currencyText: resource.currencyText,
  billingContactText: resource.billingContactText,
  shippingContactText: resource.shippingContactText,
  accountingEntityText: resource.accountingEntityText,
  backOfficeText: resource.backOfficeText,
  accountManagerText: resource.accountManagerText,
  warehouseText: resource.warehouseText,
  warehouseLocationText: resource.warehouseLocationText,
  locationText: resource.locationText,
  locationsTitleText: resource.locationsTitleText,
  carrierText: resource.carrierText,

  // View Properties
  id: 'quote_edit',
  detailView: 'quote_detail',
  insertSecurity: 'Entities/Quote/Add',
  updateSecurity: 'Entities/Quote/Edit',
  resourceKind: 'quotes',
  opportunityOpenCode: 'Open',
  warehouseCode: 'Warehouse',
  officeCode: 'Office',
  siteCode: 'Site',
  modelName: MODEL_NAMES.QUOTE,
  _busyIndicator: null,

  init: function init() {
    this.inherited(arguments);

    this.connect(this.fields.Account, 'onChange', this.onAccountChange);
    this.connect(this.fields.RequestedBy, 'onChange', this.onContactChange);
    this.connect(this.fields.Opportunity, 'onChange', this.onOpportunityChange);
    this.connect(this.fields.BillTo, 'onChange', this.onBillToChange);
    this.connect(this.fields.ShipTo, 'onChange', this.onShipToChange);
    this.connect(this.fields.BackOffice, 'onChange', this.onBackOfficeChange);
    this.connect(this.fields.BackOfficeAccountingEntity, 'onChange', this.onBackOfficeAccountingEntityChange);
    this.connect(this.fields.Location, 'onChange', this.onLocationChange);
    this.connect(this.fields.Warehouse, 'onChange', this.onWarehouseChange);
  },
  insert: function insert() {
    this.showUnpromotedFields();
    this.inherited(arguments);
  },
  processData: function processData() {
    this.showBusy();
    this.inherited(arguments);
    this.getEntriesFromIds();
  },
  beforeTransitionTo: function beforeTransitionTo() {
    this.inherited(arguments);
    this.hideUnpromotedFields();
    if (!this.fields.AccountManager.isDisabled) {
      this.fields.AccountManager.disable();
    }
    if (this.fields.BillTo.isDisabled && this.fields.ShipTo.isDisabled) {
      this.fields.BillTo.enable();
      this.fields.ShipTo.enable();
    }
  },
  disableBackOfficeData: function disableBackOfficeData() {
    this.fields.BackOffice.disable();
    this.fields.BackOfficeAccountingEntity.disable();
  },
  enableBackOfficeData: function enableBackOfficeData() {
    this.fields.BackOffice.enable();
    this.fields.BackOfficeAccountingEntity.enable();
  },
  convertValues: function convertValues(values) {
    if (values.BillTo) {
      values.BillTo = {
        '$key': values.BillTo.$key,
      };
    }
    if (values.ShipTo) {
      values.ShipTo = {
        '$key': values.ShipTo.$key,
      };
    }
    return values;
  },
  processEntry: function processEntry(entry) {
    this.inherited(arguments);
    if (entry && entry.Account) {
      ['RequestedBy', 'Opportunity'].forEach((f) => {
        this.fields[f].dependsOn = 'Account';
        this.fields[f].where = string.substitute('Account.Id eq "${0}"', [entry.Account.AccountId || entry.Account.$key || entry.Account.key]);
        if (f === 'Opportunity') {
          this.fields[f].where = `${this.fields[f].where} and Status eq "${this.opportunityOpenCode}"`;
        }
      });
    }
    const warehouseField = this.fields.Warehouse;
    const locationField = this.fields.Location;
    if (entry && entry.ErpLogicalId) {
      warehouseField.enable();
      warehouseField.dependsOn = 'ErpLogicalId';
      warehouseField.where = (logicalId) => {
        return string.substitute('ErpLogicalId eq "${0}" and LocationType eq "${1}"', [logicalId, this.warehouseCode]);
      };
      locationField.enable();
      locationField.dependsOn = 'ErpLogicalId';
      locationField.where = (logicalId) => {
        return string.substitute('ErpLogicalId eq "${0}" and (LocationType eq "${1}" or LocationType eq "${2}")', [logicalId, this.officeCode, this.siteCode]);
      };
    } else {
      warehouseField.disable();
      locationField.disable();
    }
    if (entry.Warehouse) {
      warehouseField.setValue(entry.Warehouse);
    }
    if (entry.Location) {
      locationField.setValue(entry.Location);
    }
    if (entry && entry.ErpExtId) {
      this.disableBackOfficeData();
    } else {
      this.enableBackOfficeData();
    }
    return entry;
  },
  setValues: function setValues() {
    this.inherited(arguments);

    if (!this.fields.CurrencyCode.getValue()) {
      const account = this.fields.Account.currentSelection;
      if (account && account.CurrencyCode) {
        this.fields.CurrencyCode.setValue(account.CurrencyCode);
      } else {
        this.fields.CurrencyCode.setValue(App.getBaseExchangeRate().code);
      }
    }
  },
  onRefresh: function onRefresh() {
    this.inherited(arguments);
    ['RequestedBy', 'Opportunity', 'BackOfficeAccountingEntity', 'Warehouse', 'Location'].forEach((f) => {
      this.fields[f].dependsOn = null;
      this.fields[f].where = null;
    });
  },
  onRefreshInsert: function onRefreshInsert() {
    this.inherited(arguments);
    this.enableBackOfficeData();
  },
  getEntriesFromIds: function getEntriesFromIds() {
    const mappedLookups = [
      'BackOffice',
      'BackOfficeAccountingEntity',
    ];
    const mappedProperties = [
      'LogicalId',
      'AcctEntityExtId',
    ];
    const fields = ['ErpLogicalId', 'ErpAccountingEntityId'];
    Utility.setFieldsFromIds(mappedLookups, mappedProperties, fields, this).then(() => {
      this.hideBusy();
    });
  },
  getPrimaryContact: function getPrimaryContact(entry) {
    const accountModel = Adapter.getModel(CRM_MODEL_NAMES.ACCOUNT);
    const relationship = {
      name: 'Contacts',
      displayName: contactResource.entityDisplayNamePlural,
      type: 'OneToMany',
      relatedEntity: 'Contact',
      relatedProperty: 'Account',
      relatedPropertyType: 'object',
      where: `IsPrimary eq true`,
    };
    accountModel.getRelatedRequest(entry, relationship).then((result) => {
      if (result && result.entities && result.entities.length) {
        const contactField = this.fields.RequestedBy;
        if (!contactField.currentSelection || contactField.currentSelection.Account && contactField.currentSelection.Account.$key !== entry.$key) {
          contactField.setSelection(result.entities[0]);
          if (this.fields.Account.currentSelection && !this.fields.Account.currentSelection.ErpExtId) {
            this.populateUnpromotedFields(contactField.currentSelection);
          }
        }
      }
    });
  },
  hidePromotedFields: function hidePromotedFields() {
    this.fields.BillTo.hide();
    this.fields.ShipTo.hide();
  },
  hideUnpromotedFields: function hideUnpromotedFields() {
    this.fields.BillingContact.hide();
    this.fields.ShippingContact.hide();
  },
  populateUnpromotedFields: function populateUnpromotedFields(contact) {
    this.fields.BillingContact.setSelection(contact);
    this.fields.ShippingContact.setSelection(contact);
  },
  onAccountChange: function onAccountChange(value, field) {
    const entry = field.currentSelection;
    ['RequestedBy', 'Opportunity'].forEach((f) => {
      if (value) {
        this.fields[f].dependsOn = 'Account';
        this.fields[f].where = string.substitute('Account.Id eq "${0}"', [value.AccountId || value.$key || value.key]);
        if (f === 'Opportunity') {
          this.fields[f].where = `${this.fields[f].where} and Status eq "${this.opportunityOpenCode}"`;
        }
      }
    });
    if (entry) {
      this.fields.CurrencyCode.setValue((entry.CurrencyCode) ? entry.CurrencyCode : App.getBaseExchangeRate().code);
      if (this.fields.BillTo.isDisabled() && this.fields.ShipTo.isDisabled()) {
        this.fields.BillTo.enable();
        this.fields.ShipTo.enable();
      }
      if (entry.ErpExtId) {
        this.showPromotedFields();
      } else {
        this.hidePromotedFields();
      }
      if (entry.AccountManager) {
        const accountManagerField = this.fields.AccountManager;
        accountManagerField.setSelection({
          $key: entry.AccountManager.$key,
        });
      }
      field.setValue(field.currentSelection);
      this.showBusy();
      this.getPrimaryContact(entry);
      Utility.setFieldsFromIds(
        ['BackOffice', 'BackOfficeAccountingEntity'],
        ['LogicalId', 'AcctEntityExtId'],
        ['ErpLogicalId', 'ErpAccountingEntityId'],
        this,
        entry
      ).then(() => {
        this.hideBusy();
      });
    }
  },
  onAccountDependentChange: function onAccountDependentChange(value, field) {
    if (value && !field.dependsOn && field.currentSelection && field.currentSelection.Account) {
      const accountField = this.fields.Account;
      accountField.setSelection(field.currentSelection.Account);
      this.onAccountChange(accountField.getValue(), accountField);
    }
  },
  onBackOfficeChange: function onBackOfficeChange(value, field) {
    this.fields.BackOffice.setValue(field.currentSelection);
    this.fields.ErpLogicalId.setValue(field.currentSelection.LogicalId);
    const accountingField = this.fields.BackOfficeAccountingEntity;
    accountingField.where = `BackOffice.Id eq "${field.currentSelection.$key}"`;
    const accountingIsToBackOffice = accountingField.currentSelection && accountingField.currentSelection.BackOffice.$key === field.currentSelection.$key;
    if (field.currentSelection.BackOfficeAccountingEntities.$resources && !accountingIsToBackOffice) {
      const entry = field.currentSelection.BackOfficeAccountingEntities.$resources[0];
      if (entry) {
        accountingField.setSelection(entry);
        this.onBackOfficeAccountingEntityChange(accountingField.getValue(), accountingField);
      }
    }
    const warehouseField = this.fields.Warehouse;
    if (warehouseField.isDisabled) {
      warehouseField.enable();
      warehouseField.dependsOn = 'ErpLogicalId';
      warehouseField.where = (logicalId) => {
        return string.substitute('ErpLogicalId eq "${0}" and LocationType eq "${1}"', [logicalId, this.warehouseCode]);
      };
    }
    const locationField = this.fields.Location;
    if (locationField.isDisabled) {
      locationField.enable();
      locationField.dependsOn = 'ErpLogicalId';
      locationField.where = (logicalId) => {
        return string.substitute('ErpLogicalId eq "${0}" and (LocationType eq "${1}" or LocationType eq "${2}")', [logicalId, this.officeCode, this.siteCode]);
      };
    }
  },
  onBackOfficeAccountingEntityChange: function onBackOfficeAccountingEntityChange(value, field) {
    this.fields.BackOfficeAccountingEntity.setValue(field.currentSelection);
    this.fields.ErpAccountingEntityId.setValue(field.currentSelection.AcctEntityExtId);
  },
  onBillToChange: function onBillToChange(value, field) {
    this.fields.BillTo.setValue(field.currentSelection);
  },
  onContactChange: function onContactChange(value, field) {
    this.onAccountDependentChange(value, field);
  },
  onLocationChange: function onLocationChance(value, field) {
    if (field.currentSelection.ErpExtId) {
      this.fields.ErpLocation.setValue(field.currentSelection.ErpExtId);
    }
    this.fields.Location.setValue(field.currentSelection);
  },
  onOpportunityChange: function onOpportunityChange(value, field) {
    this.onAccountDependentChange(value, field);
  },
  onShipToChange: function onShipToChange(value, field) {
    this.fields.ShipTo.setValue(field.currentSelection);
  },
  onWarehouseChange: function onWarehouseChange(value, field) {
    this.fields.Warehouse.setValue(field.currentSelection);
  },
  applyContext: function applyContext() {
    this.inherited(arguments);
    const found = this._getNavContext();

    const accountField = this.fields.Account;
    this.onAccountChange(accountField.getValue(), accountField);

    const context = (found && found.options && found.options.source) || found;
    const lookup = {
      'accounts': this.applyAccountContext,
      'contacts': this.applyContactContext,
      'opportunities': this.applyOpportunityContext,
    };

    if (context && lookup[context.resourceKind]) {
      lookup[context.resourceKind].call(this, context);
    }

    if (!this.fields.Account.currentSelection && !this.fields.Account.currentValue) {
      this.fields.BillTo.disable();
      this.fields.ShipTo.disable();
    }
    if (!this.fields.BackOffice.currentSelection) {
      this.fields.Location.disable();
      this.fields.Warehouse.disable();
    }
  },
  _getNavContext: function _getNavContext() {
    const navContext = App.queryNavigationContext(function checkContext(o) {
      const context = (o.options && o.options.source) || o;

      if (/^(accounts|contacts|opportunities)$/.test(context.resourceKind) && context.key) {
        return true;
      }

      return false;
    });
    return navContext;
  },
  applyAccountContext: function applyAccountContext(context) {
    const view = App.getView(context.id);
    const entry = context.entry || (view && view.entry) || context;

    if (!entry || !entry.$key) {
      return;
    }

    const accountField = this.fields.Account;
    accountField.setSelection(entry);
    this.onAccountChange(accountField.getValue(), accountField);
  },
  applyContactContext: function applyContactContext(context) {
    const view = App.getView(context.id);
    const entry = context.entry || (view && view.entry) || context;

    if (!entry || !entry.$key) {
      return;
    }

    const contactField = this.fields.RequestedBy;
    contactField.setSelection(entry);
    this.onAccountDependentChange(contactField.getValue(), contactField);
  },
  applyOpportunityContext: function applyOpportunityContext(context) {
    const view = App.getView(context.id);
    const entry = context.entry || (view && view.entry) || context;

    if (!entry || !entry.$key) {
      return;
    }

    const opportunityField = this.fields.Opportunity;
    opportunityField.setSelection(entry);
    this.onAccountDependentChange(opportunityField.getValue(), opportunityField);
  },
  hideBusy: function hideBusy() {
    if (this._busyIndicator) {
      this._busyIndicator.complete();
      App.modal.disableClose = false;
      App.modal.hide();
    }
  },
  showBusy: function showBusy() {
    if (!this._busyIndicator || this._busyIndicator._destroyed) {
      this._busyIndicator = new BusyIndicator({ id: this.id + '-busyIndicator' });
    }
    this._busyIndicator.start();
    App.modal.disableClose = true;
    App.modal.showToolbar = false;
    App.modal.add(this._busyIndicator);
  },
  showPromotedFields: function showPromotedFields() {
    this.fields.BillTo.show();
    this.fields.ShipTo.show();
  },
  showUnpromotedFields: function showUnpromotedFields() {
    this.fields.BillingContact.show();
    this.fields.ShippingContact.show();
  },
  formatDependentQuery: function formatDependentQuery(dependentValue, theFormat, property) {
    return string.substitute(theFormat, [utility.getValue(dependentValue, property || '$key')]);
  },
  createLayout: function createLayout() {
    return this.layout || (this.layout = [{
      title: this.detailsText,
      name: 'DetailsSection',
      children: [{
        label: this.accountText,
        name: 'Account',
        property: 'Account',
        type: 'lookup',
        emptyText: '',
        valueTextProperty: 'AccountName',
        view: 'account_related',
        autoFocus: true,
        required: true,
      }, {
        label: this.opportunityText,
        name: 'Opportunity',
        property: 'Opportunity',
        type: 'lookup',
        emptyText: '',
        valueTextProperty: 'Description',
        view: 'opportunity_related',
        where: `Status eq "${this.opportunityOpenCode}"`,
      }, {
        label: this.backOfficeText,
        name: 'BackOffice',
        type: 'lookup',
        emptyText: '',
        valueTextProperty: 'BackOfficeName',
        view: 'quote_backoffice_related',
        where: `IsActive eq true`,
        include: false,
      }, {
        name: 'ErpLogicalId',
        property: 'ErpLogicalId',
        type: 'hidden',
        emptyText: '',
      }, {
        label: this.accountingEntityText,
        name: 'BackOfficeAccountingEntity',
        type: 'lookup',
        emptyText: '',
        valueTextProperty: 'Name',
        view: 'quote_backofficeaccountingentity_related',
        include: false,
      }, {
        name: 'ErpAccountingEntityId',
        property: 'ErpAccountingEntityId',
        type: 'hidden',
        emptyText: '',
      }, {
        label: this.currencyText,
        name: 'CurrencyCode',
        property: 'CurrencyCode',
        type: 'picklist',
        picklist: 'Currency Codes',
        singleSelect: true,
        textProperty: 'code',
        keyProperty: 'code',
      }, {
        label: this.startDateText,
        name: 'StartDate',
        property: 'StartDate',
        type: 'date',
        timeless: false,
        showTimePicker: true,
        showRelativeDateTime: false,
        dateFormatText: this.dateFormat,
        minValue: (new Date(1900, 0, 1)),
        validator: [
          validator.isDateInRange,
        ],
      }, {
        label: this.endDateText,
        name: 'EndDate',
        property: 'EndDate',
        type: 'date',
        timeless: false,
        showTimePicker: true,
        showRelativeDateTime: false,
        dateFormatText: this.dateFormat,
        minValue: (new Date(1900, 0, 1)),
        validator: [
          validator.isDateInRange,
        ],
      }, {
        label: this.expectedDeliveryDateText,
        name: 'ExpectedDeliveryDate',
        property: 'ExpectedDeliveryDate',
        type: 'date',
        timeless: false,
        showTimePicker: true,
        showRelativeDateTime: false,
        dateFormatText: this.dateFormat,
        minValue: (new Date(1900, 0, 1)),
        validator: [
          validator.isDateInRange,
        ],
      }, {
        label: this.customerRFQText,
        name: 'CustomerRFQNumber',
        property: 'CustomerRFQNumber',
        type: 'text',
      }, {
        label: this.commentsText, // TODO: Make on save, append 'Created by <user> on <datetime>' to comment
        noteProperty: false,
        name: 'Comments',
        property: 'Comments',
        title: this.commentsText,
        type: 'note',
        view: 'text_edit',
      }, {
        label: this.locationText,
        name: 'Location',
        property: 'Location',
        type: 'lookup',
        emptyText: '',
        valueTextProperty: 'Description',
        view: 'quote_location_list',
        title: this.locationsTitleText,
      }, {
        name: 'ErpLocation',
        property: 'ErpLocation',
        type: 'hidden',
        emptyText: '',
      }, {
        label: this.warehouseText,
        name: 'Warehouse',
        property: 'Warehouse',
        type: 'lookup',
        emptyText: '',
        valueTextProperty: 'Description',
        view: 'quote_warehouse_list',
        title: this.warehouseLocationText,
      },
    ]}, {
      title: this.moreDetailsText,
      name: 'MoreDetailsSection',
      collapsed: true,
      children: [{
        label: this.requestedByText,
        name: 'RequestedBy',
        property: 'RequestedBy',
        type: 'lookup',
        emptyText: '',
        valueTextProperty: 'NameLF',
        view: 'contact_related',
      }, {
        label: this.statusText,
        name: 'Quote Status',
        property: 'Status',
        type: 'picklist',
        picklist: 'QuoteStatus',
        singleSelect: true,
        titleText: this.statusTitle,
      }, {
        dependsOn: 'Account',
        label: this.billToText,
        name: 'BillTo',
        property: 'BillTo',
        type: 'lookup',
        emptyText: '',
        valueTextProperty: 'Address.FullAddress',
        view: 'quote_billTos_related',
        where: this.formatDependentQuery.bindDelegate(
          this, 'ErpBillToAccounts.Account.Id eq "${0}"'
        ),
      }, {
        dependsOn: 'Account',
        label: this.billingContactText,
        name: 'BillingContact',
        property: 'BillingContact',
        type: 'lookup',
      }, {
        dependsOn: 'Account',
        label: this.shipToText,
        name: 'ShipTo',
        property: 'ShipTo',
        type: 'lookup',
        emptyText: '',
        valueTextProperty: 'Address.FullAddress',
        view: 'quote_shipTos_related',
        where: this.formatDependentQuery.bindDelegate(
          this, 'ErpShipToAccounts.Account.Id eq "${0}"'
        ),
      }, {
        dependsOn: 'ErpLogicalId',
        label: this.carrierText,
        name: 'Carrier',
        property: 'Carrier',
        type: 'lookup',
        emptyText: '',
        valueTextProperty: 'CarrierName',
        view: 'quote_carriers',
        where: (value) => {
          return `ErpLogicalId eq "${value}"`;
        },
      }, {
        dependsOn: 'Account',
        label: this.shippingContactText,
        name: 'ShippingContact',
        property: 'ShippingContact',
        type: 'lookup',
      }, {
        label: this.dropShipmentText,
        name: 'DropShipment',
        property: 'DropShip',
        include: true,
        type: 'boolean',
        onText: this.yesText,
        offText: this.noText,
      }, {
        label: this.earlyShipmentText,
        name: 'EarlyShipment',
        property: 'ShipEarly',
        include: true,
        type: 'boolean',
        onText: this.yesText,
        offText: this.noText,
      }, {
        label: this.partialShipText,
        name: 'PartialShipment',
        property: 'PartialShip',
        include: true,
        type: 'boolean',
        onText: this.yesText,
        offText: this.noText,
      }, {
        label: this.accountManagerText,
        name: 'AccountManager',
        property: 'AccountManager',
        include: true,
        type: 'lookup',
        emptyText: '',
        valueTextProperty: 'Name',
      },
    ]},
  ]);
  },
});

lang.setObject('icboe.Views.Quotes.Edit', __class);
lang.setObject('icboe.Views.Quotes.Edit', __class);
export default __class;
