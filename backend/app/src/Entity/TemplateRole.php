<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\TemplateRoleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TemplateRoleRepository::class)]
#[ApiResource]
class TemplateRole
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $name = null;

    /**
     * @var Collection<int, TemplatePerson>
     */
    #[ORM\ManyToMany(targetEntity: TemplatePerson::class, inversedBy: 'role')]
    private Collection $person;

    public function __construct()
    {
        $this->person = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    /**
     * @return Collection<int, TemplatePerson>
     */
    public function getPerson(): Collection
    {
        return $this->person;
    }

    public function addPerson(TemplatePerson $person): static
    {
        if (!$this->person->contains($person)) {
            $this->person->add($person);
        }

        return $this;
    }

    public function removePerson(TemplatePerson $person): static
    {
        $this->person->removeElement($person);

        return $this;
    }
}
