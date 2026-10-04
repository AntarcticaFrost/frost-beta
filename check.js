function updateTime() {
    const now = new Date();

    document.getElementById("local-time").textContent =
        now.toLocaleString([], {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });
}

updateTime();
setInterval(updateTime, 1000);

const params = new URLSearchParams(window.location.search);
const floor = params.get("floor");



const checkBody = document.getElementById("check-body");

const startRoom = Number(floor) * 100 + 1;

for (let i = 0; i < 32; i++) {

    const roomNumber = startRoom + i;
    const rowNumber = i + 1;

    const row = document.createElement("tr");

    row.className = "room-row";

    row.innerHTML = `

        <td class="rooms">${roomNumber}</td>

        <td>
            <select>
                <option>Open</option>
                <option>Closed</option>
            </select>
        </td>

        <td>
            <input
            type="text"
            placeholder="Person Name"
            >
        </td>

        <td>
            <select>
                <option>In</option>
                <option>Out</option>
            </select>
        </td>

        <td>
            <input
                type="text"
                placeholder="Status"
            >
        </td>
    `;

    checkBody.appendChild(row);
}


function generateJSON() {

    const rows = document.querySelectorAll("#check-table tbody tr");

    const data = [];

    rows.forEach(row => {

        const room = row
            .querySelector(".rooms")
            .textContent
            .trim();

        const selects = row.querySelectorAll("select");

        const inputs = row.querySelectorAll("input");

        const door = selects[0].value;

        const inOut = selects[1].value;

        const person = inputs[0].value;

        const status = inputs[1].value;

        data.push({
            room: room,
            door: door,
            person: person,
            inOut: inOut,
            status: status
        });
    });


    /* Get name from header */

    const name = document
        .querySelector(".heading select")
        .value;


    /* Get today's date */

    const now = new Date();

    const year = now.getFullYear();

    const month = String(
        now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        now.getDate()
    ).padStart(2, "0");

    const date = `${year}-${month}-${day}`;


    /* Create JSON */

    const result = {

        header: {
            name: name,
            date: date
        },

        data: data
    };


    const json = JSON.stringify(
        result,
        null,
        4
    );


    /* Download JSON */

    const blob = new Blob(
        [json],
        {
            type: "application/json"
        }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
        `${date}-floor-${floor}.json`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
}


document
    .getElementById("json-btn")
    .addEventListener(
        "click",
        generateJSON
    );




    
function generatePDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();


    /* Get name */

    const name = document
        .querySelector(".heading select")
        .value;


    /* Get date */

    const now = new Date();

    const year = now.getFullYear();

    const month = String(
        now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        now.getDate()
    ).padStart(2, "0");

    const date = `${year}-${month}-${day}`;


    /* PDF title */

    doc.setFontSize(18);

    doc.text(
        "Room Check",
        14,
        10
    );


    /* Header information */

    doc.setFontSize(11);

    doc.text(
        `Checker: ${name}`,
        14,
        20
    );

    doc.text(
        `Date: ${date}`,
        14,
        27
    );


    /* Get table data */

    const rows = document.querySelectorAll(
        "#check-table tbody tr"
    );

    const tableData = [];


    rows.forEach(row => {

        const room = row
            .querySelector(".rooms")
            .textContent
            .trim();

        const selects = row.querySelectorAll("select");

        const inputs = row.querySelectorAll("input");

        const door = selects[0].value;

        const person = inputs[0].value;

        const inOut = selects[1].value;

        const status = inputs[1].value;


        tableData.push([
            room,
            door,
            person,
            inOut,
            status
        ]);

    }); 



    doc.autoTable({

        startY: 32,

        head: [
            [
                "Room",
                "Door",
                "Person",
                "In / Out",
                "Status"
            ]
        ],

        body: tableData

    });


    /* Save PDF */

    doc.save(
        `${date}-floor-${floor}.pdf`
    );
}


/* PDF button */

document
    .getElementById("pdf-btn")
    .addEventListener(
        "click",
        generatePDF
    );