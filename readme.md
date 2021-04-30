# Nested Data types module for Omeka S

This module allows the user to choose a specific resource class as datatype while editing resource templates.   
Additionally, when editing an item the user can select inner properties for the chosen class.

It was initially designed to work with the CIDOC-CRM nested structure in Omeka S, avoiding to create an abundance of Omeka resources.   

- crm:P43_has_dimension   
    - crm:E54_Dimension   
        - crm:P2_has_type
        - crm:P90_has_value
        - crm:P91_has_unit

## Installation

* See general end user documentation for [Installing a module](http://omeka.org/s/docs/user-manual/modules/#installing-modules)

## Usage

* Activate the NestedDataType module.
* On the resource template, you can choose a resource class from previously installed vocabularies as datatype.
* When you create or edit an item based on the template, the sidebar suggest you the specific class choose above.
* A dropdown will help you in chosing an inner property to insert.