const myModal = new bootstrap.Modal(document.getElementById("transaction-modal"));
let logged = sessionStorage.getItem("logged");
let data = {
    transactions: []
};

document.getElementById("button-logout").addEventListener("click", logout);
document.getElementById("transaction-form").addEventListener("submit", handleTransactionSubmit);

checkLogged();

function checkLogged() {
    if (!logged) {
        window.location.href = "index.html";
        return;
    }

    const dataUser = localStorage.getItem(logged);
    if (dataUser) {
        data = JSON.parse(dataUser);
    }

    getTransactions();
}

function handleTransactionSubmit(e) {
    e.preventDefault();

    const value = parseFloat(document.getElementById("value-input").value);
    const description = document.getElementById("description-input").value;
    const date = document.getElementById("date-input").value;
    const typeInput = document.querySelector('input[name="type-input"]:checked');

    if (typeInput) {
        const type = typeInput.value;

        if (!data.transactions) {
            data.transactions = [];
        }

        data.transactions.unshift({
            value: value, type: type, description: description, date: date
        });

        if (!checkNegativeBalance()) {
            // Se o saldo ficar negativo, desfaz a transação e encerra a função
            data.transactions.shift();
            saveData();
            getTransactions();
            alert("Transação cancelada. Seu saldo não foi alterado.");
            return;
        }

        saveData();
        e.target.reset();
        myModal.hide();

        getTransactions();
        getCashIn();
        getCashOut();
        getTotal();

        alert("Lançamento adicionado com sucesso.");
    }
}

function getTransactions() {
    const transactions = data.transactions;
    let transactionsHtml = "";

    if (transactions && transactions.length) {
        transactions.forEach((item) => {
            let type = item.type === "2" ? "Saída" : "Entrada";

            transactionsHtml += `
                <tr>
                    <th scope="row">${item.date}</th>
                    <td>${item.value.toFixed(2)}</td>
                    <td>${type}</td>
                    <td>${item.description}</td>
                </tr>
            `;
        });
    }

    document.getElementById("transactions-list").innerHTML = transactionsHtml;
}

function checkNegativeBalance() {
    const transactions = data.transactions;
    const total = transactions.reduce((acc, item) => {
        return item.type === "1" ? acc + item.value : acc - item.value;
    }, 0);

    if (total < 0) {
        const confirmMessage = "Seu saldo ficará negativo. Deseja continuar?";
        return window.confirm(confirmMessage);
    }

    return true;
}

function logout() {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");
    window.location.href = "index.html";
}

function saveData() {
    localStorage.setItem(logged, JSON.stringify(data));
}
