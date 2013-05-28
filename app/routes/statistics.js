
/*
 * GET statistics page.
 */

exports.index = function(req, res) {
  res.render('statistics', {
      title: 'Page Statistiques'
    });
};