.. include:: ../Includes.txt

.. _configuration:

=============
Configuration
=============

Install extension
===============

1. Active extension
2. Include default typoscript of plugin
3. Define constant for changing template display

.. code-block:: typoscript
    # Constants
    plugin.tx_lbofootnote.view.templateRootPath

4. Include plugin ressources of the ckeditor

.. code-block:: yaml
    - { resource: "EXT:lbo_footnote/Configuration/RTE/Plugin.yaml" }

5. Use ViewHelpers in plugin to display the footnote in your website.

.. code-block:: html
    {namespace footnote=Libeo\LboFootnote\ViewHelpers}

    <footnote:noteBasPage.process>
        {content}
    </footnote:noteBasPage.process>

    <footnote:noteBasPage.display />