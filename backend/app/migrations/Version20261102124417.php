<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261102124417 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Migracion donde se agrega un mail a las personas.';
    }
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE template_person ADD email VARCHAR(100) DEFAULT NULL, CHANGE name name VARCHAR(50) NOT NULL');
        $this->addSql('ALTER TABLE template_product CHANGE name name VARCHAR(50) NOT NULL');
    }
    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE template_person DROP email, CHANGE name name VARCHAR(100) NOT NULL');
        $this->addSql('ALTER TABLE template_product CHANGE name name VARCHAR(100) NOT NULL');
    }
}
