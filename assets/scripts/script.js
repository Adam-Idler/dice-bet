// Common
const generateRandomNumber = (min, max) => Math.floor(Math.random( ) * (max - min + 1)) + min;

// Проверка на блокировку страницы
document.addEventListener('DOMContentLoaded', () => {
    let blockTime = localStorage.getItem('blockTime');
    if (blockTime) {
        if (+new Date() >= +blockTime) {
            localStorage.removeItem('blockTime');
            localStorage.setItem('balance', 1000);
            userBalance.textContent = 1000;
        } else {
            openModal('ban');
            timer(+blockTime);
            document.querySelectorAll('input, button:not(.continue-button, .start-game)').forEach(item => item.disabled = true);
        }
    }
});

// Таймер
const timer = (deadline) => {
    const timerHours = document.querySelector(`.visible #timer-hours`);
    const timerMinutes = document.querySelector(`.visible #timer-minutes`);
    const timerSeconds = document.querySelector(`.visible #timer-seconds`);

    const getNullAdd = function (param) {
        if (param < 10) {
            return '0' + param;
        } else {
            return param
        }
    }
    const getTimeRemaining = () => {
        let dateStop = new Date(deadline).getTime()
        let dateNow = new Date().getTime();
        let timeRemaining = (dateStop - dateNow) / 1000;
        let hours = getNullAdd(Math.floor(timeRemaining / 60 / 60));
        let minutes = getNullAdd(Math.floor((timeRemaining / 60) % 60));
        let seconds = getNullAdd(Math.floor(timeRemaining % 60));
        return {timeRemaining, hours, minutes, seconds}
    }
    const updateClock = () => {
        let getTime = getTimeRemaining();
        if (getTime.timeRemaining < 0) {
            timerHours.textContent = getNullAdd(0);
            timerMinutes.textContent = getNullAdd(0);
            timerSeconds.textContent = getNullAdd(0);

            localStorage.removeItem('blockTime');
            localStorage.setItem('balance', 1000);
            userBalance.textContent = 1000;
            document.querySelectorAll('input, button:not(.continue-button, .start-game)').forEach(item => item.disabled = false);
        } else {
            timerHours.textContent = getTime.hours;
            timerMinutes.textContent = getTime.minutes;
            timerSeconds.textContent = getTime.seconds;
        }
    }
    let getTime = getTimeRemaining()
    if (getTime.timeRemaining > 0) {
        setInterval(updateClock, 1000)
    }
    updateClock()
}

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

// Нахождение среднего значения в кубиках
const middles = document.querySelectorAll('.tab-values__item_more-or-less .middle');
let middleNumber;
const findMiddle = () => {
    middleNumber = Math.ceil(6 * rangeSlider.value / 2);
    middles.forEach(item => {
        item.textContent = middleNumber;
    });
};

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

    findMiddle();
};
createDiceElement();
rangeSlider.addEventListener('change', createDiceElement);

// Подсчет выпавших очков
const countDiceItemsValue = () => diceItemsSum.reduce((previousValue, currentValue) => previousValue + currentValue);

// Фукнции победы/проигрыша
const win = (ratio, winNumber) => {
    setTimeout(() => {
        openModal('win', winNumber, ratio);
        userBalance.textContent = (+userBalance.textContent + +userBet.value * ratio).toFixed(0);
        localStorage.setItem('balance', userBalance.textContent);
    }, 900);
};

const loose = (looseNumber) => setTimeout(() => openModal('loose', looseNumber), 900);

// Открытие/закрытие модального окна
const modalWrapper = document.querySelector('.modal__wrapper');
const modalWindows = document.querySelectorAll('.modal');
const modalCloseBtns = document.querySelectorAll('.continue-button');
let userNumber = document.querySelector('.user-exact-number');

const openModal = (modalName, winNumber, ratio) => {
    modalWrapper.style.display = 'block';

    modalWindows.forEach(modal => {
        if (modal.classList.contains(`modal_${modalName}`)) {
            modal.classList.add('visible');

            let totalResultDice = modal.querySelector('.total__result');
            let totalResultUser = modal.querySelector('.total__result_user');

            if (totalResultDice) totalResultDice.textContent = countDiceItemsValue();
            if (totalResultUser) totalResultUser.textContent = winNumber;

            if (modalName === 'win') modal.querySelector('.winning_result').textContent = (+userBet.value * ratio).toFixed(0);
            if (modalName === 'loose') modal.querySelector('.loose_result').textContent = (+userBet.value).toFixed(0);
        }
    });
};

