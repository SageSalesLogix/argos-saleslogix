define('Mobile/SalesLogix/Views/OpportunityProduct/Edit', [
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/string',
    'Mobile/SalesLogix/Validator',
    'Mobile/SalesLogix/Template',
    'Sage/Platform/Mobile/Utility',
    'Sage/Platform/Mobile/Edit'
], function(
    declare,
    array,
    string,
    validator,
    template,
    utility,
    Edit
) {

    return declare('Mobile.SalesLogix.Views.OpportunityProduct.Edit', [Edit], {
        //Localization
        titleText: 'Opportunity Product',
        detailsText: 'Details',
        opportunityText: 'opportunity',
        productText: 'product',
        productFamilyText: 'product family',
        priceLevelText: 'price level',
        priceText: 'price',
        discountText: 'discount %',
        adjustedPriceText: 'adjusted price',
        quantityText: 'quantity',
        extendedPriceText: 'extended price',

        //View Properties
        entityName: 'Opportunity',
        id: 'opportunityproduct_edit',
        resourceKind: 'opportunityProducts',
        insertSecurity: 'Entities/Opportunity/Add',
        updateSecurity: 'Entities/Opportunity/Edit',
        querySelect: [
            'Opportunity/Description',
            'Product/Name',
            'Product/Family',
            'Program',
            'Price',
            'Discount',
            'AdjustedPrice',
            'Quantity',
            'ExtendedPrice'
        ],
        init: function() {
            this.inherited(arguments);
            this.connect(this.fields['Product'], 'onChange', this.onProductChange);
            this.connect(this.fields['Program'], 'onChange', this.onProgramChange);
            this.connect(this.fields['Discount'], 'onChange', this.onDiscountChange);
            this.connect(this.fields['AdjustedPrice'], 'onChange', this.onAdjustedPriceChange);
            this.connect(this.fields['AdjustedPriceMine'], 'onChange', this.onAdjustedPriceMineChange);
            this.connect(this.fields['AdjustedPriceOpportunity'], 'onChange', this.onAdjustedPriceOpportunityChange);
            this.connect(this.fields['Quantity'], 'onChange', this.onQuantityChange);
        },
        setValues: function(values) {
            this.inherited(arguments);
            var adjusted, myCode, oppCode, baseCode;
            this.fields['Program'].setValue({'$key':'', 'Program': values.Program});

            if (values.Discount > 0) {
                adjusted = values.Price - (values.Discount * values.Price);
                // transform the discount into a whole number .10 to 10%
                this.fields['Discount'].setValue(values.Discount * 100);
            } else {
                adjusted = values.Price;
            }

            myCode = App.getMyExchangeRate().code;
            baseCode = App.getBaseExchangeRate().code;
            oppCode = App.getCurrentOpportunityExchangeRate().code;

            this.fields['AdjustedPrice'].setValue(adjusted);
            this.fields['AdjustedPrice'].setCurrencyCode(baseCode);

            this.fields['AdjustedPriceMine'].setValue(this._getMyRate() * adjusted);
            if (App.hasMultiCurrency()) {
                this.fields['AdjustedPriceMine'].setCurrencyCode(myCode);
            }

            this.fields['AdjustedPriceOpportunity'].setValue(this._getOpportunityRate() * adjusted);
            if (App.hasMultiCurrency()) {
                this.fields['AdjustedPriceOpportunity'].setCurrencyCode(oppCode);
            }

            this.fields['ExtendedPrice'].setCurrencyCode(baseCode);
            if (App.hasMultiCurrency()) {
                this.fields['ExtendedPriceMine'].setCurrencyCode(myCode);
                this.fields['ExtendedPriceOpportunity'].setCurrencyCode(oppCode);
            }

            this._updateExtendedPrice();
        },
        _getMyRate: function() {
            return App.getMyExchangeRate().rate;
        },
        _getOpportunityRate: function() {
            return App.getCurrentOpportunityExchangeRate().rate;
        },
        getValues: function() {
            var o = this.inherited(arguments);
            o.Program = o.Program.Program;

            /*
             * 'AdjustedPrice' is a lie. The underlying database field is actually PRICEADJUSTED and
             * is a boolean, not a price that has been adjusted. Since we use the adjusted price to calculate
             * the discount %, we will remove it from getValues so we aren't trying to save the wrong data type when sending
             * the sdata request.
             */
            delete o.AdjustedPrice;
            delete o.AdjustedPriceMine;
            delete o.AdjustedPriceOpportunity;
            delete o.ExtendedPriceMine;
            delete o.ExtendedPriceOpportunity;

            // transform the discount back into a decimal
            o.Discount = o.Discount / 100;

            return o;
        },
        applyContext: function(templateEntry) {
            var context, view, entry;
            context = App.queryNavigationContext(function(o) {
                return /^(opportunities)$/.test(o.resourceKind) && o.key;
            });

            view = App.getView(context && context.id);
            entry = view && view.entry;
            if (entry) {
                this.fields['Opportunity'].setValue(entry);
            }
        },
        onProductChange: function(value, field) {
            var selection = field && field.currentSelection;
            if (selection) {
                this.fields['ProductId'].setValue(value.key);
                this.fields['Product.Family'].setValue(selection.Family);
                this.fields['Program'].clearValue();

                this.fields['Price'].setValue(selection.Price);
                this.fields['Discount'].clearValue();
                this.fields['AdjustedPrice'].clearValue();
                this.fields['Quantity'].setValue(1);
                this._updateExtendedPrice();
            }
        },
        onProgramChange: function(value, field) {
            var selection = field && field.currentSelection;
            if (selection) {
                this.fields['Price'].setValue(selection.Price);
                this.fields['Discount'].clearValue();
                this.fields['AdjustedPrice'].clearValue();

                if (App.hasMultiCurrency()) {
                    this.fields['AdjustedPriceMine'].clearValue();
                    this.fields['AdjustedPriceOpportunity'].clearValue();
                }

                this._updateExtendedPrice();
            }
        },
        onDiscountChange: function(value, field) {
            var price, discount, adjusted, quantity, extended;
            price = parseFloat(this.fields['Price'].getValue(), 10) || 0;
            discount = this.fields['Discount'].getValue();
            quantity = parseFloat(this.fields['Quantity'].getValue(), 10) || 0;

            adjusted = discount > 0 ? price - ((discount / 100) * price) : price;
            this.fields['AdjustedPrice'].setValue(adjusted);
            this._updateAdjustedPrices(adjusted);

            adjusted = this.fields['AdjustedPrice'].getValue();
            extended = adjusted * quantity;

            this._updateExtendedPrice();
        },
        onAdjustedPriceChange: function(value, field) {
            var price, discount, adjusted;
            price = parseFloat(this.fields['Price'].getValue(), 10) || 0;
            adjusted = parseFloat(this.fields['AdjustedPrice'].getValue(), 10) || price;

            discount = (1 - (adjusted / price)) * 100;
            this.fields['Discount'].setValue(discount);
            this._updateAdjustedPrices(adjusted);
            this._updateExtendedPrice();
        },
        onAdjustedPriceMineChange: function(value, field) {
            var price, discount, myAdjusted;
            myAdjusted = this.fields['AdjustedPriceMine'].getValue();
            price = this.fields['Price'].getValue() || 0;
            price = price * this._getMyRate();// get the price in the users exchange rate

            discount = (1 - (myAdjusted / price)) * 100;
            this.fields['Discount'].setValue(discount);
            this.onDiscountChange();
        },
        onAdjustedPriceOpportunityChange: function(value, field) {
            var price, discount, opportunityAdjusted;
            opportunityAdjusted = this.fields['AdjustedPriceOpportunity'].getValue();
            price = this.fields['Price'].getValue() || 0;
            price = price * this._getOpportunityRate();// get the price in the opportunity exchange rate

            discount = (1 - (opportunityAdjusted / price)) * 100;
            this.fields['Discount'].setValue(discount);
            this.onDiscountChange();
        },
        onQuantityChange: function(value, field) {
            this._updateExtendedPrice();
        },
        _updateAdjustedPrices: function(adjusted) {
            this.fields['AdjustedPriceMine'].setValue(this._getMyRate() * adjusted);
            this.fields['AdjustedPriceOpportunity'].setValue(this._getOpportunityRate() * adjusted);
        },
        _updateExtendedPrice: function() {
            var price, discount, adjusted, quantity, extended;
            price = parseFloat(this.fields['Price'].getValue(), 10) || 0;
            quantity = parseFloat(this.fields['Quantity'].getValue(), 10) || 0;
            adjusted = parseFloat(this.fields['AdjustedPrice'].getValue(), 10) || price;

            extended = adjusted * quantity;

            this.fields['ExtendedPrice'].setValue(extended);

            if (App.hasMultiCurrency()) {
                this.fields['ExtendedPriceMine'].setValue(extended * this._getMyRate());
                this.fields['ExtendedPriceOpportunity'].setValue(extended * this._getOpportunityRate());
            }
        },
        onUpdateCompleted: function(entry) {
            this._refreshOpportunityViews();
            this.inherited(arguments);
        },
        onInsertCompleted: function(entry) {
            this._refreshOpportunityViews();
            this.inherited(arguments);
        },
        _refreshOpportunityViews: function() {
            var views = [
                App.getView('opportunityproduct_related'),
                App.getView('opportunity_detail'),
                App.getView('opportunity_list')
            ];

            array.forEach(views, function(view) {
                if (view) {
                    view.refreshRequired = true;
                }
            }, this);
        },
        createLayout: function() {
            return this.layout || (this.layout = [
                {
                    label: this.opportunityText,
                    name: 'Opportunity',
                    property: 'Opportunity',
                    type: 'lookup',
                    textProperty: 'Description',
                    view: 'opportunity_related',
                    validator: validator.exists
                },
                {
                    name: 'ProductId',
                    property: 'ProductId',
                    type: 'hidden'
                },
                {
                    label: this.productText,
                    name: 'Product',
                    property: 'Product',
                    type: 'lookup',
                    textProperty: 'Name',
                    view: 'product_related',
                    validator: validator.exists
                },
                {
                    label: this.productFamilyText,
                    name: 'Product.Family',
                    property: 'Product.Family',
                    type: 'text',
                    readonly: true
                },
                {
                    label: this.priceLevelText,
                    name: 'Program',
                    property: 'Program',
                    textProperty: 'Program',
                    type: 'lookup',
                    view: 'productprogram_related',
                    validator: validator.exists,
                    where: (function(){
                        var val = this.fields['Product'].getValue();
                        return string.substitute('Product.Name eq "${0}"', [val.Name]);
                    }).bindDelegate( this)
                },
                {
                    label: this.priceText,
                    name: 'Price',
                    property: 'Price',
                    type: 'decimal',
                    readonly: true
                },
                {
                    label: this.discountText,
                    name: 'Discount',
                    property: 'Discount',
                    type: 'decimal',
                    notificationTrigger: 'blur'
                },
                {
                    label: this.adjustedPriceText,
                    name: 'AdjustedPrice',
                    property: 'AdjustedPrice',
                    type: 'multiCurrency',
                    notificationTrigger: 'blur'
                },
                {
                    label: this.adjustedPriceText,
                    name: 'AdjustedPriceMine',
                    property: 'AdjustedPriceMine',
                    type: App.hasMultiCurrency() ? 'multiCurrency' : 'hidden',
                    notificationTrigger: 'blur'
                },
                {
                    label: this.adjustedPriceText,
                    name: 'AdjustedPriceOpportunity',
                    property: 'AdjustedPriceOpportunity',
                    type: App.hasMultiCurrency() ? 'multiCurrency' : 'hidden',
                    notificationTrigger: 'blur'
                },
                {
                    label: this.quantityText,
                    name: 'Quantity',
                    property: 'Quantity',
                    type: 'decimal',
                    notificationTrigger: 'blur'
                },
                {
                    label: this.extendedPriceText,
                    name: 'ExtendedPrice',
                    property: 'ExtendedPrice',
                    type: 'multiCurrency',
                    readonly: true
                },
                {
                    label: this.extendedPriceText,
                    name: 'ExtendedPriceMine',
                    property: 'ExtendedPriceMine',
                    type: App.hasMultiCurrency() ? 'multiCurrency' : 'hidden',
                    readonly: true
                },
                {
                    label: this.extendedPriceText,
                    name: 'ExtendedPriceOpportunity',
                    property: 'ExtendedPriceOpportunity',
                    type: App.hasMultiCurrency() ? 'multiCurrency' : 'hidden',
                    readonly: true
                }
            ]);
        }
    });
});
