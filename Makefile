PROJECT_NAME := api_template
UID := $(shell id -u)
GID := $(shell id -g)

.PHONY: run stop restart build sh sh-db logs

run: ## Levanta los contenedores
	docker compose up -d
	@echo "Proyecto corriendo en http://localhost:8080/"
	@echo "PhpMyAdmin corriendo en http://localhost:8081/"

stop: ## Baja los contenedores
	docker compose stop

restart: stop run

build: ## Reconstruye las imágenes
	docker compose build
	@echo "Levantar el proyecto con 'make run'"

ssh-be: ## Entra al contenedor PHP
	docker compose exec --user $(UID):$(GID) php bash

ssh-db: ## Entra a la consola de MySQL
	docker compose exec db mysql -uroot -proot $(PROJECT_NAME) -A

logs: ## Sigue los logs
	docker compose logs -f