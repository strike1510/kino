@echo on
cd clientside
npm install
npm install -g @vue/cli
start http://localhost:8081/
npm run serve -- --port 8081
npx vue-cli-service serve --port 8081
