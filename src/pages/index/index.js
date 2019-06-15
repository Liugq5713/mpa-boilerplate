import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import './style.less'
$('#content').html('hello jquery')
console.log('$', $)

$(function () {
  $('.example-popover').popover({
    container: 'body'
  })
})
