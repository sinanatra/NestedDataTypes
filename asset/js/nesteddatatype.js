$(document).on('o:prepare-value', function (e, type, value, valueObj) {
    const thisValue = $(value);
    const container = thisValue.find('.nested-data-type_properties');
    const addBtn = thisValue.find('.nested-data-type_add_property');
    const rmvBtn = $('.nested-data-type_remove_property');

    // Add a default Value to trigger the hydrate() function
    const defaultValue = thisValue.find('.nested-data-type_value').val('value');
    const defaultProeprty = thisValue.find('.nested-data-type_property').val('value');

    let select, textareaValue, textareaUri;
    const findItems = () => {
        select = container.find('.nested-data-type_repeat_property').last().find('.nested-data-type_property_dropdown');
        textareaValue = container.find('.nested-data-type_repeat_property').last().find('.property-value');
        textareaUri = container.find('.nested-data-type_repeat_property').last().find('.property-uri');
    }
    const cloneItem = () => container.append(container.find('.nested-data-type_repeat_property').last().clone());

    // Add item on click
    addBtn.on('click', function (e) {
        e.preventDefault();
        const num = container.find('.nested-data-type_repeat_property').length;
        cloneItem();
        findItems();
        select.attr({ 'data-value-key': `property-label-${num + 1}` });
        select.val('');
        textareaValue.attr({ 'data-value-key': `property-value-${num + 1}` });
        textareaValue.val('');
        textareaUri.attr({ 'data-value-key': `property-uri-${num + 1}` });
        textareaUri.val('');
    });

    // Remove Button on click
    rmvBtn.on('click', function (e) {
        e.preventDefault();
        $(this).parent().remove();
    });

    // Prepares the fields to be rendered in the frontend
    if (0 === type.indexOf('nesteddatatype#')) {
        try {
            const properties = valueObj.properties;
            const keys = Object.keys(properties[0]);

            keys.forEach((element, idx) => {
                let item = properties[0][element];
                let val = item[0]
                console.log(idx, item)

                if (idx == 1) {
                    findItems();
                    select.val(element);
                    if (val['@value']) textareaValue.val(val['@value']);
                    if (val['label']) textareaValue.val(val['label']);
                    if (val['@id']) textareaUri.val(val['@id']);
                }
                else if (idx > 1) {
                    cloneItem();
                    findItems();
                    textareaValue.attr({ 'data-value-key': `property-value-${idx}` }).val('');
                    textareaUri.attr({ 'data-value-key': `property-uri-${idx}` }).val('');
                    select.attr({ 'data-value-key': `property-label-${idx}` }).val(element);
                    
                    if (val['@value']) { textareaValue.attr({ 'data-value-key': `property-value-${idx}` }).val(val['@value']) };
                    if (val['label']) textareaValue.attr({ 'data-value-key': `property-value-${idx}` }).val(val['label']);
                    if (val['@id']) textareaUri.attr({ 'data-value-key': `property-uri-${idx}` }).val(val['@id']);
                }
            });
        }
        catch (error) { console.error(error); }
    }
});
