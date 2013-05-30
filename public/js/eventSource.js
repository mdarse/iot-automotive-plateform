if (!!window.EventSource) {
  var source = new EventSource('/stream');

  source.addEventListener('open', function(e) {
    // Connection was opened.
  }, false);

  source.addEventListener('message', function(e) {
    console.log(e.data);
  }, false);

  source.addEventListener('batteryStatusChange', function(e) {
    var data = JSON.parse(e.data);
    console.log(data);
    var level = data.level;
    var isCharging = data.isCharging;
    console.log(level);
    console.log(isCharging);
  }, false);

  source.addEventListener('error', function(e) {
    if (e.readyState == EventSource.CLOSED) {
      // Connection was closed.
    }
  }, false);
    
} else {
  // Result to xhr polling :(
}