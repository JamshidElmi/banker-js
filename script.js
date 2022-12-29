'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jamshid Elmi',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const log = function(log) {
  console.log(log);
}

// display movements to the table
const displayMovement = function (movements) {
  
  containerMovements.innerHTML = '';
  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i} ${type}</div>
        <div class="movements__value">${mov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};


// =================================

// create username to the accounts abj
const createUserName = accs => 
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  }); 
    
  
createUserName(accounts);
// log(accounts);

// =================================

// calcolate deposits and  withdraws 
const calcDeposits = movements =>
  movements
  .filter(mov => mov > 0)
  .reduce((accu, curr) => accu + curr, 0);

const calcWithdraws = movements =>
  movements
  .filter(mov => mov < 0)
  .reduce((accu, curr) => accu + curr, 0);

const calcIntrest = movements =>
  movements
    .filter(mov => mov > 0)
    .map(dep => (dep * 1.2) / 100)
    .filter(int => int >= 1)
    .reduce((accu, curr) => accu + curr, 0);

const calcBalance = movements =>
  movements.
  reduce((accu, curr) => accu + curr, 0);

// ========================================
// Display calculations function
const displayCalcs = function (movements) {

  labelSumOut.innerHTML = calcDeposits(movements)+'€';
  labelSumIn.innerHTML = calcWithdraws(movements)+'€';
  labelSumInterest.innerHTML = calcIntrest(movements)+'€';
  labelBalance.innerHTML = calcBalance(movements)+' €';
};



// =====================================
// check login
const login = function(user, pin) {
  return accounts.find(acc => acc.username === user && acc.pin === pin);
}


// click login 
let currentAccount = '';
btnLogin.addEventListener('click', function(e){
  e.preventDefault();
  currentAccount = login(inputLoginUsername.value, Math.abs(inputLoginPin.value));

  if (currentAccount != undefined) {
    containerApp.style.opacity = 1; 
    labelWelcome.innerHTML = `Welcome Dear ${currentAccount.owner.split(' ')[0]}`;

    displayMovement(currentAccount.movements);
    displayCalcs(currentAccount.movements);

    inputLoginUsername.value = inputLoginPin.value = '';
  }
  else 
  {
    containerApp.style.opacity = 0; 
    alert(" Username and Password is wrong");
  }

  inputLoginPin.blur();
});


// ================================
// transfer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recvierAcc = accounts.find(account => account.username === inputTransferTo.value)
  console.log(amount, recvierAcc);

  if (
    amount > 0 &&
    recvierAcc &&
    amount <= Number(labelBalance.textContent.slice(0, -1)) &&
    recvierAcc.username !== currentAccount.username
  )
  {
    currentAccount.movements.push(-amount);
    recvierAcc.movements.push(amount);

    displayMovement(currentAccount.movements);
    displayCalcs(currentAccount.movements);

    inputTransferAmount.value = inputTransferTo.value = '';
  }

});

// ====================================
// close account 
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  
  if (
    inputCloseUsername.username === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin 
  )
    log('valid');
  else log('not valid');

});
