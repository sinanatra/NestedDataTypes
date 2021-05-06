<?php

namespace NestedDataType\DataType;

use Zend\View\Renderer\PhpRenderer;
use Omeka\Entity\Value;
use Omeka\Api\Adapter\AbstractEntityAdapter;
use Omeka\Api\Representation\ResourceClassRepresentation;
use Omeka\Api\Representation\PropertyRepresentation;
use Omeka\Api\Representation\ValueRepresentation;
use Omeka\DataType\Literal;

class NestedDataType extends Literal
{
    /**
     * @var ResourceClassRepresentation
     */
    protected $resourceClass;

    /**
     * Constructor
     *
     * @param ResourceClassRepresentation $resourceClass
     * @param PropertyRepresentation[] $properties
     */
    public function __construct(ResourceClassRepresentation $resourceClass, array $properties)
    {
        $this->resourceClass = $resourceClass;
        $this->properties = $properties;
    }

    public function getName()
    {
        return 'nesteddatatype#'.$this->resourceClass->term();
    }

    public function getLabel()
    {
        return $this->resourceClass->label();
    }
    
    public function getOptgroupLabel()
    {
        return 'Specific class'; // @translate
    }

    public function form(PhpRenderer $view)
    {
        return $view->partial('common/data-type/nested', [
            'dataType' => $this->getName(),
            'label' => $this->getLabel(),
            'properties' => $this->properties,
            'resource' => $view->resource,
        ]);
    }

    public function getJsonLd(ValueRepresentation $value)
    {    
        $label = $this->getLabel();
        $valuesFlattened = preg_replace('/\;/', ' ', $value->value());
        $valuesArray = explode(";",$value->value());
        $propertiesArray = explode(";", preg_replace('/\ /', '_', $value->uri())); // this has to change
        $classesAndProperties =  array_combine( $propertiesArray, $valuesArray);

        $jsonLd = [
            '@value' => $valuesFlattened,
            'entity_label' => $label,
            'properties' => $classesAndProperties
        ];

        return $jsonLd;   
    }
    
    /**
     * @param array $valueObject
     */
    public function isValid(array $valueObject){

        //  to do
        // foreach($valueObject as $key => $item) {
        //     if (strpos($key, 'property-label') !== false) {
        //         if(in_array($valueObject[$key], $this->properties) == false){
        //             return false;
        //         }
        //     }
        // }

        return true;
    }

    public function hydrate(array $valueObject, Value $value, AbstractEntityAdapter $adapter){        
        
        $propLabels = array();
        $propValues = array();

        foreach($valueObject as $key => $item) {
            if (strpos($key, 'property-label') !== false) {
                $propLabels[] = $item;
            }
            if (strpos($key, 'property-value') !== false) {
                $propValues[] = $item;
            }
        }

        $value->setValue(implode(";",$propValues));
        $value->setUri(implode(";",$propLabels)); // this has to change
    }
}
