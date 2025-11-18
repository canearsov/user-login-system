document.addEventListener('DOMContentLoaded', () => {

  // REGISTER
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

        setTimeout(() => window.location.href = 'success.html', 1000);

      } catch (err) {
        console.error(err);
      }
    });
  }

  // LOGIN
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

        if (!res.ok) {
          msgEl.textContent = data.msg || "Napaka pri prijavi.";
          msgEl.classList.add('error');
          return;
        }

        msgEl.textContent = 'Prijava uspešna!';
        msgEl.classList.add('success');

        localStorage.setItem('user', JSON.stringify(data.user));

        setTimeout(() => window.location.href = 'index.html', 800);

      } catch (err) {
        console.error(err);
      }
    });
  }

});
