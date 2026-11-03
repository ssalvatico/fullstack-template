<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261103110337 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'En esta migración corrijo que el campo entity
                en un TemplateItem pueda ser nulo, asi no hay
                conflictos cuando se elimina una entidad padre.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE template_item DROP FOREIGN KEY `FK_CAD50F7381257D5D`');
        $this->addSql('ALTER TABLE template_item CHANGE entity_id entity_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE template_item ADD CONSTRAINT FK_CAD50F7381257D5D FOREIGN KEY (entity_id) REFERENCES template_entity (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE template_item DROP FOREIGN KEY FK_CAD50F7381257D5D');
        $this->addSql('ALTER TABLE template_item CHANGE entity_id entity_id INT NOT NULL');
        $this->addSql('ALTER TABLE template_item ADD CONSTRAINT `FK_CAD50F7381257D5D` FOREIGN KEY (entity_id) REFERENCES template_entity (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
    }
}
