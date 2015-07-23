/**
 * @class crm.Views.Offline.Detail
 *
 *
 * @extends argos._DetailBase
 * @requires argos._DetailBase
 *
 */
define('crm/Views/Offline/Detail', [
    'dojo/_base/declare',
    'argos/_DetailBase',
    'argos/Store/PouchDB'
], function(
    declare,
    _DetailBase,
    Store
    ) {

    return declare('crm.Views.Offline.Detail', [_DetailBase], {
        id: 'offline_detail',
        titleText: 'Recently Viewed Detail',

        idProperty: 'id',

        OFFLINE_DB_NAME: 'crm-offline',
        offlineDoc: null,
        createStore: function() {
            return new Store({databaseName: this.OFFLINE_DB_NAME});
        },
        _applyStateToGetOptions: function() {
        },
        _buildGetExpression: function() {
            var options = this.options;
            return options && (options.id || options.key);
        },
        processEntry: function(offlineEntry) {
            var arg = arguments[0];
            this.offlineDoc = offlineEntry;

            arg = this.offlineDoc.entity;
            this.inherited(arguments);
        },
        createLayout: function() {
            var views, view, i, len, createLayoutFn, layout;
            views = App.getViews();
            len = views.length;

            for (i = 0; i < len; i++) {
                view = views[i];
                if (view.id === this.offlineDoc.storedBy && view.createLayout) {
                    createLayoutFn = view.createLayout;
                    break;
                }
            }

            view.entry = this.entry.entity;
            layout = createLayoutFn.apply(view);

            // TODO: Filter the layout to exclude rows we don't want (Quick actions, relatted items, etc)?
            return layout;
        }
    });
});
