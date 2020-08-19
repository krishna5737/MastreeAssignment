function randomBinaryDigit() {
  let y = Math.random();
  return y < 0.5 ? 0 : 1;
}

function generateNewGridArray() {
  for (let i = 0; i < row; i++) {
    gridArrayCurrent[i] = [];
    gridArrayRequired[i] = [];
    for (let j = 0; j < row; j++) {
      let x = randomBinaryDigit();
      gridArrayCurrent[i][j] = x;
      gridArrayRequired[i][j] = x;
    }
  }
  return gridArrayCurrent;
}

function flipGridArray() {
  let randomFlipCount = Math.floor(Math.random() * 10);
  for (let i = 0; i < randomFlipCount; i++) {
    let flipType = Math.random() < 0.5 ? "row" : "col";
    let rowColID = Math.floor(Math.random() * row);
    if (flipType == "row") {
      gridArrayRequired[rowColID] = gridArrayRequired[rowColID].map(
        (currentCellValue) => 1 - currentCellValue
      );
    }
    if (flipType == "col") {
      for (let i = 0; i < gridArrayRequired.length; i++) {
        gridArrayRequired[i][rowColID] = 1 - gridArrayRequired[i][rowColID];
      }
    }
  }
}

function updateFipGrid() {
  let row = window.row || 3;
  generateNewGridArray(row);
  flipGridArray();
  $("#flipGameCurrent").empty();
  $("#flipGameOutput").empty();
  $("#flipGameDiv").css("display", "flex");
  $("#userWon").css("display", "none");
  $("#flipGameCurrent").append(getTableHTML(row, gridArrayCurrent));
  $("#flipGameOutput").append(getTableHTML(row, gridArrayRequired, true));
  if (checkIfUserWon()) {
    updateFipGrid();
  }
}

function checkIfUserWon() {
  for (let i = 0; i < gridArrayCurrent.length; i++) {
    for (let j = 0; j < gridArrayCurrent.length; j++) {
      if (gridArrayCurrent[i][j] !== gridArrayRequired[i][j]) {
        return false;
      }
    }
  }
  return true;
}

function updateUserScore() {
  userScore+=1;
  $("#userScore").empty();
  $("#userScore").append(`<h4>User Score: ${userScore}</h4>`)
}

function flipRowColumnOnUserClick() {
  updateUserScore();
  let flipType = event.currentTarget.dataset.headertype;
  let rowColID = +event.currentTarget.dataset.rowcolid;
  if (flipType == "row") {
    gridArrayCurrent[rowColID - 1] = gridArrayCurrent[rowColID - 1].map(
      (currentCellValue) => 1 - currentCellValue
    );
  }
  if (flipType == "col") {
    for (let i = 0; i < gridArrayCurrent.length; i++) {
      gridArrayCurrent[i][rowColID - 1] = 1 - gridArrayCurrent[i][rowColID - 1];
    }
  }
  let isUserWon = checkIfUserWon();
  if (!isUserWon) {
    $("#flipGameCurrent").empty();
    $("#flipGameCurrent").append(
      getTableHTML(gridArrayCurrent.length, gridArrayCurrent)
    );
    $("#userWon").css("display", "none");
  } else {
    $("#userWon").css("display", "flex");
    $("#flipGameDiv").css("display", "none");
  }
}

function getTableHTML(row, gridArray, noActiveButton) {
  let tableHTML = `<table class="table table-danger"><tbody>`;
  row += 1;
  for (let i = 0; i < row; i++) {
    if (i == 0) {
      tableHTML += `<thead><tr>`;
      for (let j = 0; j < row; j++) {
        if (j == 0) {
          tableHTML += ` <th scope="col"></th>`;
        } else {
          tableHTML += `<td scope="col">`;
          tableHTML += noActiveButton
            ? `${String.fromCharCode(j + 64)}`
            : `<button onClick="flipRowColumnOnUserClick()" data-headerType="col" data-rowColID=${j} type="button" class="btn btn-primary">${String.fromCharCode(
                j + 64
              )}</button>`;
          tableHTML += `</td>`;
        }
      }
      tableHTML += `</tr></thead>`;
    } else {
      tableHTML += `<tr>`;
      for (let j = 0; j < row; j++) {
        if (j == 0) {
          tableHTML += `<th scope="row">`;
          tableHTML += noActiveButton
            ? `${i}`
            : `<button data-gridArray=${JSON.stringify(
                gridArray
              )} onClick="flipRowColumnOnUserClick()" data-headerType="row" data-rowColID=${i} type="button" class="btn btn-primary">${i}</button>`;
          tableHTML += `</th>`;
        } else {
          tableHTML += ` <td scope="row">${gridArray[i - 1][j - 1]}</td>`;
        }
      }
      tableHTML += `</tr>`;
    }
  }
  tableHTML += `</tbody></table>`;
  return tableHTML;
}

function formSubmit() {
  let row = +$("#rowValue").val();
  event.preventDefault();
  event.stopPropagation();
  createNewGame(row);
}

function createNewGame(row) {
  window.userScore = 0;
  window.row = row || 3;
  window.gridArrayCurrent = [];
  window.gridArrayRequired = [];
  updateFipGrid(row);
}

$(document).ready(function () {
  createNewGame();
});
