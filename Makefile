# Image names
DEV_IMAGE = bellecolleenv2-dev
PROD_IMAGE = bellecolleenv2

# Development commands
.PHONY: dev-build
dev-build:
	docker build --target development -t $(DEV_IMAGE) .

.PHONY: dev
dev:
	docker run -p 3000:3000 \
		-v $(PWD)/src:/app/src \
		-v $(PWD)/public:/app/public \
		$(DEV_IMAGE)

.PHONY: dev-stop
dev-stop:
	docker ps -q --filter "ancestor=$(DEV_IMAGE)" | xargs -r docker stop

.PHONY: dev-rm
dev-rm:
	docker ps -aq --filter "ancestor=$(DEV_IMAGE)" | xargs -r docker rm

.PHONY: dev-clean
dev-clean: dev-stop dev-rm
	docker rmi $(DEV_IMAGE) || true

# Production commands
.PHONY: prod-build
prod-build:
	docker build -t $(PROD_IMAGE) .

.PHONY: prod
prod:
	docker run -p 3000:80 $(PROD_IMAGE)

.PHONY: prod-stop
prod-stop:
	docker ps -q --filter "ancestor=$(PROD_IMAGE)" | xargs -r docker stop

.PHONY: prod-rm
prod-rm:
	docker ps -aq --filter "ancestor=$(PROD_IMAGE)" | xargs -r docker rm

.PHONY: prod-clean
prod-clean: prod-stop prod-rm
	docker rmi $(PROD_IMAGE) || true

# Utility commands
.PHONY: clean
clean:
	docker system prune -f

.PHONY: logs
logs:
	docker ps -q --filter "ancestor=$(DEV_IMAGE)" | xargs -r docker logs -f

# Combined commands
.PHONY: start
start: install dev-build dev

.PHONY: prod-start
prod-start: prod-build prod

# Restart commands
.PHONY: restart
restart: dev-clean start

open:
	open http://localhost:3000

# Package management commands
.PHONY: install
install:
		rm -rf node_modules package-lock.json
		npm install

# Add install to deployment process
.PHONY: deploy
deploy: install
		npm run build
