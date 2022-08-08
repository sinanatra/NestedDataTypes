<?php

namespace NestedDataType;

use Laminas\Mvc\MvcEvent;
use Omeka\Module\AbstractModule;
use Laminas\EventManager\Event;
use Laminas\EventManager\SharedEventManagerInterface;

class Module extends AbstractModule
{

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

    public function onBootstrap(MvcEvent $event): void
    {
        parent::onBootstrap($event);
        $acl = $this->getServiceLocator()->get('Omeka\Acl');
        $acl->allow(null, 'NestedDataType\Controller\Index');
    }

    public function attachListeners(SharedEventManagerInterface $sharedEventManager)
    {
        $sharedEventManager->attach(
            \Omeka\Api\Representation\ItemRepresentation::class,
            'rep.resource.title',
            [$this, 'handleResourceTitle']
        );
        $sharedEventManager->attach(
            \Omeka\Api\Representation\ItemSetRepresentation::class,
            'rep.resource.title',
            [$this, 'handleResourceTitle']
        );
        $sharedEventManager->attach(
            \Omeka\Api\Representation\MediaRepresentation::class,
            'rep.resource.title',
            [$this, 'handleResourceTitle']
        );
        $sharedEventManager->attach(
            \Annotate\Api\Representation\AnnotationRepresentation::class,
            'rep.resource.title',
            [$this, 'handleResourceTitle']
        );
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
        $view->headScript()
            ->appendFile($assetUrl('js/jquery-ui.min.js', 'NestedDataType'));
        $view->headScript()
            ->appendFile($assetUrl('js/nesteddatatype.js', 'NestedDataType'));
    }

    public function addResourcesClassesServices(Event $event)
    {
        $resourcesClasses = $this->getServiceLocator()->get('Omeka\ApiManager')->search('resource_classes')->getContent();

        $names = $event->getParam('registered_names');

        foreach ($resourcesClasses as $class) {
            $names[] = 'nesteddatatype#' . $class->term();
        }

        $event->setParam('registered_names', $names);
    }

    /**
     * Manage the parsing of the title.
     *
     * @param Event $event
     */
    public function handleResourceTitle(Event $event): void
    {
        $resource = $event->getTarget();
        $template = $resource->resourceTemplate();

        if ($template && $property = $template->titleProperty()) {
            $title = $resource->value($property->term());
            $properties = json_decode($title, true);

            $event->setParam('title', (string) $title);
            if (isset($properties[0]['@type'])) {
                $values = [];

                foreach ($properties[0] as $key => $val) {
                    if (is_array($val) || is_object($val)) {
                        foreach ($val as $innerKey => $innerVal) {
                            if ($innerVal['@value']) {
                                $values[$key] = $innerVal['@value'];
                                continue;
                            }
                            if ($innerVal['label']) {
                                $values[$key] = $innerVal['label'];
                                continue;
                            }
                            foreach ($innerVal as $secondKey => $secondVal) {
                                $values[$key] = $secondVal['@value'];
                                if ($secondVal['@value']) {
                                    $values[$key] = $secondVal['@value'];
                                }
                                if ($secondVal['label']) {
                                    $values[$key] = $secondVal['label'];
                                }
                            }
                        }
                    }
                }
                $cleanedTitle = implode('; ', $values);
                $event->setParam('title', (string) $cleanedTitle);
            } else {
                $event->setParam('title', (string) $title);
            }
        }
    }
}
