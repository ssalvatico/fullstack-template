<?php

namespace App\Entity;

use App\Repository\TemplateItemRepository;
use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TemplateItemRepository::class)]
#[ApiResource]
class TemplateItem extends BaseEntity
{
    #[ORM\Column(length: 50)]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'items')]
    #[ORM\JoinColumn(nullable: false)]
    private ?TemplateEntity $entity = null;

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getEntity(): ?TemplateEntity
    {
        return $this->entity;
    }

    public function setEntity(?TemplateEntity $entity): static
    {
        $this->entity = $entity;
        return $this;
    }
}
