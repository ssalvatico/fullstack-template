<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261013111250 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Creacion de una entidad base con los campos esenciales';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE template_entity ADD created_at DATETIME NOT NULL, ADD updated_at DATETIME NOT NULL');
        $this->addSql('ALTER TABLE template_item ADD created_at DATETIME NOT NULL, ADD updated_at DATETIME NOT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE template_entity DROP created_at, DROP updated_at');
        $this->addSql('ALTER TABLE template_item DROP created_at, DROP updated_at');
    }
}
