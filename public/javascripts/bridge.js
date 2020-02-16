"use strict";

class BridgeEvent {
  constructor(eventType, boards) {
    this.eventType = eventType;
    this.boards = boards;
  }
}

class Board {
  constructor(number, dealer, vulnerable, hands) {
    this.number = number;
    this.dealer = dealer;
    this.vulnerable = vulnerable;
    this.hands = hands;
  }
}

class Hand {
  constructor(ns_pair) {
    this.ns_pair = ns_pair;
  }
}

class Pair {
  constructor(number, pair) {
    this.number = number;
    this.pair = pair;
  }
}

var EventType = {
  MITCHELL: 1,
  HOWELL: 2,
};

var Dealer = {
  NORTH: 1,
  SOUTH: 2,
  EAST: 3,
  WEST: 4,
};

var Vulnerable = {
  NONE: 1,
  NS: 2,
  EW: 3,
  ALL: 4,
};

var Suit = {
  DIAMOND: 1,
  CLUB: 2,
  HEART: 3,
  SPADE: 4,
  NO_TRUMP: 5,
}

var thisEvent;

$(function() {
    $(".dropdown-menu li a").click(function() {
      $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
    });

    $("#title_link").click(showCoverPage);
    $("#cancel-event-button").click(cleanNewEventModal);
    $("#create-event-button").click(createEvent);
    $('#print-scores-button').click(printScores);

    var retrievedEvent = JSON.parse(localStorage.getItem('bridgeEvent'));
    if (typeof retrievedEvent !== 'undefined' && retrievedEvent != null) {
      if (retrievedEvent.eventType) {
        createPartialEvent(retrievedEvent);
      } else {
        localStorage.removeItem('bridgeEvent');
        $("#masthead").hide();
      }
    } else {
      $("#masthead").hide();
  }
});

function showCoverPage() {
  $("#masthead").slideUp(1000, "linear");
  $("#accordion").fadeOut(1000, "linear");
  $("#scores-well").fadeOut(1000, "linear");
  sleep(1000).then(() => {
    $("#accordion").empty();
    $("#accordion").show();
    $("#cover-page").show();
  });
}

function cleanNewEventModal() {
  $(".nav li a").blur();

  <!-- Clean the Movement dropdown -->
  $("#movement").html("Movement <span class=\"caret\"></span>");
  $("#mitchell-pairs").addClass("hidden");
  $("#howell-pairs").addClass("hidden");
  $(".mitchell-ns-pair").children(".form-control").prop("disabled", true);
  $(".mitchell-ew-pair").children(".form-control").prop("disabled", true);
  $(".howell-pair").children(".form-control").prop("disabled", true);

  <!-- Clean the boards per table dropdown -->
  $("#boards-per-table").html("5 <span class=\"caret\"></span>");

  <!-- Remove Extra Mitchell North South Pairs -->
  var number_mitchell_ns_pairs = $(".mitchell-ns-pair").length;
  for (var i = 2; i <= number_mitchell_ns_pairs; i++) {
    $("#mitchell-ns-pair" + i + "-label").remove();
    $("#mitchell-ns-pair" + i + "-div").remove();
  }

  <!-- Remove Extra Mitchell East West Pairs -->
  var number_mitchell_ew_pairs = $(".mitchell-ew-pair").length;
  for (var i = 2; i <= number_mitchell_ew_pairs; i++) {
    $("#mitchell-ew-pair" + i + "-label").remove();
    $("#mitchell-ew-pair" + i + "-div").remove();
  }

  <!-- Remove Extra Howell Pairs -->
  var number_howell_pairs = $(".howell-pair").length;
  for (var i = 2; i <= number_howell_pairs; i++) {
    $("#howell-pair" + i + "-label").remove();
    $("#howell-pair" + i + "-div").remove();
  }

  <!-- Clean up remaining inputs -->
  $("#mitchell-ns-pair1").val("");
  $("#mitchell-ew-pair1").val("");
  $("#howell-pair1").val("");
  $("#remove-mitchell-ns-pair-button").addClass("hidden");
  $("#remove-mitchell-ew-pair-button").addClass("hidden");
  $("#remove-howell-pair-button").addClass("hidden");
}

function createEvent() {
  if (!eventInputsValid()) {
    console.log("inputs not valid -- event not created");
    return;
  }

  $("#scores-well").addClass("hidden");
  $("#final_score_tables_div").empty();
  $("#myModal").modal('toggle');
  $(".nav li a").blur();

  if ($("#movement").text().includes("Mitchell")) {
    createMitchellEvent();
  } else {
    createHowellEvent();
  }
}

