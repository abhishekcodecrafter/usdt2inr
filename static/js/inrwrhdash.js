document.addEventListener("DOMContentLoaded", function() {
    var arrow = document.getElementById("scrollArrow");
  
    
    var container = document.querySelector(".container");
  
   
    window.addEventListener("scroll", function() {
      if (isElementInViewport(container)) {
        arrow.style.display = "block"; 
      } else {
        arrow.style.display = "none";
      }
    });
  
    function isElementInViewport(el) {
      var rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
  });
  
  
  function redirectTo(page) {
        window.location.href = page;
      }