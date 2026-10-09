UID := $(shell id -u)
GID := $(shell id -g)

.PHONY: run stop restart build sh sh-db logs

run: ## Levanta los contenedores
	docker compose up -d

stop: ## Baja los contenedores
	docker compose stop

restart: stop run

build: ## Reconstruye las imágenes y levanta
	docker compose build
	docker compose up -d

sh: ## Entra al contenedor PHP
	docker compose exec --user $(UID):$(GID) php bash

sh-db: ## Entra al contenedor de MySQL
	docker compose exec db bash

logs: ## Sigue los logs
	docker compose logs -f