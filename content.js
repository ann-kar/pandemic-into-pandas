chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.message === "words") {
            words();
        } else if (request.message === "contents") {
            contents();
        }
    });

chrome.storage.onChanged.addListener(function (changes) {

    for (const key in changes) {
        const storageChange = changes[key];
        switch (storageChange.newValue) {
            case "words" :
                location.reload();
                words();
                break;
            case "contents" :
                location.reload();
                contents();
                break;
            case "undefined" :
                location.reload();
                break;
        }
    }
});

chrome.storage.local.get(null, function (result) {
    if (result.option === "words") {
        words();
    } else if (result.option === "contents") {
        contents();
    }
});

function words() {

    const texts = document.querySelectorAll("h1, h2, p, a, strong, span, div");

    const data = [
        {was: "zakaże", is: "objedze"},
        {was: "zakażon", is: "objedzon"},
        {was: "szczepie", is: "karmie"},
        {was: "obostrze", is: "drzema"},
        {was: "covid-19", is: "PANDIX"},
        {was: "covid", is: "PANDIX"},
        {was: "covidow", is: "pandowat"},
        {was: "koronawirus", is: "bambus"},
        {was: "wirus", is: "bambus"},
        {was: "pandemiczn", is: "pandowat"},
        {was: "pandemie", is: "pandy"},
        {was: "pandemii", is: "pandowatej"},
        {was: "pandemi", is: "pand"},
    ];

    function replace(word, fragment, newFragment) {

        let myWord = word.split("");
        let re = new RegExp(fragment, "gi");
        let tag = new RegExp("<.*" + fragment + ".*>", "gi");

        // safeguard for trigger words placed inside tags

        if (word.match(tag)) {

            let tagStart = word.indexOf("<");
            let tagEnd = word.indexOf(">") + 1;
            let firstPart = word.split("").splice(0, tagStart).join("");
            let secondPart = word.split("").splice(tagStart, tagEnd).join("");
            let thirdPart = word.split("").splice(tagEnd).join("");
            return createNewFragment(firstPart) + secondPart + createNewFragment(thirdPart);

        } else {
            myWord.splice(word.search(re), fragment.length, newFragment);
        }

        return myWord.join("")
    }

    function createNewFragment(test) {
        let output = test.split(" ").map(word => {
            for (let i = 0; i < data.length; i++) {
                if (word.toLowerCase().includes(data[i]["was"])) {
                    return replace(word, data[i]["was"], data[i]["is"]);
                }
            }
            return word;
        });
        return output.join(" ");
    }

    for (const el of texts) {
        el.innerHTML = createNewFragment(el.innerHTML);
    }
}

function contents() {

    function chooseFacts() {

        const facts = [
            "Panda wielka ma 40 zębów.",
            "Pandy wielkie zwykle żyją samotnie.",
            "Pandy są wspaniałe.",
            "Dorosła panda w ciągu jednego dnia defekuje około 100 razy.",
            "Blisko 60% samców pand nie wykazuje żadnego popędu seksualnego.",
            "Dawniej pandy były symbolem pokoju w Chinach.",
            "Samice pand owulują tylko raz w roku.",
            "Panda wielka potrafi wspinać się na drzewa, kłusować i galopować.",
            "Pandy są w stanie rozpędzić się do 32km/h.",
            "Nowo narodzona panda waży mniej niż telefon komórkowy.",
            "Zachodnie państwa dowiedziały się o istnieniu pand dopiero w 1869 roku.",
            "W środowisku naturalnym pandy żyją około 20 lat.",
            "Pandy wielkie jedzą nawet do 40 kg bambusa dziennie."
        ];

        let index = Math.floor(Math.random() * facts.length);
        return facts[index];
    }

    const triggers = [
        "infekcj", "zachor", "przyłbic", "maseczk", "kwarantann", "wirus", "koronawirus",
        "kornawirus", "obostrze", "restrykcj", "pandemi", "lockdown", "epidemi", "zaraz", "corona", "covid",
        "respirator", "zakażeń", "zakażeni", "szczepi", "astra", "pfizer", "moderna",
        "pielęgnia", "teleporad", "szpital", "zmarli", "zmarłych", "zgon", "karetk", "karetek",
        "pacjent", "rezyden", "zabieg", "test", "amantadyn"
    ];

    const texts = document.querySelectorAll("a, li, p, div, h1, h2, h3, h4, h5, h6, span, strong, b, i, u, td, article, aside, caption");

    // 1. change text inside childless elements

    for (const el of texts) {

        if (el.innerText.length && !(el.children.length) &&
            triggers.some(trigger => el.innerText.toLowerCase().includes(trigger)) ||
            el.innerText.length && !(el.children.length) && el.href &&
            triggers.some(trigger => el.href.toLowerCase().includes(trigger)) ||
            el.innerText.length && !(el.children.length) && el.alt &&
            triggers.some(trigger => el.alt.toLowerCase().includes(trigger))
        ) {
            if (el.innerText.length < 40) {el.innerText = "Pandy <3"} else {el.innerText = chooseFacts()}
        }
    }

    // 2. change visual content

    const images = document.querySelectorAll("img, amp-img, source, video, picture");

    for (const el of images) {
        if ((el.getAttribute("alt"))
            && (triggers.some(trigger => el.alt.toLowerCase().includes(trigger)))) {
            el.dataset.src = "https://images6.fanpop.com/image/photos/41400000/Happy-Panda-pandas-41453447-436-282.png"
            el.src = "https://images6.fanpop.com/image/photos/41400000/Happy-Panda-pandas-41453447-436-282.png"
            el.srcset = "https://images6.fanpop.com/image/photos/41400000/Happy-Panda-pandas-41453447-436-282.png"
        }
    }

    // 3. change texts inside bigger blocks on triggering topics

    const parents = document.querySelectorAll("a[href], div, article, aside");

    for (const parent of parents) {

        if (triggers.some(trigger => parent.innerText.toLowerCase().includes(trigger)) ||
            triggers.some(trigger => parent.href.toLowerCase().includes(trigger)) ||
            (triggers.some(trigger => parent.title.toLowerCase().includes(trigger)))) {

            if (!parent.children.length) {
                parent.innerText = chooseFacts();
            } else {
                for (const child of parent.children) {
                    checkChildren(child);
                }
            }
        }
    }

    function checkChildren(child) {
        if (!child.children.length) {
            if (child.innerText.length) {
                child.innerText = chooseFacts();
            } else if (child.tagName && child.tagName === "IMG") {
                child.dataset.src = "https://images6.fanpop.com/image/photos/41400000/Happy-Panda-pandas-41453447-436-282.png"
                child.src = "https://images6.fanpop.com/image/photos/41400000/Happy-Panda-pandas-41453447-436-282.png"
                child.srcset = "https://images6.fanpop.com/image/photos/41400000/Happy-Panda-pandas-41453447-436-282.png"
                if (child.previousElementSibling.tagName && child.previousElementSibling.tagName === "SOURCE") {
                    child.previousElementSibling.remove()
                }
            }
        } else {
            for (const grandchild of child.children) {
                checkChildren(grandchild);
            }
        }
    }
}