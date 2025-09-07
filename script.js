// Wallet in localStorage
function getWallet() {
  return JSON.parse(localStorage.getItem("wallet") || '{"balance":0,"transactions":[]}');
}
function saveWallet(wallet) {
  localStorage.setItem("wallet", JSON.stringify(wallet));
}

// Animate balance instantly
function animateBalance(newBalance) {
  document.getElementById("balance").innerText = newBalance;
}

// Charts
let lineChart;
function renderLineChart(wallet) {
  const ctx = document.getElementById("transactionLineChart").getContext("2d");
  const labels = wallet.transactions.map((t, i) => `#${i+1}`);
  const values = wallet.transactions.map(t => t.balanceAfter);

  if (lineChart) lineChart.destroy();
  lineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Balance Over Time",
        data: values,
        borderColor: "rgba(37,117,252,1)",
        backgroundColor: "rgba(37,117,252,0.2)",
        tension: 0.3
      }]
    }
  });
}

// Transactions list
function renderTransactions(wallet) {
  let txList = document.getElementById("transactionsList");
  txList.innerHTML = "";
  wallet.transactions.slice().reverse().forEach(tx => {
    let li = document.createElement("li");
    li.textContent = `${tx.type} $${tx.amount} (Balance: $${tx.balanceAfter})`;
    txList.appendChild(li);
  });
}

// Init
let wallet = getWallet();
animateBalance(wallet.balance);
renderTransactions(wallet);
renderLineChart(wallet);

// Add money
document.getElementById("addForm").addEventListener("submit", e => {
  e.preventDefault();
  let amt = parseFloat(document.getElementById("addAmount").value);
  wallet.balance += amt;
  wallet.transactions.push({ type: "Added", amount: amt, balanceAfter: wallet.balance });
  saveWallet(wallet);
  animateBalance(wallet.balance);
  renderTransactions(wallet);
  renderLineChart(wallet);
  e.target.reset();
});

// Withdraw
document.getElementById("withdrawForm").addEventListener("submit", e => {
  e.preventDefault();
  let amt = parseFloat(document.getElementById("withdrawAmount").value);
  if (wallet.balance >= amt) {
    wallet.balance -= amt;
    wallet.transactions.push({ type: "Withdrew", amount: amt, balanceAfter: wallet.balance });
    saveWallet(wallet);
    animateBalance(wallet.balance);
    renderTransactions(wallet);
    renderLineChart(wallet);
  } else {
    alert("Insufficient balance!");
  }
  e.target.reset();
});

// Send money (record only)
document.getElementById("sendForm").addEventListener("submit", e => {
  e.preventDefault();
  let receiver = document.getElementById("sendTo").value;
  let amt = parseFloat(document.getElementById("sendAmount").value);
  if (wallet.balance >= amt) {
    wallet.balance -= amt;
    wallet.transactions.push({ type: `Sent to ${receiver}`, amount: amt, balanceAfter: wallet.balance });
    saveWallet(wallet);
    animateBalance(wallet.balance);
    renderTransactions(wallet);
    renderLineChart(wallet);
  } else {
    alert("Insufficient balance!");
  }
  e.target.reset();
});