<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

final class Version20261009142159 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Segunda entidad TemplateItem con relacion a Template entity';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE template_item (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(50) NOT NULL, entity_id INT NOT NULL, INDEX IDX_CAD50F7381257D5D (entity_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE template_item ADD CONSTRAINT FK_CAD50F7381257D5D FOREIGN KEY (entity_id) REFERENCES template_entity (id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE template_item DROP FOREIGN KEY FK_CAD50F7381257D5D');
        $this->addSql('DROP TABLE template_item');
    }
}
