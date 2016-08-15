<!-- Globals -->
var number_ns_pairs = 1;
var number_ew_pairs = 1;

$(function() {
  $('#date').datepicker();

  $(".dropdown-menu li a").click(function() {
    $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
    $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
  });

  $("#add-ns-pair-button").click(addNorthSouthPair);
  $("#add-ew-pair-button").click(addEastWestPair);
  $("#cancel-event-button").click(cancelEventCreation);
  $("#create-event-button").click(createEvent);

});

function addNorthSouthPair() {
  var nextId = ++number_ns_pairs
  $("<label id='ns-pair" + nextId + "-label' for='ns-pair" + nextId + "' class='col-sm-2 form-control-label'>Pair " + nextId + "</label>" +
    "<div class='col-sm-10 pair ns-pair' id='ns-pair" + nextId + "'>" +
      "<input type='text' class='form-control' id='pair" + nextId + "-north' placeholder='North'>" +
      "<input type='text' class='form-control' id='pair" + nextId + "-south' placeholder='South'>" +
    "</div>").insertBefore($("#add-ns-pair-button"));
}

function addEastWestPair() {
  var nextId = ++number_ew_pairs
  $("<label id='ew-pair" + nextId + "-label' for='ew-pair" + nextId + "' class='col-sm-2 form-control-label'>Pair " + nextId + "</label>" +
    "<div class='col-sm-10 pair ew-pair' id='ew-pair" + nextId + "'>" +
      "<input type='text' class='form-control' id='pair" + nextId + "-east' placeholder='East'>" +
      "<input type='text' class='form-control' id='pair" + nextId + "west' placeholder='West'>" +
    "</div>").insertBefore($("#add-ew-pair-button"));
}

function cancelEventCreation() {
  <!-- Remove Extra North South Pairs -->
  for (i = 2; i <= number_ns_pairs; i++) {
    $("#ns-pair" + i + "-label").remove();
    $("#ns-pair" + i).remove();
  }
  number_ns_pairs = 1;

  <!-- Remove Extra East West Pairs -->
  for (i = 2; i <= number_ew_pairs; i++) {
    $("#ew-pair" + i + "-label").remove();
    $("#ew-pair" + i).remove();
  }
  number_ew_pairs = 1;

  <!-- Clean up remaining inputs -->
  $("#pair1-north").val("");
  $("#pair1-south").val("");
  $("#pair1-east").val("");
  $("#pair1-west").val("");
  // datepicker
  // movement
  // hands per table
}

function createEvent() {
  $("#myModal").modal('toggle')

  var number_of_hands = $('#hands-per-table').text().trim() * number_ns_pairs;

  for (i = 1; i <= number_of_hands; i++) {
    $("#accordion").append(
      "<div class='accordion-scores panel panel-default'>" +
        "<div class='panel-heading' role='tab' id='heading" + i + "'>" +
          "<h4 class='panel-title'>" +
            "<a data-toggle='collapse' data-parent='#accordion' href='#collapse" + i + "' aria-expanded='true' aria-controls='collapse" + i + "'>" +
              "Hand " + i +
            "</a>" +
          "</h4>" +
        "</div>" +
        "<div id='collapse" + i + "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading" + i + "'>" +
          "Content goes here" +
        "</div>" +
      "</div>");
  }

  $("#collapse1").addClass("in")
}
