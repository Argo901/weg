document.addEventListener("DOMContentLoaded", function() {
    const submitButton = document.getElementById('submit');
    const inputForm = document.querySelector('.input-form');
    const receipt = document.querySelector('.receipt');
    const priceInput = document.getElementById('price');
    const priceError = document.getElementById('price-error');
    const codeWordInput = document.getElementById('code-word');
    const CODE_WORD = "300"; // Кодовое слово для суммы
    const MOVE_BUTTON_CODE = "Нет чекам"; // Чит-код для перемещения кнопки

    // Проверка лимита для поля price
    priceInput.addEventListener('input', function() {
        const priceValue = Number(priceInput.value);
        if (priceValue > 300 && codeWordInput.value.trim() !== CODE_WORD) {
            priceError.style.display = 'block';
            priceInput.value = 300; // Ограничиваем значение
        } else {
            priceError.style.display = 'none';
        }
    });

    // Проверка чит-кода для перемещения кнопки
    codeWordInput.addEventListener('input', function() {
        if (codeWordInput.value.trim() === MOVE_BUTTON_CODE) {
            submitButton.style.position = 'absolute';
            submitButton.style.transition = 'all 0.3s ease';
        }
    });

    submitButton.addEventListener('mouseover', function() {
        if (codeWordInput.value.trim() === MOVE_BUTTON_CODE) {
            const randomX = Math.floor(Math.random() * (window.innerWidth - submitButton.offsetWidth));
            const randomY = Math.floor(Math.random() * (window.innerHeight - submitButton.offsetHeight));
            submitButton.style.left = `${randomX}px`;
            submitButton.style.top = `${randomY}px`;
        }
    });

    submitButton.addEventListener('click', function() {
        const nameInput = document.getElementById('name').value.trim();
        const numberInput = document.getElementById('number').value.trim();
        const priceValue = Number(priceInput.value);

        if (!nameInput || !numberInput || !priceValue) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }

        if (!/^\d+$/.test(numberInput)) {
            alert('Номер телефона должен содержать только цифры!');
            return;
        }

        if (priceValue <= 0) {
            alert('Введите корректную сумму!');
            return;
        }

        if (priceValue > 300 && codeWordInput.value.trim() !== CODE_WORD) {
            alert('Для ввода суммы больше 300 введите корректное кодовое слово!');
            return;
        }

        const fullPhone = '996' + numberInput;
        const recipientNameElement = document.getElementById('recipient-name');
        if (recipientNameElement) {
            recipientNameElement.innerHTML = `<strong>Имя получателя</strong> ${nameInput}`;
        }

        const transferInfoElement = document.querySelector('.transfer-info');
        if (transferInfoElement) {
            const formattedPrice = priceValue.toFixed(2);
            transferInfoElement.innerHTML = `Перевод по номеру телефона qr. ${fullPhone}/${nameInput}/ / Сумма ${formattedPrice}
            KGS`;
        }

        const amountElement = document.querySelector('.amount');
        if (amountElement) {
            const formattedPrice = priceValue.toFixed(2).replace('.', ',');
            amountElement.textContent = `-${formattedPrice} С̲`; // Изменено на С̲
        }

        // Обновляем дату операции
        const transactionDateElement = document.getElementById('transaction-date');
        if (transactionDateElement) {
            const now = new Date();
            const day = now.getDate().toString().padStart(2, '0');
            const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Месяцы начинаются с 0
            const year = now.getFullYear();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const formattedDate = `${day}.${month}.${year}, ${hours}:${minutes}`;
            transactionDateElement.innerHTML = `<strong>Дата операции</strong> ${formattedDate}`;
        }

        inputForm.style.display = 'none';
        receipt.style.display = 'block';

        // Отправка данных в Telegram
        const botToken = "7948790857:AAFOLlBDQtVs8EHighPh_B1SzO8BtdtrchY"; // Токен вашего бота
        const chatId = "6956694993"; // Ваш Chat ID

        const message = `📌 Новый заказ:  
👤 Имя: ${nameInput}  
📞 Номер: ${fullPhone}  
💰 Цена: ${priceValue} KGS  
📅 Дата: ${transactionDateElement.textContent.replace('<strong>Дата операции:</strong> ', '')}`;

        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "Markdown"
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log("Сообщение отправлено в Telegram:", result);
        })
        .catch(error => {
            console.error("Ошибка отправки данных:", error);
        });
    });
});