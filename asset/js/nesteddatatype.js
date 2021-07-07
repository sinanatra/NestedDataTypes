

$(document).on('o:prepare-value', function (e, type, value, valueObj) {
    const thisValue = $(value);
    const container = thisValue.find('.nested-data-type_properties');
    const addBtn = thisValue.find('.nested-data-type_add_property');
    const selectResource = $('.nested-data-type__resource_link');

    // Add a default Value to trigger the hydrate() function
    const defaultValue = thisValue.find('.nested-data-type_value').val('value');
    const defaultProperty = thisValue.find('.nested-data-type_property').val('value');

    let select, textareaValue, textareaUri;
    const findItems = () => {
        select = container.find('.nested-data-type_repeat_property').last().find('.nested-data-type_property_dropdown');
        textareaValue = container.find('.nested-data-type_repeat_property').last().find('.property-value');
        textareaUri = container.find('.nested-data-type_repeat_property').last().find('.property-uri');
        innerClass = container.find('.nested-data-type_repeat_property').last().find('.inner-class');
        innerProperty = container.find('.nested-data-type_repeat_property').last().find('.inner-property');
        renderedLink = container.find('.nested-data-type_repeat_property').last().find('.items');
    }

    const cloneItem = () => {
        container.append(container.find('.nested-data-type_repeat_property').last().clone());
    }

    // Add item on click
    addBtn.on('click', function (e) {
        e.preventDefault();
        const num = container.find('.nested-data-type_repeat_property').length;
        cloneItem();
        findItems();

        if (renderedLink) {
            renderedLink.remove();
            textareaValue.parent().parent().css('display', 'block');
            textareaUri.parent().parent().css('display', 'block')
        }

        select.attr({ 'data-value-key': `property-label-${num + 1}` })
            .val('');
        textareaValue.attr({ 'data-value-key': `property-value-${num + 1}` })
            .val('');
        textareaUri.attr({ 'data-value-key': `property-uri-${num + 1}` })
            .val('');
        innerClass.attr({ 'data-value-key': `inner-class-${num + 1}` })
            .val('');
        innerProperty.attr({ 'data-value-key': `inner-property-${num + 1}` })
            .val('');
    });

    // Remove Button on click
    container.on('click', '.nested-data-type_remove_property', function (e) {
        e.preventDefault();
        $(this).parent().remove();
    });

    // Add Class on click
    container.on('click', '.nested-data-type_add_class', function (e) {
        e.preventDefault();
        $(this).next().children().val('')
        $(this).next().toggle();
    });


    // Prepares the fields to be rendered in the frontend
    if (0 === type.indexOf('nesteddatatype#')) {

        try {
            const properties = valueObj.properties;
            const keys = Object.keys(properties[0]);

            keys.forEach((element, idx) => {
                let item = properties[0][element];
                let val = item[0]
                if (typeof val === "object") {
                    if (idx == 1) {
                        findItems();
                        select.val(element);
                        if (val['@value']) textareaValue.val(val['@value']);
                        if (val['label']) textareaValue.val(val['label']);
                        if (val['@id']) textareaUri.val(val['@id']);
                        if (val['@id'] && val['@id'].includes('/api/items/')) {

                            container.find('.nested-data-type_repeat_property')
                                .last()
                                .find('.o-title.items')
                                .remove();

                            container.find('.nested-data-type_repeat_property')
                                .last()
                                .find('.input')
                                .css('display', 'none');
                            let link = `<span class="o-title items ml"><a href="${url}"> ${label}</a></span>`
                            container.append(container.find('.nested-data-type_repeat_property').last().append(link));
                        }
                    }

                    else if (idx > 1) {
                        cloneItem();
                        findItems();
                        if (renderedLink) {
                            renderedLink.remove();
                            textareaValue.parent().parent().css('display', 'block');
                            textareaUri.parent().parent().css('display', 'block')
                        }
                        textareaValue.attr({ 'data-value-key': `property-value-${idx}` }).val('');
                        textareaUri.attr({ 'data-value-key': `property-uri-${idx}` }).val('');
                        select.attr({ 'data-value-key': `property-label-${idx}` }).val(element);
                        innerClass.attr({ 'data-value-key': `inner-class-${idx}` }).val('')
                            .parent().css('display', 'none');
                        innerProperty.attr({ 'data-value-key': `inner-property-${idx}` }).val('');

                        if (val['@value']) { textareaValue.attr({ 'data-value-key': `property-value-${idx}` }).val(val['@value']) };
                        if (val['label']) textareaValue.attr({ 'data-value-key': `property-value-${idx}` }).val(val['label']);
                        if (val['@id']) textareaUri.attr({ 'data-value-key': `property-uri-${idx}` }).val(val['@id']);

                        if (val['@id'] && val['@id'].includes('/api/items/')) {
                            container.find('.nested-data-type_repeat_property')
                                .last()
                                .find('.o-title.items')
                                .remove();

                            container.find('.nested-data-type_repeat_property')
                                .last()
                                .find('.input')
                                .css('display', 'none');

                            let changeLinkView = val['@id'].replace('/api/items/', '/admin/item/');
                            let link = `<span class="o-title items ml"><a href="${changeLinkView}"> ${val['label']}</a></span>`
                            container.append(container.find('.nested-data-type_repeat_property').last().append(link));
                        }
                    }

                    for (const [key, value] of Object.entries(val)) {
                        if (key == '@type') {
                            innerClass.val(value)
                                .parent().css('display', 'block');
                        }
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

                                let changeLinkView = val[key]['@id'].replace('/api/items/', '/admin/item/');
                                let link = `<span class="o-title items ml"><a href="${changeLinkView}"> ${val[key]['label']}</a></span>`
                                container.append(container.find('.nested-data-type_repeat_property').last().append(link));
                            }
                        }
                        else if (idx > 1) {
                            innerClass.attr({ 'data-value-key': `inner-class-${idx}` });
                            innerProperty.attr({ 'data-value-key': `inner-property-${idx}` }).val(key);

                            if (val[key]['@value']) {
                                textareaValue.attr({ 'data-value-key': `property-value-${idx}` }).val(val[key]['@value']);
                            }
                            if (val[key]['label']) {
                                textareaValue.attr({ 'data-value-key': `property-value-${idx}` }).val(val[key]['label']);
                            }
                            if (val[key]['@id']) textareaUri.attr({ 'data-value-key': `property-uri-${idx}` }).val(val[key]['@id']);

                            if (val[key]['@id'] && val[key]['@id'].includes('/api/items/')) {
                                container.find('.nested-data-type_repeat_property')
                                    .last()
                                    .find('.o-title.items')
                                    .remove();

                                container.find('.nested-data-type_repeat_property')
                                    .last()
                                    .find('.input')
                                    .css('display', 'none');

                                let changeLinkView = val[key]['@id'].replace('/api/items/', '/admin/item/');
                                let link = `<span class="o-title items ml"><a href="${changeLinkView}"> ${val[key]['label']}</a></span>`
                                container.append(container.find('.nested-data-type_repeat_property').last().append(link));
                            }
                        }
                    }
                }
            });
        }
        catch (error) { console.error(error); }
    }

    $(document).on('click', '.nested-data-type__resource_link', function (e) {
        e.preventDefault();

        const resource = JSON.parse($(this.parentElement).attr('data-resource-values'));
        const id = resource['@id'];
        const label = resource['display_title'];
        const url = resource['url'];

        if (thisValue.is('.selecting-resource')) {
            const num = container.find('.nested-data-type_repeat_property').length;

            cloneItem();
            findItems();
            
            if (renderedLink) {
                renderedLink.remove();
                textareaValue.parent().parent().css('display', 'block');
                textareaUri.parent().parent().css('display', 'block')
            }

            select.attr({ 'data-value-key': `property-label-${num + 1}` })
                .val('');
            textareaValue.attr({ 'data-value-key': `property-value-${num + 1}` })
                .val(label)
            textareaUri.attr({ 'data-value-key': `property-uri-${num + 1}` })
                .val(id)
            innerClass.attr({ 'data-value-key': `inner-class-${num + 1}` })
                .val('');
            innerProperty.attr({ 'data-value-key': `inner-property-${num + 1}` })
                .val('');

            container.find('.nested-data-type_repeat_property')
                .last()
                .find('.input')
                .css('display', 'none');

            container.find('.nested-data-type_repeat_property')
                .last()
                .find('.o-title.items')
                .remove();


            let link = `<span class="o-title items ml"><a href="${url}"> ${label}</a></span>`

            container.append(container.find('.nested-data-type_repeat_property').last().append(link));

        };
    });

});


