"use strict";

class BridgeEvent {
  constructor(hands) {
    this.hands = hands;
  }
}

class Hand {
  constructor(number, table_hands) {
    this.number = number;
    this.table_hands = table_hands;
  }
}

class TableHand {
  constructor(ns_pair, board) {
    this.ns_pair = ns_pair;
    this.board = board;
  }
}

class NorthSouthPair {
  constructor(number, north, south) {
    this.number = number;
    this.north = north;
    this.south = south;
  }
}

class EastWestPair {
  constructor(number, east, west) {
    this.number = number;
    this.east = east;
    this.west = west;
  }
}

class Board {
  constructor(number, dealer, vulnerable) {
    this.number = number;
    this.dealer = dealer;
    this.vulnerable = vulnerable;
  }
}

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
  $('#date').datepicker();

  $(".dropdown-menu li a").click(function() {
    $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
  });

  $("#add-ns-pair-button").click(addNorthSouthPair);
  $("#add-ew-pair-button").click(addEastWestPair);
  $("#cancel-event-button").click(cancelEventCreation);
  $("#create-event-button").click(createEvent);

});

function addNorthSouthPair() {
  var nextId = $(".ns-pair").length + 1;
  $("<label id='ns-pair" + nextId + "-label' for='ns-pair" + nextId + "' class='col-sm-2 form-control-label'>Pair " + nextId + "</label>" +
    "<div class='col-sm-10 pair ns-pair' id='ns-pair" + nextId + "'>" +
      "<input type='text' class='form-control' id='pair" + nextId + "-north' placeholder='North' required>" +
      "<input type='text' class='form-control' id='pair" + nextId + "-south' placeholder='South' required>" +
    "</div>").insertBefore($("#add-ns-pair-button"));
}

function addEastWestPair() {
  var nextId = $(".ew-pair").length + 1;
  $("<label id='ew-pair" + nextId + "-label' for='ew-pair" + nextId + "' class='col-sm-2 form-control-label'>Pair " + nextId + "</label>" +
    "<div class='col-sm-10 pair ew-pair' id='ew-pair" + nextId + "'>" +
      "<input type='text' class='form-control' id='pair" + nextId + "-east' placeholder='East' required>" +
      "<input type='text' class='form-control' id='pair" + nextId + "west' placeholder='West' required>" +
    "</div>").insertBefore($("#add-ew-pair-button"));
}

function cancelEventCreation() {
  <!-- Remove Extra North South Pairs -->
  var number_ns_pairs = $(".ns-pair").length;
  for (i = 2; i <= number_ns_pairs; i++) {
    $("#ns-pair" + i + "-label").remove();
    $("#ns-pair" + i).remove();
  }

  <!-- Remove Extra East West Pairs -->
  var number_ew_pairs = $(".ew-pair").length;
  for (i = 2; i <= number_ew_pairs; i++) {
    $("#ew-pair" + i + "-label").remove();
    $("#ew-pair" + i).remove();
  }

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
  $("#myModal").modal('toggle');

  var ns_pairs = [];
  var number_ns_pairs = $(".ns-pair").length;
  for (var i = 1; i <= number_ns_pairs; i++) {
    var north = $("#pair" + i + "-north").val();
    var south = $("#pair" + i + "-south").val();
    ns_pairs.push(new NorthSouthPair(i, north, south));
  }

  var ew_pairs = [];
  var number_ew_pairs = $(".ew-pair").length;
  for (var i = 1; i <= number_ew_pairs; i++) {
    var east = $("#pair" + i + "-east").val();
    var west = $("#pair" + i + "-west").val();
    ew_pairs.push(new EastWestPair(i, east, west));
  }

  var number_hands_per_table = $('#hands-per-table').text().trim();
  var number_of_tables = Math.max(number_ns_pairs, number_ew_pairs);
  var total_number_of_hands = number_hands_per_table * number_of_tables;

  var boards = createBoards(total_number_of_hands);

  var hands = [];
  for (var hand_id = 1; hand_id <= total_number_of_hands; hand_id++) {
    hands.push(new Hand(hand_id, createTableHands(hand_id, ns_pairs, boards, number_hands_per_table)));
  }

  var bridgeEvent = new BridgeEvent(hands);
  thisEvent = bridgeEvent;
  createScoringAccordion(bridgeEvent, ns_pairs, ew_pairs);

  $(".dropdown-menu li a").click(function() {
    $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
  });

  $('.selectpicker').selectpicker({
    style: 'btn-default'
  });

}

