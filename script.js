const sidebarLinks = Array.from(document.querySelectorAll('.sidebar a'));

sidebarLinks.forEach((link) => {
  link.addEventListener('click', () => {
    sidebarLinks.forEach((item) => item.classList.toggle('active', item === link));
  });
});

const themeToggle = document.querySelector('#themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
  });
}

const navLinks = Array.from(document.querySelectorAll('.main-nav-link'));

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((item) => item.classList.toggle('active', item === link));
  });
});

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    const id = entry.target.getAttribute('id');
    if (!id) {
      return;
    }

    const matchingLink = navLinks.find((link) => link.getAttribute('href') === `#${id}`);
    if (matchingLink) {
      navLinks.forEach((link) => link.classList.toggle('active', link === matchingLink));
    }
  });
}, { threshold: 0.35 });

document.querySelectorAll('section[id]').forEach((section) => {
  navObserver.observe(section);
});
