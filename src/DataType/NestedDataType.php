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
        $properties = json_decode($value->value(),true);
        $values = array_column($properties,'value');

        $jsonLd = [
            '@value' => implode(' ', $values),
            'entity_label' => $label,
            'properties' =>  $properties,
        ];

        return $jsonLd;   
    }
    
    /**
     * @param array $valueObject
     */
    public function isValid(array $valueObject){

        $labels = array_map(
            function ($prop){
                return $prop->label();
            },
            $this->properties
        );

        foreach($valueObject as $key => $label) {
            if (strpos($key, 'property-label') !== false) {
                if(!in_array($label, $labels)){
                    return false;
                }
            }
        }

        return true;
    }

    public function hydrate(array $valueObject, Value $value, AbstractEntityAdapter $adapter){        
        
        if( array_column($valueObject['@value'], 'label') and array_column($valueObject['@value'], 'value')){
            $value->setValue(json_encode($valueObject['@value']));
        }
        else {
            $properties = [];
            
            foreach($valueObject as $key => $label) {
                
                if(substr($key,0,15) !== 'property-label-'){
                    continue;
                }
                
                $idx = (int) substr($key,15);
                $val = $valueObject["property-value-$idx"];
                $uri = $valueObject["property-uri-$idx"];
                $properties[$idx] = array_merge(
                    ['label' => $label],
                    $val ? ['value' => $val] : [],
                    $uri ? ['uri' => $uri] : []
                );
            }
            
            ksort($properties, SORT_NUMERIC);
            $value->setValue(json_encode(array_values($properties)));
        }
    }

    public function render(PhpRenderer $view, ValueRepresentation $value){
        
        $properties = json_decode($value->value(),true);
        $values = array_column($properties,'value');
        return implode(' ', $values);
    }
}
