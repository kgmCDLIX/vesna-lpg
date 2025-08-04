document.addEventListener("DOMContentLoaded", function () {
    const burger = document.querySelector('.burger-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    const links = mobileMenu.querySelectorAll('a');
    const body = document.body;
    const closeBtn = document.querySelector('.mobile-menu__close');

    const closeMenu = () => {
        mobileMenu.classList.remove('active');
        burger.classList.remove('active');
        body.classList.remove('no-scroll');
    };

    if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            burger.classList.toggle('active');
            body.classList.toggle('no-scroll');
        });

        links.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }
});
