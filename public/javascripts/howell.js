$(function() {
  $("#add-howell-pair-button").click(addHowellPair);
  $("#remove-howell-pair-button").click(removeHowellPair);
});

function addHowellPair() {
  var nextId = $(".howell-pair").length + 1;
  $("<label id='pair" + nextId + "-label' for='pair" + nextId + "' class='col-sm-2 form-control-label'>Pair " + nextId + "</label>" +
    "<div class='col-sm-10 pair howell-pair' id='pair" + nextId + "-div'>" +
      "<input type='text' class='form-control' id='pair" + nextId + "' placeholder='Pair " + nextId + "' required>" +
    "</div>").insertBefore($("#add-howell-pair-button"));

  $("#remove-howell-pair-button").removeClass("hidden");
}

function removeHowellPair() {
  var idToRemove = $(".howell-pair").length;
  $("#pair" + idToRemove + "-label").remove();
  $("#pair" + idToRemove + "-div").remove();

  if (idToRemove <= 2) {
    $("#remove-howell-pair-button").addClass("hidden");
  }
}
