<?php

namespace NestedDataType\DataType;

use Zend\View\Renderer\PhpRenderer;
use Zend\Form\Form;
use Laminas\Form\Element;
use Omeka\Api\Representation\ResourceClassRepresentation;
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
     * @param CustomVocabRepresentation $vocab
     */
    public function __construct(ResourceClassRepresentation $resourceClass)
    {
        $this->resourceClass = $resourceClass;
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
        $label = $this->getLabel();
        $element = new Element\Textarea('html');
        
        $element->setAttributes([
            'class' => 'value',
            'data-value-key' => '@value',
        ]);

        // $translate = $view->plugin('translate');
        // $html = $view->hyperlink('', '#', ['class' => 'value-language o-icon-language', 'title' => $translate('Set language')]);
        // $html .= '<input class="value-language property-language" type="text" data-value-key="@language" aria-label="' . $translate('Language') . '">';
        $html .= '<div class="property-label">'. $label .'</div>';
        $html .= $view->formTextarea($element);

        return $html;
    }
    
    public function getJsonLd(ValueRepresentation $value)
    {    
        $label = $this->getLabel();

        $jsonLd = [
            '@value' => $value->value(),
            'entity' => $label,
        ];         
        return $jsonLd;   
    }
    
    public function getFulltextText(PhpRenderer $view, ValueRepresentation $value)
    {
        return $this->render($view, $value);
    }

    // public function render(PhpRenderer $view, ValueRepresentation $value)
    // {
    //     return $value->value();
    // }

    // public function validate()
    // {
    //     return false;
    // }

}
