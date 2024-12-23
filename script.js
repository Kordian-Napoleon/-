document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('card');
    const cardInner = document.querySelector('.card-inner');
    const output = document.getElementById('output');
    const informacjaInput = document.getElementById('informacja');
    const kluczInput = document.getElementById('klucz');
    const tablicaInput = document.getElementById('tablica');
    const encryptOption = document.getElementById('encrypt');
    const decryptOption = document.getElementById('decrypt');

    let action = 'encrypt'; // Domyślnie szyfrowanie

    // Przełączanie między szyfrowaniem a deszyfrowaniem
    encryptOption.addEventListener('click', () => {
        action = 'encrypt';
        encryptOption.classList.add('selected');
        decryptOption.classList.remove('selected');
    });

    decryptOption.addEventListener('click', () => {
        action = 'decrypt';
        decryptOption.classList.add('selected');
        encryptOption.classList.remove('selected');
    });

    // Obsługa kliknięcia przycisku START
    document.getElementById('startButton').addEventListener('click', () => {
        const informacja = informacjaInput.value.trim();
        const klucz = kluczInput.value.trim();
        const tablicaText = tablicaInput.value.trim();

        if (!informacja) {
            alert("Proszę wpisać tekst do szyfrowania lub deszyfrowania.");
            return;
        }

        if (action === 'encrypt') {
            output.textContent = encryptText(informacja, klucz, tablicaText);
        } else {
            output.textContent = decryptText(informacja, klucz, tablicaText);
        }
    });

    // Funkcja do przetwarzania tekstu z pola 'Tablica'
    function processTablica(tablicaText) {
        const tablicaArray = [];

        for (let i = 0; i < tablicaText.length; i++) {
            let row = tablicaText.slice(i) + tablicaText.slice(0, i);
            tablicaArray.push(row.split(''));
        }
        return tablicaArray;
    }

    // Funkcja do szyfrowania
    function encryptText(informacja, klucz, tablicaText) {
        const tablicaArray = processTablica(tablicaText);
        let haslo = '';

        for (let i = 0; i < informacja.length; i++) {
            const keyChar = klucz[i % klucz.length];
            const infoChar = informacja[i];

            const rowIndex = tablicaArray[0].indexOf(infoChar);
            const colIndex = tablicaArray.findIndex(row => row[0] === keyChar);

            if (rowIndex !== -1 && colIndex !== -1) {
                haslo += tablicaArray[colIndex][rowIndex];
            } else {
                haslo += infoChar;
            }
        }

        return haslo;
    }

    // Funkcja do deszyfrowania
    function decryptText(informacja, klucz, tablicaText) {
        const tablicaArray = processTablica(tablicaText);
        let haslo = '';

        for (let i = 0; i < informacja.length; i++) {
            const keyChar = klucz[i % klucz.length];
            const infoChar = informacja[i];

            const rowIndex = tablicaArray[0].indexOf(keyChar);
            if (rowIndex === -1) {
                haslo += infoChar;
                continue;
            }

            const colIndex = tablicaArray[rowIndex].indexOf(infoChar);
            if (colIndex !== -1) {
                haslo += tablicaArray[colIndex][0];
            } else {
                haslo += infoChar;
            }
        }

        return haslo;
    }

    // Obsługa kliknięcia przycisku "#" (Wyświetlenie tablicy szyfrowania)
    document.getElementById('table').addEventListener('click', () => {
        const tablicaText = tablicaInput.value.trim();
        const tablicaArray = processTablica(tablicaText);
        const newWindow = window.open('', '_blank', 'width=600,height=400');

        let tablicaTextFormatted = tablicaArray.map(row => row.join('')).join('\n');
        newWindow.document.write('<pre>' + tablicaTextFormatted + '</pre>');
        newWindow.document.title = 'Tablica Szyfrowania';
    });

    // Obsługa kliknięcia przycisku "O" (Ustawienia domyślne)
    document.getElementById('default').addEventListener('click', () => {
        tablicaInput.value = '32SPLITABCDEFGHJKMNOQRUVWXYZ14567890!~@#$%^&*(abcdefghijklmnopqrstuvwxyz)_-+={[}]|\\:;"\'<,>.?/';
        kluczInput.value = '2-Fenyloetyloamina';
    });

    // Obracanie karty
    card.addEventListener('click', (event) => {
        const isInteractiveElement = ['INPUT', 'TEXTAREA', 'SPAN'].includes(event.target.tagName);
        const isExcludedElement = event.target.id === 'table' || event.target.id === 'default';

        if (isInteractiveElement || isExcludedElement) {
            return; // Zablokuj obracanie, jeśli kliknięto w element interaktywny lub wykluczony
        }

        cardInner.style.transform = cardInner.style.transform === 'rotateY(180deg)'
            ? 'rotateY(0deg)'
            : 'rotateY(180deg)';
    });

    // Kopiowanie zawartości 'output' do schowka po kliknięciu
    output.addEventListener('click', () => {
        const outputText = output.textContent.trim(); // Pobiera tekst z elementu 'output'

       /* if (outputText) {
            navigator.clipboard.writeText(outputText)
                .then(() => {
                    alert('Skopiowano do schowka: ' + outputText);
                })
                .catch((err) => {
                    console.error('Błąd podczas kopiowania do schowka:', err);
                    alert('Nie udało się skopiować do schowka.');
                });
        } else {
            alert('Brak tekstu do skopiowania!');
        }*/
        if (outputText) {
            navigator.clipboard.writeText(outputText).catch((err) => {
                console.error('Błąd podczas kopiowania do schowka:', err);
            });
        }
    });

    // Elementy opcji szyfruj i deszyfruj
    const encryptSpan = document.getElementById('encrypt');
    const decryptSpan = document.getElementById('decrypt');

    // Funkcja obsługująca wybór opcji
    function selectOption(option) {
        if (option === 'encrypt') {
            encryptSpan.classList.add('selected'); // Dodaje pogrubienie dla szyfruj
            decryptSpan.classList.remove('selected'); // Usuwa pogrubienie dla deszyfruj
        } else if (option === 'decrypt') {
            decryptSpan.classList.add('selected'); // Dodaje pogrubienie dla deszyfruj
            encryptSpan.classList.remove('selected'); // Usuwa pogrubienie dla szyfruj
        }
    }

    // Nasłuchiwanie kliknięcia na elementy
    encryptSpan.addEventListener('click', () => selectOption('encrypt'));
    decryptSpan.addEventListener('click', () => selectOption('decrypt'));
});
