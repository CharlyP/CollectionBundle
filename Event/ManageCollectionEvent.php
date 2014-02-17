<?php

namespace Charlyp\CollectionBundle\Event;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\EventDispatcher\Event;

/**
 * Custom Event for collection management
 *
 * @author Charles Pourcel <ch.pourcel@gmail.com>
 */
class ManageCollectionEvent extends Event
{
    /**
     * @var Object
     */
    private $owningEntity;

    /**
     * @var ArrayCollection
     */
    private $originalCollection;

    /**
     * @var string
     */
    private $getterName;

    /**
     * @var string
     */
    private $removerName;

    /**
     * @param ArrayCollection $originalCollection
     * @param string          $getterName
     * @param string          $removerName
     */
    public function __construct(Collection $originalCollection = null, $getterName = null, $removerName = null)
    {
        $this->setOriginalCollection($originalCollection);
        $this->setGetterName($getterName);
        $this->setRemoverName($removerName);
    }

    /**
     * @param ArrayCollection $originalCollection
     */
    public function setOriginalCollection(Collection $originalCollection)
    {
        $this->originalCollection = new ArrayCollection();

        foreach ($originalCollection as $collectionItem) {
            $this->originalCollection->add($collectionItem);
        }
    }

    /**
     * @return ArrayCollection
     */
    public function getOriginalCollection()
    {
        return $this->originalCollection;
    }

    /**
     * @param $owningEntity
     */
    public function setOwningEntity($owningEntity)
    {
        $this->owningEntity = $owningEntity;
    }

    public function getOwningEntity()
    {
        return $this->owningEntity;
    }

    /**
     * @param string $getterName
     */
    public function setGetterName($getterName)
    {
        $this->getterName = $getterName;
    }

    /**
     * @return string
     */
    public function getGetterName()
    {
        return $this->getterName;
    }

    /**
     * @param string $removerName
     */
    public function setRemoverName($removerName)
    {
        $this->removerName = $removerName;
    }

    /**
     * @return string
     */
    public function getRemoverName()
    {
        return $this->removerName;
    }
}
