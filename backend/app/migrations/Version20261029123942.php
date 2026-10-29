<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261029123942 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Diff migration, hago una mejora de la consistencia';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE template_person ADD created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ADD updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP');
        $this->addSql('ALTER TABLE template_product ADD created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ADD updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE template_person DROP created_at, DROP updated_at');
        $this->addSql('ALTER TABLE template_product DROP created_at, DROP updated_at');
    }
}
