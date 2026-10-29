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
build:
	cd $(BACKEND_DIR) && composer install
	cd $(FRONTEND_DIR) && npm install
	$(MAKE) build_backend
	$(MAKE) build_frontend
	@echo "Imágenes construidas. Ejecutá 'make run' para iniciar el proyecto."


build_backend:
	docker compose build php nginx

build_frontend:
	docker compose build frontend


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


### Descarga de imágenes auxiliares
pull_images: pull_composer pull_node

pull_composer:
	docker pull composer:2

pull_node:
	docker pull node:24.15.0-alpine