$(document).on('o:prepare-value', function (e, type, value, valueObj) {
    const thisValue = $(value);
    const container = thisValue.find('.nested-data-type_properties');
    container.sortable()
    const addBtn = thisValue.find('.nested-data-type_add_property');

    // Add a default Value to trigger the hydrate() function
    const defaultValue = thisValue.find('.nested-data-type_value').val('value');
    const defaultProperty = thisValue.find('.nested-data-type_property').val('value');

    let repeatProperty, select, textareaValue, textareaUri;
    const findItems = () => {
        repeatProperty = container.find('.nested-data-type_repeat_property').last();
        isHidden = repeatProperty.find('.nested-data-type_is-hidden');
        select = repeatProperty.find('.nested-data-type_property_dropdown');
        textareaValue = repeatProperty.find('.property-value');
        textareaUri = repeatProperty.find('.property-uri');
        innerClass = repeatProperty.find('.inner-class');
        innerProperty = repeatProperty.find('.inner-property');
        renderedLink = repeatProperty.find('.items');
    }

    const cloneItem = (idx) => {
        let item = `
        <div class="nested-data-type_repeat_property">
        <div class="nested-data-type_repeat_property_list">
        <div class="nested-data-type_handle"></div>
                <input class="nested-data-type-dropwdown nested-data-type_property_dropdown" list="property-dropdown" data-value-key="property-label-${idx}" placeholder="Select a property" />
                <button class="nested-data-type_button o-icon-add nested-data-type_add_class"></button>
            </div>
            <div class="nested-data-type_repeat_class hidden">
                <input class="nested-data-type-dropwdown inner-class" list="class-dropdown" data-value-key="inner-class-${idx}" placeholder="Select a class" />
                <input class="nested-data-type-dropwdown inner-property" list="property-dropdown" data-value-key="inner-property-${idx}" placeholder="Select a property" />
            </div>
            <div class="input">
                <label class="value">
                    <textarea class="property-value" name="property-value" data-value-key="property-value-${idx}"></textarea>
                </label>
            </div>
            <div class="input hidden">
                <label class="value-uri">
                    <textarea class="property-uri" name="property-uri" data-value-key="property-uri-${idx}"></textarea>
                </label>
            </div>
            <input type="hidden" class="nested-data-type_is-hidden" data-value-key="is-hidden-${idx}" />
            <button class="nested-data-type_button o-icon-public nested-data-type_hide_property"></button>
            <button class="nested-data-type_button o-icon-delete nested-data-type_remove_property"></button>
        </div>`;

        container.append(container.append(item));
    }

    const structureField = (obj, type, insertVal = '') => {
        return obj.attr({ 'data-value-key': `${type}` }).val(insertVal);
    }

    const structureInnerLinks = (insertVal, url) => {
        let title;

        $.ajaxSetup({
            async: false
        });
        $.getJSON(url.replace("/admin/item/", "/api/items/"), function (data) {
            title = data["o:title"];
        });

        let link = `<div class="o-title items ml"><a href="${url}"> ${title || insertVal}</a></div>`
        container.append(container.find('.nested-data-type_repeat_property').last().append(link));
    }

    // Replace item on click
    // container.on('click', '.re-link', function (e) {
    //     e.preventDefault();
    //     openSidebar()
    // });

    // Add item on click
    addBtn.on('click', function (e) {
        e.preventDefault();
        const num = container.find('.nested-data-type_repeat_property').length;
        cloneItem(num + 1);
        findItems();

        if (renderedLink) {
            renderedLink.remove();
            textareaValue.parent().parent().css('display', 'block');
        }

        container.find('.nested-data-type_repeat_property')
            .last()
            .find('.o-icon-private')
            .removeClass('o-icon-private')
            .addClass('o-icon-public')();
    });

    // Remove Button on click
    container.on('click', '.nested-data-type_remove_property', function (e) {
        e.preventDefault();
        const nextItems = $(this).parent().nextAll();
        $(this).parent().remove();

        // change the index number
        for (let index = 0; index < nextItems.length; index++) {
            const element = $(nextItems[index]).find("input[data-value-key]");
            for (let item = 0; item < element.length; item++) {
                const dataValueKey = $(element[item]).attr('data-value-key').split('-');
                const updatedIndex = dataValueKey.join('-') + "-" + (dataValueKey.pop() - 1);
                structureField($(element[item]), updatedIndex, insertVal = element[item].value)
            }
        }
    });

    // Show properties on click
    container.on('click', '.nested-data-type_hide_property', function (e) {
        e.preventDefault();
        const isHiddenInput = $(this).parent().find('.nested-data-type_is-hidden');
        const dataKey = isHiddenInput.attr('data-value-key');
        const hide = isHiddenInput.attr({ 'data-value-key': dataKey }).val();

        if (hide != "true") {
            $(this).removeClass('o-icon-public').addClass('o-icon-private');
            isHiddenInput.attr({ 'data-value-key': dataKey }).val("true");
        }
        else {
            $(this).removeClass('o-icon-private').addClass('o-icon-public');
            isHiddenInput.attr({ 'data-value-key': dataKey }).val("");
        }
    });

    // Add Class on click
    container.on('click', '.nested-data-type_add_class', function (e) {
        e.preventDefault();
        $(this).parent().next().children().val('')
        $(this).parent().next().toggle();
    });


    // Prepares the fields to be rendered in the frontend
    if (0 === type.indexOf('nesteddatatype#')) {
        if (valueObj != undefined) {
            const p = valueObj["@value"];
            const k = Object.keys(p[0]);
            renderFields(p, k)
        }

        else {
            let templateId = $('#resource-template-select').val();
            let templateUrl = `/api/resource_templates/${templateId}`
            getTemplateJson(templateUrl).then(function (returndata) {
                returndata["o:resource_template_property"].forEach(element => {
                    if (element["o:data_type"] == type) {
                        let p = JSON.parse(element["o:data"][0]["default_value"]);
                        let k = Object.keys(p[0]);
                        renderFields(p, k)
                    }
                });
            });
        }
    }

    $(document).on('click', '.nested-data-type__resource_link', function (e) {
        e.preventDefault();

        const resource = JSON.parse($(this.parentElement).attr('data-resource-values'));
        const id = resource['@id'];
        const label = resource['display_title'];
        const url = resource['url'];

        if (thisValue.is('.selecting-resource')) {
            const num = container.find('.nested-data-type_repeat_property').length;

            cloneItem(num + 1);
            findItems();

            if (renderedLink) {
                renderedLink.remove();
                textareaValue.parent().parent().css('display', 'block');
            }

            structureField(textareaValue, `property-value-${num + 1}`, insertVal = label);
            structureField(textareaUri, `property-uri-${num + 1}`, insertVal = id);

            container.find('.nested-data-type_repeat_property')
                .last()
                .find('.input')
                .css('display', 'none');

            container.find('.nested-data-type_repeat_property')
                .last()
                .find('.o-title.items')
                .remove();

            container.find('.nested-data-type_repeat_property')
                .last()
                .find('.o-icon-private')
                .removeClass('o-icon-private')
                .addClass('o-icon-public')

            structureInnerLinks(label, url);
        };
    });

    function renderFields(properties, keys) {
        keys.forEach((element, idx) => {
            let item = properties[0][element];

            for (i in item) {
                let val = item[i];
                if (typeof val === "object") {

                    if (idx == 1) {
                        findItems();

                        // select.val(element);
                        structureField(select, `property-label-${idx}`, insertVal = element);

                        if (val['@value']) textareaValue.val(val['@value']);
                        if (val['label']) textareaValue.val(val['label']);
                        if (val['@id']) textareaUri.val(val['@id']);
                        if (val['is_hidden']) {
                            structureField(isHidden, `is-hidden-${idx}`, insertVal = 'true');
                            container.find('.nested-data-type_hide_property').last().removeClass('o-icon-public').addClass('o-icon-private')
                        };
                        if (val['@id'] && val['@id'].includes('/api/items/')) {

                            container.find('.nested-data-type_repeat_property')
                                .last()
                                .find('.input')
                                .css('display', 'none');

                            structureInnerLinks(val['label'], val['@id'].replace('/api/items/', '/admin/item/'));
                        }
                    }

                    else if (idx > 1) {
                        cloneItem(idx);
                        findItems();

                        container.find('.nested-data-type_hide_property').last().removeClass('o-icon-private').addClass('o-icon-public');

                        if (renderedLink) {
                            renderedLink.remove();
                            textareaValue.parent().parent().css('display', 'block');
                        }

                        structureField(select, `property-label-${idx}`, insertVal = element);
                        innerClass.parent().css('display', 'none');
                        if (val['is_hidden']) {
                            structureField(isHidden, `is-hidden-${idx}`, insertVal = 'true');
                            container.find('.nested-data-type_hide_property').last().removeClass('o-icon-public').addClass('o-icon-private')
                        };
                        if (val['@value']) { structureField(textareaValue, `property-value-${idx}`, insertVal = val['@value']); };
                        if (val['label']) { structureField(textareaValue, `property-value-${idx}`, insertVal = val['label']); }
                        if (val['@id']) { structureField(textareaUri, `property-uri-${idx}`, insertVal = val['@id']); }
                        if (val['@id'] && val['@id'].includes('/api/items/')) {
                            container.find('.nested-data-type_repeat_property')
                                .last()
                                .find('.o-title.items')
                                .remove();

                            container.find('.nested-data-type_repeat_property')
                                .last()
                                .find('.input')
                                .css('display', 'none');

                            structureInnerLinks(val['label'], val['@id'].replace('/api/items/', '/admin/item/'));
                        }
                    }

                    for (const [key, value] of Object.entries(val)) {
                        if (key == '@type') { innerClass.val(value).parent().css('display', 'block') };
                        if (idx == 1) {
                            if (val[key]['@value']) {
                                innerProperty.val(key);
                                innerProperty.parent().css('display', 'block');
                                textareaValue.val(val[key]['@value']);
                            }
                            if (val[key]['@id']) {
                                innerProperty.val(key);
                                textareaValue.val(val[key]['@id']);
                            }
                            if (val[key]['label']) textareaValue.val(val[key]['label']);

                            if (val[key]['@id'] && val[key]['@id'].includes('/api/items/')) {
                                container.find('.nested-data-type_repeat_property')
                                    .last()
                                    .find('.o-title.items')
                                    .remove();

                                container.find('.nested-data-type_repeat_property')
                                    .last()
                                    .find('.input')
                                    .css('display', 'none');
                                structureInnerLinks(val[key]['label'], val[key]['@id'].replace('/api/items/', '/admin/item/'));
                            }
                        }
                        else if (idx > 1 && key != "is_hidden") {
                            structureField(innerProperty, `inner-property-${idx}`, insertVal = key);
                            if (key == '@type') { structureField(innerClass, `inner-class-${idx}`, insertVal = value); };
                            if (val[key]['@value']) { structureField(textareaValue, `property-value-${idx}`, insertVal = val[key]['@value']); }
                            if (val[key]['label']) { structureField(textareaValue, `property-value-${idx}`, insertVal = val[key]['label']); }
                            if (val[key]['@id']) { structureField(textareaUri, `property-uri-${idx}`, insertVal = val[key]['@id']); };

                            if (val[key]['@id'] && val[key]['@id'].includes('/api/items/')) {
                                container.find('.nested-data-type_repeat_property')
                                    .last()
                                    .find('.o-title.items')
                                    .remove();

                                container.find('.nested-data-type_repeat_property')
                                    .last()
                                    .find('.input')
                                    .css('display', 'none');

                                structureInnerLinks(val[key]['label'], val[key]['@id'].replace('/api/items/', '/admin/item/'));
                            }
                        }
                    }
                }
            }
        });

    }
});


function getTemplateJson(url) {
    return $.getJSON(url, function (data) {
        return data
    });
}

// function openSidebar() {
//     let sidebar = $(".sidebar");
//     sidebar.addClass('active');
//     sidebar.trigger('o:sidebar-opened');
//     if ($('.active.sidebar').length > 1) {
//         var highestIndex = 3; // The CSS currently defines the default sidebar z-index as 3.
//         $('.active.sidebar').each(function () {
//             var currentIndex = parseInt($(this).css('zIndex'), 10);
//             if (currentIndex > highestIndex) {
//                 highestIndex = currentIndex;
//             }
//         });
//         sidebar.css('zIndex', highestIndex + 1);

//         // populate
//         var sidebarContent = sidebar.find('.sidebar-content');
//         sidebar.addClass('loading');
//         sidebarContent.empty();

//         $.get("/admin/nested-data-type/sidebar-select")
//             .done(function (data) {
//                 sidebarContent.html(data);
//                 $(sidebar).trigger('o:sidebar-content-loaded');
//             })
//             .fail(function () {
//                 sidebarContent.html('<p>' + Omeka.jsTranslate('Something went wrong') + '</p>');
//             })
//             .always(function () {
//                 sidebar.removeClass('loading');
//             });
//     }
// }