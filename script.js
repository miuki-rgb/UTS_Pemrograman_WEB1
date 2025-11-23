document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const userIn = document.getElementById('username').value;
            const passIn = document.getElementById('password').value;
            const errorMsg = document.getElementById('errorMsg');

            // Reset pesan error
            errorMsg.innerText = "";

            try {
                // Kirim data ke API Login
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: userIn, password: passIn })
                });

                const result = await response.json();

                if (response.ok) {
                    // LOGIN SUKSES
                    alert(`Selamat Datang, ${result.user.nama}!`);
                    
                    // Simpan nama user biar bisa muncul di Dashboard
                    localStorage.setItem('userLoggedIn', JSON.stringify(result.user));
                    
                    window.location.href = 'dashboard.html';
                } else {
                    // LOGIN GAGAL (Password salah / User gak ada)
                    errorMsg.innerText = result.message;
                }

            } catch (error) {
                console.error('Error:', error);
                errorMsg.innerText = "Gagal terhubung ke server.";
            }
        });
    }
});