<?php
return [
    'data_types' => [
        'abstract_factories' => ['NestedDataType\Service\NestedDataTypeFactory'],
    ],
    'view_manager' => [
        'template_path_stack' => [
            OMEKA_PATH . '/modules/NestedDataType/view',
        ],
    ],
];
