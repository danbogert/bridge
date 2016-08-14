$(function() {
  $('#inputDate').datepicker();

  $(".dropdown-menu li a").click(function() {
    $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
    $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
  });

  $("#add-ns-pair-button").click(addNorthSouthPair);
  $("#add-ew-pair-button").click(addEastWestPair);
});

function addNorthSouthPair() {
  var nextId = $(".ns-pair").size() + 1
  $("<label for='ns-pair" + nextId + "' class='col-sm-2 form-control-label'>Pair " + nextId + "</label>" +
    "<div class='col-sm-10 pair ns-pair' id='ns-pair" + nextId + "'>" +
      "<input type='text' class='form-control' id='pair" + nextId + "North' placeholder='North'>" +
      "<input type='text' class='form-control' id='pair" + nextId + "South' placeholder='South'>" +
    "</div>").insertBefore($("#add-ns-pair-button"));
}

function addEastWestPair() {
  var nextId = $(".ew-pair").size() + 1
  $("<label for='ew-pair" + nextId + "' class='col-sm-2 form-control-label'>Pair " + nextId + "</label>" +
    "<div class='col-sm-10 pair ew-pair' id='ew-pair" + nextId + "'>" +
      "<input type='text' class='form-control' id='pair" + nextId + "East' placeholder='East'>" +
      "<input type='text' class='form-control' id='pair" + nextId + "West' placeholder='West'>" +
    "</div>").insertBefore($("#add-ew-pair-button"));
}
