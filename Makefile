stop:
	docker stop tg_bot

rebuild:
	docker stop tg_bot || true
	docker rm tg_bot || true
	docker rmi yvpai_4 || true
	$(MAKE) build
	$(MAKE) run

build:
	docker build -t yvpai_4 .

run:
	docker run --rm -dp 3000:3000 --name tg_bot yvpai_4