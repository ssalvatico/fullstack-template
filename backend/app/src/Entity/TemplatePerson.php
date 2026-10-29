<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\TemplatePersonRepository;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TemplatePersonRepository::class)]
#[ApiResource]
class TemplatePerson
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private int $id;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: 'El nombre es obligatorio.')]
    #[Assert\Length(max: 100, maxMessage: 'El nombre no puede superar los 100 caracteres.')]
    private string $name;

    #[ORM\Column(type: Types::INTEGER)]
    #[Assert\NotNull(message: 'La edad es obligatoria.')]
    #[Assert\PositiveOrZero(message: 'La edad debe ser mayor o igual a cero.')]
    private int $age;

    #[ORM\Column(type: Types::INTEGER)]
    #[Assert\NotNull(message: 'El DNI es obligatorio.')]
    #[Assert\Positive(message: 'El DNI debe ser mayor que cero.')]
    private int $dni;

    #[ORM\Column]
    #[Assert\NotNull(message: 'El estado vital es obligatorio.')]
    private bool $alive;

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getAge(): int
    {
        return $this->age;
    }

    public function setAge(int $age): static
    {
        $this->age = $age;

        return $this;
    }

    public function getDni(): int
    {
        return $this->dni;
    }

    public function setDni(int $dni): static
    {
        $this->dni = $dni;

        return $this;
    }

    public function isAlive(): bool
    {
        return $this->alive;
    }

    public function setAlive(bool $alive): static
    {
        $this->alive = $alive;

        return $this;
    }
}
