const myModal = new bootstrap.Modal(document.getElementById("transaction-modal"));
let logged = sessionStorage.getItem("logged");
let data = {
    transactions: []
};

document.getElementById("button-logout").addEventListener("click", logout);
document.getElementById("transactions-button").addEventListener("click", function() {
    window.location.href = "transactions.html"
});

document.getElementById("transaction-form").addEventListener("submit", handleTransactionSubmit);

checkLogged();

function checkLogged() {
    if (session) {
        sessionStorage.setItem("logged", session);
        logged = session;
    }

    if (!logged) {
        window.location.href = "index.html";
        return;
    }

    const dataUser = localStorage.getItem(logged);
    if (dataUser) {
        data = JSON.parse(dataUser);
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

function getCashIn() {
    const transactions = data.transactions;

    if (transactions) {
        const cashIn = transactions.filter((item) => item.type === "1");

        if (cashIn.length) {
            let cashInHtml = ``;
            let limit =0;

            if(cashIn.length > 5){
                limit = 5;
            } else {
                limit = cashIn.length;
            }

            for (let index = 0; index < limit; index++) {
                const transaction = cashIn[index];

                cashInHtml += `
                <div class="row mb-4">
                    <div class="col-12">
                        <h3 class="fs-2">R$ ${cashIn[index].value.toFixed(2)}</h3>
                        <div class="container p-0">
                            <div class="row">
                                <div class="col-12 col-md-8">
                                    <p>${cashIn[index].description}</p>
                                </div>
                                <div class="col-12 col-md-3 d-flex justify-content-end">
                                    ${cashIn[index].date}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            }

            document.getElementById("cash-in-list").innerHTML = cashInHtml;
        }
    }
}

function getCashOut() {
    const transactions = data.transactions;

    if (transactions) {
        const cashIn = transactions.filter((item) => item.type === "2");

        if (cashIn.length) {
            let cashInHtml = ``;
            let limit =0;

            if(cashIn.length > 5){
                limit = 5;
            } else {
                limit = cashIn.length;
            }

            for (let index = 0; index < limit; index++) {
                const transaction = cashIn[index];

                cashInHtml += `
                <div class="row mb-4">
                    <div class="col-12">
                        <h3 class="fs-2">R$ ${cashIn[index].value.toFixed(2)}</h3>
                        <div class="container p-0">
                            <div class="row">
                                <div class="col-12 col-md-8">
                                    <p>${cashIn[index].description}</p>
                                </div>
                                <div class="col-12 col-md-3 d-flex justify-content-end">
                                    ${cashIn[index].date}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            }

            document.getElementById("cash-out-list").innerHTML = cashInHtml;
        }
    }
}

function getTotal() {
    const transactions = data.transactions;
    let total = 0;

    transactions.forEach((item) => {
        if(item.type === "1") {
            total += item.value;
        } else {
            total -= item.value;
        }
    });

    document.getElementById("total").innerHTML = `R$ ${total.toFixed(2)}`;
}

function saveData() {
    localStorage.setItem(logged, JSON.stringify(data));
}

function logout() {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");
    window.location.href = "index.html";
}
