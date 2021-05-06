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
        return $this->resourceClass->term();
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
        $propertiesArray = explode(";",$value->uri()); // this has to change
        $classesAndProperties =  array_combine( $propertiesArray, $valuesArray);

        $jsonLd = [
            '@value' => $valuesFlattened,
            'entity_label' => $label,
            'properties' => $classesAndProperties
        ];

        return $jsonLd;   
    }
    
    public function isValid(array $valueObject){
        $propLabels = array();
        
        // limit the range properly
        for($i = 0; $i < 20; ++$i ) {
            if($valueObject['property-label-' . $i]) {
                $propLabels[] = $valueObject['property-label-' . $i];
            }
        } 

        foreach($propLabels as $prop){
            if((in_array($prop, $this->properties))){
                return false;
            }
        }

        return true;
    }

    public function hydrate(array $valueObject, Value $value, AbstractEntityAdapter $adapter){        
        
        $propLabels = array();
        $propValues = array();

        // limit the range properly
        for($i = 0; $i < 20; ++$i ) {
            if($valueObject['property-label-' . $i]) {
                $propLabels[] = $valueObject['property-label-' . $i];
            }
            if($valueObject['property-value-' . $i]) {
                $propValues[] = $valueObject['property-value-' . $i];
            }
        } 

        $value->setUri(implode(";",$propLabels)); // this has to change
        $value->setValue(implode(";",$propValues));
    }
}
