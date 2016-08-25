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
  console.log(bridgeEvent);
  createScoringAccordion(bridgeEvent, ns_pairs, ew_pairs);

  $(".dropdown-menu li a").click(function() {
    $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
  });

  $('.selectpicker').selectpicker({
    style: 'btn-default',
    size: 4
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
            "<div class='col-sm-1'>Score</div>" +
            "<div class='col-sm-1'>MPs</div>" +
          "</div>" +
          createScoringForms(hands[hand_num - 1], ns_pairs, ew_pairs) +
        "</div>" +
      "</div>");
  }

  $("#collapse1").addClass("in")
}

function createScoringForms(hand, ns_pairs, ew_pairs) {
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
                    "<div class='col-sm-1'>" + table_hands[i].board.number + "</div>" +
                    "<div class='col-sm-1'>" + table_hands[i].ns_pair.number + "</div>" +
                    "<div class='col-sm-2'>" + createDropdown(hand.number + '-' + i, "-ew", "E/W", ew_pair_numbers) + "</div>" +
                    "<div class='col-sm-2'><input type='text' pattern='^[1-7][SsDdCcHhNn]([Xx])?([Xx])?$' class='form-control uppercase' id='" + hand.number + "-" + i + "-contract' required></div>" +
                    "<div class='col-sm-2'>" + createDropdown(hand.number + '-' + i, "-by", "By", ["North", "South", "East", "West"]) + "</div>" +
                    "<div class='col-sm-2'>" + createDropdown(hand.number + '-' + i, "-tricks", "Contract", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]) + "</div>" +
                    "<div class='col-sm-1'>50</div>" +
                    "<div class='col-sm-1'>10</div>" +
                    "<button id='" + hand.number + "-" + i + "-submit' type='submit' class='btn btn-primary hidden'>Submit</button>" +
                  "</form>" +
                "</div>";
  }

  return content;
}

function createDropdown(base_id, dropdown_id, text, values) {
  var dropdown_values = "";
  for (var i = 0; i < values.length; i++) {
    dropdown_values += "<option value='" + values[i] + "'>" + values[i] + "</option>";
  }

  return "<select id='" + base_id + dropdown_id + "' class='selectpicker btn-default' onchange='isRowComplete(\"" + base_id + "\")' required>" +
            "<option value='' disabled selected>" + text + "</option>" +
            dropdown_values +
          "</select>";
}

function isRowComplete(id) {
  if (isValid(id + "-ew") && isValid(id + "-contract") && isValid(id + "-by") && isValid(id + "-tricks")) {
    console.log("score!");
  } else {
    console.log("don't score!");
  }
}

function isValid(id) {
  return $("#" + id)[0].checkValidity();
}
