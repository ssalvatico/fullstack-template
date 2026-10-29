<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\TemplateProductRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: TemplateProductRepository::class)]
#[ApiResource]
class TemplateProduct extends BaseEntity
{
    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: 'El nombre es obligatorio.')]
    private ?string $name = null;

    #[ORM\Column(type:'float')]
    #[Assert\NotNull(message: 'El precio es obligatorio.')]
    #[Assert\PositiveOrZero(message: 'El precio no puede ser negativo.')]
    private ?float $price = null;

    #[ORM\Column(length: 50)]
    #[Assert\NotBlank(message: 'El SKU es obligatorio.')]
    private ?string $sku = null;

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getSku(): ?string
    {
        return $this->sku;
    }

    public function setSku(string $sku): static
    {
        $this->sku = $sku;

        return $this;
    }
}
