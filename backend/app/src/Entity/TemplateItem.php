<?php

namespace App\Entity;

use App\Repository\TemplateItemRepository;
use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;


#[ORM\Entity(repositoryClass: TemplateItemRepository::class)]
#[ApiResource]
class TemplateItem extends BaseEntity
{
    #[ORM\Column(length: 50)]
    #[Assert\NotBlank(message: 'El nombre es obligatorio.')]
    #[Assert\Length(
        min: 3,
        max: 50,
        minMessage: 'El nombre debe tener al menos 3 caracteres.',
        maxMessage: 'El nombre debe tener a lo sumo 50 caracteres.',
    )]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'items')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
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
