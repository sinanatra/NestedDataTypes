# Nested Data types module for Omeka S

This module allows the user to choose a specific resource class as datatype while editing resource templates.    Additionally, when editing an item, the user can select inner properties for the chosen class.

It was initially designed to work with the CIDOC-CRM nested structure in Omeka S, while avoiding to create an abundance of Omeka resources. 

For instance:

- crm:P43_has_dimension   
    - crm:E54_Dimension   
        - crm:P2_has_type
        - crm:P90_has_value
        - crm:P91_has_unit

Can be structured as a multi input field:

![alt text](https://gist.githubusercontent.com/sinanatra/a39c3625f3871c19a7e720d3ceb44339/raw/607f3207c23b29bde0f7b0151b8e33e236ea1c1c/img.png)

The module adds two keys to the json-ld Omeka S provides: the `entity_label`  and the `properties`. 
This will make further conversions to RDF/XML easier.

The json-ld also keeps the `@value` key, for basic processing.

```json
{
"type": "nesteddatatype#cidoc-crm:E54_Dimension",
    "property_id": 1262,
    "property_label": "P43 has dimension",
    "is_public": true,
    "@value": "width 90 cm",
    "entity_label": "cidoc-crm:E54_Dimension",
    "properties": {
        "cidoc-crm:P2_has_type": "width",
        "cidoc-crm:P90_has_value": "90",
        "cidoc-crm:P91_has_unit": "cm"
    }
}
```

## Installation

* See general end user documentation for [Installing a module](http://omeka.org/s/docs/user-manual/modules/#installing-modules)

## Usage

* Activate the NestedDataType module.
* On the resource template, you can choose a resource class from previously installed vocabularies as datatype.
* When you create or edit an item based on the template, the sidebar suggest you the specific class choose above.
* A dropdown will help you in chosing an inner property to insert.

## Contribute

Feel free to submit any issue or request.

This project is still in development and I use it for my own projects. Don't use it on a production website if you're not sure of being able to correct my bugs.
