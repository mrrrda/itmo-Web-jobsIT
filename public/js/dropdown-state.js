(function () {
  document.addEventListener('click', function (event) {
    const hiddenClassName = 'dropdown-menu_hidden';
    const headerDropdownMenu = document.getElementById('headerDropdownMenu');

    if (event.target.id === 'headerUserLogo' || event.target.classList.contains('user-avatar')) {
      headerDropdownMenu.classList.toggle(hiddenClassName);
    } else {
      headerDropdownMenu.classList.add(hiddenClassName);
    }
  });
})();