const closeModal = () => {
    modalWrapper.style.display = 'none';
    document.querySelector('.visible').classList.remove('visible');
};

modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
});
modalWrapper.addEventListener('click', (e) => {
    if (e.target !== e.currentTarget) return;
    closeModal();
});
document.addEventListener('keyup', (e) => {
    if ((e.key === 'Enter' || e.key === 'Escape') && modalWrapper.style.display === 'block') {
        e.preventDefault();
        closeModal();
    }
});

// Реализация ставки игрока
let balance = localStorage.getItem('balance') || 1000;
const userBalance = document.querySelector('.user-balance_value');
userBalance.textContent = balance;
const userBet = document.querySelector('.user-bet');
let exactNumberRatio = 1.5 * (rangeSlider.value * 1.1);
let moreOrLessRatio = 1.5 * rangeSlider.value;
let evenRatio = 2;
let diceValue;

// Обработка нажатие на кнопку старта игры
const startBtn = document.querySelector('.start-game');

const startBtnClickHandler = () => {
    blockTime = localStorage.getItem('blockTime');
    if (blockTime) {
        openModal('ban');
        timer(+blockTime);
        return;
    }

    userBalance.textContent -= +userBet.value;

    const activeTabItem = document.querySelector('.tab-values__item_active');

    if (activeTabItem.classList.contains('tab-values__item_exact')) {
        if (!userNumber.value) {
            openModal('error');
            return;
        }

        createDiceElement();
        diceValue = countDiceItemsValue();

        if (+userNumber.value === diceValue) {
            win(exactNumberRatio, userNumber.value);
        } else {
            loose(userNumber.value);
        }

    } else if (activeTabItem.classList.contains('tab-values__item_more-or-less')) {
        const checked = activeTabItem.querySelector('input[type="radio"]:checked').value;
        createDiceElement();
        diceValue = countDiceItemsValue();
        switch (checked) {
            case 'exact':
                moreOrLessRatio = +(1.5 * (rangeSlider.value * 1.2)).toFixed(0);
                if (diceValue == middleNumber) {
                    win(moreOrLessRatio, `Равно ${middleNumber}`);
                } else {
                    loose(`Равно ${middleNumber}`);
                }
                break;
            case 'more':
                moreOrLessRatio = 1.5 * rangeSlider.value;
                if (diceValue > middleNumber) {
                    win(moreOrLessRatio, `Больше ${middleNumber}`);
                } else {
                    loose(`Больше ${middleNumber}`);
                }
                break;
            case 'less':
                moreOrLessRatio = 1.5 * rangeSlider.value;
                if (diceValue < middleNumber) {
                    win(moreOrLessRatio, `Меньше ${middleNumber}`);
                } else {
                    loose(`Меньше ${middleNumber}` );
                }
                break;
            default:
                break;
        }
    } else if (activeTabItem.classList.contains('tab-values__item_even')) {
        const checked = activeTabItem.querySelector('input[type="radio"]:checked').value;
        createDiceElement();
        diceValue = countDiceItemsValue();
        switch (checked) {
            case 'even':
                if (diceValue % 2 === 0) {
                    win(evenRatio, 'Чётное');
                } else {
                    loose('Чётное');
                }
                break;
            case 'odd':
                evenRatio = 1.5 * rangeSlider.value;
                if (diceValue % 2 !== 0) {
                    win(evenRatio, 'Нечётное');
                } else {
                    loose('Нечётное');
                }
                break;
            default:
                break;
        }
    }

    localStorage.setItem('balance', userBalance.textContent);

    setTimeout(() => {
        if (userBalance.textContent <= 0) {
            closeModal();
            openModal('game-over');
            document.querySelectorAll('input, button:not(.continue-button, .start-game)').forEach(item => item.disabled = true);
            let deadline = +new Date() + (3600 * 1000);
            timer(deadline);
            localStorage.setItem('blockTime', deadline);
        }
    }, 900)
};

startBtn.addEventListener('click', startBtnClickHandler);
userNumber.addEventListener('keyup', (e) => {
    if (e.key == 'Enter') {
        e.preventDefault();
        startBtnClickHandler();
    }
});
userBet.addEventListener('keyup', (e) => {
    if (e.key == 'Enter') {
        e.preventDefault();
        startBtnClickHandler();
    }
});