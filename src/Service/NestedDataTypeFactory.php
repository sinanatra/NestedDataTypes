<?php

namespace NestedDataType\Service;

use NestedDataType\DataType\NestedDataType;
use Laminas\ServiceManager\Factory\AbstractFactoryInterface;

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
        
        $apiManager = $services->get('Omeka\ApiManager');
        $resourceClasses = $apiManager->search('resource_classes', ['term' => $term])->getContent();
        
        $vocabularyId = $resourceClasses[0]->vocabulary()->id();
        $properties = $apiManager->search('properties', ['vocabulary_id' => $vocabularyId])->getContent();
        $classes = $apiManager->search('resource_classes', ['vocabulary_id' => $vocabularyId])->getContent();

        $i = new NestedDataType($resourceClasses[0], $properties, $classes);

        return $i;
    }
}
