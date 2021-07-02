<?php

namespace NestedDataType\Controller;

use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\View\Model\ViewModel;

class IndexController extends AbstractActionController
{
    public function sidebarSelectAction()
    {
        $this->setBrowseDefaults('created');

        $response = $this->api()->search('items', $this->params()->fromQuery());
        $this->paginator($response->getTotalResults());
        
        $view = new ViewModel;
        $view->setVariable('items', $response->getContent());
        $view->setVariable('search', $this->params()->fromQuery('search'));
        $view->setVariable('resourceClassId', $this->params()->fromQuery('resource_class_id'));
        $view->setVariable('itemSetId', $this->params()->fromQuery('item_set_id'));
        $view->setVariable('showDetails', false);
        $view->setTerminal(true);
        $view->setTemplate('/nested-data-type/item/sidebar-select');
        return $view;
    }
}