function createBoards(total_number_of_hands) {
  var boards = [];

  for (var i = 1; i <= total_number_of_hands; i++) {
    if (i % 16 == 0) {
      boards.push(new Board(i, Dealer.WEST, Vulnerable.EW));
    } else if (i % 15 == 0) {
      boards.push(new Board(i, Dealer.SOUTH, Vulnerable.NS));
    } else if (i % 14 == 0) {
      boards.push(new Board(i, Dealer.EAST, Vulnerable.NONE));
    } else if (i % 13 == 0) {
      boards.push(new Board(i, Dealer.NORTH, Vulnerable.ALL));
    } else if (i % 12 == 0) {
      boards.push(new Board(i, Dealer.WEST, Vulnerable.NS));
    } else if (i % 11 == 0) {
      boards.push(new Board(i, Dealer.SOUTH, Vulnerable.NONE));
    } else if (i % 10 == 0) {
      boards.push(new Board(i, Dealer.EAST, Vulnerable.ALL));
    } else if (i % 9 == 0) {
      boards.push(new Board(i, Dealer.NORTH, Vulnerable.EW));
    } else if (i % 8 == 0) {
      boards.push(new Board(i, Dealer.WEST, Vulnerable.NONE));
    } else if (i % 7 == 0) {
      boards.push(new Board(i, Dealer.SOUTH, Vulnerable.ALL));
    } else if (i % 6 == 0) {
      boards.push(new Board(i, Dealer.EAST, Vulnerable.EW));
    } else if (i % 5 == 0) {
      boards.push(new Board(i, Dealer.NORTH, Vulnerable.NS));
    } else if (i % 4 == 0) {
      boards.push(new Board(i, Dealer.WEST, Vulnerable.ALL));
    } else if (i % 3 == 0) {
      boards.push(new Board(i, Dealer.SOUTH, Vulnerable.EW));
    } else if (i % 2 == 0) {
      boards.push(new Board(i, Dealer.EAST, Vulnerable.NS));
    } else {
      boards.push(new Board(i, Dealer.NORTH, Vulnerable.NONE));
    }
  }

  return boards;
}

function createTableHands(hand_num, ns_pairs, boards, hands_per_table) {
  var table_hands = [];
  var max_boards = boards.length;

  for (var table_num = 1; table_num <= ns_pairs.length; table_num++) {
    var board_num = (table_num * hands_per_table) - hands_per_table + hand_num;
    if (board_num > max_boards) {
      board_num -= max_boards;
    }

    table_hands.push(new TableHand(ns_pairs[table_num - 1], boards[board_num - 1]));
  }

  return table_hands;
}

function createScoringAccordion(bridgeEvent, ns_pairs, ew_pairs) {
  var hands = bridgeEvent.hands;
  for (var hand_num = 1; hand_num <= hands.length; hand_num++) {
    $("#accordion").append(
      "<div class='no-margin panel panel-default'>" +
        "<div class='no-margin alert alert-danger' role='tab' id='heading" + hand_num + "'>" +
          "<h4 class='panel-title'>" +
            "<a data-toggle='collapse' data-parent='#accordion' href='#collapse" + hand_num + "' aria-expanded='true' aria-controls='collapse" + hand_num + "'>" +
              "Hand " + hand_num +
            "</a>" +
          "</h4>" +
        "</div>" +
        "<div id='collapse" + hand_num + "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading" + hand_num + "'>" +
          "<div class='row header'>" +
            "<div class='col-sm-1 header'>Board</div>" +
            "<div class='col-sm-1'>North/South</div>" +
            "<div class='col-sm-2'>East/West</div>" +
            "<div class='col-sm-2'>Contract</div>" +
            "<div class='col-sm-2'>By</div>" +
            "<div class='col-sm-2'>Tricks</div>" +
            "<div class='col-sm-1'>N/S Score</div>" +
            "<div class='col-sm-1'>E/W Score</div>" +
          "</div>" +
          createScoringForms(hands[hand_num - 1], ns_pairs, ew_pairs, bridgeEvent) +
        "</div>" +
      "</div>");
  }

  $("#collapse1").addClass("in")
}

function createScoringForms(hand, ns_pairs, ew_pairs, bridgeEvent) {
  var ew_pair_numbers = [];
  for (var i = 1; i <= ew_pairs.length; i++) {
    ew_pair_numbers.push(i);
  }

  if (ns_pairs.length != ew_pairs.length) {
    ew_pair_numbers.push("Skip");
  }

  var table_hands = hand.table_hands;
  var content = "";
  for (var i = 0; i < table_hands.length; i++) {
    content += "<div class='row'>" +
                  "<form id='" + hand.number + "-" + i + "-form' action='javascript:void(0);'>" +
                    "<div class='col-sm-1'><input class='text-only' type='text' id='" + hand.number + "-" + i + "-board' value='" + table_hands[i].board.number + "'></div>" +
                    "<div class='col-sm-1'><input class='text-only' type='text' id='" + hand.number + "-" + i + "-ns' value='" + table_hands[i].ns_pair.number + "' disabled></div>" +
                    "<div class='col-sm-2'>" + createDropdown(hand.number + '-' + i, "-ew", "E/W", ew_pair_numbers, bridgeEvent) + "</div>" +
                    "<div class='col-sm-2'><input type='text' pattern='^[1-7][SsDdCcHhNn]([Xx])?([Xx])?$' class='form-control uppercase' id='" + hand.number + "-" + i + "-contract'  oninput='isRowComplete(\"" + hand.number + "-" + i + "\")' required></div>" +
                    "<div class='col-sm-2'>" + createDropdown(hand.number + '-' + i, "-by", "By", ["North", "South", "East", "West"], bridgeEvent) + "</div>" +
                    "<div class='col-sm-2'>" + createDropdown(hand.number + '-' + i, "-tricks", "Contract", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], bridgeEvent) + "</div>" +
                    "<div class='col-sm-1'><input class='text-only' type='text' id='" + hand.number + "-" + i + "-nsscore'></div>" +
                    "<div class='col-sm-1'><input class='text-only' type='text' id='" + hand.number + "-" + i + "-ewscore'></div>" +
                    "<button id='" + hand.number + "-" + i + "-submit' type='submit' class='btn btn-primary hidden'>Submit</button>" +
                  "</form>" +
                "</div>";
  }

  return content;
}

