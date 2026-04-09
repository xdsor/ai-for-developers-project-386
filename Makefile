.PHONY: spec mock web web-backend web-dev backend dev

spec:
	npm run spec:sync:backend

mock:
	npm run mock

web:
	npm run web:dev

web-backend:
	npm run web:dev:backend

web-dev:
	npm run dev

backend: spec
	./backend/gradlew -p backend bootRun

dev:
	npx concurrently -k -n backend,web -c magenta,green "make backend" "make web-backend"
