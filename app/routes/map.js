
/*
 * GET map page.
 */

exports.index = function(req, res) {
  res.render('map', {
      title: 'Page Carte des bornes'
    });
};