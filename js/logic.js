class AppointmentManager{
    constructor(){
        this.arrValues = JSON.parse(localStorage.getItem('registers')) || [];
        this.frmClinic = document.getElementById('appointmentForm');
        this.tableBody = document.querySelector('.tableBody'); 
        this.inputs = document.querySelectorAll('#appointmentForm input');
        
        this.init();
    }

    init(){
        if(this.frmClinic){
            this.frmClinic.addEventListener('submit',(event) => this.captureDataForm(event))
        }
    
        if(this.tableBody){
            this.generateTable(this.arrValues);
        }

        this.inputs.forEach((input) => {
            input.addEventListener('input', (e) => this.handleInput(e));
        });
    }

    handleInput = (e) =>{
        let input = e.target;
        if(input.classList.contains('inValidTrueInput')){
            input.classList.remove('inValidTrueInput');
            document.querySelector(`span.${input.id}`).classList.remove('inValidTrue');
            document.querySelector(`span.${input.id}`).classList.add('inValidFalse');
        }
    }

    validationRules = {
        patientID: (data) => /^\d+$/.test(data),
        patientDOB: (data) => new Date(data) < new Date(),
        patientPhone: (data) => /^\+?[1-9]\d{1,14}$/.test(data),
        patientEmail: (data) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data),
        appointmentDate: (data) => new Date(data) > new Date(),
        appointmentTime: (data) => {
            let hour = Number(data.split(':')[0]);
            return hour >= 8 && hour < 20;
        },
        registrationDate: (data) => new Date(data).getDate() + 1 == new Date().getDate(),
        registrationTime: (data) => {
            let hour = Number(data.split(':')[0]);
            return hour >= 8 && hour < 20;
        }
    };

    captureDataForm(event){
        event.preventDefault();

        let isValid = true;
        const dataFrmClinic = new FormData(this.frmClinic);
    
        for(const [name,value] of dataFrmClinic){
            let validate = this.validationRules[name] || (() => true);
    
            if(!validate(value)){
                isValid = false;
                document.querySelector(`span.${name}`).classList.remove('inValidFalse');
                document.querySelector(`span.${name}`).classList.add('inValidTrue');
                document.getElementById(`${name}`).classList.add('inValidTrueInput');
            }
        }
        
        if(isValid){
            this.arrValues.push(
                {
                    name: document.querySelector(`#patientName`).value,
                    dni: document.querySelector(`#patientID`).value,
                    phone: document.querySelector(`#patientPhone`).value,
                    mail: document.querySelector(`#patientEmail`).value,
                    date: document.querySelector(`#appointmentDate`).value,
                    specialty: document.querySelector(`#specialty`).value,
                    doctor: document.querySelector(`#doctor`).value,
                    type: document.querySelector(`#appointmentType`).value
                }
            )
            
            localStorage.setItem('registers',JSON.stringify(this.arrValues));
            this.generateTable(this.arrValues);

            document.querySelector('.list').click();
        }
    }

    generateTable = (data) =>{
        if(!this.tableBody) return;

        let rows =  `
        ${
            data.map(x => {
                return `
                    <tr>
                        <td>${x.name}</td>
                        <td>${x.dni}</td>
                        <td>${x.phone}</td>
                        <td>${x.mail}</td>
                        <td>${x.date}</td>
                        <td>${x.specialty}</td>
                        <td>${x.doctor}</td>
                        <td>${x.type}</td>
                    </tr>
                `
            }).join('')
        }
        `
    
        this.tableBody.innerHTML = rows;
    }
}

document.addEventListener('DOMContentLoaded',() =>{
    new AppointmentManager();
});