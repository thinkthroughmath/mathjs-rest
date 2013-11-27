var expr1 = document.getElementById('expr1'),
    expr2 = document.getElementById('expr2'),
    link = document.getElementById('link'),
    post = document.getElementById('post');

expr1.oninput = function () {
  var url = '/v1/?expr=' + encodeURIComponent(expr1.value);
  link.href = url;
  link.innerHTML = 'http://api.mathjs.org' + url;
};
expr1.oninput();


post.onclick = function () {
  var expr = expr2.value;

  $.ajax({
    type: 'POST',
    url: '/v1/',
    data: expr,
    contentType: 'text/plain',
    success: function (result) {
      alert(JSON.stringify(result, null, 2));
    },
    error: function (resp) {
      alert('Error: ' + resp.responseText);
    }
  });
};
