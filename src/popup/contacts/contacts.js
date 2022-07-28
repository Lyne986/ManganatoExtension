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
        // case "About":
        //     window.location.href = './about/about.html'
        //     break;
        default:
            break;
    }
}