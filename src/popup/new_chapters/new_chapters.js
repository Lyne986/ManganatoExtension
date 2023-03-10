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
    let regexp = "\">Chapter (.+)<\/a>[\n]"
    // regex to match the chapter "Vol.2 Chapter 5" and "Chapter 5"
    
    let data;
    try {
        data = await requestGetData("https://readmanganato.com/manga-" + manga.mangaCode);
        console.log("request sent : ", "https://readmanganato.com/manga-" + manga.mangaCode)
    } catch (e) {
        console.log("Error couldn't get manga data")
        console.log(e);
        return "none";
    }
    console.log("DATA : ", data)
    let array = [...data.matchAll(regexp)];
    let left;
    // console.log(array[0]);
    // console.log(data);
    console.log(array);
    // console.log(array.length);


    let lastChapter = array[0][1];
    // console.log("for manga : " + manga.title + "chapter : " + manga.chapter + " and chapter found = " + array.length + " last chapter = " + lastChapter);
    // console.log(lastChapter)
    // console.log(lastChapter - manga.chapter)
    if (manga.chapter == 0) {
        left = "no chapters read yet for [" + manga.title + "]";
    } else if (lastChapter == manga.chapter) {
        left = "none";
    } else if ((lastChapter - manga.chapter) > 0) {
        left = lastChapter - manga.chapter;
    } else {
        left = "none";
    }

    if (left == "none")
        return "none";

    let html = ('<div class="home-manga-column ' + (manga.chapterUrl != null ? "url-found" : "url-not-found") + '" id="'+ manga.mangaCode +'">' +
                    '<div class="home-manga-img-column" >' +
                        '<img src="' + manga.image + ' " id="'+ manga.mangaCode +'" class="manga-image-home"></img>' +
                    '</div>' +
                    '<div class="home-manga-info-column">' +
                        '<p class="home-manga-informations"> ' +  (manga.title.length > 20 ? manga.title.substring(0, 20) + "..." : manga.title) + ' </p>' +
                        '<br>' +
                        '<p class="home-manga-informations"> Chapters Left :' + (left) + ' </p>' +
                        '<p class="home-manga-informations"> Resume :' + (manga.chapter == 0 ? "none" : manga.chapter) + ' </p>' +
                    '</div>' +
                '</div>')
    return html
}

async function loadAllNewManga() {
    let object;
    let mangaObj;
    let html = '<div class="home-manga-rows">';
    let mangaHtml = "";
    let index = 0;

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
    console.log("mangaOBJ ======= ", mangaObj)
    try {
        let element = document.getElementById('home-manga-content');
        let length = mangaObj.length
        console.log(length);
        for (let i = 0; i < length; i++) {
            console.log("len", length, " i ", i)
            let manga = mangaObj[i];
            // console.log("SCROLL FOR " + mangaObj[i].title + " SCROLL IS " + mangaObj[i].scroll);
            console.log("MANGA ->", manga);
            if ((mangaHtml = await createManga(manga)) == "none") {
                mangaHtml = "";
                continue;
            } else {
                html += mangaHtml;
            }
            if (index % 2 != 0) {
                html += '</div>'
                if (i != length - 1)
                    html += '<div class="home-manga-rows">'
            }
            index++;
            element.innerHTML = html;
        }
    } catch (e) {
        console.log("Something Went Wrong when building home page of the popup");
        console.log(e);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadAllNewManga();
});

window.onclick = async function(e) {
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
}