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
        return $view->partial('nested-data-type/data-type/nested-data-type', [
            'dataType' => $this->getName(),
            'label' => $this->getLabel(),
            'properties' => $this->properties,
            'classes' => $this->classes,
            'resource' => $view->resource,
        ]);
    }

    public function getJsonLd(ValueRepresentation $value)
    {    
        $values= json_decode($value->value(), true);
        $simpleValue = [];

        foreach ($values[0] as $key => $val) {
            if (is_array($val) || is_object($val)){
                foreach ($val as $innerKey => $innerVal) {
                    if(!isset($innerVal['is_hidden'])){
                        if(isset($innerVal['@value'])){
                            $simpleValue[$key] = $innerVal['@value'];
                            continue;
                        }
                        if(isset($innerVal['label'])){
                            $simpleValue[$key] = $innerVal['label'];
                            continue;
                        }
                        if (is_array($innerVal) || is_object($innerVal)){
                            foreach ($innerVal as $secondKey => $secondVal) {
                            if(isset($secondVal['@value'])){
                                    $simpleValue[$key] = $secondVal['@value'];
                                }
                                if(isset($secondVal['label'])){
                                    $simpleValue[$key] = $secondVal['label'];
                                }
                            }
                        }
                    }
                }
            }
        }

        $jsonLd = [
            '@value' => $values,
            'simpleValue' => implode('; ', $simpleValue),
        ];

        return $jsonLd;   
    }
    
    /**
     * @param array $valueObject
     */
    public function isValid(array $valueObject){

        // $labels = array_map(
        //     function ($prop){
        //         return $prop->term();
        //     },
        //     $this->properties
        // );

        // foreach($valueObject as $key => $label) {
        //     if (strpos($key, 'property-label') !== false) {
        //         if(!in_array($label, $labels)){
        //             return false;
        //         }
        //     }
        // }

        return true;
    }

    public function hydrate(array $valueObject, Value $value, AbstractEntityAdapter $adapter){        
        $serviceLocator = $adapter->getServiceLocator();

        $prevLabel = '';
        $num = 0;

        if(strpos($valueObject['@value'],'@type') !== false){
            $value->setValue(json_encode($valueObject['@value']));
        }


        else {
            $properties = [];

            $properties = array_merge(
                ["@type" => $this->getLabel() ]
            );


            foreach($valueObject as $key => $label) {
                
                if ($prevLabel == $label) {
                    $num += 1;
                }
                
                if (substr($key,0,15) !== 'property-label-'){
                    continue;
                }
                
                $idx = (int) substr($key,15);
                $val = $valueObject["property-value-$idx"];
                $uri = $valueObject["property-uri-$idx"];
                
                // Update title from Omeka Id - to be cleaned.
                if (strpos($uri, '/api/items/') !== false) {
                    try {
                        $str = explode("/api/items/", $uri);
                        $api = $serviceLocator->get('Omeka\ApiManager');
                        $response = $api->read('items', $str[1]);
                        $val = $response->getContent()->displayTitle();
                    } catch (\Throwable $th) {}
                }

                $innerClass = $valueObject["inner-class-$idx"];
                $innerProp = $valueObject["inner-property-$idx"];
                $isHidden = $valueObject["is-hidden-$idx"];

                $prevLabel = $label;

                if ($innerClass && $innerProp){
                    $properties[$label][$num] = array_merge(
                        ["@type" => $innerClass ],
                        [$innerProp  => $uri ? ['@id' => $uri, 'label' => $val] : ['@value' => $val] ],
                        $isHidden ? ['is_hidden' => $isHidden] : []
                   );
                } else {
                    $properties[$label][$num] = array_merge(
                        $uri ? ['@id' => $uri, 'label' => $val] : ['@value' => $val],
                        $isHidden ? ['is_hidden' => $isHidden] : []
                    );
                }        
            }

            $value->setValue(json_encode([$properties]));     
            $prevLabel .= $label;
        }
    }

    public function render(PhpRenderer $view, ValueRepresentation $value){
        
        $values = json_decode($value->value(), true);
        $simpleValue = [];
        
        foreach ($values[0] as $key => $val) {
            
            if($key == '@type'){
                $simpleValue[$key] =  $val;
            }

            if (is_array($val) || is_object($val)){
                foreach ($val as $innerKey => $innerVal) {
                    if(!isset($innerVal['is_hidden'])){
                        if(isset($innerVal['@value'])){
                            $simpleValue[$key] = $innerVal['@value'];
                            continue;
                        }
                        if(isset($innerVal['label'])){
                            $simpleValue[$key] = $innerVal;
                            continue;
                        }
                        if (is_array($innerVal) || is_object($innerVal)){
                            foreach ($innerVal as $secondKey => $secondVal) {
                            if(isset($secondVal['@value'])){
                                    $simpleValue[$key] = $secondVal['@value'];
                                }
                                if(isset($secondVal['label'])){
                                    $simpleValue[$key] = $secondVal;
                                }
                            }
                        }
                    }
                }
            }
        }

        // return json_encode($values);
        return "<div class='nested-data-types__value-value-container'>" . implode('', array_map(
            function ($v, $k) {

                if($k == '@type'){
                    return "<div class='value-container__type'><strong>" . str_replace("_", " ", explode(":", $v)[1]) . "</strong></div>";
                }

                if(isset($v['label'])){
                    $url = explode("items/", $v['@id'])[1];
                    $v =  "<span class='value__property'><a class='resource-link' href='" . $url . "'><span class='resource-name'>" . $v['label']. "</span></a></span>";
                }
                else {
                    $v =  "<span class='value__property'>" . $v . "</span>";
                }
                
                $k =  "<span class='value__label'><em>" . str_replace("_", " ", explode(":", $k)[1]) . "</em></span>";

                return "<div class='value-container__value'>" . $k . "<span class='value__separator'>" .": " . "</span>" . $v . "</div>";
            },
            $simpleValue,
            array_keys($simpleValue)
        )). "</div>";
    }
}

