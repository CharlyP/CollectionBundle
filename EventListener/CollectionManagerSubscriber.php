<?php

namespace Charlyp\CollectionBundle\EventListener;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManager;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

use Charlyp\CollectionBundle\CollectionManagementEvents;
use Charlyp\CollectionBundle\Event\ManageCollectionEvent;

/**
 * Subscriber for Collection Management
 *
 * @author Charles Pourcel <ch.pourcel@gmail.com>
 */
class CollectionManagerSubscriber implements EventSubscriberInterface
{
    /**
     * @var EntityManager
     */
    private $em;

    public static function getSubscribedEvents()
    {
        return array(
            CollectionManagementEvents::COLLECTION_MANAGE => 'manageCollection',
        );
    }

    public function __construct(EntityManager $em)
    {
        $this->em = $em;
    }

    public function manageCollection(ManageCollectionEvent $event)
    {
        if (!$this->supportsEventData($event)) {
            return;
        }

        $originalCollection = $event->getOriginalCollection();
        $owningEntity = $event->getOwningEntity();
        $getterName = $event->getGetterName();
        $removerName = $event->getRemoverName();

        //Remove the relationship between the owningEntity and the relatedEntity
        foreach ($originalCollection as $collectionItem) {
            if (false === $owningEntity->{$getterName}()->contains($collectionItem)) {
                //Remove the relation between the collectionItem and the owningEntity
                $owningEntity->{$removerName}($collectionItem);

                //Delete the related collectionItem from the database
                $this->em->remove($collectionItem);
            }
        }
    }

    protected function supportsEventData(ManageCollectionEvent $event)
    {
        $originalCollection = $event->getOriginalCollection();
        if (!$originalCollection || !$originalCollection instanceof ArrayCollection || $originalCollection->isEmpty()) {
            return false;
        }

        $owningEntity = $event->getOwningEntity();
        if (!$owningEntity) {
            return false;
        }

        $getterName = $event->getGetterName();
        if (!is_callable(array($owningEntity, $getterName))) {
            return false;
        }

        $removerName = $event->getRemoverName();
        if (!is_callable(array($owningEntity, $removerName))) {
            return false;
        }

        return true;
    }
}
