$(function() {
  $("#howell-dropdown").click(howellDropdown);
  $("#add-howell-pair-button").click(addHowellPair);
  $("#remove-howell-pair-button").click(removeHowellPair);
});

function howellDropdown() {
  $("#howell-pairs").removeClass("hidden");
  $("#mitchell-pairs").addClass("hidden");
  $(".mitchell-ns-pair").children(".form-control").prop("disabled", true);
  $(".mitchell-ew-pair").children(".form-control").prop("disabled", true);
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
  var pairs = [];
  var num_pairs = $(".howell-pair").length;
  for (var i = 1; i <= num_pairs; i++) {
    var pair = $("#howell-pair" + i).val();
    pairs.push(new Pair(i, pair));
  }

  var number_boards_per_table = $('#boards-per-table').text().trim();
  var total_number_of_boards = number_boards_per_table * pairs.length;

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
  var pairs = [];
  var i = 1;
  for (var pair = retrievedEvent.pairs[i]; typeof pair != 'undefined'; pair = retrievedEvent.pairs[++i] ) {
    pairs.push(new Pair(i, pair.pair));
  }

  var number_boards_per_table = retrievedEvent.boardsPerTable;
  var total_number_of_boards = number_boards_per_table * pairs.length;

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

  fillCompletedRows(retrievedEvent);
}

function updateHowellFinalScores() {
  $("#final_score_tables_div").empty();
  $("#final_score_tables_div").append("<div class='scoring-div'><h3 class='bold'>Scores</h3>" + createHowellMatchPointTable(true) + "</div>");
  $("#final_score_tables_div").append("<div class='scoring-div side-by-side'><h3 class='bold'>Ranking</h3>" + createHowellRankingTable(true) + "</div>");
}

function createHowellMatchPointTable() {
  var num_pairs = Object.keys(thisEvent.pairs).length;
  // TODO check this.  high score could vary between ns and ew
  var single_hand_high_score = (Math.trunc(num_pairs / 2) - 1) * 2;

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
      if (board.ns_matchpoints === undefined || board.ew_matchpoints === undefined)  {
        matchpoint_table += "<td> </td>";
        continue;
      }

      // if this pair skipped this board, put a hyphen
      var board_matchpoints;
      if (board.ns_matchpoints[pair] !== undefined) {
        board_matchpoints = board.ns_matchpoints[pair];
      } else if (board.ew_matchpoints[pair] !== undefined) {
        board_matchpoints = board.ew_matchpoints[pair]
      } else {
        matchpoint_table += "<td>-</td>";
        continue;
      }

      number_of_hands_played++;
      total_matchpoints += board_matchpoints;
      matchpoint_table += "<td>" + board_matchpoints + "</td>";
    }

    var names = thisEvent.pairs[pair].pair;
    var best_possible_score = single_hand_high_score * number_of_hands_played;
    var score = best_possible_score == 0 ? ((total_matchpoints / best_possible_score) * 100).toFixed(2);
    matchpoint_table += "<td class='black-border-sides'>" + total_matchpoints + "</td><td class='black-border-right'>" + score + "%</td><td>" + names + "</td></tr>";
  }

  return matchpoint_table += "</table>";
}

function createHowellRankingTable() {
  var num_pairs = Object.keys(thisEvent.pairs).length;
  // TODO check this.  high score could vary between ns and ew
  var single_hand_high_score = (Math.trunc(num_pairs / 2) - 1) * 2;
  var final_scores = {};

  for (var pair = 1; pair <= num_pairs; pair++) {
    var total_matchpoints = 0;
    var number_of_hands_played = 0;

    for (var board_index = 0; board_index < thisEvent.boards.length; board_index++) {
      // if scores not entered for this board yet, no score

      var board = thisEvent.boards[board_index];
      if (board.ns_matchpoints === undefined && board.ew_matchpoints === undefined) {
        continue;
      }

      var board_matchpoints;
      if (board.ns_matchpoints[pair] !== undefined) {
        number_of_hands_played++;
        total_matchpoints += board.ns_matchpoints[pair];
      } else if (board.ew_matchpoints[pair] !== undefined) {
        number_of_hands_played++;
        total_matchpoints += board.ew_matchpoints[pair]
      } else {
        continue;
      }
    }

    var best_possible_score = single_hand_high_score * number_of_hands_played;
    final_scores[pair] = best_possible_score == 0 ? 0 : (total_matchpoints / best_possible_score) * 100;
  }

  var final_scores_sorted = sortByValue(final_scores);
  var rankings_table = "<table><tr class='thick-border-bottom'><th class='small-fixed-col'>Rank</th><th class='med-fixed-col'>%</th><th>Pair</th></tr>";

  for (var i = 0; i < final_scores_sorted.length; i++) {
    var pair_num = final_scores_sorted[i][0];
    var score = final_scores_sorted[i][1].toFixed(2);
    var names = thisEvent.pairs[pair_num].pair;

    var border_bottom = "";
    if ((i + 1) === final_scores_sorted.length) {
      border_bottom = " class='border-bottom'";
    }
    rankings_table += "<tr" + border_bottom + "><td class='small-fixed-col black-border-right'>" + (i + 1) + "</td><td class='med-fixed-col black-border-right'>" + score + "%</td><td>" + pair_num + " / " + names + "</td></tr>";
  }
  rankings_table += "</table>";

  return rankings_table;
}
