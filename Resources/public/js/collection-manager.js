!function ($) {

    "use strict";

    var CollectionManager = function (element, options) {
        this.$element = null;

        this.init(element, options);
    }

    CollectionManager.DEFAULTS = {
        'templateAdd': '<a href="#">Add</a>',
        'templateDelete': '<a href="#">Delete</a>',
        'templateItem': '<li></li>',
        'insertLocation': null,
        'itemsSelector': 'li.collection-item',
        'prototypeName': 'prototype'
    }

    CollectionManager.prototype.init = function (element, options) {
        this.$element = $(element);

        this.options = this.getOptions(options);

        var that = this;

        // Add a delete link to all of the existing items
        this.$element
            .find(this.options.itemsSelector)
            .filter('[data-manage-collection-option!="disable-delete"]') //Remove items that need no deletion button
            .each(function() {
                that.addDeleteButton($(this));
            });

        // Count the current form inputs we have (e.g. 2), use that as the new
        // index when inserting a new item (e.g. 2)
        this.$element.data('index', this.$element.find(this.options.itemsSelector).length);

        // Add the add button and bind the proper event
        this.addAddButton();
    }

    CollectionManager.prototype.addItem = function (prototypeName) {
        var // Get the data-prototype
            prototype = this.$element.data(this.options.prototypeName + ((typeof prototypeName !== 'undefined')? '-' + prototypeName : '')),
            // Get the new index
            index = this.$element.data('index'),
            // Replace '__name__' in the prototype's HTML to instead be a number based on how many items we have
            newItemForm = prototype.replace(/__name__/g, index),
            // Create jQuery object corresponding to the complete item
            $newItem = $(newItemForm);

        // Increase the index with one for the next item
        this.$element.data('index', index + 1);

        // Display the complete item in the page as the last item
        if (this.$element.find(this.options.itemsSelector).length > 0) {
            this.$element.find(this.options.itemsSelector + ':last').after($newItem);
        } else if (typeof this.options.insertLocation !== 'string') {
            this.$element.prepend($newItem);
        } else {
            this.$element.find(this.options.insertLocation).prepend($newItem);
        }

        $newItem.trigger('collectionmanager.additem');

        // Add a delete link for the new item
        this.addDeleteButton($newItem);
    }

    CollectionManager.prototype.addAddButton = function () {
        var that = this,
            $addButton = $(this.options.templateAdd),
            $addItemButton = $(this.options.templateItem).append($addButton),
            //Existing add buttons have to be within the $element element
            $existingAddButtons = this.$element.find('[data-manage-collection-action^="add-"]');

        if ($existingAddButtons.length <= 0) {
            //Add and bind default add button
            if (this.$element.find(this.options.itemsSelector).length > 0) {
                this.$element.find(this.options.itemsSelector + ':last').after($addItemButton);
            } else if (typeof this.options.insertLocation !== 'string') {
                this.$element.prepend($addItemButton);
            } else {
                this.$element.find(this.options.insertLocation).prepend($addItemButton);
            }

            $addButton.on('click', function (e) {
                // Prevent the button from creating a "#" on the URL
                e.preventDefault();

                // Add a new item in the DOM
                that.addItem();
            });
        } else {
            //Foreach action button bind the event with the appropriate prototype
            $existingAddButtons.each(function () {
                var $addButton = $(this);

                $addButton.on('click', function (e) {
                    var prototypeName = $addButton.data('manage-collection-action').replace(/add\-/gi, '');

                    // Prevent the button from creating a "#" on the URL
                    e.preventDefault();

                    // Add a new item in the DOM
                    that.addItem(prototypeName);
                });
            });
        }
    }

    CollectionManager.prototype.addDeleteButton = function ($item) {
        var $deleteButton = $(this.options.templateDelete),
            $existingDeleteButtons = $item.find('[data-manage-collection-action="delete"]');

        if ($existingDeleteButtons.length <= 0) {
            $item.append($deleteButton);

            $deleteButton.on('click', function (e) {
                // Prevent the link from creating a "#" on the URL
                e.preventDefault();

                $(this).trigger('collectionmanager.removeitem');

                // Remove the item from the DOM
                $item.remove();
            });
        } else {
            //Foreach action button bind the event with the appropriate prototype
            $existingDeleteButtons.each(function () {
                var $deleteButton = $(this);

                $deleteButton.on('click', function (e) {
                    // Prevent the button from creating a "#" on the URL
                    e.preventDefault();

                    $(this).trigger('collectionmanager.removeitem');

                    // Remove the item from the DOM
                    $item.remove();
                });
            });
        }
    }

    CollectionManager.prototype.getDefaults = function () {
        return CollectionManager.DEFAULTS;
    }

    CollectionManager.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options);

        return options;
    }

    // Collection Manager Plugin Definition
    $.fn.manageCollection = function () {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('collectionManager');

            if (!data) $this.data('collectionManager', new CollectionManager(this));
        })
    };

    // Collection Manager DATA-API
    $(document).ready(function () {
        $('[data-toggle="manage-collection"]').manageCollection();
    });
}(window.jQuery);