function createPartialEvent(retrievedEvent) {
  if (retrievedEvent.eventType == EventType.MITCHELL) {
    createPartialMitchellEvent(retrievedEvent);
  } else {
    createPartialHowellEvent(retrievedEvent);
  }
}

function fillCompletedRows(retrievedEvent) {
  for (var i = 0; i < retrievedEvent.boards.length; i++) {
    var board = retrievedEvent.boards[i];
    for (var j = 0; j < board.hands.length; j++) {
      var hand = board.hands[j];

      var board_hand_id = board.number + "-" + j;
      if (hand.ew_pair == "N/A") {
        if (retrievedEvent.eventType == EventType.HOWELL) {
          $("#" + board_hand_id + "-ns").val(hand.ns_pair.number ? hand.ns_pair.number : hand.ns_pair);
        }
        $("#" + board_hand_id + "-ew").val(hand.ew_pair);
      } else {
        if (typeof hand.ew_score == 'undefined') {
          continue;
        }

        if (retrievedEvent.eventType == EventType.HOWELL) {
          $("#" + board_hand_id + "-ns").val(hand.ns_pair.number);
        }
        $("#" + board_hand_id + "-ew").val(hand.ew_pair.number);
        $("#" + board_hand_id + "-contract").val(hand.contract);
        $("#" + board_hand_id + "-by").val(hand.by);
        $("#" + board_hand_id + "-tricks").val(hand.tricks);
      }

      $("#" + board_hand_id + "-form .selectpicker").selectpicker('refresh');

      isRowComplete(board_hand_id);
    }
  }
}

function eventInputsValid() {
  var inputs = $("#myModal input");

  for (var i = 0; i < inputs.length; i++) {
    if (!inputs[i].checkValidity()) {
      return false;
    }
  }

  if ($("#movement").text().includes("Movement")) {
    return false;
  }

  return true;
}

function createPairsLookupMap(pairs) {
  var pairs_map = {};

  for (var i = 0; i < pairs.length; i++) {
    pairs_map[pairs[i].number] = pairs[i];
  }

  return pairs_map;
}

function createBoards(total_number_of_boards, event_type, pairs) {
  var boards = [];

  for (var i = 1; i <= total_number_of_boards; i++) {
    var board_hands = createHands(event_type, pairs);

    var board_number = i;
    while (board_number > 16) {
      board_number -= 16;
    }

    switch (board_number) {
      case 1:
        boards.push(new Board(i, Dealer.NORTH, Vulnerable.NONE, board_hands));
        break;
      case 2:
        boards.push(new Board(i, Dealer.EAST, Vulnerable.NS, board_hands));
        break;
      case 3:
        boards.push(new Board(i, Dealer.SOUTH, Vulnerable.EW, board_hands));
        break;
      case 4:
        boards.push(new Board(i, Dealer.WEST, Vulnerable.ALL, board_hands));
        break;
      case 5:
        boards.push(new Board(i, Dealer.NORTH, Vulnerable.NS, board_hands));
        break;
      case 6:
        boards.push(new Board(i, Dealer.EAST, Vulnerable.EW, board_hands));
        break;
      case 7:
        boards.push(new Board(i, Dealer.SOUTH, Vulnerable.ALL, board_hands));
        break;
      case 8:
        boards.push(new Board(i, Dealer.WEST, Vulnerable.NONE, board_hands));
        break;
      case 9:
        boards.push(new Board(i, Dealer.NORTH, Vulnerable.EW, board_hands));
        break;
      case 10:
        boards.push(new Board(i, Dealer.EAST, Vulnerable.ALL, board_hands));
        break;
      case 11:
        boards.push(new Board(i, Dealer.SOUTH, Vulnerable.NONE, board_hands));
        break;
      case 12:
        boards.push(new Board(i, Dealer.WEST, Vulnerable.NS, board_hands));
        break;
      case 13:
        boards.push(new Board(i, Dealer.NORTH, Vulnerable.ALL, board_hands));
        break;
      case 14:
        boards.push(new Board(i, Dealer.EAST, Vulnerable.NONE, board_hands));
        break;
      case 15:
        boards.push(new Board(i, Dealer.SOUTH, Vulnerable.NS, board_hands));
        break;
      case 16:
        boards.push(new Board(i, Dealer.WEST, Vulnerable.EW, board_hands));
        break;
    }
  }

  return boards;
}

function createHands(event_type, pairs) {
  var board_hands = [];

  if (event_type == EventType.MITCHELL) {
    for (var i = 0; i < pairs.length; i++) {
      board_hands.push(new Hand(pairs[i]));
    }
  } else {
    for (var i = 0; i < Math.round(pairs.length / 2); i++) {
      board_hands.push(new Hand());
    }
  }

  return board_hands;
}

