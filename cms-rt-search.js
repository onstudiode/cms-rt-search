function FilterControllerSearch(t) {
    this.element = t, this.element.on("input", function() {
        this.onChange()
    }.bind(this))
}

function FilterControllerWfCheckbox(t) {
    this.element = t, this.element.parent().find("input[type='checkbox']").change(function() {
        this.onChange()
    }.bind(this))
}

function FilterControllerCheckbox(t) {
    this.element = t, this.element.change(function() {
        this.onChange()
    }.bind(this))
}

function FilterControllerChip(t) {
    this.element = t, this.element.click(function() {
        this.element.toggleClass("ncf-selected"), this.onChange()
    }.bind(this))
}

function FilterControllerCategory(t) {
    this.elements = t, this.controller = [], this.elements.each(function(t, e) {
        var i;
        $(e).hasClass("ncf-filter-categorie-chip") ? (i = new FilterControllerChip($(e)), val = $(e).data("value")) : $(e).hasClass("ncf-filter-categorie-checkbox") ? $(e).hasClass("w-checkbox-input--inputType-custom") ? (i = new FilterControllerWfCheckbox($(e)), val = $(e).parent().find("input[type='checkbox']").first().data("value")) : (i = new FilterControllerCheckbox($(e)), val = $(e).data("value")) : console.error("Error: ControllerCategory called with wrong elements!!");
        const r = i,
            n = val;
        r.onChange = function() {
            this.change(r, n)
        }.bind(this), val in this.controller ? this.controller[val].push(r) : this.controller[val] = [r]
    }.bind(this))
}

function FilterObject(t, e, i) {
    this.key = e, this.type = t, this.controller = i
}

function FilterList(t) {
    this.root = t, this.container = this.root.find(".ncf-filter-item-container"), this.itemList = [], this.controller = [], this.filterObjects = [], this.page = 0, this.perPage = this.root.data("items-per-page") || 20, console.log(this.perPage), this.currentFilter = [], this.orderby = null, this.root.find(".ncf-next-page").click(this.nextPage.bind(this)), this.root.find(".ncf-prev-page").click(this.prevPage.bind(this)), this.root.find(".ncf-filter-reset").click(this.reset.bind(this)), this.emptyState = this.root.find(".ncf-empty-state").clone(!0, !0), this.root.find(".ncf-empty-state").remove(), this.initController(), this.container.find(".ncf-filter-item").each(function(t, e) {
        this.itemList.push(new FilterListItem($(e)))
    }.bind(this)), this.maxPage = Math.max(0, Math.floor((this.itemList.length - 1) / this.perPage)), this.update(void 0, !0)
}

