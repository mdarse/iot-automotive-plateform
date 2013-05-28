
/*
 * GET settings page.
 */

exports.index = function(req, res) {
  res.render('settings', {
      title: 'Page Réglages'
    });
};