function createScoringAccordion() {
  $("#accordion").empty();

  var boards = thisEvent.boards;
  for (var board_num = 1; board_num <= boards.length; board_num++) {
    $("#accordion").append(
      "<div class='no-margin panel panel-default'>" +
        "<div class='no-margin alert alert-danger clickable' role='tab' id='heading" + board_num + "' data-toggle='collapse' data-parent='#accordion' data-target='#collapse" + board_num + "'>" +
          "<h4 class='panel-title'>" +
            "Board " + board_num +
          "</h4>" +
        "</div>" +
        "<div id='collapse" + board_num + "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading" + board_num + "'>" +
          "<div class='row header row-eq-height'>" +
            "<div class='col-sm-1'><span>N/S</span></div>" +
            "<div class='col-sm-1'>E/W</div>" +
            "<div class='col-sm-2'>Contract</div>" +
            "<div class='col-sm-2'>By</div>" +
            "<div class='col-sm-2'>Tricks</div>" +
            "<div class='col-sm-3'>" +
              "<div class='row bottom'>" +
                "<div class='col-sm-6 no-padding'>N/S Score</div>" +
                "<div class='col-sm-6 no-padding'>E/W Score</div>" +
              "</div>" +
            "</div>" +
            "<div class='col-sm-1'><span>Explain</span></div>" +
          "</div>" +
          createScoringForms(boards[board_num - 1]) +
        "</div>" +
      "</div>");
  }

  $("#collapse1").addClass("in")
}

function createScoringForms(board) {
  var potential_pair_numbers = [];

  if (thisEvent.eventType == EventType.MITCHELL) {
    for (var i = 1; i <= Object.keys(thisEvent.ew_pairs).length; i++) {
      potential_pair_numbers.push(i);
    }
  } else {
    for (var i = 1; i <= Object.keys(thisEvent.pairs).length; i++) {
      potential_pair_numbers.push(i);
    }
  }

  var hands = board.hands;
  var content = "";

  for (var i = 0; i < hands.length; i++) {
    var board_hand_id = board.number + '-' + i;
    var colored_row = (i % 2 == 0) ? " colored-row " : "";
    var nsColumn = (hands[i].ns_pair)
      ? "<input class='text-only' type='text' id='" + board_hand_id + "-ns' value='" + hands[i].ns_pair.number + "' disabled>"
      : createDropdown(board_hand_id, "-ns", "N/S", potential_pair_numbers);

    content += "<div class='row" + colored_row + "'>" +
                  "<form id='" + board_hand_id + "-form' action='javascript:void(0);'>" +
                    "<div class='col-sm-1'>" + nsColumn + "</div>" +
                    "<div class='col-sm-1'>" + createDropdown(board_hand_id, "-ew", "E/W", potential_pair_numbers) + "</div>" +
                    "<div class='col-sm-2'><input type='text' pattern='^[1-7]([Ss]|[Dd]|[Cc]|[Hh]|([Nn]([Tt])?))([Xx*])?([Xx*])?$' class='form-control uppercase' id='" + board_hand_id + "-contract'  oninput='isRowComplete(\"" + board_hand_id + "\")' required></div>" +
                    "<div class='col-sm-2'>" + createDropdown(board_hand_id, "-by", "By", ["North", "South", "East", "West"]) + "</div>" +
                    "<div class='col-sm-2'>" + createDropdown(board_hand_id, "-tricks", "Tricks", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]) + "</div>" +
                    "<div class='col-sm-3'>" +
                      "<div class='row'>" +
                        "<div class='col-sm-6'><input class='text-only' type='text' id='" + board_hand_id + "-nsscore' disabled></div>" +
                        "<div class='col-sm-6'><input class='text-only' type='text' id='" + board_hand_id + "-ewscore' disabled></div>" +
                      "</div>" +
                    "</div>" +
                    "<div class='col-sm-1'>" +
                      "<button id='" + board_hand_id + "-explain' onclick='explainScore(\"" + board_hand_id + "\")' type='button' class='btn btn-default btn-lg centered-btn'>" +
                        "<span class='glyphicon glyphicon-question-sign' aria-hidden='true'></span>" +
                      "</button>" +
                    "</div>" +
                  "</form>" +
                "</div>";
  }

  return content;
}

