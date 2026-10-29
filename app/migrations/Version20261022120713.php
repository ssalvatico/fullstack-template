<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261022120713 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Cuarta migración para testear con la api, se agrega TemplateProduct';
    }
    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE template_product (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(100) NOT NULL, price DOUBLE PRECISION NOT NULL, sku VARCHAR(50) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
    }
    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE template_product');
    }
}