function FilterListItem(t) {
    this.root = t, this.data = this.root.find(".identifyer").data(), this.template = $(t).clone()
}
FilterControllerSearch.prototype = {
    constructor: FilterControllerSearch,
    getValue: function() {
        return value = this.element.val(), "" == value ? null : value
    },
    setValue: function(t) {
        this.element.val(null === t ? "" : t)
    },
    onChange: function() {}
}, FilterControllerWfCheckbox.prototype = {
    constructor: FilterControllerWfCheckbox,
    getValue: function() {
        return d = this.element.parent().find("input[type='checkbox']").first(), d.prop("checked")
    },
    setValue: function(t) {
        d = this.element.parent().find("input[type='checkbox']").first(), t && !d.prop("checked") ? d.click() : !t && d.prop("checked") && d.click()
    },
    onChange: function() {}
}, FilterControllerCheckbox.prototype = {
    constructor: FilterControllerCheckbox,
    getValue: function() {
        return this.element.prop("checked")
    },
    setValue: function(t) {
        this.element.prop("checked", t)
    },
    onChange: function() {}
}, FilterControllerChip.prototype = {
    constructor: FilterControllerChip,
    getValue: function() {
        return this.element.hasClass("ncf-selected")
    },
    setValue: function(t) {
        x = t ? this.element.addClass("ncf-selected") : this.element.removeClass("ncf-selected")
    },
    onChange: function() {}
}, FilterControllerCategory.prototype = {
    constructor: FilterControllerCategory,
    getValue: function() {
        for (k in values = [], this.controller) this.controller[k][0].getValue() && values.push(k);
        return values
    },
    setValue: function(t) {
        for (k in this.controller)
            for (c of this.controller[k]) c.setValue(t === k)
    },
    change: function(t, e) {
        for (c of this.controller[e]) c.setValue(t.getValue());
        this.onChange()
    },
    onChange: function() {}
}, FilterObject.prototype = {
    constructor: FilterObject,
    setValue: function(t) {
        this.value = t
    },
    getFilter: function() {
        var t = this.controller.getValue();
        if (Array.isArray(t)) {
            var e = [];
            for (val of t) e.push({
                type: this.type,
                key: this.key,
                value: val
            });
            return 0 == e.length ? null : {
                type: "group",
                items: e
            }
        }
        return null == t ? null : {
            type: this.type,
            key: this.key,
            value: t
        }
    }
}, FilterList.prototype = {
    constructor: FilterList,
    nextPage: function() {
        this.page < this.maxPage && this.update(this.page + 1)
    },
    initController: function() {
        for (k of(search = this.root.find(".ncf-filter-control-search"), order = this.root.find(".ncf-filter-order"), order.change(this.update.bind(this)), categorie = this.root.find(".ncf-filter-categorie-checkbox,.ncf-filter-categorie-chip"), search.each(function(t, e) {
                const i = new FilterControllerSearch($(e));
                this.controller.push(i), this.filterObjects[$(e).data("filter")] = new FilterObject("search", $(e).data("filter"), i)
            }.bind(this)), keys = [], categorie.each(function(t, e) {
                $(e).hasClass("w-checkbox-input--inputType-custom") ? key = $(e).parent().find("input[type='checkbox']").first().data("filter") : key = $(e).data("filter"), keys.includes(key) || keys.push(key)
            }.bind(this)), keys)) ctl = new FilterControllerCategory(this.root.find(".w-checkbox>*[data-filter='" + k + "']").parent().children(".ncf-filter-categorie-checkbox").add(this.root.find(".ncf-filter-categorie-chip[data-filter='" + k + "']"))), this.controller.push(ctl), this.filterObjects[k] = new FilterObject("equal", k, ctl);
        for (ct of this.controller) ct.onChange = function() {
            this.update()
        }.bind(this)
    },
    prevPage: function() {
        this.page > 0 && this.update(this.page - 1)
    },
    updatePageIndicator: function() {
        next = this.root.find(".ncf-next-page"), prev = this.root.find(".ncf-prev-page"), 0 == this.maxPage ? this.root.find(".ncf-filter-page-indicator").hide() : this.root.find(".ncf-filter-page-indicator").show(), this.page == this.maxPage ? next.hide() : next.show(), 0 == this.page ? prev.hide() : prev.show(), this.root.find(".ncf-current-page").html(this.page - 0 + 1), this.root.find(".ncf-max-page").html(this.maxPage + 1)
    },
    onUpdate: function() {},
    reset: function() {
        for (c of this.controller) c.setValue(null);
        this.update()
    },
    update: function(t = this.page, e = !1) {
        for (flt in filter = [], this.filterObjects) tempFilter = this.filterObjects[flt].getFilter(), null != tempFilter && filter.push(tempFilter);
        if (console.log(filter), 0 == filter.length ? (this.root.find(".ncf-filter-target").addClass("ncf-filter-no"), this.root.find(".ncf-filter-target").removeClass("ncf-filter-yes")) : (this.root.find(".ncf-filter-target").addClass("ncf-filter-yes"), this.root.find(".ncf-filter-target").removeClass("ncf-filter-no")), orderby = this.root.find(".ncf-filter-order").val(), e = this.orderby !== orderby, this.orderby = orderby, JSON.stringify(filter) !== JSON.stringify(this.currentFilter) || e) this.page = 0, this.currentFilter = filter, displayList = this.itemList.filter(function(t) {
            return t.filter(this.currentFilter)
        }.bind(this));
        else {
            if (t == this.page) return void this.updatePageIndicator();
            this.page = t, displayList = this.itemList.filter(function(t) {
                return t.filter(this.currentFilter)
            }.bind(this))
        }
        for (item of(displayList.sort(function(t, e) {
                return console.log(t.data[this.orderby], this.orderby), t.data[this.orderby] < e.data[this.orderby] ? -1 : 1
            }), console.log(displayList), this.maxPage = Math.max(Math.floor((displayList.length - 1) / this.perPage), 0), this.container.html(""), 0 == displayList.length && this.container.append(this.emptyState.clone(!0, !0)), displayList.slice(this.page * this.perPage, (this.page + 1) * this.perPage))) item.append(this.container);
        this.updatePageIndicator(), this.onUpdate()
    }
}, FilterListItem.prototype = {
    constructor: FilterListItem,
    filter: function(t, e = !0) {
        for (filter of(equalset = !1, t)) {
            if ("group" == filter.type) {
                if (resp = this.filter(filter.items, !1), e && !resp) return !1;
                if (!e && resp) return !0
            }
            if ("search" == filter.type && !this.data[filter.key].toLowerCase().includes(filter.value.toLowerCase())) return !1;
            if ("equal" == filter.type) {
                if (equalset = !0, e && (!filter.key in this.data || this.data[filter.key] != filter.value)) return !1;
                if (!e && this.data[filter.key] == filter.value) return !0
            }
        }
        return !equalset || e
    },
    getOrderIndex: function(t) {
        return t in this.data ? this.data[t] : Number.MAX_SAFE_INTEGER
    },
    sortHelper: function(t, e) {
        return this.getOrderIndex(e) - t.getOrderIndex(e)
    },
    append: function(t) {
        t.append(this.template)
    }
}, $(document).ready(() => {
    $(".ncf-filterlist").not(".ncf-map").each((t, e) => {
        new FilterList($(e))
    })
});
Copied
