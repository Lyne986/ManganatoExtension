const key = "manga-followed-by-user"
const baseUrl = document.URL.substring(0, document.URL.indexOf("manga-"));
// console.log("NEW URL" + document.URL.substring(0, document.URL.indexOf("manga-")));


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

async function getMangaObject() {
    let mangaUrl = document.URL;
    let mangaCode = mangaUrl.substring(mangaUrl.indexOf("manga-") + 6);
    let data = await requestGetData(baseUrl + "manga-" + mangaCode);
    let image = data.match(/<meta name="twitter:image" content="(.*?)" \/>/);


    let title = data.match(/<title>(.*?)<\/title>/)[1].split("Manga Online Free")[0];

    console.log(image);
    console.log(title);

    let mangaObj = {
        "mangaCode": mangaCode,
        "title": title,
        "image": image[1],
        "chapter": 0,
        "chapterUrl": null,
        "scroll" : null
    }
    return mangaObj;
}

function addButton(text) {
    let element = document.getElementsByClassName("panel-story-info");
    let followButton = document.createElement("button")
    let followCase = document.createElement("div")

    followCase.classList.add("box-3");
    followButton.classList.add("btn-three")
    followButton.classList.add("btn")
    followButton['data-name'] = 'name1'
    followButton.type = 'button';
    window.addEventListener('load',() => {
        followButton.onclick = function() {
            followOrUnfollow(followButton);
        }
      });
    followButton.innerText = text
    followCase.appendChild(followButton);
    element[0].prepend(followCase);
}

function isEmptyObject(obj){
    return JSON.stringify(obj) === '{}'
}

async function followOrUnfollow(button) {
    console.log("FOLLOW SCRIPT");
    let item = await getItem(key);
    let mangaObj;
    console.log(item);

    try {
        mangaObj = JSON.parse(item);
    } catch (e) {
        mangaObj = item;
    }

    if (isEmptyObject(mangaObj))
        mangaObj = null;

    let mangaUrl = document.URL;
    let mangaCode = mangaUrl.substring(mangaUrl.indexOf("manga-") + 6);

    console.log("OBJECT IN FOLLOW SCRIPT" + mangaObj);

    if (button.innerText == "Follow") {
        console.log("WENT FOLLOW");

        if (mangaObj == null) {
            console.log("OBJECT IS NULL");
            mangaObj = [];
            newManga = await getMangaObject();
            mangaObj.push(newManga);
            await setItem(key, JSON.stringify(mangaObj));
            button.innerText = "UnFollow";
            return;
        }

        console.log("object before push" + mangaObj);
        newManga = await getMangaObject();
        mangaObj.push(newManga);
        console.log("object after push" + mangaObj);
        await setItem(key, JSON.stringify(mangaObj));
        button.innerText = "UnFollow";
    } else if (button.innerText == "UnFollow") {
        console.log("WENT UNFOLLOW");

        if (mangaObj != null) {
            const indexOfObject = mangaObj.findIndex(object => {
                return object.mangaCode === mangaCode;
            });
            console.log("NEW index with find func => " + indexOfObject);
            console.log("index of manga : " + JSON.stringify(mangaObj).indexOf(mangaCode))
            console.log(mangaObj);
            mangaObj.splice(indexOfObject, 1)
            console.log("MANGA obj after delete => " + mangaObj);
        }
        setItem(key, JSON.stringify(mangaObj));
        button.innerText = "Follow";
    }
    console.log(mangaObj);
}

async function checkIfFollowedMangaCode(MangaCode) {
    let mangaObj;
    let object = await getItem(key);

    try {
        mangaObj = JSON.parse(object);
    } catch (e) {
        mangaObj = object;
    }

    if (isEmptyObject(mangaObj))
        mangaObj = null;

    // Loop in mangaObj and check if mangacode is present
    let length = mangaObj.length

    for (let i = 0; i < length; i++) {
        if (mangaObj[i].mangaCode == MangaCode) {
            delete mangaObj;
        }
    }
    return mangaObj;

}

async function checkIfFollowedUrl() {
    let mangaUrl = document.URL;
    let mangaCode = mangaUrl.substring(mangaUrl.indexOf("manga-") + 6);
    let item = JSON.stringify(await getItem(key));
    let object;
    console.log("[CHECK IF FOLLWOW MANGA FOUND] -> " + mangaCode);
    console.log("[CHECK IF FOLLWOW ITEM] -> " + item);

    if (item != undefined && item.length > 0) {
        object = JSON.parse(item)
        console.log("[CHECK IF FOLLWOW OBJECT FOUND]-> " + object);
    } else
        return false;

    return (object.indexOf(mangaCode) != -1 ? true : false)
}

async function onPageLoad() {
    let followMangasObject = await checkIfFollowedUrl();
    console.log("FOLLOW MANGA FUNC RES = " + followMangasObject);

    if (followMangasObject) {
        addButton("UnFollow");
    } else {
        addButton("Follow");
    }
}

onPageLoad();