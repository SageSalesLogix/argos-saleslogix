import lang from 'dojo/_base/lang';
import ErrorManager from 'argos/ErrorManager';
import SData from 'argos/Store/SData';

const PickListService = ICRMServicesSDK.PickListService;
const picklistFormat = ICRMCommonSDK.format.picklist;

const __class = lang.setObject('crm.PicklistService', {
  _picklists: {},
  _currentRequests: new Map(),

  // Previous properties
  _viewMapping: {},
  _store: null,
  contractName: 'system',
  resourceKind: 'picklists',
  include: ['items'],
  select: [
    'name',
    'allowMultiples',
    'valueMustExist',
    'required',
    'alphaSorted',
    'noneEditable',
    'modifyDate',
    'items/text',
    'items/code',
    'items/number',
  ],
  orderBy: 'name',
  where: '',

  init(service, storage) {
    this.service = new PickListService(storage, service);
  },
  getPicklistByKey(key) {
    return this.getPicklistByName(key);
  },
  getPicklistByName(name, languageCode) {
    if (languageCode) {
      const picklist = this._picklists[`${name}_${languageCode}`];
      if (picklist) {
        return picklist;
      }
    }
    return this._picklists[name] || false;
  },
  getPicklistItemByKey(picklistName, key, languageCode = App.getCurrentLocale()) {
    const picklist = this.getPicklistByName(picklistName, languageCode);

    if (picklist) {
      for (let i = 0; i < picklist.items.length; i++) {
        if (picklist.items[i].$key === key) {
          return picklist.items[i];
        }
      }
    }
    return false;
  },
  getPicklistItemByCode(picklistName, itemCode, languageCode = App.getCurrentLocale()) {
    const picklist = this.getPicklistByName(picklistName, languageCode);

    if (picklist) {
      for (let i = 0; i < picklist.items.length; i++) {
        if (picklist.items[i].code === itemCode) {
          return picklist.items[i];
        }
      }
    }
    return false;
  },
  getPicklistItemTextByCode(picklistName, itemCode, languageCode = App.getCurrentLocale()) {
    const picklistItem = this.getPicklistItemByCode(picklistName, itemCode, languageCode);
    if (itemCode && picklistItem) {
      return picklistItem.text;
    }
    return null;
  },
  getPicklistItemTextByKey(picklistName, key, languageCode = App.getCurrentLocale()) {
    const picklistItem = this.getPicklistItemByKey(picklistName, key, languageCode);
    if (key && picklistItem) {
      return picklistItem.text;
    }
    return null;
  },
  format(picklistCode /* , storageMode */) {
    const picklist = this.getPicklistByName(picklistCode);
    return picklistFormat(picklist);
  },
  registerPicklist(code, picklist) {
    if (!this._picklists[code]) {
      this._picklists[code] = picklist;
    }
  },
  requestPicklistsFromArray(picklists) {
    const promise = new Promise((resolve, reject) => {
      const promises = [];
      for (let i = 0; i < picklists.length; i++) {
        promises.push(this.requestPicklist(picklists[i]));
      }
      Promise.all(promises).then(() => {
        resolve(true);
      }, (response) => {
        reject(response);
      });
    });
    return promise;
  },
  onPicklistSuccess(resolve, languageCode) {
    return (result) => {
      let picklist = null;
      if (result && result.items) {
        picklist = result;
        picklist.items = picklist.items.$resources.map(item => Object.assign({}, item, { id: item.$key }));
        if (languageCode) {
          this._picklists[`${picklist.name}_${languageCode}`] = picklist;
        } else {
          this._picklists[picklist.name] = picklist;
        }
      }
      this.removeRequest(picklist.name);
      resolve(picklist);
    };
  },
  onPicklistError(reject, name) {
    return (response, o) => {
      this.removeRequest(name);
      ErrorManager.addError(response, o, null, 'failure');
      reject(response);
    };
  },
  requestPicklist(name, queryOptions = {}) {
    // Avoid duplicating model requests
    if (this.hasRequest(name)) {
      return new Promise(resolve => resolve());
    }
    const pickListServiceOptions = Object.assign({}, {
      storageMode: 'code',
    }, queryOptions);
    const language = this.determineLanguage(pickListServiceOptions, queryOptions);
    return new Promise((resolve, reject) => {
      this.addRequest(name);
      const {
        options,
        handlers,
      } = this.service.getFirstByName(
        name,
        this.onPicklistSuccess(resolve, language),
        this.onPicklistError(reject, name),
        { pickListServiceOptions, language, useCache: true }
      );
      if (options) {
        const request = this.service.setUpRequest(
          new Sage.SData.Client.SDataResourceCollectionRequest(App.getService(false))
            .setContractName(this.contractName),
          options
        );
        request.read(handlers);
      }
    }).catch(err => console.error(err)); // eslint-disable-line
  },
  determineLanguage(serviceOptions, queryOptions) {
    if (serviceOptions.filterByLanguage) {
      return (queryOptions.language && queryOptions.language.trim())
          || App.getCurrentLocale();
    }
    if (serviceOptions.filterByLanguage === false) {
      // This means disable fallback
      // Used for Name Prefix and Suffix we only want the filtered picklist.
      return queryOptions.language || ' ';
    }
    return queryOptions.language || App.getCurrentLocale();
  },

  /**
   * Simple requestMap to optimize requests to avoid overlap from model requests
   */
  addRequest(name) {
    return this._currentRequests.set(name, true);
  },
  removeRequest(name) {
    return this._currentRequests.delete(name);
  },
  hasRequest(name) {
    return this._currentRequests.has(name);
  },

  // Previous functions
  getViewPicklists: function getViewPicklists(viewId) {
    const picklistIds = this._viewMapping[viewId];
    const picklists = [];
    if (picklistIds && picklistIds.length) {
      for (let i = 0; i < picklistIds.length; i++) {
        if (this._picklists[picklistIds[i]]) {
          picklists.push(this._picklists[picklistIds[i]]);
        } else {
          console.warn('Picklist "' + picklistIds[i] + '" has not been registered'); // eslint-disable-line
        }
      }
      return picklists;
    }
    return null;
  },
  registerPicklistToView: function registerPicklistToView(code, viewId) {
    if (!this._viewMapping[viewId]) {
      this._viewMapping[viewId] = [];
    }
    if (!this._viewMapping[viewId][code]) {
      this._viewMapping[viewId].push(code);
    } else {
      console.log('Picklist already exists for view "' + viewId + '"'); // eslint-disable-line
    }
    this.registerPicklist(code, true);
  },
  getStore: function getStore() {
    if (!this._store) {
      const options = this.getStoreOptions();
      this._store = new SData(options);
    }
    return this._store;
  },
  getStoreOptions: function getStoreOptions() {
    const options = {
      service: App.getService(false),
      contractName: this.contractName,
      resourceKind: this.resourceKind,
      include: this.include,
      select: this.select,
      orderBy: this.orderBy,
      where: this.where,
      scope: this,
    };
    return options;
  },
});

// Backwards compatibility
lang.setObject('crm.Integrations.BOE.PicklistService', __class);
lang.setObject('icboe.PicklistService', __class);
export default __class;