function explainScore(board_hand_id) {
  if ($("#" + board_hand_id + "-ew").val() === "N/A") {
    console.log("N/A -- no score");
    return;
  }

  if (!isValid(board_hand_id + "-ew") || !isValid(board_hand_id + "-contract") || !isValid(board_hand_id + "-by") || !isValid(board_hand_id + "-tricks")) {
    console.log("Row not complete -- no score");
    return;
  }

  var ids = board_hand_id.split("-");
  var board_id = ids[0];
  var hand_id = ids[1];
  var board = thisEvent.boards[board_id-1];

  // Board Number
  $("#exBoard").html(board.number);

  // Dealer
  switch (board.dealer) {
    case Dealer.NORTH:
      $("#exDealer").html("North");
      break;
    case Dealer.SOUTH:
      $("#exDealer").html("South");
      break;
    case Dealer.EAST:
      $("#exDealer").html("East");
      break;
    case Dealer.WEST:
      $("#exDealer").html("West");
      break;
  }

  // Vulnerability
  switch (board.vulnerable) {
    case Vulnerable.ALL:
      $("#exVulnerability").html("All");
      break;
    case Vulnerable.NONE:
      $("#exVulnerability").html("None");
      break;
    case Vulnerable.NS:
      $("#exVulnerability").html("N/S");
      break;
    case Vulnerable.EW:
      $("#exVulnerability").html("E/W");
      break;
  }

  // Declarer
  var declarer = $("#" + board_hand_id + "-by").val();
  $("#exDeclarer").html(declarer);

  // Contract
  $("#exContract").html($("#" + board_hand_id + "-contract").val());

  // Made
  var taken_num_tricks = $("#" + board_hand_id + "-tricks").val();
  var contract = $("#" + board_hand_id + "-contract").val();
  var contract_num_tricks = parseInt(contract.charAt(0));
  var numOddTricks = (taken_num_tricks - 6) - contract_num_tricks;
  var doubled = (contract.indexOf("X") > 0 || contract.indexOf("*") > 0);
  var redoubled = (contract.indexOf("XX") > 0 || contract.indexOf("**") > 0);
  var vulnerable = isVulnerable(declarer, board);

  if (numOddTricks < 0) {
    var penalty_points = calculatePenaltyPoints((numOddTricks * -1), vulnerable, doubled, redoubled);

    $("#exMade").html("-");
    $("#exDown").html(numOddTricks * -1);
    $("#exContractPoints").html("-");
    $("#exOvertrickPoints").html("-");
    $("#exSlamBonus").html("-");
    $("#exRedoubledBonus").html("-");
    $("#exGameBonus").html("-");
    $("#exPenaltyPoints").html(penalty_points);

    if (declarer === 'North' || declarer === 'South') {
      $("#exTotalNSScore").html("-");
      $("#exTotalEWScore").html(penalty_points);
    } else {
      $("#exTotalNSScore").html(penalty_points);
      $("#exTotalEWScore").html("-");
    }
  } else {
    $("#exMade").html(numOddTricks);
    $("#exDown").html("-");

    // Contract Points
    var suit = getSuit(contract);
    var contract_points = getContractPoints(contract_num_tricks, suit, doubled, redoubled);
    var overtrick_points = getOvertrickPoints(numOddTricks, suit, vulnerable, doubled, redoubled);
    var slam_bonus = getSlamBonus(contract_num_tricks, vulnerable);
    var redoubled_bonus = getDoubledRedoubledBonus(doubled, redoubled);
    var game_bonus = getGameBonus(contract_points, vulnerable);
    var victory_points = contract_points + overtrick_points + slam_bonus + redoubled_bonus + game_bonus;

    $("#exContractPoints").html(contract_points);
    $("#exOvertrickPoints").html(overtrick_points);
    $("#exSlamBonus").html(slam_bonus);
    $("#exRedoubledBonus").html(redoubled_bonus);
    $("#exGameBonus").html(redoubled_bonus);
    $("#exPenaltyPoints").html("-");

    if (declarer === 'North' || declarer === 'South') {
      $("#exTotalNSScore").html(victory_points);
      $("#exTotalEWScore").html("-");
    } else {
      $("#exTotalNSScore").html("-");
      $("#exTotalEWScore").html(victory_points);
    }
  }

  $("#explainModal").modal();
}

function createDropdown(board_hand_id, dropdown_id, text, values) {
  var dropdown_values = "";
  for (var i = 0; i < values.length; i++) {
    dropdown_values += "<option value='" + values[i] + "'>" + values[i] + "</option>";
  }
  if (dropdown_id === "-ew") {
    dropdown_values += "<option value='N/A'>N/A</option>";
  }

  return "<select id='" + board_hand_id + dropdown_id + "' class='selectpicker btn-default' onchange='isRowComplete(\"" + board_hand_id + "\")' required>" +
            "<option value='' disabled selected>" + text + "</option>" +
            dropdown_values +
          "</select>";
}

