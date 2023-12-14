const myModal = new bootstrap.Modal(document.getElementById("transaction-modal"));
let logged = sessionStorage.getItem("logged");
let userData = {
    transactions: []
};

document.getElementById("button-logout").addEventListener("click", logout);
document.getElementById("transactions-button").addEventListener("click", function () {
    window.location.href = "transactions.html";
});

document.getElementById("transaction-form").addEventListener("submit", handleTransactionSubmit);

checkLogged();

function checkLogged() {
    const session = sessionStorage.getItem("logged");

    if (!session) {
        window.location.href = "index.html";
        return;
    }

    logged = session;
    const userDataString = localStorage.getItem(logged);

    if (userDataString) {
        userData = JSON.parse(userDataString);
    }

    getCashIn();
    getCashOut();
    getTotal();
}

function handleTransactionSubmit(e) {
    e.preventDefault();

    const value = parseFloat(document.getElementById("value-input").value);
    const description = document.getElementById("description-input").value;
    const date = document.getElementById("date-input").value;
    const typeInput = document.querySelector('input[name="type-input"]:checked');

    if (isNaN(value) || value <= 0) {
        alert("Digite um valor válido.");
        return;
    }

    if (typeInput) {
        const type = typeInput.value;

        userData.transactions.unshift({
            value: value,
            type: type,
            description: description,
            date: date
        });

        if (!checkNegativeBalance()) {
            userData.transactions.shift(); // Desfaz a transação se o saldo ficar negativo
            saveData();
            getTransactions();
            alert("A transação foi cancelada porque deixaria o saldo negativo.");
            return;
        }

        saveData();
        e.target.reset();
        myModal.hide();

        getCashIn();
        getCashOut();
        getTotal();

        alert("Lançamento adicionado com sucesso.");
    }
}

function checkNegativeBalance() {
    const total = userData.transactions.reduce((acc, item) => {
        return item.type === "1" ? acc + item.value : acc - item.value;
    }, 0);

    if (total < 0) {
        return window.confirm("Seu saldo ficará negativo. Deseja continuar?");
    }

    return true;
}

function getTransactions(type) {
    const transactions = userData.transactions;

    if (transactions) {
        const filteredTransactions = type
            ? transactions.filter((item) => item.type === type)
            : transactions;

        return filteredTransactions.slice(0, 5);
    }

    return [];
}

function renderTransactionList(type, containerId) {
    const transactions = getTransactions(type);
    const container = document.getElementById(containerId);

    if (transactions.length) {
        let html = "";

        for (const transaction of transactions) {
            html += `
            <div class="row mb-4">
                <div class="col-12">
                    <h3 class="fs-2">R$ ${transaction.value.toFixed(2)}</h3>
                    <div class="container p-0">
                        <div class="row">
                            <div class="col-12 col-md-8">
                                <p>${transaction.description}</p>
                            </div>
                            <div class="col-12 col-md-3 d-flex justify-content-end">
                                ${transaction.date}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }

        container.innerHTML = html;
    } else {
        container.innerHTML = "";
    }
}

function getCashIn() {
    renderTransactionList("1", "cash-in-list");
}

function getCashOut() {
    renderTransactionList("2", "cash-out-list");
}

function getTotal() {
    const total = userData.transactions.reduce((acc, item) => {
        return item.type === "1" ? acc + item.value : acc - item.value;
    }, 0);

    document.getElementById("total").innerHTML = `R$ ${total.toFixed(2)}`;
}

function saveData() {
    localStorage.setItem(logged, JSON.stringify(userData));
}

function logout() {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");
    window.location.href = "index.html";
}
