$(function() {
  $("#add-ns-pair-button").click(addNorthSouthPair);
  $("#remove-ns-pair-button").click(removeNorthSouthPair);
  $("#add-ew-pair-button").click(addEastWestPair);
  $("#remove-ew-pair-button").click(removeEastWestPair);
});

function addNorthSouthPair() {
  var nextId = $(".ns-pair").length + 1;
  $("<label id='ns-pair" + nextId + "-label' for='ns-pair" + nextId + "' class='col-sm-2 form-control-label'>Pair " + nextId + "</label>" +
    "<div class='col-sm-10 pair ns-pair' id='ns-pair" + nextId + "'>" +
      "<input type='text' class='form-control' id='pair" + nextId + "-north' placeholder='North " + nextId + "' required>" +
      "<input type='text' class='form-control' id='pair" + nextId + "-south' placeholder='South " + nextId + "' required>" +
    "</div>").insertBefore($("#add-ns-pair-button"));

    $("#remove-ns-pair-button").removeClass("hidden");
}

function removeNorthSouthPair() {
  var idToRemove = $(".ns-pair").length;
  $("#ns-pair" + idToRemove + "-label").remove();
  $("#ns-pair" + idToRemove).remove();

  if (idToRemove <= 2) {
    $("#remove-ns-pair-button").addClass("hidden");
  }
}

function addEastWestPair() {
  var nextId = $(".ew-pair").length + 1;
  $("<label id='ew-pair" + nextId + "-label' for='ew-pair" + nextId + "' class='col-sm-2 form-control-label'>Pair " + nextId + "</label>" +
    "<div class='col-sm-10 pair ew-pair' id='ew-pair" + nextId + "'>" +
      "<input type='text' class='form-control' id='pair" + nextId + "-east' placeholder='East " + nextId + "' required>" +
      "<input type='text' class='form-control' id='pair" + nextId + "-west' placeholder='West " + nextId + "' required>" +
    "</div>").insertBefore($("#add-ew-pair-button"));

    $("#remove-ew-pair-button").removeClass("hidden");
}

function removeEastWestPair() {
  var idToRemove = $(".ew-pair").length;
  $("#ew-pair" + idToRemove + "-label").remove();
  $("#ew-pair" + idToRemove).remove();

  if (idToRemove <= 2) {
    $("#remove-ew-pair-button").addClass("hidden");
  }
}