function isRowComplete(board_hand_id) {
  var currentlyActive = $(document.activeElement);
  var noEastWestPair = $("#" + board_hand_id + "-ew").val() === "N/A";
  var northSouthPairExists = $("#" + board_hand_id + "-ns").val() != null;
  var eastWestPairExists = $("#" + board_hand_id + "-ew").val() != null;
  var boardHandPassed = $("#" + board_hand_id + "-contract").val().toUpperCase().startsWith("PASS");

  if (noEastWestPair) {
    // TODO Clear and disable the rest of the row.  Scoring is allowed for the board!
    $("#" + board_hand_id + "-contract").val('');
    $("#" + board_hand_id + "-by").val('');
    $("#" + board_hand_id + "-tricks").val('');
    $("#" + board_hand_id + "-nsscore").val('');
    $("#" + board_hand_id + "-ewscore").val('');
    $("#" + board_hand_id + "-form .selectpicker").selectpicker('refresh');

    var ids = board_hand_id.split("-");
    var board_id = ids[0];
    var hand_id = ids[1];
    delete thisEvent.boards[board_id-1].hands[hand_id].ew_score;
    delete thisEvent.boards[board_id-1].hands[hand_id].ns_score;
    delete thisEvent.boards[board_id-1].hands[hand_id].ew_pair;
  } else if (boardHandPassed && northSouthPairExists && eastWestPairExists) {
    // TODO clear and disable the rest of the row, scoring is allowed for the board
    $("#" + board_hand_id + "-by").val('');
    $("#" + board_hand_id + "-tricks").val('');
    $("#" + board_hand_id + "-nsscore").val('');
    $("#" + board_hand_id + "-ewscore").val('');
    $("#" + board_hand_id + "-form .selectpicker").selectpicker('refresh');

    var ids = board_hand_id.split("-");
    var board_id = ids[0];
    var hand_id = ids[1];
    delete thisEvent.boards[board_id-1].hands[hand_id].ew_score;
    delete thisEvent.boards[board_id-1].hands[hand_id].ns_score;
    delete thisEvent.boards[board_id-1].hands[hand_id].ew_pair;
  }

  if (noEastWestPair || (boardHandPassed && northSouthPairExists && eastWestPairExists) || (isValid(board_hand_id + "-ns") && isValid(board_hand_id + "-ew") && isValid(board_hand_id + "-contract") && isValid(board_hand_id + "-by") && isValid(board_hand_id + "-tricks"))) {
    calculateScore(board_hand_id);
    localStorage.setItem('bridgeEvent', JSON.stringify(thisEvent));
  }

  currentlyActive.focus();
}

function isValid(board_hand_id) {
  return $("#" + board_hand_id)[0].checkValidity();
}

function calculateScore(full_board_hand_id) {
  var ids = full_board_hand_id.split("-");
  var board_id = parseInt(ids[0]) - 1;
  var hand_id = parseInt(ids[1]);
  var board = thisEvent.boards[board_id];

  calculateScoreForBoardHand(full_board_hand_id, board_id, hand_id, board);

  if (allHandsScored(board.hands)) {
    $("#heading" + (board_id + 1)).removeClass("alert-danger");
    $("#heading" + (board_id + 1)).addClass("alert-success");

    if (thisEvent.eventType == EventType.MITCHELL) {
      calculateMatchPointsForBoard(board);
      updateMitchellFinalScores();
    } else {
      calculateMatchPointsForBoard(board);
      updateHowellFinalScores();
    }

    $("#scores-well").removeClass("hidden");

    if (isFirstBoardAtTable(board_id)) {
      copyPairsToRemainingBoardsAtTable(board_id);
    }
  }
}

function calculateMatchPointsForBoard(board) {
  // create sorted array of tuples
  var ns_pairs_to_scores = {};
  for (var i = 0; i < board.hands.length; i++) {
    if (board.hands[i].ew_pair != 'N/A') {
      ns_pairs_to_scores[board.hands[i].ns_pair.number] = board.hands[i].ns_score;
    }
  }
  var sortedNsPairScoreTuples = sortByValue(ns_pairs_to_scores);

  // assign matchpoints to each pair
  board.ns_matchpoints = calculateMatchPoints(sortedNsPairScoreTuples);


  var ew_pairs_to_scores = {};
  for (var i = 0; i < board.hands.length; i++) {
    if (board.hands[i].ew_pair != 'N/A') {
      ew_pairs_to_scores[board.hands[i].ew_pair.number] = board.hands[i].ew_score;
    }
  }
  var sortedEwPairScoreTuples = sortByValue(ew_pairs_to_scores);

  // assign matchpoints to each pair
  board.ew_matchpoints = calculateMatchPoints(sortedEwPairScoreTuples);
}

function isFirstBoardAtTable(board_id) {
  var boardsPerTable = thisEvent.boardsPerTable;

  while (board_id >= boardsPerTable) {
    board_id -= boardsPerTable;
  }

  return board_id === 0;
}

