# Nested Data types module for Omeka S

This module allows the user to choose a specific resource class as datatype while editing resource templates.    Additionally, when editing an item, the user can select inner properties for the chosen class.

It was initially designed to work with the nested CIDOC-CRM structure in Omeka S, avoiding creating an abundance of Omeka resources.
However, it should only replace an Omeka resource, literal, or URI when strictly necessary.  

For instance:

- crm:P43_has_dimension   
    - crm:E54_Dimension   
        - crm:P2_has_type
        - crm:P90_has_value
        - crm:P91_has_unit

Can be structured as a multi input field:

![alt text](https://gist.githubusercontent.com/sinanatra/a39c3625f3871c19a7e720d3ceb44339/raw/5ffa98b47e96a9225ed4d80340684d8036c67e89/img.png)

The module fills the content of `@value` as json-ld based on the values from the multi input field.
Specific keys can be ignored when rendering the `@value` with the `"is_hidden"` property, which can be activated by clicking on the eye icon.

```json
{
    "type": "nesteddatatype#crm:E54_Dimension",
    "property_id": 1262,
    "property_label": "P43 has dimension",
    "is_public": true,
    "@value": [
        {
            "@type": "crm:E54_Dimension",
            "crm:P2_has_type": [
                {
                    "@id": "http://localhost:8080/api/items/23685",
                    "label": "width"
                }
            ],
            "crm:P90_has_value": [
                {
                    "@value": "90"
                }
            ],
            "crm:P91_has_unit": [
                {
                    "@id": "http://localhost:8080/api/items/23686",
                    "label": "centimeters"
                }
            ]
        }
    ]
}
```

The content of `@value` is structured as JSON-LD that can be easily converted to other semantic web standars:

### RDFXML:
```xml
<ns0:P43_has_dimension>
    <ns0:E54_Dimension>
        <ns0:P2_has_type rdf:resource="http://vocab.getty.edu/aat/300055647"/>
        <ns0:P90_has_value rdf:datatype="http://www.w3.org/2001/XMLSchema#string">90</ns0:P90_has_value>
        <ns0:P91_has_unit rdf:resource="http://vocab.getty.edu/aat/300379098"/>
    </ns0:E54_Dimension>
</ns0:P43_has_dimension>
```
### Turtle:
```
@prefix ns0: <crm:> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

[] ns0:P43_has_dimension [
    a ns0:E54_Dimension ;
    ns0:P2_has_type <http://vocab.getty.edu/aat/300055647> ;
    ns0:P90_has_value "90"^^xsd:string ;
    ns0:P91_has_unit <http://vocab.getty.edu/aat/300379098>
  ] .
```

### N-Triples:
```
_:genid1 <crm:P43_has_dimension> _:genid2 .
_:genid2 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <crm:E54_Dimension> .
_:genid2 <crm:P2_has_type> <http://vocab.getty.edu/aat/300055647> .
_:genid2 <crm:P90_has_value> "90"^^<http://www.w3.org/2001/XMLSchema#string> .
_:genid2 <crm:P91_has_unit> <http://vocab.getty.edu/aat/300379098> .
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
