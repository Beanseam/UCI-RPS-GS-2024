const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (username === "1" && password === "1") {
        location.replace("file:///c%3A/Users/seany/RP%20AV%20Ground%20Station/graphs.html")
    } else {
        loginErrorMsg.style.opacity = 1;
    }
})