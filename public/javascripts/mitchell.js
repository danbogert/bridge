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

function updateMitchellFinalScores() {
  $("#final_score_tables_div").empty();
  $("#final_score_tables_div").append("<div class='scoring-div'><h3 class='bold'>North/South Scores</h3>" + createMitchellMatchPointTable(true) + "</div>");
  $("#final_score_tables_div").append("<div class='scoring-div'><h3 class='bold'>East/West Scores</h3>" + createMitchellMatchPointTable(false) + "</div>");
  $("#final_score_tables_div").append("<div class='scoring-div side-by-side'><h3 class='bold'>North/South Ranking</h3>" + createMitchellRankingTable(true) + "</div>");
  $("#final_score_tables_div").append("<div class='scoring-div side-by-side right'><h3 class='bold'>East/West Ranking</h3>" + createMitchellRankingTable(false) + "</div>");
}

function createMitchellMatchPointTable(ns) {

  var num_pairs = ns ? Object.keys(thisEvent.ns_pairs).length : Object.keys(thisEvent.ew_pairs).length;
  var single_hand_high_score = (thisEvent.boards[0].hands.length - 1) * 2;

  var matchpoint_table = "<table><tr class='thick-border-bottom'><th class='small-fixed-col'>Pair</th>";
  for (var i = 1; i <= thisEvent.boards.length; i++) {
    matchpoint_table += "<th>" + i + "</th>";
  }
  matchpoint_table += "<th class='small-fixed-col'>Total</th><th class='med-fixed-col'>%</th><th class='large-fixed-col'>Name</th></tr>";

  for (var pair = 1; pair <= num_pairs; pair++) {
    var number_of_hands_played = 0;
    var border_bottom = "";
    if (pair === num_pairs) {
      border_bottom = " class='border-bottom'";
    }
    matchpoint_table += "<tr" + border_bottom + "><td class='black-border-right'>" + pair + "</td>";

    var total_matchpoints = 0;
    for (var board_index = 0; board_index < thisEvent.boards.length; board_index++) {
      // if scores not entered for this board yet, just put an empty space
      var board = thisEvent.boards[board_index];
      if ((ns && board.ns_matchpoints === undefined) || (!ns && board.ew_matchpoints === undefined))  {
        matchpoint_table += "<td> </td>";
        continue;
      }

      // if this pair skipped this board, put a hyphen
      var board_matchpoints = ns ? board.ns_matchpoints[pair] : board.ew_matchpoints[pair];
      if (board_matchpoints === undefined) {
        matchpoint_table += "<td>-</td>";
        continue;
      }

      number_of_hands_played++;
      total_matchpoints += board_matchpoints;
      matchpoint_table += "<td>" + board_matchpoints + "</td>";
    }

    var names = ns ? thisEvent.ns_pairs[pair].pair : thisEvent.ew_pairs[pair].pair;
    var best_possible_score = single_hand_high_score * number_of_hands_played;
    matchpoint_table += "<td class='black-border-sides'>" + total_matchpoints + "</td><td class='black-border-right'>" + ((total_matchpoints / best_possible_score) * 100).toFixed(2) + "%</td><td>" + names + "</td></tr>";
  }

  return matchpoint_table += "</table>";
}

function createMitchellRankingTable(ns) {
  var num_pairs = ns ? Object.keys(thisEvent.ns_pairs).length : Object.keys(thisEvent.ew_pairs).length;
  var single_hand_high_score = (thisEvent.boards[0].hands.length - 1) * 2;
  var final_scores = {};

  for (var pair = 1; pair <= num_pairs; pair++) {
    var total_matchpoints = 0;
    var number_of_hands_played = 0;

    for (var board_index = 0; board_index < thisEvent.boards.length; board_index++) {
      // if scores not entered for this board yet, no score
      var board = thisEvent.boards[board_index];
      if ((ns && board.ns_matchpoints === undefined) || (!ns && board.ew_matchpoints === undefined))  {
        continue;
      }

      // if this pair skipped this board, no score
      var board_matchpoints = ns ? board.ns_matchpoints[pair] : board.ew_matchpoints[pair];
      if (board_matchpoints === undefined) {
        continue;
      }

      number_of_hands_played++;
      total_matchpoints += board_matchpoints;
    }

    var best_possible_score = single_hand_high_score * number_of_hands_played;
    final_scores[pair] = (total_matchpoints / best_possible_score) * 100;
  }

  var final_scores_sorted = sortByValue(final_scores);
  var rankings_table = "<table><tr class='thick-border-bottom'><th class='small-fixed-col'>Rank</th><th class='med-fixed-col'>%</th><th>Pair</th></tr>";

  for (var i = 0; i < final_scores_sorted.length; i++) {
    var pair_num = final_scores_sorted[i][0];
    var score = final_scores_sorted[i][1].toFixed(2);
    var names = ns ? thisEvent.ns_pairs[pair_num].pair : thisEvent.ew_pairs[pair_num].pair;

    var border_bottom = "";
    if ((i + 1) === final_scores_sorted.length) {
      border_bottom = " class='border-bottom'";
    }
    rankings_table += "<tr" + border_bottom + "><td class='small-fixed-col black-border-right'>" + (i + 1) + "</td><td class='med-fixed-col black-border-right'>" + score + "%</td><td>" + pair_num + " / " + names + "</td></tr>";
  }
  rankings_table += "</table>";

  return rankings_table;
}
