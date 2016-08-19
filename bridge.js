"use strict";

class Event {
  constructor(hands) {
    this.hands = hands;
  }
}

class Hand {
  constructor(ns_pair, ew_pair, board) {
    this.ns_pair = ns_pair;
    this.ew_pair = ew_pair;
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
  var total_number_of_hands = number_hands_per_table * Math.min(number_ns_pairs, number_ew_pairs);

// create boards
  var boards = createBoards(total_number_of_hands);

// create hands
// create event



  var tableContent = createTableContent();
  for (var i = 1; i <= total_number_of_hands; i++) {

    $("#accordion").append(
      "<div class='no-margin panel panel-default'>" +
        "<div class='no-margin alert alert-danger' role='tab' id='heading" + i + "'>" +
          "<h4 class='panel-title'>" +
            "<a data-toggle='collapse' data-parent='#accordion' href='#collapse" + i + "' aria-expanded='true' aria-controls='collapse" + i + "'>" +
              "Hand " + i +
            "</a>" +
          "</h4>" +
        "</div>" +
        "<div id='collapse" + i + "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading" + i + "'>" +
          "<table>" +
            "<tr>" +
              "<th>North/South</th><th>East/West</th><th>Contract</th><th>By</th><th>Tricks</th><th>Score</th><th>MPs</th>" +
            "</tr>" +
            tableContent +
          "</table>" +
        "</div>" +
      "</div>");
  }

  $("#collapse1").addClass("in")
}

function createBoards(total_number_of_hands) {
  // new Board(1, Dealer.NORTH, Vulnerable.NONE);
  // new Board(2, Dealer.EAST, Vulnerable.NS);
  // new Board(3, Dealer.SOUTH, Vulnerable.EW);
  // new Board(4, Dealer.WEST, Vulnerable.ALL);
  // new Board(5, Dealer.NORTH, Vulnerable.NS);
  // new Board(6, Dealer.EAST, Vulnerable.EW);
  // new Board(7, Dealer.SOUTH, Vulnerable.ALL);
  // new Board(8, Dealer.WEST, Vulnerable.NONE);
  // new Board(9, Dealer.NORTH, Vulnerable.EW);
  // new Board(10, Dealer.EAST, Vulnerable.ALL);
  // new Board(11, Dealer.SOUTH, Vulnerable.NONE);
  // new Board(12, Dealer.WEST, Vulnerable.NS);
  // new Board(13, Dealer.NORTH, Vulnerable.ALL);
  // new Board(14, Dealer.EAST, Vulnerable.NONE);
  // new Board(15, Dealer.SOUTH, Vulnerable.NS);
  // new Board(16, Dealer.WEST, Vulnerable.EW);
}

function createTableContent() {
  var content = "";
  var number_ns_pairs = $(".ns-pair").length;
  var number_ew_pairs = $(".ew-pair").length;
  for (var i = 1; i <= number_ns_pairs; i++) {
    for (var j = 1; j <= number_ew_pairs; j++) {
      content += "<tr><td>" + i + "</td><td>" + j + "</td><td>5S</td><td>N</td><td>6</td><td>50</td><td>10</td></tr>"
    }
  }
  return content;
}
