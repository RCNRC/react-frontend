# task-frontend

## Создание нового проекта

Создание нового проекта с именем `APP_NAME`: `npx create-react-app APP_NAME --template typescript`

## Начало работы

Скачать репозиторий.

Установить [Node.js (+npx)](https://nodejs.org/) ([на Ubuntu](https://nodejs.org/ru/download/package-manager/#debian-and-ubuntu-based-linux-distributions-enterprise-linux-fedora-and-snap-packages)).

Дополнительно выполнить следующие команды:
1. `npm install axios`
2. `npm install validator`
3. `npm install --save d3`
4. `npm install --save @types/d3`

В терминале открыть рабочую папку и ввести:
```commandline
npm start
```

## Информация для бэкенда

В папке index.tsx сразу после импорта лежат дефолтные настройки: 1) базовый урл, куда отправляются axios запросы, 2) настройка allowedCredentials=false.  
В папке components/SignUpForm.tsx где-то в середине лежат функции для отправки post и get запросов. Весь полученный response отображается в логе в браузере.  