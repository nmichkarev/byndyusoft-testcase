Установка
```
npm install
```
Запуск
```
npm start
```
Запуск тестов
```
npm test
```

Для добавления операции в файле **functions.js** в объект OPERATIONS добавить ключ: символ операции, значение: объект со свойствами priority - числовое значение приоритета, func - функция с двумя аргументами, возвращающая результат. Пример:
```
const OPERATIONS = {
    ...
    '%': { priority: 1, func: (l, r) => l % r }
}
```