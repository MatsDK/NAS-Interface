const loginForm = document.querySelector(".login-form");
const emailInput = loginForm.querySelector(".email-input");
const passwordInput = loginForm.querySelector(".password-input");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (
    emailInput.value.replace(/\s/g, "").length &&
    passwordInput.value.replace(/\s/g, "").length
  ) {
    axios
      .post("/auth/login", {
        email: emailInput.value,
        password: passwordInput.value,
      })
      .then(function (response) {
        if (response.data.redirect) window.location = response.data.redirect;
        else console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    alert("please enter email and password");
  }
});
