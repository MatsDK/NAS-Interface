const registerForm = document.querySelector(".register-form");
const nameInput = registerForm.querySelector(".name-input");
const emailInput = registerForm.querySelector(".email-input");
const passwordInput = registerForm.querySelector(".password-input");

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  axios
    .post("/auth/register", {
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
    })
    .then((res) => {
      if (res.data.redirect) window.location = res.data.redirect;
      else console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
});
