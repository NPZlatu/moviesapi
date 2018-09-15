const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const app = express();
let quizes = { overall: [], names: [], dialogues: [], pictures: [] };
let hindiQuizes = { overall: [], names: [], dialogues: [], stars: [] };

const createQuizArray = function() {
    const names = quizes.names;
    const dialogues = quizes.dialogues;
    const pictures = quizes.pictures;
    for (let i = 0; i < names.length; i++) {
        let obj = {};
        obj.name = names[i];
        obj.dialogue = dialogues[i];
        obj.picture = pictures[i];
        quizes.overall.push(obj);
    }
};

app.get("/hindi", function(req, res) {
    let page = req.params.index;
    page = 2;
    url = "https://www.filmyquotes.com/categories/comedy/" + page;
    request(url, function(error, response, html) {
        if (!error) {
            const $ = cheerio.load(html);
            $("h5.card-title").each(function(i, elem) {
                hindiQuizes.dialogues.push($(elem).text());
            });
            $(".badge.badge-primary.ml-1").each(function(i, elem) {
                hindiQuizes.names.push($(elem).text());
            });
            $(".badge.badge-primary.ml-2").each(function(i, elem) {
                hindiQuizes.stars.push($(elem).text());
            });
        }
    });
});

app.get("/quiz", function(req, res) {
    url =
        "https://www.hollywoodreporter.com/lists/best-movie-quotes-hollywoods-top-867142/item/love-means-never-having-say-867171";
    request(url, function(error, response, html) {
        if (!error) {
            const $ = cheerio.load(html);
            $(".list-item").each(function(i, liElem) {
                const $child = cheerio.load(liElem);
                $child(".list-item__title").each(function(i, eleDialogue) {
                    let dialogue = $(eleDialogue).text();
                    quizes.dialogues.push($(eleDialogue).text());
                });

                $child(".list-item__deck").each(function(i, elemMovie) {
                    let movieWithDate = $(elemMovie).text();
                    let movieArr = movieWithDate.split(",");
                    quizes.names.push(movieArr[0]);
                });

                $child(".list-media__image.main-media__image").each(function(
                    i,
                    picture
                ) {
                    let src = $(picture).attr("data-src");
                    if (!src) src = $(picture).attr("src");
                    quizes.pictures.push(src);
                });
            });
            createQuizArray();
            res.send(quizes);
        }
    });
});

app.listen(process.env.PORT || 5000);

console.log("Magic happens on port 8081");
exports = module.exports = app;
