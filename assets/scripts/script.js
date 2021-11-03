// Common
const generateRandomNumber = (min, max) => Math.floor(Math.random( ) * (max - min + 1)) + min;

// Табы
const tabs = document.querySelector('.tab-names'); 
const tabNames = tabs.querySelectorAll('.tab-name__item');
const tabValues = document.querySelectorAll('.tab-values__item');

const toggleTabContent = (index) => {
    tabValues.forEach((item, i) => {
        if (index === i) {
            item.classList.add('tab-values__item_active');
            tabNames[i].classList.add('tab-name__item_active');
        } else {
            item.classList.remove('tab-values__item_active');
            tabNames[i].classList.remove('tab-name__item_active');
        }
    });
};

tabs.addEventListener('click', (e) => {
    let target = e.target;
    target = target.closest('.tab-name__item');

    if (target) {
        tabNames.forEach((item, i) => {
            if (item === target) {
                toggleTabContent(i);
            }
        });
    }
});

// Range slider
const rangeSlider = document.querySelector('.dice-count');
const sliderValue = document.querySelector('.dice-count__value');

sliderValue.textContent = rangeSlider.value;
rangeSlider.addEventListener('input', () => {
    sliderValue.textContent = rangeSlider.value;
    exactNumberRatio = 1.5 * rangeSlider.value;
});

// Изменение количества кубиков
const diceItemWrapper = document.querySelector('.dice__wrapper');
const diceItemsSum = [];

const createDiceElement = () => {
    diceItemWrapper.innerHTML = '';
    diceItemsSum.splice(0, diceItemsSum.length);

    for (let i = 0; i < rangeSlider.value; i++) {
        let diceItemValue = generateRandomNumber(1, 6);
        diceItemElement = document.createElement('div');
        diceItemElement.classList.add('dice__item');
        diceItemsSum.push(diceItemValue);

        if (diceItemWrapper.hasAttribute('data-loaded') && i === rangeSlider.value - 1) {
            diceItemWrapper.removeAttribute('data-loaded');
        } else if (!diceItemWrapper.hasAttribute('data-loaded') && i === rangeSlider.value - 1) {
            diceItemWrapper.classList.add('change');
            setTimeout(() => diceItemWrapper.classList.remove('change'), 700);
        }

        let diceItemTemplate = `<img src="./assets/images/dice-images/${diceItemValue}-white.png" alt="Dice">`;
        
        diceItemElement.innerHTML = diceItemTemplate;
        diceItemWrapper.appendChild(diceItemElement);
    }
};
createDiceElement();
rangeSlider.addEventListener('change', createDiceElement);

// Подсчет выпавших очков
const countDiceItemsValue = () => diceItemsSum.reduce((previousValue, currentValue) => previousValue + currentValue);

// Открытие/закрытие модального окна
const modalWrapper = document.querySelector('.modal__wrapper');
const modalWindows = document.querySelectorAll('.modal');
const modalCloseBtn = document.querySelectorAll('.continue-button');
let userNumber = document.querySelector('.user-exact-number');

const openModal = (modalName) => {
    modalWrapper.style.display = 'block';

    modalWindows.forEach(modal => {
        if (modal.classList.contains(`modal_${modalName}`)) {
            modal.style.display = 'flex';
            modal.classList.add('visible');

            let totalResultDice = modal.querySelector('.total__result');
            let totalResultUser = modal.querySelector('.total__result_user');

            if (totalResultDice) totalResultDice.textContent = countDiceItemsValue()
            if (totalResultUser) totalResultUser.textContent = +userNumber.value

            if (modalName === 'win') modal.querySelector('.winning_result').textContent = +userBet.value * exactNumberRatio;
            if (modalName === 'loose') modal.querySelector('.loose_result').textContent = +userBet.value;
        }
    });
};

const closeModal = () => {
    modalWrapper.style.display = 'none';
    document.querySelector('.visible').style.display = 'none';
};

modalCloseBtn.forEach(btn => {
    btn.addEventListener('click', closeModal);
});
modalWrapper.addEventListener('click', (e) => {
    if (e.target !== e.currentTarget) return;
    closeModal();
});
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && modalWrapper.style.display === 'block') {
        e.preventDefault();
        closeModal();
    }
});

// Реализация ставки игрока
const userBalance = document.querySelector('.user-balance_value');
const userBet = document.querySelector('.user-bet');
let exactNumberRatio = 1.5 * rangeSlider.value;
let moreOrLessRatio = 2;
let evenRatio = 2;

// Обработка нажатие на кнопку старта игры
const startBtn = document.querySelector('.start-game');

const startBtnClickHandler = () => {
    if (!userNumber.value) {
        openModal('error');
        return;
    }

    userBalance.textContent -= +userBet.value;

    createDiceElement();
    let diceValue = countDiceItemsValue();

    if (+userNumber.value === diceValue) {
        setTimeout(() => openModal('win'), 900);
        userBalance.textContent = +userBalance.textContent + +userBet.value * exactNumberRatio;
    } else {
        setTimeout(() => openModal('loose'), 900)
    }
};

startBtn.addEventListener('click', startBtnClickHandler);
userNumber.addEventListener('keyup', (e) => {
    if (e.keyCode == 13) {
        e.preventDefault();
        startBtnClickHandler();
    }
});
userBet.addEventListener('keyup', (e) => {
    if (e.keyCode == 13) {
        e.preventDefault();
        startBtnClickHandler();
    }
});
