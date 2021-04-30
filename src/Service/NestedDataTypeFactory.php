<?php

namespace NestedDataType\Service;

use NestedDataType\DataType\NestedDataType;
use Zend\ServiceManager\Factory\AbstractFactoryInterface;

class NestedDataTypeFactory implements AbstractFactoryInterface
{
    public function canCreate($services, $requestedName)
    {
        return (bool) preg_match('/^nesteddatatype#(\w).+$/', $requestedName);
    }

    public function __invoke($services, $requestedName, array $options = null)
    {
        $term = explode('#', $requestedName)[1];
        
        if (!$term) {
            throw new NestedDataTypeException("Invalid term : ".$term);
        }
        
        $resourceClasses = $services->get('Omeka\ApiManager')->search('resource_classes', ['term' => $term])->getContent();
        
        $i = new NestedDataType($resourceClasses[0]);

        return $i;
    }
}
