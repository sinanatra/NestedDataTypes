<?php
return [
    'data_types' => [
        'abstract_factories' => ['NestedDataType\Service\NestedDataTypeFactory'],
    ],
    'controllers' => [
        'invokables' => [
            'NestedDataType\Controller\Index' => 'NestedDataType\Controller\IndexController',
        ],
    ],
    'view_manager' => [
        'template_path_stack' => [
            OMEKA_PATH . '/modules/NestedDataType/view',
        ],
    ],
    'router' => [
        'routes' => [
            'admin' => [
                'child_routes' => [
                    'nested-data-type' => [
                        'type' => 'Literal',
                        'options' => [
                            'route' => '/nested-data-type/sidebar-select',
                            'defaults' => [
                                '__NAMESPACE__' => 'NestedDataType\Controller',
                                'controller' => 'Index',
                                'action' => 'sidebar-select',
                            ],
                        ],
                        'may_terminate' => true,
                    ],
                ],
            ],
        ],
    ],
];
