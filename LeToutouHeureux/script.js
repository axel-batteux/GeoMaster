document.addEventListener('DOMContentLoaded', () => {

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
        } else {
            navbar.style.boxShadow = "none";
            navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
        }
    });

    // Form Submission Simulation
    const form = document.getElementById('bookingForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get button to change state
        const btn = form.querySelector('.btn-submit');
        const originalText = btn.innerText;

        btn.innerText = "Envoi en cours...";
        btn.style.opacity = "0.7";

        setTimeout(() => {
            btn.innerText = "Demande Envoyée ! ✅";
            btn.style.backgroundColor = "#2ecc71"; // Success green

            // Reset form
            form.reset();

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = "";
                btn.style.opacity = "1";

                alert("Merci ! Nous avons bien reçu votre demande. Un membre de l'équipe vous recontactera sous 24h. 🐶");
            }, 2000);

        }, 1500);
    });

    // Mobile Menu (Simple alert for demo)
    const burger = document.querySelector('.burger');
    burger.addEventListener('click', () => {
        alert("Le menu mobile s'ouvrirait ici dans la version complète !");
    });

});
