<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20261102142035 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Migracion donde se agrega una relacion many to many entre TemplatePerson y TemplateRole';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE template_role (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(50) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE template_role_template_person (template_role_id INT NOT NULL, template_person_id INT NOT NULL, INDEX IDX_92B8A49E85BB5995 (template_role_id), INDEX IDX_92B8A49EE828CDF1 (template_person_id), PRIMARY KEY (template_role_id, template_person_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE template_role_template_person ADD CONSTRAINT FK_92B8A49E85BB5995 FOREIGN KEY (template_role_id) REFERENCES template_role (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE template_role_template_person ADD CONSTRAINT FK_92B8A49EE828CDF1 FOREIGN KEY (template_person_id) REFERENCES template_person (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE template_role_template_person DROP FOREIGN KEY FK_92B8A49E85BB5995');
        $this->addSql('ALTER TABLE template_role_template_person DROP FOREIGN KEY FK_92B8A49EE828CDF1');
        $this->addSql('DROP TABLE template_role');
        $this->addSql('DROP TABLE template_role_template_person');
    }
}
