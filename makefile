dev:
	docker compose --env-file .env up --build

stop:
	docker stop $$(docker ps -a -q)

prune:
	docker system prune -a -f

down:
	docker compose -f docker-compose.yml down
