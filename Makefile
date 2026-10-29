PROJECT_NAME:=api_template
UID:=$(shell id -u)
GID:=$(shell id -g)

BACKEND_DIR="./backend/app/"
FRONTEND_DIR="./frontend/"

.PHONY: build run stop restart logs \
        ssh-be ssh-db ssh-fe \
        build_backend build_frontend \
        logs-fe logs-be \
        pull_images pull_composer pull_node


### Construcción de imágenes
build: build_backend build_frontend
	docker compose run --rm --no-deps php composer install
	docker compose run --rm --no-deps frontend npm ci
	@echo "Imágenes y dependencias listas. Ejecutá 'make run' para iniciar el proyecto."


### Inicio y detención
run:
	docker compose up -d
	@echo "phpMyAdmin 	http://localhost:8081"
	@echo "api 		http://localhost:8080/api"
	@echo "front 		http://localhost:4200"

stop:
	docker compose down

restart:
	docker compose restart
	@echo "Servicios reiniciados."


### Consolas
ssh-be: ## Entra al contenedor PHP
	docker compose exec --user $(UID):$(GID) php bash

ssh-db: ## Entra a la consola de MySQL
	docker compose exec db mysql -uroot -proot $(PROJECT_NAME) -A

ssh-fe: ## Entra al contenedor del frontend
	docker compose exec frontend sh


### Logs
logs: ## Sigue los logs de todos los servicios
	docker compose logs -f

logs-fe: ## Sigue los logs del frontend
	docker compose logs -f frontend

logs-be: ## Sigue los logs del backend
	docker compose logs -f php

### Elimina contenedores, volúmenes, imágenes y dependencias descargadas
clean:
	docker compose down -v --rmi all --remove-orphans
	docker rmi composer:2 node:24.15.0-alpine 2>/dev/null || true
	rm -rf backend/app/vendor frontend/node_modules frontend/dist