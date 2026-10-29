<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use App\Repository\TemplateEntityRepository;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;


#[ORM\Entity(repositoryClass: TemplateEntityRepository::class)]
#[ApiResource]
class TemplateEntity extends BaseEntity
{
    #[ORM\Column(length: 50)]
    #[Assert\NotBlank(message: 'El nombre es obligatorio.')]
    private ?string $name = null;

    #[ORM\Column]
    #[Assert\NotNull(message: 'El estado es obligatorio.')]
    private ?bool $active = null;

    /**
     * @var Collection<int, TemplateItem>
     */
    #[ORM\OneToMany(targetEntity: TemplateItem::class, mappedBy: 'entity')]
    private Collection $items;

    public function __construct()
    {
        $this->items = new ArrayCollection();
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->active;
    }

    public function setActive(bool $active): static
    {
        $this->active = $active;
        return $this;
    }

    /**
     * @return Collection<int, TemplateItem>
     */
    public function getItems(): Collection
    {
        return $this->items;
    }

    public function addItem(TemplateItem $item): static
    {
        if (!$this->items->contains($item)) {
            $this->items->add($item);
            $item->setEntity($this);
        }
        return $this;
    }

    public function removeItem(TemplateItem $item): static
    {
        if ($this->items->removeElement($item)) {
            // set the owning side to null (unless already changed)
            if ($item->getEntity() === $this) {
                $item->setEntity(null);
            }
        }
        return $this;
    }
}
