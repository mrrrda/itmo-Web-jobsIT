(function () {
  const links = Array.from(document.getElementsByClassName('header__navigation-link'));

  links.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('header__navigation-link_active');
    }
  });
})();
