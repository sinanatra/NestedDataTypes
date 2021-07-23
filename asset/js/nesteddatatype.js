

$(document).on('o:prepare-value', function (e, type, value, valueObj) {
    const thisValue = $(value);
    const container = thisValue.find('.nested-data-type_properties');
    const addBtn = thisValue.find('.nested-data-type_add_property');

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

        select.attr({ 'data-value-key': `property-label-${num + 1}` }).val('');
        textareaValue.attr({ 'data-value-key': `property-value-${num + 1}` }).val('');
        textareaUri.attr({ 'data-value-key': `property-uri-${num + 1}` }).val('');
        innerClass.attr({ 'data-value-key': `inner-class-${num + 1}` }).val('');
        innerProperty.attr({ 'data-value-key': `inner-property-${num + 1}` }).val('');
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

    const structureField = (obj, type, insertVal = '') => {
        return obj.attr({ 'data-value-key': `${type}` }).val(insertVal);
    }

    const structureInnerLinks = (insertVal, url) => {
        let link = `<div class="o-title items ml"><a href="${url}"> ${insertVal['label']}</a></div>`
        container.append(container.find('.nested-data-type_repeat_property').last().append(link));
    }

    // Prepares the fields to be rendered in the frontend
    if (0 === type.indexOf('nesteddatatype#')) {

        try {
            const properties = valueObj.properties;
            const keys = Object.keys(properties[0]);

            keys.forEach((element, idx) => {
                let item = properties[0][element];
                for (i in item) {
                    let val = item[i];
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
                                    .find('.input')
                                    .css('display', 'none');

                                structureInnerLinks(val[key], insertVal['@id'].replace('/api/items/', '/admin/item/'));
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

                            structureField(textareaValue, `property-value-${idx}`);
                            structureField(textareaUri, `property-uri-${idx}`);
                            structureField(select, `property-label-${idx}`, insertVal = element);
                            structureField(innerClass, `inner-class-${idx}`);
                            structureField(innerProperty, `inner-property-${idx}`);
                            innerClass.parent().css('display', 'none');

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

                                structureInnerLinks(val, val['@id'].replace('/api/items/', '/admin/item/'));
                            }
                        }

                        for (const [key, value] of Object.entries(val)) {
                            if (key == '@type') { innerClass.val(value).parent().css('display', 'block'); }
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

                                    structureInnerLinks(val[key], val['@id'].replace('/api/items/', '/admin/item/'));
                                }
                            }
                            else if (idx > 1) {
                                structureField(innerClass, `inner-class-${idx}`);
                                structureField(innerProperty, `inner-property-${idx}`, insertVal = key);

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

                                    structureInnerLinks(val[key], val[key]['@id'].replace('/api/items/', '/admin/item/'));
                                }
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

            select.attr({ 'data-value-key': `property-label-${num + 1}` }).val('');
            textareaValue.attr({ 'data-value-key': `property-value-${num + 1}` }).val(label)
            textareaUri.attr({ 'data-value-key': `property-uri-${num + 1}` }).val(id)
            innerClass.attr({ 'data-value-key': `inner-class-${num + 1}` }).val('');
            innerProperty.attr({ 'data-value-key': `inner-property-${num + 1}` }).val('');

            container.find('.nested-data-type_repeat_property')
                .last()
                .find('.input')
                .css('display', 'none');

            container.find('.nested-data-type_repeat_property')
                .last()
                .find('.o-title.items')
                .remove();

            structureInnerLinks(label, url);
        };
    });

    $(document).on('click', '.nested-data-type__resource_multiple', function (e) {
        e.preventDefault();
        let checkbox = $('.items  input:checked').parent().parent();
        cloneItem();
        findItems();

        const num = container.find('.nested-data-type_repeat_property').length;

        if (thisValue.is('.selecting-resource')) {

            let id = [], label = [], url = [];
            $(checkbox).each(element => {
                if ($(checkbox[element]).hasClass('resource')) {
                    const resource = JSON.parse($(checkbox[element]).attr('data-resource-values'));
                    id.push(resource['@id']);
                    label.push(resource['display_title']);
                    url.push(resource['url']);
                }
            });

            if (renderedLink) {
                renderedLink.remove();
                textareaValue.parent().parent().css('display', 'block');
                textareaUri.parent().parent().css('display', 'block')
            }

            select.attr({ 'data-value-key': `property-label-${num + 1}` }).val('');
            textareaValue.attr({ 'data-value-key': `property-value-${num + 1}` }).val(label)
            textareaUri.attr({ 'data-value-key': `property-uri-${num + 1}` }).val(id)
            innerClass.attr({ 'data-value-key': `inner-class-${num + 1}` }).val('');
            innerProperty.attr({ 'data-value-key': `inner-property-${num + 1}` }).val('');

            container.find('.nested-data-type_repeat_property')
                .last()
                .find('.input')
                .css('display', 'none');

            container.find('.nested-data-type_repeat_property')
                .last()
                .find('.o-title.items')
                .remove();

            for (let index = 0; index < id.length; index++) {
                const singleUrl = url[index];
                const singleLabel = label[index];

                structureInnerLinks(singleLabel, singleUrl);
            }
        };
    });
});