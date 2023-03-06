
function initNavbar() {
    
    console.log("navbar js")
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

// window.onload = function(){
//     initNavbar();
// };
// document.addEventListener('DOMContentLoaded', function() {
//     initNavbar();
// });

document.onreadystatechange = function(e)
{
    if (document.readyState === 'complete')
    {
        //dom is ready, window.onload fires later
        initNavbar()
    }
};
// let navbar = document.getElementById("navbar");
// let sticky = navbar ? navbar.offsetTop : null;

// window.onscroll = function() {
//     navBarSticky()
// };

// function navBarSticky() {
//     if (!sticky)
//         return;
//   if (window.pageYOffset >= sticky) {
//     navbar.classList.add("sticky")
//     mangaContent.style.marginTop = "13%";
//   } else {
//     navbar.classList.remove("sticky");
//   }

// }
