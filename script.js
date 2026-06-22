// application state
let transactions = loadFromLocalStorage();
let current_theme="";
let savedTheme="";
 // dom elements
const expenseForm = document.getElementById("expenseForm");

const balanceCard = document.getElementById("balance-card");
const incomeCard = document.getElementById("income-card");
const expenseCard = document.getElementById("expense-card");

const noteInput = document.getElementById("notes");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const typeInputs = document.querySelectorAll('input[name="type"]');

const transactionList = document.getElementById("transactionList");

const themeBtn=document.getElementById("theme-btn");

// theme persistance
loadSavedTheme();
function loadSavedTheme(){
  savedTheme=localStorage.getItem("current_theme");
  if(savedTheme==="dark"){
    document.body.classList.add("dark-mode");
    themeBtn.textContent="☀️";
  }
  else{
    themeBtn.textContent="🌙";
  }
}
// called before form submission to show history
updateUI();

// Event Listener for form
expenseForm.addEventListener("submit", handleFormSubmit);

// event listener for theme
themeBtn.addEventListener("click",()=>{
  const isDarkMode=document.body.classList.toggle("dark-mode");
  if(isDarkMode){
// save dark to local storage
themeBtn.textContent="☀️";
localStorage.setItem("current_theme","dark");
}
else{
  // save light
  themeBtn.textContent="🌙";
   localStorage.setItem("current_theme","light");
  }

});


// Event Handler
function handleFormSubmit(event) {
  event.preventDefault();

  const transaction = createTransaction();
   
  transactions.push(transaction);

   
  saveToLocalStorage(transactions);
  updateUI();        // updates the summary and transaction history
  expenseForm.reset();    // resets form after submission
}

// data/object creation
function createTransaction() {
  const selectedInput = [...typeInputs].find((radio) => radio.checked);
  return {
    id: Date.now(),
    note: noteInput.value,
    category: categoryInput.value,
    amount: Number(amountInput.value),
    type: selectedInput.value,
    createdAt: new Date().toISOString(),
  };
}

// calculations for summary card
function calculateSummary() {
  let income = 0;
  let expense = 0;
  for (const transaction of transactions) {
    if (transaction.type === "credit") {
      income += transaction.amount;
    } else {
      expense += transaction.amount;
    }
  }
  const balance = income - expense;
  return { income, expense, balance };
}

function saveToLocalStorage(){
    localStorage.setItem("transactions",JSON.stringify(transactions));
}

function loadFromLocalStorage(){
    const data=localStorage.getItem("transactions");
    if(data===null) return [];
    return JSON.parse(data);
}
// updates UI
function updateUI() {
    const summary = calculateSummary();
    renderSummary(summary);
    renderTransactions();
}
//  Renders Summary
function renderSummary(summary) {
  balanceCard.textContent = `Balance: ₹${summary.balance}`;

  incomeCard.textContent = `Income: ₹${summary.income}`;

  expenseCard.textContent = `Expense: ₹${summary.expense}`;
}
 
//adds necessary elements to show in the history
function createTransactionCard(transaction) {
  const card = document.createElement("div");
  card.classList.add("transaction-card");

  const transactionTop = document.createElement("div");
  transactionTop.classList.add("transaction-top");

  const cardTitle = document.createElement("h3");
  cardTitle.textContent = transaction.note;
  card.appendChild(cardTitle);

  const cardAmount = document.createElement("span");
  cardAmount.classList.add("cardAmount");
  cardAmount.classList.add(transaction.type);
  if(transaction.type==="credit"){
    cardAmount.textContent = `+ ₹ ${transaction.amount}`;
  } 
  else{
    cardAmount.textContent = `- ₹ ${transaction.amount}`;
  }
  transactionTop.appendChild(cardAmount);
  
   
  
  const deletebtn=document.createElement("button");
  deletebtn.classList.add("delete-btn");
  deletebtn.textContent="🗑️";

  deletebtn.addEventListener("click",()=>{
      deleteTransaction(transaction.id);
  });
  transactionTop.appendChild(deletebtn);


  const transactionBottom = document.createElement("div");
  transactionBottom.classList.add("transaction-bottom");

  const cardCategory = document.createElement("span");
  cardCategory.classList.add("cardCategory");
  if(transaction.type==="credit")
  {
    cardCategory.classList.add("credit-category");
  }
  else{
    cardCategory.classList.add("debit-category");
  }
  cardCategory.textContent = transaction.category;

  const cardType = document.createElement("span");
  cardType.classList.add("cardType");
  cardType.classList.add(transaction.type);
  cardType.textContent = transaction.type;

  transactionBottom.appendChild(cardCategory);
  transactionBottom.appendChild(cardType);

  card.appendChild(transactionTop);
  card.appendChild(transactionBottom);

  return card;
}
//  Renders transaction cards
function renderTransactions() {
  transactionList.innerHTML = "";
  if (transactions.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = `No transactions yet`;
    emptyMessage.classList.add("emptyMessage");
    transactionList.appendChild(emptyMessage);
    return;
  }
  for (const transaction of transactions) {
    const card = createTransactionCard(transaction);
    transactionList.appendChild(card);
  }
}

// delete the transaction in array
function deleteTransaction(id){
   for(let i=0;i<transactions.length;i++){
    if(transactions[i].id===id){
         transactions.splice(i,1);
         break;
    }
   }
   saveToLocalStorage(transactions);
   updateUI();
}