function copyPairsToRemainingBoardsAtTable(first_board_id) {
  var first_board_number = first_board_id + 1;
  var boards_per_table = parseInt(thisEvent.boardsPerTable);
  var number_pairs_per_board = (thisEvent.eventType == EventType.MITCHELL)
    ? Object.keys(thisEvent.ns_pairs).length
    : Math.round(Object.keys(thisEvent.pairs).length / 2);

  // get the pair numbers from the first board and put them in an array
  var ns_pair_numbers = [];
  var ew_pair_numbers = [];
  for (var i = 0; i < number_pairs_per_board; i++) {
    ns_pair_numbers.push($("#" + first_board_number + "-" + i + "-ns").val());
    ew_pair_numbers.push($("#" + first_board_number + "-" + i + "-ew").val());
  }

  // go through the rest of the boards and update the rest of the pair numbers
  for (var i = first_board_number + 1; i <= first_board_number + boards_per_table - 1; i++) {
    for (var j = 0; j < number_pairs_per_board; j++) {
      if (thisEvent.eventType == EventType.HOWELL) {
        $("#" + i + "-" + j + "-ns").val(ns_pair_numbers[j]);
        thisEvent.boards[i-1].hands[j].ns_pair = ns_pair_numbers[j];
      }

      $("#" + i + "-" + j + "-ew").val(ew_pair_numbers[j]);
      $("#" + i + "-" + j + "-form .selectpicker").selectpicker('refresh');

      thisEvent.boards[i-1].hands[j].ew_pair = ew_pair_numbers[j];
      if (ew_pair_numbers[j] === 'N/A') {
        thisEvent.boards[i-1].hands[j].contract = "";
        thisEvent.boards[i-1].hands[j].by = "";
        thisEvent.boards[i-1].hands[j].tricks = "";
      }
    }
  }
}

function calculateScoreForBoardHand(full_board_hand_id, board_id, hand_id, board) {
  var ns_number = $("#" + full_board_hand_id + "-ns").val();
  var ew_number = $("#" + full_board_hand_id + "-ew").val();
  var contract = $("#" + full_board_hand_id + "-contract").val().toUpperCase();

  if (ew_number === 'N/A') {
    thisEvent.boards[board_id].hands[hand_id].ns_pair = thisEvent.pairs[ns_number];
    thisEvent.boards[board_id].hands[hand_id].ew_pair = "N/A";
    thisEvent.boards[board_id].hands[hand_id].contract = "";
    thisEvent.boards[board_id].hands[hand_id].by = "";
    thisEvent.boards[board_id].hands[hand_id].tricks = "";
  } else if (contract.startsWith("PASS")) {
    if (thisEvent.eventType == EventType.MITCHELL) {
      thisEvent.boards[board_id].hands[hand_id].ew_pair = thisEvent.ew_pairs[ew_number];
    } else {
      thisEvent.boards[board_id].hands[hand_id].ns_pair = thisEvent.pairs[ns_number];
      thisEvent.boards[board_id].hands[hand_id].ew_pair = thisEvent.pairs[ew_number];
    }
    thisEvent.boards[board_id].hands[hand_id].contract = "PASS";
    thisEvent.boards[board_id].hands[hand_id].by = "";
    thisEvent.boards[board_id].hands[hand_id].tricks = "";
    setScores(full_board_hand_id, board_id, hand_id, 0);
  } else {
    var declarer = $("#" + full_board_hand_id + "-by").val();
    var taken_num_tricks = $("#" + full_board_hand_id + "-tricks").val();

    var doubled = (contract.indexOf("X") > 0 || contract.indexOf("*") > 0);
    var redoubled = (contract.indexOf("XX") > 0 || contract.indexOf("**") > 0);

    var contract_num_tricks = parseInt(contract.charAt(0));
    var numOddTricks = (taken_num_tricks - 6) - contract_num_tricks;

    if (thisEvent.eventType == EventType.MITCHELL) {
      thisEvent.boards[board_id].hands[hand_id].ew_pair = thisEvent.ew_pairs[ew_number];
    } else {
      thisEvent.boards[board_id].hands[hand_id].ns_pair = thisEvent.pairs[ns_number];
      thisEvent.boards[board_id].hands[hand_id].ew_pair = thisEvent.pairs[ew_number];
    }
    thisEvent.boards[board_id].hands[hand_id].contract = contract;
    thisEvent.boards[board_id].hands[hand_id].by = declarer;
    thisEvent.boards[board_id].hands[hand_id].tricks = taken_num_tricks;

    if (numOddTricks < 0) {
      // Failed to meet the contract, calculate penalty points
      var vulnerable = isVulnerable(declarer, board);
      var penalty_points = calculatePenaltyPoints(numOddTricks * -1, vulnerable, doubled, redoubled);

      if (declarer === "North" || declarer === "South") {
        setScores(full_board_hand_id, board_id, hand_id, penalty_points * -1);
      } else {
        setScores(full_board_hand_id, board_id, hand_id, penalty_points);
      }
    } else {
      // Met the contract, calculate victory points
      var vulnerable = isVulnerable(declarer, board);
      var suit = getSuit(contract);
      var victory_points = calculateVictoryPoints(contract_num_tricks, numOddTricks, suit, vulnerable, doubled, redoubled);

      if (declarer === "North" || declarer === "South") {
        setScores(full_board_hand_id, board_id, hand_id, victory_points);
      } else {
        setScores(full_board_hand_id, board_id, hand_id, victory_points * -1);
      }
    }
  }
}

