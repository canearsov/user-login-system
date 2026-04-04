document.addEventListener('DOMContentLoaded', () => {

  // =========================
  // REGISTER
  // =========================
  const regForm = document.getElementById('registerForm');
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value;

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();
        const msgEl = document.getElementById('regMsg');

        if (!res.ok) {
          msgEl.textContent = data.msg || "Napaka pri registraciji.";
          msgEl.classList.add('error');
          return;
        }

        msgEl.textContent = 'Registracija uspešna! Preusmerjam...';
        msgEl.classList.add('success');

        setTimeout(() => window.location.href = 'login.html', 1000);

      } catch (err) {
        console.error(err);
      }
    });
  }

  // =========================
  // LOGIN
  // =========================
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const msgEl = document.getElementById('loginMsg');

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        console.log("LOGIN RESPONSE:", data);

        if (res.ok) {
          // Shrani token in user v localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          window.location.href = "aplikacija.html"; // redirect
        } else {
          msgEl.textContent = data.msg || "Login failed";
          msgEl.classList.add('error');
        }

      } catch (err) {
        console.error(err);
      }
    });
  }

  // =========================
  // DASHBOARD – ACTIVE USERS
  // =========================
  const userList = document.getElementById('userList');
  if (userList) {
    async function loadUsers() {
      try {
        const res = await fetch('/api/auth/active-users');
        const users = await res.json();

        console.log("ACTIVE USERS FROM SERVER:", users);

        userList.innerHTML = "";
        users.forEach(email => {
          const li = document.createElement('li');
          li.textContent = email;
          userList.appendChild(li);
        });
      } catch (err) {
        console.error(err);
      }
    }

    loadUsers();
  }

  // =========================
  // LOGOUT
  // =========================
  const logoutBtn = document.querySelector('button[onclick="logout()"]');
  window.logout = async function() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return window.location.href = "login.html";

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
    } catch (err) {
      console.error(err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  };
});
