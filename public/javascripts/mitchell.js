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
