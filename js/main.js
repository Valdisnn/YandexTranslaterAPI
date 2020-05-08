/* 

Переведено сервисом «Яндекс.Переводчик»  http://translate.yandex.ru

https://yandex.ru/dev/translate/
https://yandex.ru/dev/translate/doc/dg/concepts/design-requirements-docpage/
https://yandex.ru/dev/translate/doc/dg/reference/getLangs-docpage/
https://yandex.ru/dev/translate/doc/dg/reference/detect-docpage/
https://yandex.ru/dev/translate/doc/dg/reference/translate-docpage/
https://yandex.ru/blog/webmaster-api/112

*/
document.addEventListener('DOMContentLoaded', () => { // брузер полностью загрузил DOM дерево
    // строгий режим 
    'use strict';
    // получение элементов из верстки 
    const input = document.querySelector('#input'),
        output = document.querySelector('#output'),
        langInput = document.querySelector('#lang-input'),
        langOutput = document.querySelector('#lang-output'),
        // Наш АПИ
        key = 'key=trnsl.1.1.20200506T224017Z.96f64b1bf73610f3.a060ca8791b1a974ec7c63ac1c9f670cd96bb691';
    // функция перевода текста 
    const translate = (text) => { // text - Текст, который необходимо перевести.
        // Направление перевода.
        const lang = langInput.value + '-' + langOutput.value;
        // обращаемся к серверу ( все значение описаны ниже, взяты из инструкции) 
        // encodeURIComponent метод, кодирующий компонент универсального идентификатора ресурса (URI)
        const url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?' +
            key + '&text=' + encodeURIComponent(text) + '&lang=' + lang + '&format=html';
        // вызываем функцию отправки
        request(url)
            //возвращает promise, который разрешается в response
            .then((response) => {
                // проверка на успех (200 ок)
                if (response.status !== 200) {
                    // перехват ошибки
                    throw new Error('Status network ${response.status} (${response.statusText})');
                }
                // возврат клонированного промиса в формате JSON
                return response.clone().json();
            })
            //возвращает promise, который разрешается в data
            .then((data) => {
                // проверка на успех (200 ок)
                if (data.code !== 200) {
                    // перехват ошибки
                    throw new Error('Yandex response: ${data.message} (${data.code})');
                }
                // отображение переведенного текста
                output.innerHTML = data.text;
            })
            // возвращает оишбку
            .catch((error) => console.error(error));
    };
    // функция переведенного текста
    const getTranslateText = (lang) => {
        // Получение списка поддерживаемых языков
        const url = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs?ui=ru&' + key;
        // вызываем функцию отправки
        request(url)
            //возвращает promise, который разрешается в response
            .then((response) => {
                // проверка на успех (200 ок)
                if (response.status !== 200) {
                    // перехват ошибки
                    throw new Error('Status network ${response.status} (${response.statusText})');
                }
                // возврат клонированного промиса в формате JSON
                return response.clone().json();
            })
            .then((data) => {
                const outLangs = data.dirs.filter((item) =>
                    item.split('-')[0] === lang).map((item) =>
                    item.split('-')[1]);
                const langOut = !langOutput.value && lang === 'ru' ? 'en' :
                    langInput.value === langOutput.value &&
                    lang !== langInput.value &&
                    outLangs.includes(langInput.value) ? langInput.value :
                    outLangs.includes(langOutput.value) && lang !== langOutput.value ? langOutput.value :
                    outLangs.includes('ru') ? 'ru' :
                    outLangs.includes('en') ? 'en' : outLangs[0];
                // Object.keys возвращает массив из собственных перечисляемых свойств переданного объекта
                Object.keys(data.langs).filter((item) =>
                    outLangs.includes(item)).forEach((key) => {
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = data.langs[key];
                    if (key === langOut) {
                        option.selected = true;
                    }
                    langOutput.appendChild(option);
                    if (input.value.trim() !== '') {
                        translate(input.value.trim());
                    }
                });
            })
            // возвращает оишбку
            .catch((error) => console.error(error));
    };
    // Функция определения языка
    const detectLang = (text) => {
        // Определение языка
        const url = 'https://translate.yandex.net/api/v1.5/tr.json/detect?' + key + '&text=' + encodeURIComponent(text);
        // вызываем функцию отправки
        request(url)
            //возвращает promise, который разрешается в response
            .then((response) => {
                // проверка на успех (200 ок)
                if (response.status !== 200) {
                    // перехват ошибки
                    throw new Error('Status network ${response.status} (${response.statusText})');
                }
                return response.clone().json();
            })
            //возвращает promise, который разрешается в data
            .then((data) => {
                // проверка на успех (200 ок)
                if (data.code !== 200) {
                    // перехват ошибки
                    throw new Error('Yandex response: ${data.code}');
                }
                for (const item of langInput.children) {
                    if (item.value === data.lang) {
                        item.selected = true;
                    } else if (item.selected) {
                        item.selected = false;
                    }
                }
                getTranslateText(data.lang);
                if (input.value.trim() !== '') {
                    translate(input.value.trim());
                }
            })
            // возвращает оишбку
            .catch((error) => console.error(error));
    };
    // переводимый язык
    const inputLang = (lang) => {
        // Получение списка поддерживаемых языков
        const url = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs?ui=ru&' + key;
        // вызываем функцию отправки
        request(url)
            //возвращает promise, который разрешается в response
            .then((response) => {
                // проверка на успех (200 ок)
                if (response.status !== 200) {
                    // перехват ошибки
                    throw new Error('Status network ${response.status} (${response.statusText})');
                }
                return response.clone().json();
            })
            //возвращает promise, который разрешается в data
            .then((data) => {
                // Object.keys возвращает массив из собственных перечисляемых свойств переданного объекта
                Object.keys(data.langs).forEach((key) => {
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = data.langs[key];
                    if (key === lang) {
                        option.selected = true;
                    }
                    langInput.appendChild(option);
                });
                getTranslateText(lang);
            })
            // возвращает оишбку
            .catch((error) => console.error(error));
    };
    // функция отправки на сервер
    const request = (url, str) => fetch(url, {
        // настройка соединения
        method: 'POST',
        // Опция mode – это защита от нечаянной отправки запроса на другой источник:
        // "cors" – стоит по умолчанию, позволяет делать такие запросы так, как описано в Fetch
        mode: 'cors',
        // // настройка заголовков
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        // отправка
        body: str,
    });
    // Основная функция , запускающая другие через слушателей
    const workingProcess = () => {
        // Стартовый вводимый язык
        inputLang('ru');
        // слушатель для ввода
        input.addEventListener('input', (event) => {
            // вызываем функцию определения языка
            detectLang(event.target.value);
        });
        // слуаштель для вводимого языка
        langInput.addEventListener('change', (event) => {
            // вызов функции перевода
            inputLang(event.target.value);
        });
        // слушатель для переведенного языка
        langOutput.addEventListener('change', (event) => {
            // вызов функцию вывода переведенного текста
            getTranslateText(event.target.value);
        });
    };
    // вызов основной функции
    workingProcess();
    // Переведено сервисом «Яндекс.Переводчик» http://translate.yandex.ru
    console.log(`Переведено сервисом «Яндекс.Переводчик»
http://translate.yandex.ru`);
});