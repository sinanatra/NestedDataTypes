$(document).on('o:prepare-value', function (e, type, value, valueObj) {
    const thisValue = $(value);
    const addBtn = thisValue.find('.nested-data-type_add_property');
    const container = thisValue.find('.nested-data-type_properties');

    // I have to add a default Value to trigger the hydrate() function
    const defaultValue = thisValue.find('.nested-data-type_value').attr({ 'value': 'value' });

    // Add item on click
    addBtn.on('click', function (e) {
        e.preventDefault();
        const num = container.find('.nested-data-type_repeat_property').length;
        const clone = container.append(container.find('.nested-data-type_repeat_property').last().clone());

        const select = container.find('.nested-data-type_repeat_property').last().find('select');
        select.attr({ 'data-value-key': `property-label-${num + 1}` });

        const textarea = container.find('.nested-data-type_repeat_property').last().find('textarea');
        textarea.attr({ 'data-value-key': `property-value-${num + 1}` });
        textarea.val('');
    });

    // Prepares the fields to be rendered in the frontend
    if (0 === type.indexOf('nesteddatatype#')) {
        try {
            
            const properties = valueObj.properties;
            const keys = Object.keys(properties);
            
            keys.forEach(function (element, i) {
                const container = thisValue.find('.nested-data-type_properties');
                const select = container.find('.nested-data-type_repeat_property').last().find('select');
                const textarea = container.find('.nested-data-type_repeat_property').last().find('textarea');

                if(i == 0){
                    select.val(element);
                    textarea.val(properties[element]);
                }
                else{
                    const clone = container.append(container.find('.nested-data-type_repeat_property').last().clone());

                    select.attr({ 'data-value-key': `property-label-${i + 1}` });
                    select.val(element);
                    textarea.attr({ 'data-value-key': `property-value-${i + 1}` })
                    textarea.val(properties[element]);
                }

            });
        }
        catch { }
    }
});