function isVulnerable(declarer, board) {
  if (board.vulnerable === Vulnerable.ALL) {
    return true;
  } else if (board.vulnerable === Vulnerable.NONE) {
    return false;
  } else if (board.vulnerable === Vulnerable.NS && (declarer === "North" || declarer === "South")) {
    return true;
  } else if (board.vulnerable === Vulnerable.EW && (declarer === "East" || declarer === "West")) {
    return true;
  } else {
    return false;
  }
}

function getSuit(contract) {
  if (contract.indexOf("D") > 0) {
    return Suit.DIAMOND;
  } else if (contract.indexOf("C") > 0) {
    return Suit.CLUB;
  } else if (contract.indexOf("H") > 0) {
    return Suit.HEART;
  } else if (contract.indexOf("S") > 0) {
    return Suit.SPADE;
  } else {
    return Suit.NO_TRUMP;
  }
}

function calculatePenaltyPoints(numOddTricks, vulnerable, doubled, redoubled) {
  var penalty_points = 0;

  for (var i = 1; i <= numOddTricks; i++) {
    if (redoubled) {
      penalty_points += getRedoubledPenalty(i, vulnerable);
    } else if (doubled) {
      penalty_points += getDoubledPenalty(i, vulnerable);
    } else {
      penalty_points += getUndoubledPenalty(vulnerable);
    }
  }

  return penalty_points;
}

function getRedoubledPenalty(undertrick_num, vulnerable) {
  if (vulnerable) {
    if (undertrick_num === 1) {
      return 400;
    } else {
      return 600;
    }
  } else {
    if (undertrick_num === 1) {
      return 200;
    } else if (undertrick_num === 2 || undertrick_num === 3) {
      return 400;
    } else {
      return 600;
    }
  }
}

function getDoubledPenalty(undertrick_num, vulnerable) {
  if (vulnerable) {
    if (undertrick_num === 1) {
      return 200;
    } else {
      return 300;
    }
  } else {
    if (undertrick_num === 1) {
      return 100;
    } else if (undertrick_num === 2 || undertrick_num === 3) {
      return 200;
    } else {
      return 300;
    }
  }
}

function getUndoubledPenalty(vulnerable) {
  if (vulnerable) {
    return 100;
  } else {
    return 50;
  }
}

function calculateVictoryPoints(contract_num_tricks, num_overtricks, suit, vulnerable, doubled, redoubled) {
  var victory_points = 0;

  var contract_points = getContractPoints(contract_num_tricks, suit, doubled, redoubled);
  victory_points += contract_points;
  victory_points += getOvertrickPoints(num_overtricks, suit, vulnerable, doubled, redoubled);
  victory_points += getSlamBonus(contract_num_tricks, vulnerable);
  victory_points += getDoubledRedoubledBonus(doubled, redoubled);
  victory_points += getGameBonus(contract_points, vulnerable);

  return victory_points;
}

function getContractPoints(contract_num_tricks, suit, doubled, redoubled) {
  var contract_points;

  if (suit === Suit.NO_TRUMP) {
    contract_points = 40;
    contract_points += 30 * (contract_num_tricks - 1);
  } else if (suit === Suit.SPADE || suit === Suit.HEART) {
    contract_points = 30 * contract_num_tricks;
  } else {
    contract_points = 20 * contract_num_tricks;
  }

  if (doubled) {
    contract_points *= 2;
  }

  if (redoubled) {
    contract_points *= 2;
  }

  return contract_points;
}

function getOvertrickPoints(num_overtricks, suit, vulnerable, doubled, redoubled) {
  var overtrick_points;

  if (redoubled) {
    if (vulnerable) {
      overtrick_points = 400 * num_overtricks;
    } else {
      overtrick_points = 200 * num_overtricks;
    }
  } else if (doubled) {
    if (vulnerable) {
      overtrick_points = 200 * num_overtricks;
    } else {
      overtrick_points = 100 * num_overtricks;
    }
  } else {
    if (suit === Suit.NO_TRUMP || suit === Suit.SPADE || suit === Suit.HEART) {
      overtrick_points = 30 * num_overtricks;
    } else {
      overtrick_points = 20 * num_overtricks;
    }
  }

  return overtrick_points;
}

