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
});

// Изменение количества кубиков
const diceItemWrapper = document.querySelector('.dice__wrapper');
const createDiceElement = () => {
    diceItemWrapper.innerHTML = '';
    for (let i = 0; i < rangeSlider.value; i++) {
        let diceItemValue = generateRandomNumber(1, 6);
        diceItemElement = document.createElement('div');
        diceItemElement.classList.add('dice__item');
        diceItemElement.setAttribute('data-value', diceItemValue);

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
let diceItems = document.querySelectorAll('.dice__item');

const countDiceItemsValue = () => {
    diceItems = document.querySelectorAll('.dice__item');
    let result = 0;
    diceItems.forEach(item => {
        result += +item.dataset.value;
    });

    return result;
}

// Открытие/закрытие модального окна
const modalWrapper = document.querySelector('.modal__wrapper');
const modalWin = document.querySelector('.modal_win');
const modalLoose = document.querySelector('.modal_loose');
const modalCloseBtn = document.querySelectorAll('.continue-button');
let userBet = document.querySelector('.user-bet');

const openModal = (modalName) => {
    modalWrapper.style.display = 'block';

    if (modalName === 'win') {
        modalWin.style.display = 'flex';
        modalWin.classList.add('visible');
        modalWin.querySelector('.total__result').textContent = countDiceItemsValue();
        modalWin.querySelector('.total__result_user').textContent = +userBet.value;
    } else if (modalName === 'loose') {
        modalLoose.style.display = 'flex';
        modalLoose.classList.add('visible');
        modalLoose.querySelector('.total__result').textContent = countDiceItemsValue();
        modalLoose.querySelector('.total__result_user').textContent = +userBet.value;
    }
}

const closeModal = () => {
    modalWrapper.style.display = 'none';
    document.querySelector('.visible').style.display = 'none';
}

modalCloseBtn.forEach(btn => {
    btn.addEventListener('click', closeModal);
});
modalWrapper.addEventListener('click', closeModal);

// Обработка нажатие на кнопку старта игры
const startBtn = document.querySelector('.start-game');


const startBtnClickHandler = () => {
    createDiceElement();
    let diceValue = countDiceItemsValue();

    if (+userBet.value === diceValue) {
        setTimeout(() => openModal('win'), 900)
    } else {
        setTimeout(() => openModal('loose'), 900)
    }

    
};
startBtn.addEventListener('click', startBtnClickHandler);
userBet.addEventListener('keyup', (e) => {
    if(e.keyCode == 13){
        e.preventDefault();
        startBtnClickHandler();
    }
});
