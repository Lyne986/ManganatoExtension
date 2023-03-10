
function initNavbar() {
    
    if (!document.getElementById('navbar'))
        return;
    let navbar = document.getElementById('navbar').getElementsByTagName('a');
    if (!navbar)
        return;

    for (let i = 0; i < navbar.length; i++) {
        if (navbar[i].id == document.title) {
            document.getElementById(document.title).className = "active";
            document.getElementById(document.title).href = "#";
        } else {
            document.getElementById(navbar[i].id).className = "";
        }
    }
}

window.onload = function(){
    setTimeout(() => {
        initNavbar();
    }, 5);
};

let navbar = document.getElementById("navbar");
let sticky = navbar ? navbar.offsetTop : null;

window.onscroll = function() {
    navBarSticky()
};

function navBarSticky() {
    if (!sticky)
        return;
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
    mangaContent.style.marginTop = "13%";
  } else {
    navbar.classList.remove("sticky");
  }
}
