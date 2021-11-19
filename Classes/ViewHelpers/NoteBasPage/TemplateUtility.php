<?php

namespace Libeo\LboFootnote\ViewHelpers\NoteBasPage;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Configuration\ConfigurationManager;
use TYPO3\CMS\Extbase\Configuration\ConfigurationManagerInterface;
use TYPO3\CMS\Fluid\View\StandaloneView;

class TemplateUtility
{
    /**
     * @param int $indexNote
     * @param string $prefix
     * @return string
     */
    public static function getLinkToNote(string $footquote, int $indexNote, string $prefix = ''): string
    {
        $view = self::getTemplateView();

        $view->setTemplate('LinkToNote');

        $view->assign('id', 'note-' . $prefix . $indexNote);
        $view->assign('indexNote', $indexNote);
        $view->assign('footquote', $footquote);

        return $view->render();
    }

    /**
     * @param array $notes
     * @param string $prefix
     * @return string
     */
    public static function displayNotes(array $notes, string $prefix = ''): string
    {
        $view = self::getTemplateView();

        $view->setTemplate('DisplayNotes');

        $view->assign('notes', $notes);
        $view->assign('prefix', $prefix);

        return $view->render();
    }

    /**
     * @return StandaloneView
     */
    private static function getTemplateView(): StandaloneView
    {
        $configurationManager = GeneralUtility::makeInstance(ConfigurationManager::class);
        $setting = $configurationManager->getConfiguration(ConfigurationManagerInterface::CONFIGURATION_TYPE_FULL_TYPOSCRIPT);
        $typoscriptView = $setting['plugin.']['tx_lbofootnote.']['view.'];

        /** @var StandaloneView $view */
        $view = GeneralUtility::makeInstance(StandaloneView::class);
        $view->setTemplateRootPaths($typoscriptView['templateRootPaths.']);

        return $view;
    }
}