function getSlamBonus(contract_num_tricks, vulnerable) {
  var slam_bonus = 0;

  if (contract_num_tricks + 6 === 12) {
    if (vulnerable) {
      slam_bonus = 750;
    } else {
      slam_bonus = 500;
    }
  } else if (contract_num_tricks + 6 === 13) {
    if (vulnerable) {
      slam_bonus = 1500;
    } else {
      slam_bonus = 1000;
    }
  }

  return slam_bonus;
}

function getDoubledRedoubledBonus(doubled, redoubled) {
  var doubled_redoubled_bonus = 0;

  if (redoubled) {
    doubled_redoubled_bonus = 100;
  } else if (doubled) {
    doubled_redoubled_bonus = 50;
  }

  return doubled_redoubled_bonus;
}

function getGameBonus(contract_points, vulnerable) {
  var game_bonus;

  if (contract_points < 100) {
    game_bonus = 50;
  } else {
    if (vulnerable) {
      game_bonus = 500;
    } else {
      game_bonus = 300;
    }
  }

  return game_bonus;
}

// Pass the score for ns
function setScores(full_board_hand_id, board_id, hand_id, score) {
  thisEvent.boards[board_id].hands[hand_id].ns_score = score;
  thisEvent.boards[board_id].hands[hand_id].ew_score = score * -1;

  // Only show the positive score, clear the other
  if (score === 0) {
    $("#" + full_board_hand_id + "-nsscore").val(score);
    $("#" + full_board_hand_id + "-ewscore").val(score);
  } else if (score > 0) {
    $("#" + full_board_hand_id + "-nsscore").val(score);
    $("#" + full_board_hand_id + "-ewscore").val("");
  } else {
    $("#" + full_board_hand_id + "-nsscore").val("");
    $("#" + full_board_hand_id + "-ewscore").val(score * -1);
  }
}

function allHandsScored(hands) {
  for (var i = 0; i < hands.length; i++) {
    if (hands[i].ew_pair != 'N/A' && hands[i].ns_score === undefined) {
      return false;
    }
  }

  return true;
}

function sortByValue(obj) {
    var tuples = [];

    for (var key in obj) {
      tuples.push([key, obj[key]]);
    }

    tuples.sort(function(a, b) { return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0 });
    return tuples;
}

function calculateMatchPoints(sortedPairScoreTuples) {
  var matchpoints = {};
  var nextMpScore = (sortedPairScoreTuples.length * 2) - 2; // max mp score

  for (var i = 0; i < sortedPairScoreTuples.length; i++) {
    var thisPairScore = sortedPairScoreTuples[i][1];
    if (sortedPairScoreTuples[i+1] === undefined) {
      var nextPairScore = undefined;
    } else {
      var nextPairScore = sortedPairScoreTuples[i+1][1];
    }

    if (nextPairScore === undefined) {
      matchpoints[sortedPairScoreTuples[i][0]] = nextMpScore;
    } else {
      if (thisPairScore === nextPairScore) {
        // tie!
        var tied_pairs = [];
        tied_pairs.push(sortedPairScoreTuples[i][0]);
        tied_pairs.push(sortedPairScoreTuples[i+1][0]);

        var skips = 2;
        while (true) {
          if (sortedPairScoreTuples[i+skips] != undefined && thisPairScore === sortedPairScoreTuples[i+skips][1]) {
            tied_pairs.push(sortedPairScoreTuples[i+skips][0]);
            skips++;
          } else {
            i += skips - 1; // going to skip one already in the outer loop
            break;
          }
        }

        var sharedMps = 0;
        for (var j = 0; j < tied_pairs.length; j++) {
          sharedMps += nextMpScore;
          nextMpScore -= 2;
        }

        for (var j = 0; j < tied_pairs.length; j++) {
          matchpoints[tied_pairs[j]] = (sharedMps / tied_pairs.length);
        }
      } else {
        matchpoints[sortedPairScoreTuples[i][0]] = nextMpScore;
        nextMpScore -= 2;
      }
    }
  }

  return matchpoints;
}

function printScores() {
  var print_window = window.open('','printwindow');
  print_window.document.write('<html><head><title>Bridge</title><link rel="stylesheet" type="text/css" href="stylesheets/print.css" /></head><body>');
  print_window.document.write($("#final_score_tables_div").html());
  print_window.document.write('</body></html>');
  sleep(1000).then(() => {
    print_window.print();
    print_window.close();
  });
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
