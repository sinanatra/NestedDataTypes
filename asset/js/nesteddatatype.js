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
            const keys = Object.keys(properties);

            keys.forEach((element, i) => {
                if (i == 0) {
                    findItems();
                    select.val(properties[element]['label']);
                    textareaValue.val(properties[element]['value']);
                    textareaUri.val(properties[element]['uri']);
                }
                else {
                    cloneItem();
                    findItems();
                    select.attr({ 'data-value-key': `property-label-${i + 1}` }).val(properties[element]['label']);
                    textareaValue.attr({ 'data-value-key': `property-value-${i + 1}` }).val(properties[element]['value']);
                    textareaUri.attr({ 'data-value-key': `property-uri-${i + 1}` }).val(properties[element]['uri']);
                }
            });
        }
        catch (error) { console.error(error); }
    }
});
