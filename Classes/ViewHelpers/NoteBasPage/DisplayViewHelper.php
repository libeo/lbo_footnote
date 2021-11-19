<?php

namespace Libeo\LboFootnote\ViewHelpers\NoteBasPage;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3Fluid\Fluid\Core\ViewHelper\Traits\CompileWithRenderStatic;

class DisplayViewHelper extends AbstractViewHelper
{
    use CompileWithRenderStatic;

    /**
     * @var boolean
     */
    protected $escapeOutput = false;

    /**
     * @param array $arguments
     * @param \Closure $renderChildrenClosure
     * @param RenderingContextInterface $renderingContext
     * @return mixed
     */
    public static function renderStatic(
        array $arguments,
        \Closure $renderChildrenClosure,
        RenderingContextInterface $renderingContext
    ) {
        $content = '';

        /** @var NoteBasPageRepository $noteBasPageRepository */
        $noteBasPageRepository = GeneralUtility::makeInstance(NoteBasPageRepository::class);

        $notes = $noteBasPageRepository->getNotes();
        if (!$notes) {
            return $content;
        }

        $content = TemplateUtility::displayNotes($notes);

        return $content;
    }
}
