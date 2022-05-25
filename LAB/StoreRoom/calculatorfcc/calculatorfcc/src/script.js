// Assign Variables
const historyBtn = document.querySelector("#historyBtn");
const historyPanel = document.querySelector("#historyPanel");
const historyList = document.querySelector("#history-list");
const clearHistoryBtn = document.querySelector("#clear-history");
const el = document.querySelectorAll(".el");
const displaySum = document.querySelector("#currentSum");
const total = document.querySelector("#total");
const clear = document.querySelector("#clear");
const backArrow = document.querySelector("#backArrow");
const equals = document.querySelector(".equals");
let sum, historySum, historyTotal ;
let count = 0;
let brackets = 0;

// Add Event Listeners for click/keypress and add to screen 
el.forEach(elem => elem.addEventListener("click", highlightKey));
el.forEach(key => key.addEventListener("click", addKeysClick));
historyBtn.addEventListener('click', historyPanelSlide);
clearHistoryBtn.addEventListener('click', clearHistory);
clear.addEventListener("click", clearScreen);
backArrow.addEventListener("click", reduceSingleChar);
equals.addEventListener("click", equalsScreen);
historyPanel.style.left = "-75%";

// Regular Expressions
const regex1 = /(\%|\+|\*|\/|\.)/; // chars except - minus
const regex2 = /(\(|\%|\+|-|\*|\/|\.)/; // char with special char
const regex3 = /(?!\+\-)(\%|\+|-|\*|\/|\.){2}$/; // ignore plus minus together
const regex4 = /[0-9]/; // only a number
const regex5 = /(\()(\(\|\%|\+|-|\*|\/|\.)$/; //disallow special char after (;
const regex6 = /./; // check for a period
const regex7 = /(\(|\%|\+|-|\*|\/|\.)$/; // char with special char at the end

// Highlight All Keys
function highlightKey() {
    let key = this;
    this.classList.add("highlight");
     setTimeout(function() {
         key.classList.remove("highlight");
    }, 125);
}

// Main function - When Keys are Clicked
function addKeysClick() {

    // assign displaySum to Value
    let value = this.dataset.value;
    let lengthAlt = displaySum.innerHTML.length;
    backArrow.style.color = "#888";
    fontSize();

    //if brackets is clicked
    if (value == "()") {
        if ( (displaySum.innerHTML[lengthAlt-1] == ")") || (regex4.test(displaySum.innerHTML[lengthAlt-1])) ) {
            value = ")"
            if (brackets <= 0) {return false;}
            brackets--;
        }
        else if ( (lengthAlt === 0) || (regex2.test(displaySum.innerHTML[lengthAlt-1])) ) {
            value = "(";
            brackets++;
            
        }
    }
    // if (value == "()") {
    //     if (displaySum.innerHTML.length == 0) {
    //         value = "("
    //     }
    // }

    // if square root is clicked
    if(value == "sr") {
        let total = eval(displaySum.innerHTML);
        displaySum.innerHTML = Math.sqrt(total);
        if(displaySum.innerHTML.length > 6 ) {
            displaySum.innerHTML = displaySum.innerHTML.slice(0, 6);
            value ="";
        }
        else{
            value = "";
        } 
    }

    // assign value to displaySum's HTML (Screen)
    displaySum.innerHTML += value;
     
    // allows reset of calculator
    if((count == 1) && (!regex2.test(value))) {
        displaySum.innerHTML = value;
    }

    // Allows minus at the start
    if(displaySum.innerHTML.length === 1) {
        if(regex1.test(value)) {
            displaySum.innerHTML = "";
        }
    }

    // disallows double special chars except +-
    let length = displaySum.innerHTML.length;
    if((regex2.test(displaySum.innerHTML[length-2])) && (regex2.test(displaySum.innerHTML[length-1]))) {
        if(regex3.test(displaySum.innerHTML))  {
            
            if(value != "+") {
                 displaySum.innerHTML = displaySum.innerHTML.slice(0, length-2);
                 displaySum.innerHTML += value;
            }
            else if (value == "+") {
                displaySum.innerHTML = displaySum.innerHTML.slice(0, length-2);
                displaySum.innerHTML +=  "+";
            }
        }
    }

    // if not ending in a special char call totalSum
    if (!regex2.test(value) && (length > 0) && (brackets == 0)) {
         totalSum();
    } 

    // reset count
    count = 0;
}

//  Clear Screen Function
function clearScreen() {
    displaySum.innerHTML = "";
    total.innerHTML = "";
    backArrow.style.color = "#444";

    this.classList.add("highlight");
    setTimeout(function() {
         clear.classList.remove("highlight");
    }, 125);

}

// Back a Single Char Function
function reduceSingleChar() {
    displaySum.innerHTML = displaySum.innerHTML.slice(0, -1);
    if(displaySum.innerHTML.length === 0) {
        backArrow.style.color = "#444";
    }
    if(!regex3.test(displaySum.innerHTML)) {
        totalSum();
    } 
}

//  Equals Button Functions
function equalsScreen() {
    
    let endOfInput = displaySum.innerHTML;
    if (regex7.test(endOfInput)) {
        return false;
    }

    history();
    let sum = total.innerHTML;

    displaySum.innerHTML = sum;
    sum = sum.toString();

    let index;
    if (regex6.test(sum)) { 
        index = sum.indexOf(".");
        if (index != -1) {
            sum = sum.slice(0, index + 4);
            displaySum.innerHTML = sum;
        }
    }
    else {
        displaySum.innerHTML = sum;
    }

    total.innerHTML = "";

     equals.style.background = "#39609A";
     setTimeout(function() {
          equals.style.background = "#4B7CC5";
     }, 125);

     count = 1;
     fontSize();
}

// Total Function and Total Display on Screen
function totalSum() {
    let sum = displaySum.innerHTML;
    let index;
    
     if(eval(sum) != undefined) {
        sum = eval(sum);
        total.innerHTML = sum;
        if (regex6.test(sum)) {
            sum = sum.toString(); 
            index = sum.indexOf("."); 
            if (index != -1) {
                sum = sum.slice(0, index + 4);
                total.innerHTML = sum;
            }
        }
        else {
            total.innerHTML = sum;
        }
     }
     else {
         total.innerHTML = "";
     }
}

// History Panel Slide Out
function historyPanelSlide() {
    if(historyPanel.style.left == "-75%") {
         historyPanel.style.left = "0";
         historyBtn.innerHTML = "KEYPAD";
    }
    else {
        historyPanel.style.left = "-75%";
        historyBtn.innerHTML = "HISTORY";
    }
}

// Create and Store History Function
function history() {
    let sum = displaySum.innerHTML;
    let total = eval(sum);

    if (total == undefined) {
        return false;
    }
    
    let historyItem = `<div class="history-item" data-value="${total}"><hr/><span>${sum}</span><br /><span style="color: #4B7CC5;">=</span><span>${total}</span></div>`;
    historyList.innerHTML = historyItem + historyList.innerHTML;

    const historyDiv = document.querySelectorAll(".history-item");
    historyDiv.forEach(items => items.addEventListener("click", selectHistory));

    if (historyDiv.length > 4) {
        historyList.classList.add("scrollable");
    }
}

// Select History Function for use with additional sums
function selectHistory() {
    let last = displaySum.innerHTML.length;
    if(regex2.test(displaySum.innerHTML[last-1])) {
        displaySum.innerHTML += this.dataset.value;
    }
    else {
        displaySum.innerHTML = this.dataset.value;
        total.innerHTML = "";
    }
    totalSum();
    historyPanelSlide();
    fontSize();
}

// Clear History on button click
function clearHistory() {
    historyList.innerHTML = "";
    historyPanelSlide();
}

// Change font size with increasingly larger numbers
function fontSize() {
    let length = displaySum.innerHTML.length;
    if (length > 24) {
        displaySum.style.fontSize = "1rem";
    }
    else if (length > 17) {
        displaySum.style.fontSize = "1.5rem";
    }
    else if (length > 10) {
        displaySum.style.fontSize = "2rem";
    }
    else {
        displaySum.style.fontSize = "3rem";
    }
}
