const express = require("express");
const cheerio = require("cheerio");
const cors = require("cors");
const app = express();
const request = require("request");
app.use(cors());
let quizes = { overall: [], names: [], dialogues: [], pictures: [] };
let hindiQuizes = { overall: [], names: [], dialogues: [], stars: [] };
let wrongAnswerMemes = [
    "https://media3.giphy.com/media/l396QUa4k8rFVK2xW/200.gif?cid=e1bb72ff5b9e06c5664d704a55609f29",
    "https://media3.giphy.com/media/l0OXWXUHdp4K9nitq/200.gif?cid=e1bb72ff5b9e06c5664d704a55609f29",
    "https://media3.giphy.com/media/l0HlP8UutaaPsauFa/200.gif?cid=e1bb72ff5b9e06c5664d704a55609f29",
    "https://media0.giphy.com/media/fLyfhjZr9g47fTJMuk/200.gif?cid=e1bb72ff5b9e06c5664d704a55609f29",
    "https://media2.giphy.com/media/l2JhLaxhWba6OivE4/200.gif?cid=e1bb72ff5b9e06c5664d704a55609f29",
    "https://media3.giphy.com/media/5Xxsxsnc9rmUw/200.gif?cid=e1bb72ff5b9e06c5664d704a55609f29",
    "https://media0.giphy.com/media/1xH5CTi3BBBM4/200.gif?cid=e1bb72ff5b9e06c5664d704a55609f29",
    "https://media3.giphy.com/media/3ohs7KZJV9es5MIIKI/200.gif?cid=e1bb72ff5b9e06c5664d704a55609f29",
    "https://media3.giphy.com/media/m8eIbBdkJK7Go/200.gif?cid=e1bb72ff5b9e0ba930553973323ce392",
    "https://media3.giphy.com/media/65i9DrU32WOME/200.gif?cid=e1bb72ff5b9e0ba930553973323ce392",
    "https://media0.giphy.com/media/EjkDOwpmLnnwI/200.gif?cid=e1bb72ff5b9e0ba930553973323ce392",
    "https://media2.giphy.com/media/hy7WmbwsNz8wE/200.gif?cid=e1bb72ff5b9e0ba930553973323ce392",
    "https://media2.giphy.com/media/TaoLxEhmJyF0s/200.gif?cid=e1bb72ff5b9e0ba930553973323ce392",
    "https://media0.giphy.com/media/11SJ52YouBaDFS/200.gif?cid=e1bb72ff5b9e0ba930553973323ce392",
    "https://media2.giphy.com/media/hPPx8yk3Bmqys/200.gif?cid=e1bb72ff5b9e0db75178306836f7bf97",
    "https://media3.giphy.com/media/fV2nYFD3akDuTUgVhy/200.gif?cid=e1bb72ff5b9e0db75178306836f7bf97",
    "https://media3.giphy.com/media/BaLLQBjaegqGc/200.gif?cid=e1bb72ff5b9e0db75178306836f7bf97",
    "https://media3.giphy.com/media/3oKIP8quIMUnLdfTAQ/200.gif?cid=e1bb72ff5b9e0db75178306836f7bf97",
    "https://media1.giphy.com/media/gJEWhG3f3zszu/200.gif?cid=e1bb72ff5b9e0db75178306836f7bf97",
    "https://media3.giphy.com/media/3oEduMq533nKRQI3YI/200.gif?cid=e1bb72ff5b9e0db75178306836f7bf97",
    "https://media1.giphy.com/media/l1IY5J4Cfw8JLi40M/200.gif?cid=e1bb72ff5b9e0db75178306836f7bf97",
    "https://media1.giphy.com/media/LFA6Qbj3Z7l4Y/200.gif?cid=e1bb72ff5b9e0db75178306836f7bf97"
];

let rigthAnswerMemes = ["sixth", "seventh", "eight", "night"];

const shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};

const getOptions = function(correctAnswer, obj) {
    let possibleAnswers = obj.names.filter(n => {
        return n != correctAnswer;
    });
    const shuffled = possibleAnswers.sort(() => 0.5 - Math.random());
    let options = shuffled.slice(0, 3);
    options.push(correctAnswer);
    options = shuffleArray(options);
    return options;
};

const createQuizArrayHindi = function() {
    const names = hindiQuizes.names;
    const dialogues = hindiQuizes.dialogues;
    const stars = hindiQuizes.stars;
    for (let i = 0; i < names.length; i++) {
        let obj = {};
        obj.correct_answer = names[i];
        obj.question = dialogues[i];
        obj.star = stars[i];
        obj.possible_answers = getOptions(names[i], hindiQuizes);
        hindiQuizes.overall.push(obj);
    }
};

const createQuizArray = function(movieType) {
    const names = quizes.names;
    const dialogues = quizes.dialogues;
    const pictures = quizes.pictures;
    for (let i = 0; i < names.length; i++) {
        let obj = {};
        obj.correct_answer = names[i];
        obj.question = dialogues[i];
        obj.picture = pictures[i];
        obj.possible_answers = getOptions(names[i], quizes);
        quizes.overall.push(obj);
    }
};

app.get("/hindi", function(req, res) {
    hindiQuizes = { overall: [], names: [], dialogues: [], stars: [] };
    let page = req.params.index;
    page = 1;
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
            $(".customCard .badge.badge-primary.ml-2").each(function(i, elem) {
                hindiQuizes.stars.push($(elem).text());
            });

            createQuizArrayHindi();
            const shuffled = hindiQuizes.overall.sort(
                () => 0.5 - Math.random()
            );
            let selected = shuffled.slice(0, 10);
            res.send(selected);
        }
    });
});

app.get("/quiz", function(req, res) {
    quizes = { overall: [], names: [], dialogues: [], pictures: [] };
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
            const shuffled = quizes.overall.sort(() => 0.5 - Math.random());
            let selected = shuffled.slice(0, 10);

            const shuffledWrongMeme = wrongAnswerMemes.sort(
                () => 0.5 - Math.random()
            );
            res.send({ quiz: selected, wrongAnswerMemes: shuffledWrongMeme });
        }
    });
});

app.listen(process.env.PORT || 5000);

console.log("Magic happens on port 5000");
exports = module.exports = app;
