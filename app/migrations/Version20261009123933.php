<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261009123933 extends AbstractMigration
{
    public function getDescription(): string 
    {
        return 'Primer entidad TemplateEntity';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE template_entity (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(50) NOT NULL, active TINYINT NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE template_entity');
    }
}