function createDropdown(table_hand_id, dropdown_id, text, values, bridgeEvent) {
  var dropdown_values = "";
  for (var i = 0; i < values.length; i++) {
    dropdown_values += "<option value='" + values[i] + "'>" + values[i] + "</option>";
  }

  return "<select id='" + table_hand_id + dropdown_id + "' class='selectpicker btn-default' onchange='isRowComplete(\"" + table_hand_id + "\")' required>" +
            "<option value='' disabled selected>" + text + "</option>" +
            dropdown_values +
          "</select>";
}

function isRowComplete(table_hand_id) {
  if (isValid(table_hand_id + "-ew") && isValid(table_hand_id + "-contract") && isValid(table_hand_id + "-by") && isValid(table_hand_id + "-tricks")) {
    calculateScore(table_hand_id);
  }
}

function isValid(table_hand_id) {
  return $("#" + table_hand_id)[0].checkValidity();
}

function calculateScore(full_table_hand_id) {
  var board_number = $("#" + full_table_hand_id + "-board").val();
  var ns_number = $("#" + full_table_hand_id + "-ns").val();
  var ew_number = $("#" + full_table_hand_id + "-ew").val();
  var contract = $("#" + full_table_hand_id + "-contract").val().toUpperCase();
  var declarer = $("#" + full_table_hand_id + "-by").val();
  var taken_num_tricks = $("#" + full_table_hand_id + "-tricks").val();

  var doubled = contract.indexOf("X") > 0;
  var redoubled = contract.indexOf("XX") > 0;

  var ids = full_table_hand_id.split("-");
  var hand_id = parseInt(ids[0]) - 1;
  var table_hand_id = parseInt(ids[1]);
  var board = thisEvent.hands[hand_id].table_hands[table_hand_id].board;

  var contract_num_tricks = parseInt(contract.charAt(0));
  var difference_num_tricks = (taken_num_tricks - 6) - contract_num_tricks;

  if (difference_num_tricks < 0) {
    var vulnerable = isDeclarerVulnerable(declarer, board);
    var penalty_points = calculatePenaltyPoints(difference_num_tricks * -1, vulnerable, doubled, redoubled);

    if (declarer === "North" || declarer === "South") {
      $("#" + full_table_hand_id + "-nsscore").val(penalty_points * -1);
      $("#" + full_table_hand_id + "-ewscore").val(penalty_points);
    } else {
      $("#" + full_table_hand_id + "-nsscore").val(penalty_points);
      $("#" + full_table_hand_id + "-ewscore").val(penalty_points * -1);
    }
  } else {
    var vulnerable = isDefenderVulnerable(declarer, board);
    var suit = getSuit(contract);
    var victory_points = calculateVictoryPoints(contract_num_tricks, difference_num_tricks, suit, vulnerable, doubled, redoubled);

    if (declarer === "North" || declarer === "South") {
      $("#" + full_table_hand_id + "-nsscore").val(victory_points);
      $("#" + full_table_hand_id + "-ewscore").val(victory_points * -1);
    } else {
      $("#" + full_table_hand_id + "-nsscore").val(victory_points * -1);
      $("#" + full_table_hand_id + "-ewscore").val(victory_points);
    }
  }
}

function isDeclarerVulnerable(declarer, board) {
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

function isDefenderVulnerable(declarer, board) {
  if (board.vulnerable === Vulnerable.ALL) {
    return true;
  } else if (board.vulnerable === Vulnerable.NONE) {
    return false;
  } else if (board.vulnerable === Vulnerable.NS && (declarer === "East" || declarer === "West")) {
    return true;
  } else if (board.vulnerable === Vulnerable.EW && (declarer === "North" || declarer === "South")) {
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

function calculatePenaltyPoints(difference_num_tricks, vulnerable, doubled, redoubled) {
  var penalty_points = 0;

  for (var i = 1; i <= difference_num_tricks; i++) {
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

  console.log("contract points: " + contract_points);
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

  console.log("overtrick points: " + overtrick_points);
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

  console.log("slam bonus: " + slam_bonus);
  return slam_bonus;
}

function getDoubledRedoubledBonus(doubled, redoubled) {
  var doubled_redoubled_bonus = 0;

  if (redoubled) {
    doubled_redoubled_bonus = 100;
  } else if (doubled) {
    doubled_redoubled_bonus = 50;
  }

  console.log("doubled/redoubled bonus: " + doubled_redoubled_bonus);
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

  console.log("game bonus: " + game_bonus);
  return game_bonus;
}
