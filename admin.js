const fileInput = document.getElementById("json-files");
const createPdfButton = document.getElementById("create-pdf-btn");
const status = document.getElementById("status");


function getFloor(fileData) {

    const fileName = fileData.file.name;

    const match = fileName.match(/floor-(\d+)/i);

    if (!match) {
        return null;
    }

    return Number(match[1]);
}


createPdfButton.addEventListener("click", async function () {

    const files = Array.from(fileInput.files);

    // Check number of files
    if (files.length !== 6) {
        status.textContent = "Please select exactly 6 JSON files.";
        return;
    }

    status.textContent = "Reading JSON files...";

    const jsonFiles = [];

    try {

        for (const file of files) {

            const text = await file.text();

            const json = JSON.parse(text);

            // Check JSON structure
            if (!json.header || !json.data) {
                throw new Error(
                    `${file.name} does not have the correct JSON format.`
                );
            }

            jsonFiles.push({
                file: file,
                data: json
            });
        }

        createPDF(jsonFiles);

    } catch (error) {

        console.error(error);

        status.textContent =
            "Error reading JSON files: " + error.message;
    }

});


function createPDF(jsonFiles) {

    // Sort Floor 2 → Floor 7
    jsonFiles.sort((a, b) => {
        return getFloor(a) - getFloor(b);
    });


    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();


    jsonFiles.forEach((fileData, index) => {

        const floor = getFloor(fileData);
        const json = fileData.data;


        // New page for every floor
        if (index > 0) {
            doc.addPage();
        }


        // Floor title
        doc.setFontSize(18);

        doc.text(
            `Floor ${floor}`,
            14,
            10
        );


        // Header information
        doc.setFontSize(11);

        if (json.header) {

            doc.text(
                `Checker: ${json.header.name}`,
                14,
                20
            );

            doc.text(
                `Date: ${json.header.date}`,
                14,
                27
            );
        }


        // Convert JSON rows into PDF table rows
        const tableData = json.data.map(row => {

            return [
                row.room,
                row.door,
                row.person,
                row.inOut,
                row.status
            ];

        });


        // Create table
        doc.autoTable({

            startY: 32,

            head: [
                ["Room", "Door", "Person", "In / Out", "Status"]
            ],

            body: tableData

        });

    });

    const date = new Date().toISOString().split("T")[0];
    doc.save(`${date}-room-check.pdf`);
    status.textContent = "PDF created successfully!";

    // Save ONE combined PDF
    doc.save(`${date}-room-check.pdf`);


    status.textContent =
        "PDF created successfully!";
}

function checkPassword() {
    const password = document.getElementById("password").value;

    if (password === "PageAdmin1234") {
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("page-content").style.display = "block";
    } else {
        document.getElementById("error").textContent = "Wrong password.";
    }
}

document.getElementById("password").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        checkPassword();
    }
});