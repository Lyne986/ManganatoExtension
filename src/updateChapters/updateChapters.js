const key = "manga-followed-by-user"

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

let mangaUrl = document.URL

let mangaCode = mangaUrl.substring(mangaUrl.indexOf("manga-") + 6, mangaUrl.indexOf("/chapter"));
let chapter = mangaUrl.substring(mangaUrl.indexOf("/chapter") + 9);

console.log("UPDATING CHAPTER NI" + chapter);
updateLastChapterRead(mangaCode);


async function updateLastChapterRead(mangaCode) {
    let item = await getItem(key);
    let mangaObj;

    console.log(mangaObj)
    try {
        mangaObj = JSON.parse(item);
    } catch (e) {
        mangaObj = item;
    }

    console.log("UPDATING THIS ITEM =>" + mangaObj);

    for (let i = 0; i < mangaObj.length; i++) {
        console.log("MANGACODE = " + mangaObj[i].mangaCode, "URL MANGA CODE =>" + mangaCode)
        if (mangaObj[i].mangaCode === mangaCode) {
            console.log(mangaObj[i].chapter)
            mangaObj[i].chapter = chapter;
            mangaObj[i].chapterUrl = document.URL;
            setItem(key, JSON.stringify(mangaObj));
            return;
        }
    }
}

// window.onbeforeunload = async function(event) {
//         event.preventDefault();
//         let mangaUrl = document.URL;
//         let currMangaCode = mangaUrl.substring(mangaUrl.indexOf("manga-") + 6);


//         // console.log(manga.mangaCode);
//         console.log("LEAVING PAGE");
//         // if (e.target.id == manga.mangaCode) {

//         let object = await getItem(key);

//         try {
//             mangaObj = JSON.parse(object);
//         } catch (e) {
//             mangaObj = object;
//         }

//         if (mangaObj.length == 0) {
//             console.log("OBJECT IS EMPTY");
//             return;
//         }

//         let length = mangaObj.length
//         console.log("EHRE JRJ");
//         for (let i = 0; i < length; i++) {
//             if (mangaObj[i].mangaCode == currMangaCode) {
//                 console.log("FOUND MANGA");
//                 mangaObj[i].scroll = document.documentElement.scrollTop;
//                 setItem(key, JSON.stringify(mangaObj));
//             }
//         }
//         return ("Trying to fix erors");
// };

// window.onbeforeunload = async function(event) {
//     alert("Are your sure?")
// };