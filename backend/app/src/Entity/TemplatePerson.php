<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\TemplatePersonRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TemplatePersonRepository::class)]
#[ApiResource]
class TemplatePerson extends BaseEntity
{
    #[ORM\Column(length: 50)]
    #[Assert\NotBlank(message: 'El nombre es obligatorio.')]
    #[Assert\Length(
        min: 3,
        max: 50,
        minMessage: 'El nombre debe tener al menos 3 caracteres.',
        maxMessage: 'El nombre debe tener a lo sumo 50 caracteres.',
    )]
    #[Assert\Regex(
        pattern: '/^[\p{L}\s]+$/u',
        message: "El nómbre debe ser un nombre válido.",
    )]
    private string $name;

    #[ORM\Column(type: Types::INTEGER)]
    #[Assert\NotNull(message: 'La edad es obligatoria.')]
    #[Assert\GreaterThan(0, message: "La edad debe ser un número entre 1 y 120")]
    #[Assert\LessThanOrEqual(120, message: "La edad debe ser un número entre 1 y 120")]
    private int $age;

    #[ORM\Column(type: Types::INTEGER)]
    #[Assert\NotNull(message: 'El DNI es obligatorio.')]
    #[Assert\Positive(message: 'El DNI debe ser mayor a cero.')]
    private int $dni;

    #[ORM\Column]
    private bool $alive = false;

    #[ORM\Column(length: 100, nullable: true)]
    #[Assert\Email(message: "El e-mail {{ value }} debe ser un e-mail válido.")]
    private ?string $email = null;

    /**
     * @var Collection<int, TemplateRole>
     */
    #[ORM\ManyToMany(targetEntity: TemplateRole::class, mappedBy: 'person')]
    private Collection $role;

    public function __construct()
    {
        $this->role = new ArrayCollection();
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

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * @return Collection<int, TemplateRole>
     */
    public function getRole(): Collection
    {
        return $this->role;
    }

    public function addRole(TemplateRole $role): static
    {
        if (!$this->role->contains($role)) {
            $this->role->add($role);
            $role->addPerson($this);
        }

        return $this;
    }

    public function removeRole(TemplateRole $role): static
    {
        if ($this->role->removeElement($role)) {
            $role->removeUser($this);
        }

        return $this;
    }
}
