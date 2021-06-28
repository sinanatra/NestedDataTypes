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
     * @param ResourceClassRepresentation[] $classes
     */
    public function __construct(ResourceClassRepresentation $resourceClass, array $properties, array $classes)
    {
        $this->resourceClass = $resourceClass;
        $this->properties = $properties;
        $this->classes = $classes;
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
            'classes' => $this->classes,
            'resource' => $view->resource,
        ]);
    }

    public function getJsonLd(ValueRepresentation $value)
    {    
        $properties = json_decode($value->value(), true);
        $values = [];

        foreach ($properties[0] as $key => $val) {
            foreach ($val as $innerKey => $innerVal) {
                if($innerVal['@value']){
                    $values[$key] = $innerVal['@value'];
                }
                if($innerVal['@id']){
                    $values[$key] = $innerVal['label'];
                }
            }
        }

        $jsonLd = [
            '@value' => implode(' ', $values),
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
                return $prop->term();
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
        
        if( array_column($valueObject['@value'], '@type')) {
            $value->setValue(json_encode($valueObject['@value']));
        }
        else {
            $properties = [];

            $properties = array_merge(
                ["@type" => $this->getLabel() ]
            );

            foreach($valueObject as $key => $label) {
                
                if(substr($key,0,15) !== 'property-label-'){
                    continue;
                }
                
                $idx = (int) substr($key,15);
                $val = $valueObject["property-value-$idx"];
                $uri = $valueObject["property-uri-$idx"];
                
                // $innerClass = $valueObject["inner-class-$idx"];
                // $innerProp = $valueObject["inner-property-$idx"];

                // if($innerClass && $innerProp){
                //     $properties[$label][0] = array_merge(
                //         ["@type" => $innerClass ],
                //         [$innerProp  => $uri ? ['@id' => $uri, 'label' => $val] : ['@value' => $val] ]
                //    );
                // } else {
                //     $properties[$label][0] = array_merge(
                //          $uri ? ['@id' => $uri, 'label' => $val] : ['@value' => $val]
                //     );
                // }

                $properties[$label][0] = array_merge(
                     $uri ? ['@id' => $uri, 'label' => $val] : ['@value' => $val]
                );
            }
            
            // ksort($properties, SORT_NUMERIC);
            $value->setValue(json_encode([$properties]));     
        }
    }

    public function render(PhpRenderer $view, ValueRepresentation $value){
        
        $properties = json_decode($value->value(), true);
        $values = [];

        foreach ($properties[0] as $key => $val) {
            foreach ($val as $innerKey => $innerVal) {
                if($innerVal['@value']){
                    $values[$key] = $innerVal['@value'];
                }
                if($innerVal['@id']){
                    $values[$key] = $innerVal['label'];
                }
            }
        }

        return implode(' ', $values);
    }
}

