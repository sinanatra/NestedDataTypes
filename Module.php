<?php
namespace NestedDataType;

use Omeka\Module\AbstractModule;
use Laminas\EventManager\Event;
use Laminas\EventManager\SharedEventManagerInterface;

class Module extends AbstractModule
{
    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

    public function attachListeners(SharedEventManagerInterface $sharedEventManager)
    {
        $sharedEventManager->attach(
            'Omeka\Controller\Admin\Item',
            'view.add.after',
            [$this, 'renderAssets']
        );
        $sharedEventManager->attach(
            'Omeka\Controller\Admin\Item',
            'view.edit.after',
            [$this, 'renderAssets']
        );
        $sharedEventManager->attach(
            'Omeka\Controller\Admin\ItemSet',
            'view.add.after',
            [$this, 'renderAssets']
        );
        $sharedEventManager->attach(
            'Omeka\Controller\Admin\ItemSet',
            'view.edit.after',
            [$this, 'renderAssets']
        );
        $sharedEventManager->attach(
            'Omeka\Controller\Admin\Media',
            'view.add.after',
            [$this, 'renderAssets']
        );
        $sharedEventManager->attach(
            'Omeka\Controller\Admin\Media',
            'view.edit.after',
            [$this, 'renderAssets']
        );
        $sharedEventManager->attach(
            'Omeka\DataType\Manager',
            'service.registered_names',
            [$this, 'addResourcesClassesServices']
        );
    }

    public function renderAssets(Event $event)
    {
        $view = $event->getTarget();
        $assetUrl = $view->plugin('assetUrl');
        $view->headLink()
            ->appendStylesheet($assetUrl('css/nesteddatatype.css', 'NestedDataType'));
    }

    public function addResourcesClassesServices(Event $event)
    {
        // $resourcesProperties = $this->getServiceLocator()->get('Omeka\ApiManager')->search('resource_classes')->getContent();
        $resourcesClasses = $this->getServiceLocator()->get('Omeka\ApiManager')->search('resource_classes')->getContent();

        $names = $event->getParam('registered_names');

        foreach ($resourcesClasses as $class) {
            $names[] = 'nesteddatatype#'.$class->term();
        }

        $event->setParam('registered_names', $names);
    }

   
}

