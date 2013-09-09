$(document).ready(function() {
  /**
   * This is a *hack*. In Twitter Bootstrap, when you initially visit a page
   * that has an anchor hash tag (#myId), the top navbar will hover over the
   * content. This script pushes the content down 60px when a hash is detected.
   */
  if (window.location.hash) scrollDown();
  window.addEventListener("hashchange", function() { scrollDown(); });

  /**
   * Add a timeout to allow for compatiblility with Chrome.
   */
  function scrollDown() {
    setTimeout(function(){
      window.scrollBy(0, -60);
    }, 1);
  }
});