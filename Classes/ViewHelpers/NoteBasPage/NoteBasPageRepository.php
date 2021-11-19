<?php

namespace Libeo\LboFootnote\ViewHelpers\NoteBasPage;

use TYPO3\CMS\Core\SingletonInterface;

class NoteBasPageRepository implements SingletonInterface
{
    private $notes = [];

    public function addNote(string $content) {
        $this->notes[] = $content;
    }

    public function getCurrentIndex() : int {
        return count($this->notes);
    }

    public function getNotes() : array {
        return $this->notes;
    }
}