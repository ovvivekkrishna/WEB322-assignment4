document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    const usernameInput = document.getElementById('userName');
    const passwordInput = document.getElementById('password');
  
    loginForm.addEventListener('submit', (event) => {
      let isValid = true;
      let errorMessage = '';
  
      // Validate username
      if (usernameInput.value.trim() === '') {
        isValid = false;
        errorMessage += 'Username is required.\n';
      }
  
      // Validate password
      if (passwordInput.value.trim() === '') {
        isValid = false;
        errorMessage += 'Password is required.\n';
      }
  
      // If validation fails, prevent form submission and display error
      if (!isValid) {
        event.preventDefault();
        alert(errorMessage);
      }
    });
  });
  