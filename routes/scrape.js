const express = require('express'),
      cheerio = require('cheerio'),
      rp = require('request-promise'),
      router = express.Router(),
      db = require('../models');

router.get("/newArticles", function(req, res) {
  const options = {
    uri: 'https://www.lemonde.fr/economie',
    transform: function (body) {
        return cheerio.load(body);
    }
  };
  db.Article
    .find({})
    .then((savedArticles) => {
      let savedHeadlines = savedArticles.map(article => article.headline);
        rp(options)
        .then(function ($) {
          let newArticleArr = [];
          $('#river section').each((i, element) => {
            console.log('e', $(element).find('h3.teaser__title').text().trim());
            let newArticle = new db.Article({
              storyUrl: $(element).find('a.teaser__link ').attr('href'),
              headline: $(element).find('h3.teaser__title').text().trim(),
              summary : $(element).find('p.teaser__desc').text().trim(),
              imgUrl  : $(element).find('img.teaser__media').attr('data-src'),
              byLine  : $(element).find('span.meta__date').text().trim()
            });
            if (newArticle.storyUrl) {
              if (!savedHeadlines.includes(newArticle.headline)) {
                newArticleArr.push(newArticle);
              }
            }
          });
          db.Article
            .create(newArticleArr)
            .then(result => res.json({count: newArticleArr.length}))
            .catch(error => {});
        })
        .catch(error => console.log(error));
    })
    .catch(error => console.log(error));
});

module.exports = router;
