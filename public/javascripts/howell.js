$(function() {
  $("#howell-dropdown").click(howellDropdown);
  $("#add-howell-pair-button").click(addHowellPair);
  $("#remove-howell-pair-button").click(removeHowellPair);
});

function howellDropdown() {
  $("#howell-pairs").removeClass("hidden");
  $("#mitchell-pairs").addClass("hidden");
  $(".ns-pair").children(".form-control").prop("disabled", true);
  $(".ew-pair").children(".form-control").prop("disabled", true);
  $(".howell-pair").children(".form-control").prop("disabled", false);
}

function addHowellPair() {
  var nextId = $(".howell-pair").length + 1;
  $("<label id='howell-pair" + nextId + "-label' for='howell-pair" + nextId + "' class='col-sm-2 form-control-label'>Pair " + nextId + "</label>" +
    "<div class='col-sm-10 pair howell-pair' id='howell-pair" + nextId + "-div'>" +
      "<input type='text' class='form-control' id='howell-pair" + nextId + "' placeholder='Pair " + nextId + "' required>" +
    "</div>").insertBefore($("#add-howell-pair-button"));

  $("#remove-howell-pair-button").removeClass("hidden");
}

function removeHowellPair() {
  var idToRemove = $(".howell-pair").length;
  $("#howell-pair" + idToRemove + "-label").remove();
  $("#howell-pair" + idToRemove + "-div").remove();

  if (idToRemove <= 2) {
    $("#remove-howell-pair-button").addClass("hidden");
  }
}

function createHowellEvent() {
  // TODO
  var pairs = [];
  var num_pairs = $(".howell-pair").length;
  for (var i = 1; i <= num_pairs; i++) {
    var pair = $("#howell-pair" + i).val();
    pairs.push(new Pair(i, pair));
  }

  var number_boards_per_table = $('#boards-per-table').text().trim();
  var number_of_tables = Math.trunc(num_pairs / 2);
  var total_number_of_boards = number_boards_per_table * number_of_tables;

  var boards = createBoards(total_number_of_boards, EventType.HOWELL, pairs);

  thisEvent = new BridgeEvent(EventType.HOWELL, boards);
  thisEvent.pairs = createPairsLookupMap(pairs);
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

function createPartialHowellEvent(retrievedEvent) {
  // TODO
  // var ns_pairs = [];
  // var i = 1;
  // for (var pair = retrievedEvent.ns_pairs[i]; typeof pair != 'undefined'; pair = retrievedEvent.ns_pairs[++i] ) {
  //   var ns_pair = retrievedEvent.ns_pairs[i].north;
  //   ns_pairs.push(new Pair(i, ns_pair));
  // }
  //
  // var ew_pairs = [];
  // i = 1;
  // for (var pair = retrievedEvent.ew_pairs[i]; typeof pair != 'undefined'; pair = retrievedEvent.ew_pairs[++i] ) {
  //   var ew_pair = retrievedEvent.ew_pairs[i].pair;
  //   ew_pairs.push(new Pair(i, ew_pair));
  // }
  //
  // var number_boards_per_table = retrievedEvent.boardsPerTable;
  // var number_of_tables = Math.max(ns_pairs.length, ew_pairs.length);
  // var total_number_of_boards = number_boards_per_table * number_of_tables;
  //
  // var boards = createBoards(total_number_of_boards, EventType.HOWELL, pairs);
  //
  // thisEvent = new BridgeEvent(retrievedEvent.eventType, boards);
  // thisEvent.ns_pairs = createPairsLookupMap(ns_pairs);
  // thisEvent.ew_pairs = createPairsLookupMap(ew_pairs);
  // thisEvent.boardsPerTable = number_boards_per_table;
  //
  // createScoringAccordion();
  //
  // $(".dropdown-menu li a").click(function() {
  //   $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
  // });
  //
  // $('.selectpicker').selectpicker({
  //   style: 'btn-default',
  //   width: '100%',
  // });
  //
  // $("#cover-page").hide();
  // $("#masthead").show();
  //
  // cleanNewEventModal();
  //
  // fillCompletedRows(retrievedEvent);
}
