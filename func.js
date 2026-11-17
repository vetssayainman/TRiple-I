const togglebutton = document.getElementById('toggle_btn')
const sidebar =  document.getElementById('sidebar')


let students = JSON.parse(localStorage.getItem("students")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

document.getElementById("generatebtn").addEventListener('click', () => {

    let name = document.getElementById('name').value.trim();
    let section = document.getElementById('choices').value;

    let qrdisplay = document.getElementById("qrcode");

    qrdisplay.innerHTML = '';

    if (!name || !section) {
        alert('Please complete all requirements!');
        return;
    }

    const qrData = `${section}|${name}`;


    new QRCode(qrdisplay, {
        text: qrData,
        width: 180,
        height: 180
    });

    document.getElementById("qr-display").style.display = "block";


    document.getElementById("userinfo").textContent =
        `${name} - ${section}`;

    let student = {
        name: name,
        section: section
    };

    students.push(student);

    localStorage.setItem("students", JSON.stringify(students));

});


document.getElementById("dowloadqr").addEventListener("click", () => {

    let qr = document.querySelector("#qrcode canvas");

    if (!qr) {
        alert("Please generate a QR code first!");
        return;
    }

    let downloadLink = document.createElement("a");

    downloadLink.href = qr.toDataURL("image/png");

    let name = document.getElementById("name").value.trim();

    downloadLink.download = `${name}-QR-Code.png`;

    downloadLink.click();

});


function onScanSuccess(decodedText) {

    // Separate QR code data
    const [choices, name] = decodedText.split("|");

    // Validate QR code
    if (!choices || !name) {
        alert("Wrong QR Code!");
        return;
    }

    const section = choices.trim();
    const studentName = name.trim();

    // Check duplicate attendance
    const alreadyRecorded = attendance.some(student =>
        student.name.toLowerCase() === studentName.toLowerCase() &&
        student.choices.toLowerCase() === section.toLowerCase()
    );

    if (alreadyRecorded) {
        alert("Attendance already recorded!");
        return;
    }

    // Get current time
    const now = new Date();
    const time = now.toLocaleTimeString();

    // Check attendance status
    let status;

    if (now.getHours() >= 7) {
        status = "Late";
    } else {
        status = "Present";
    }

    // Save attendance
    attendance.push({
        choices: section,
        name: studentName,
        time: time,
        status: status
    });

    // Update localStorage
    localStorage.setItem("attendance", JSON.stringify(attendance));

    alert(studentName + " is " + status);
}

function onScanError(errorMessage) {
    // Ignore continuous scanning errors
}



html5QrScanner.render(onScanSuccess, onScanError)

function toggleSidebar(){
    sidebar.classList.toggle('close')
    togglebutton.classList.toggle('rotate')

    Array.from(sidebar.getElementsByClassName("show")).forEach(ul=> {
        ul.classList.remove("show")
        ul.previousElementSibling.classList.remove("rotate")
    })
}

function toggleSection(button){
    button.nextElementSibling.classList.toggle("show")
    button.classList.toggle('rotate')

    if(sidebar.classList.contains("close")){
        sidebar.classList.toggle("close")
        togglebutton.classList.toggle("rotate")
    }
}