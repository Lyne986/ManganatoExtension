const key = "manga-followed-by-user"
const baseUrl = "https://readmanganato.com/"

function getItem(key) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(key, function(value) {
            resolve(value[key]);
        });
    });
}

function setItem(key, value)
{
    chrome.storage.sync.set({
        [key]: value,
    })
}

async function requestGet(url){
    try {
        const res = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        });
        console.log(res);
        if ((await res.text()) === 'true') {
            return true
        } else {
            return false
        }
    } catch (e) {
        console.log(e);
        return false
    }
};

async function requestGetData(url){
    try {
        const res = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        });
        return(res.text());
    } catch (e) {
        return (e);
    }
};

async function createManga(manga) {

    return ('<div class="home-manga-column ' + (manga.chapterUrl != null ? "url-found" : "url-not-found") + '" id="'+ manga.mangaCode +'">' +
                    '<div class="home-manga-img-column" >' +
                        '<img src="' + manga.image + ' " id="'+ manga.mangaCode +'" class="manga-image-home"></img>' +
                    '</div>' +
                    '<div class="home-manga-info-column">' +
                        '<p class="home-manga-informations"> ' + manga.title + ' </p>' +
                        '<p class="home-manga-informations"> Resume :' + (manga.chapter == 0 ? "none" : manga.chapter) + ' </p>' +
                    '</div>' +
                '</div>')
}

async function loadAllFollowedManga() {
    let object;
    let mangaObj;
    let html = '<div class="home-manga-rows">';
    console.log("ITEM : " + JSON.stringify(object));

    try {
        object = await getItem(key);
        console.log("ITEM IN STRING : " + JSON.stringify(object));
        mangaObj = JSON.parse(object);
    } catch (e) {
        console.log("Something Went Wrong when getting the localstorage object");
    }

    if (mangaObj.length == 0) {
        console.log("OBJECT IS EMPTY");
        return;
    }

    console.log("ITEM IN JSON : " + mangaObj);
    try {
        let element = document.getElementById('home-manga-content');
        let length = mangaObj.length
        console.log(length);
        for (let i = 0; i < length; i++) {
            let manga = mangaObj[i];
            console.log("SCROLL FOR " + mangaObj[i].title + " SCROLL IS " + mangaObj[i].scroll);
            console.log(manga);
            html += await createManga(manga);
            if (i % 2 != 0) {
                html += '</div>'
                if (i != length - 1)
                    html += '<div class="home-manga-rows">'
            }
        }
        element.innerHTML += html;
    } catch (e) {
        console.log("Something Went Wrong when building home page of the popup");
        console.log(e);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadAllFollowedManga();
});

window.onclick = async function(e) {
    const balise = e.target;

    if (balise.matches(".active"))
        return;

    switch (balise.innerText) {
        case "New Chapters":
            window.location.href = '../new_chapters/new_chapters.html'
            return;
        case "Home":
            window.location.href = '../home/home.html'
            return;
        case "Contact":
            window.location.href = '../contacts/contacts.html'
            break;
        default:
            break;
    }

    let object;
    let mangaObj;

    try {
        object = await getItem(key);
        console.log("ITEM IN STRING : " + JSON.stringify(object));
        mangaObj = JSON.parse(object);
    } catch (e) {
        console.log("Something Went Wrong when getting the localstorage object");
    }

    if (mangaObj.length == 0) {
        console.log("OBJECT IS EMPTY");
        return;
    }

    let length = mangaObj.length
    for (let i = 0; i < length; i++) {
        if (mangaObj[i].mangaCode == e.target.id || mangaObj[i].mangaCode == e.target.parentElement.id || mangaObj[i].mangaCode == e.target.parentElement.parentElement.id) {
            if (mangaObj[i].chapterUrl != null) {
                w = window.open(mangaObj[i].chapterUrl);
                setTimeout(function() { w.scrollTo(0,mangaObj[i].scroll) }, 500);
            }
        }
    }
};


// ========================= SCROLL RELATED FUNCS =========================

let navbar = document.getElementById("navbar");
let mangaContent = document.getElementById("home-manga-content");
let sticky = navbar.offsetTop;

window.onscroll = function() {
    navBarSticky()
};

function navBarSticky() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
    mangaContent.style.marginTop = "13%";
  } else {
    navbar.classList.remove("sticky");
  }
}