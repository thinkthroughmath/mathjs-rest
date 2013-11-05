var expr1 = document.getElementById('expr1'),
    expr2 = document.getElementById('expr2'),
    link = document.getElementById('link'),
    post = document.getElementById('post');

expr1.oninput = function () {
  var url = '/v1/' + encodeURIComponent(expr1.value);
  link.href = url;
  link.innerHTML = url;
};
expr1.oninput();


post.onclick = function () {
  var expr = expr2.value;

  $.ajax({
    type: 'POST',
    url: '/v1/?precision=5',
    data: expr,
    contentType: 'text/plain',
    success: function (result) {
      alert(result)
    },
    error: function (resp) {
      alert(resp.responseText)
    }
  });
};
