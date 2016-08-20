"use strict";

class Event {
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
    $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
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
      "<input type='text' class='form-control' id='pair" + nextId + "-north' placeholder='North'>" +
      "<input type='text' class='form-control' id='pair" + nextId + "-south' placeholder='South'>" +
    "</div>").insertBefore($("#add-ns-pair-button"));
}

function addEastWestPair() {
  var nextId = $(".ew-pair").length + 1;
  $("<label id='ew-pair" + nextId + "-label' for='ew-pair" + nextId + "' class='col-sm-2 form-control-label'>Pair " + nextId + "</label>" +
    "<div class='col-sm-10 pair ew-pair' id='ew-pair" + nextId + "'>" +
      "<input type='text' class='form-control' id='pair" + nextId + "-east' placeholder='East'>" +
      "<input type='text' class='form-control' id='pair" + nextId + "west' placeholder='West'>" +
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

  var event = new Event(hands);
  console.log(event);
  createScoringAccordion(event);
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

function createScoringAccordion(event) {
  var hands = event.hands;
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
          "<table>" +
            "<tr>" +
              "<th>Board</th><th>North/South</th><th>East/West</th><th>Contract</th><th>By</th><th>Tricks</th><th>Score</th><th>MPs</th>" +
            "</tr>" +
            createScoringTable(hands[hand_num - 1]) +
          "</table>" +
        "</div>" +
      "</div>");
  }

  $("#collapse1").addClass("in")
}

function createScoringTable(hand) {
  var table_hands = hand.table_hands;
  var content = "";
  for (var i = 0; i < table_hands.length; i++) {
    content += "<tr>" +
                  "<td>" + table_hands[i].board.number + "</td>" +
                  "<td>" + table_hands[i].ns_pair.number + "</td>" +
                  "<td><input type='text' class='form-control' id='" + hand.number + "-" + i + "-ew' placeholder='E/W'></td>" +
                  "<td><input type='text' class='form-control' id='" + hand.number + "-" + i + "-contract' placeholder='Contract'></td>" +
                  "<td><input type='text' class='form-control' id='" + hand.number + "-" + i + "-by' placeholder='By'></td>" +
                  "<td><input type='text' class='form-control' id='" + hand.number + "-" + i + "-tricks' placeholder='Tricks'></td>" +
                  "<td>50</td>" +
                  "<td>10</td>" +
                "</tr>";
  }
  return content;
}
