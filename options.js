/* options */

var save = function() {
  var status_elt = document.getElementById('status');
  status_elt.textContent = '';

  var order_elt = document.getElementById('order');
  var order_value = order_elt.value;
  var order_array = order_value.split(',');
  for(var i = 0; i < order_array.length; i++)
    order_array[i] = +order_array[i];

  chrome.storage.sync.set({
    orders: order_array
  }, function() {
    status_elt.textContent = order_array.join(',');
  });
};

var restore = function() {
  chrome.storage.sync.get({
    orders: []
  }, function(o) {
    document.getElementById('order').value = o.orders.join(',');
  });
};

document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);
