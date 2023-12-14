const myModal = new bootstrap.Modal("#register-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");

//Logar
document.getElementById("login-form").addEventListener("submit", function (e){
    e.preventDefault();

    const email = document.getElementById("email-input").value;
    const password = document.getElementById("password-input").value;
    const checkSession = document.getElementById("session-check").checked;

    const conta = getAccount(email);

    if (!conta){
        alert("Ops! verifique o usuário ou a senha.");
        return;
    }

    if(conta){
        if(conta.password !== password){
            alert("Ops! verifique o usuário ou a senha.");
            return;  
        }

        saveSession(email, checkSession);


        window.location.href = "home.html";
    }
    
});

document.getElementById("create-form").addEventListener("submit", function(e){
    e.preventDefault();

    const email = document.getElementById("email-create-input").value;
    const password = document.getElementById("password-create-input").value;
    const confirmPassword = document.getElementById("confirm-password-input").value;

    if(email.length < 4) {
        alert("Preencha o campo com um e-mail válido.");
        return;
    }

    if(password.length < 4){
        alert("Preencha a senha com no mínimo 4 dígitos.");
        return;
    }

    if(password !== confirmPassword){
        alert("As senhas não coincidem. Por favor, verifique.");
        return;
    }

    saveAccount({
        login: email,
        password: password,
        transaction: []
    });

    myModal.hide();

    alert("Conta criada com sucesso.");
});


function checkLogged() {
    const session = localStorage.getItem("session");

    if(session){
        sessionStorage.setItem("logged", session);
        logged = session;
    }
    
    if(logged){
        saveSession(logged, session);

        window.location.href = "home.html";
    }
    
}

function saveAccount(data) {
    localStorage.setItem(data.login, JSON.stringify(data)); 
}
    
function saveSession (data, saveSession){
    if(saveSession){
        localStorage.setItem("session", data);
    }

    sessionStorage.setItem("logged", data);
}

function getAccount(key){
    const conta = localStorage.getItem(key);

    if(conta) {
        return JSON.parse(conta);
    }

    return "";
}
