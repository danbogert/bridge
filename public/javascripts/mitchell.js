$(function() {
  $("#mitchell-dropdown").click(mitchellDropdown);
  $("#add-mitchell-ns-pair-button").click(addNorthSouthPair);
  $("#remove-mitchell-ns-pair-button").click(removeNorthSouthPair);
  $("#add-mitchell-ew-pair-button").click(addEastWestPair);
  $("#remove-mitchell-ew-pair-button").click(removeEastWestPair);
});

function mitchellDropdown() {
  $("#mitchell-pairs").removeClass("hidden");
  $("#howell-pairs").addClass("hidden");
  $(".mitchell-ns-pair").children(".form-control").prop("disabled", false);
  $(".mitchell-ew-pair").children(".form-control").prop("disabled", false);
  $(".howell-pair").children(".form-control").prop("disabled", true);
}

function addNorthSouthPair() {
  var nextId = $(".mitchell-ns-pair").length + 1;
  $("<label id='mitchell-ns-pair" + nextId + "-label' for='mitchell-ns-pair" + nextId + "' class='col-sm-2 form-control-label'>Pair " + nextId + "</label>" +
    "<div class='col-sm-10 pair mitchell-ns-pair' id='mitchell-ns-pair" + nextId + "-div'>" +
      "<input type='text' class='form-control' id='mitchell-ns-pair" + nextId + "' placeholder='Pair " + nextId + "' required>" +
    "</div>").insertBefore($("#add-mitchell-ns-pair-button"));

    $("#remove-mitchell-ns-pair-button").removeClass("hidden");
}

function removeNorthSouthPair() {
  var idToRemove = $(".mitchell-ns-pair").length;
  $("#mitchell-ns-pair" + idToRemove + "-label").remove();
  $("#mitchell-ns-pair" + idToRemove + "-div").remove();

  if (idToRemove <= 2) {
    $("#remove-mitchell-ns-pair-button").addClass("hidden");
  }
}

function addEastWestPair() {
  var nextId = $(".mitchell-ew-pair").length + 1;
  $("<label id='mitchell-ew-pair" + nextId + "-label' for='mitchell-ew-pair" + nextId + "' class='col-sm-2 form-control-label'>Pair " + nextId + "</label>" +
    "<div class='col-sm-10 pair mitchell-ew-pair' id='mitchell-ew-pair" + nextId + "-div'>" +
      "<input type='text' class='form-control' id='mitchell-ew-pair" + nextId + "' placeholder='Pair " + nextId + "' required>" +
    "</div>").insertBefore($("#add-mitchell-ew-pair-button"));

    $("#remove-mitchell-ew-pair-button").removeClass("hidden");
}

function removeEastWestPair() {
  var idToRemove = $(".mitchell-ew-pair").length;
  $("#mitchell-ew-pair" + idToRemove + "-label").remove();
  $("#mitchell-ew-pair" + idToRemove + "-div").remove();

  if (idToRemove <= 2) {
    $("#remove-mitchell-ew-pair-button").addClass("hidden");
  }
}

function createMitchellEvent() {
  var ns_pairs = [];
  var number_ns_pairs = $(".mitchell-ns-pair").length;
  for (var i = 1; i <= number_ns_pairs; i++) {
    var pair = $("#mitchell-ns-pair" + i).val();
    ns_pairs.push(new Pair(i, pair));
  }

  var ew_pairs = [];
  var number_ew_pairs = $(".mitchell-ew-pair").length;
  for (var i = 1; i <= number_ew_pairs; i++) {
    var pair = $("#mitchell-ew-pair" + i).val();
    ew_pairs.push(new Pair(i, pair));
  }

  var number_boards_per_table = $('#boards-per-table').text().trim();
  var number_of_tables = Math.max(number_ns_pairs, number_ew_pairs);
  var total_number_of_boards = number_boards_per_table * number_of_tables;

  var boards = createBoards(total_number_of_boards, EventType.MITCHELL, ns_pairs);

  thisEvent = new BridgeEvent(EventType.MITCHELL, boards);
  thisEvent.ns_pairs = createPairsLookupMap(ns_pairs);
  thisEvent.ew_pairs = createPairsLookupMap(ew_pairs);
  thisEvent.boardsPerTable = number_boards_per_table;

  createScoringAccordion();

  $(".dropdown-menu li a").click(function() {
    $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
  });

  $('.selectpicker').selectpicker({
    style: 'btn-default',
    width: '100%',
  });

  $("#cover-page").hide();
  $("#masthead").show();

  cleanNewEventModal();

  localStorage.setItem('bridgeEvent', JSON.stringify(thisEvent));
}

function createPartialMitchellEvent(retrievedEvent) {
  var ns_pairs = [];
  var i = 1;
  for (var pair = retrievedEvent.ns_pairs[i]; typeof pair != 'undefined'; pair = retrievedEvent.ns_pairs[++i] ) {
    var ns_pair = retrievedEvent.ns_pairs[i].pair;
    ns_pairs.push(new Pair(i, ns_pair));
  }

  var ew_pairs = [];
  i = 1;
  for (var pair = retrievedEvent.ew_pairs[i]; typeof pair != 'undefined'; pair = retrievedEvent.ew_pairs[++i] ) {
    var ew_pair = retrievedEvent.ew_pairs[i].pair;
    ew_pairs.push(new Pair(i, ew_pair));
  }

  var number_boards_per_table = retrievedEvent.boardsPerTable;
  var number_of_tables = Math.max(ns_pairs.length, ew_pairs.length);
  var total_number_of_boards = number_boards_per_table * number_of_tables;

  var boards = createBoards(total_number_of_boards, EventType.MITCHELL, ns_pairs);

  thisEvent = new BridgeEvent(retrievedEvent.eventType, boards);
  thisEvent.ns_pairs = createPairsLookupMap(ns_pairs);
  thisEvent.ew_pairs = createPairsLookupMap(ew_pairs);
  thisEvent.boardsPerTable = number_boards_per_table;

  createScoringAccordion();

  $(".dropdown-menu li a").click(function() {
    $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
  });

  $('.selectpicker').selectpicker({
    style: 'btn-default',
    width: '100%',
  });

  $("#cover-page").hide();
  $("#masthead").show();

  cleanNewEventModal();

  fillCompletedRows(retrievedEvent);
}
