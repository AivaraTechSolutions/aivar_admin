document.addEventListener('DOMContentLoaded', () => {

    if (!localStorage.getItem('loggedIn') && !sessionStorage.getItem('loggedIn')) {
        window.location.href = 'index.html';
    }
})

const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/admin/"
}