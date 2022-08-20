const scrollBtn = document.querySelector(".arrow-button")

scrollBtn.addEventListener("click", e => {
  window.scrollTo({
    top: window.innerHeight,
    behavior: "smooth"
  })
})



// animation counters
const counters = document.querySelectorAll(".statistic-list__item div span");
const speed = 500;

counters.forEach((counter) => {
  const updateCount = () => {
    const target = parseInt(+counter.getAttribute("data-target"));
    const count = parseInt(+counter.innerText);
    const increment = Math.trunc(target / speed);

    if (count < target) {
      increment ? counter.innerText = count + increment : counter.innerText = count + 1
      setTimeout(updateCount, 1);
    } else {
      count.innerText = target;
    }
  };

  window.addEventListener("scroll", (e) => {
    if (Math.ceil(window.pageYOffset) > 140 && Math.ceil(window.pageYOffset) < 1050) {
      updateCount()
    }
  })

});

const mobileMenu = document.querySelector(".mobile-menu")
const body = document.querySelector("body")

window.addEventListener("click", e => {
  if (e.target && e.target.classList.contains("close-button")) {
    mobileMenu.classList.remove("active")
    body.style.overflow = ""
  }
  if (e.target && e.target.classList.contains("burger")) {
    mobileMenu.classList.add("active")
    body.style.overflow = "hidden"
  }
})
