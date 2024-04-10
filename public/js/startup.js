(function () {
  const startTimestamp = Date.now();

  function onContentLoaded() {
    const footerLoadTime = document.querySelector('footer.footer .footer__load-time');
    footerLoadTime.textContent = `Page loaded in ${Date.now() - startTimestamp}ms`;
    window.removeEventListener('DOMContentLoaded', onContentLoaded);
  }

  window.addEventListener('DOMContentLoaded', onContentLoaded);
})();
