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
  $("<label id='pair" + nextId + "-label' for='howell-pair" + nextId + "' class='col-sm-2 form-control-label'>Pair " + nextId + "</label>" +
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
