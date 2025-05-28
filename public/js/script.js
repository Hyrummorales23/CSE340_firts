// Show password funtion for Register view
const pwbutton = document.querySelector("#pwbutton");
pwbutton.addEventListener("click", function() {
    const pwInput = document.getElementById("account_password");
    const type = pwInput.getAttribute("type");
    if (type == "password") {
        pwInput.setAttribute("type", "text");
        pwbutton.innerHTML = "Hide Password";
    } else {
        pwInput.setAttribute("type", "password");
        pwbutton.innerHTML = "Show Password";
    }
});
