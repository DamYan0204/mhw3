//Scorrimento immagini first_main_div
function changeImage()
{
    const image = document.querySelector("#first_main_div img");
    image.src = nextImage();
}

function nextImage()
{
    img_index++;                        //passaggio all'indice successivo

    if(img_index === images.length)     //se l'indice del vettore delle immagini è gia alla fine lo riporta all'inizio
        img_index = 0;
    
    return images[img_index];
}


//Modali (Accedi, Contattaci, Carrello)
function onModalClick(event)
{
    let clicked = event.currentTarget;                      //Differenziamo ciò che ha fatto partire l'evento
    
    blur_div.classList.add("blur_background");              //Effetto sfocato sfondo

    if(clicked.id === "accedi")
    {
        modale_accedi.classList.remove("hidden");           //Fa apparire la finestra di login  
        document.body.insertBefore(blur_div, modale_accedi);
    }
    else if(clicked.id === "contattaci")
    {
        modale_contattaci.classList.remove("hidden");       //Fa apparire la finestra contattaci 
        document.body.insertBefore(blur_div, modale_contattaci);
    }
    else if(clicked.id === "carrello")
    {
        modale_carrello.classList.remove("hidden");         //Fa apparire la finestra del carrello  
        document.body.insertBefore(blur_div, modale_carrello);
    }
    else if(clicked.id === "cambia_accedi")
    {
        login_form.classList.remove("hidden");
        register_form.classList.add("hidden");
        cambia_accedi.classList.add("hidden");  
        cambia_registrati.classList.remove("hidden");       
    }
    else if(clicked.id === "cambia_registrati")
    {
        login_form.classList.add("hidden");
        register_form.classList.remove("hidden");
        cambia_accedi.classList.remove("hidden");
        cambia_registrati.classList.add("hidden");         
    }

    document.body.classList.add("no_scroll");               //Disattiva lo scroll della pagina quando appare la finestra di login
}

function onChiudiClick(event)
{
    let clicked = event.currentTarget;                      //Differenziamo ciò che ha fatto partire l'evento

    if(clicked.id === "chiudi_accedi" || clicked.id === "chiudi_registrati")
    {
        modale_accedi.classList.add("hidden");            //Nasconde la finestra di login/registrati
    }
    else if(clicked.id === "chiudi_contattaci")
    {
        modale_contattaci.classList.add("hidden");            //Nasconde la finestra contattaci
    }
    else if(clicked.id === "chiudi_carrello")
    {
        modale_carrello.classList.add("hidden");            //Nasconde la finestra del carrello
    }

    document.body.classList.remove("no_scroll");            //Riattiva lo scroll della pagina

    //Rimozione effetto sfocato
    blur_div.remove();
}


//lower navbar sub-sections
function lower_navbar_sub(event)
{
    let element = event.currentTarget;

    let subDiv = element.querySelector("div");  //Sotto-menu del flex.item*/

    switch(element.dataset.nav_category)    //In base all'attributo data riguardo la categoria fa comparire elementi diversi
    {
        case "apex":
        {
            if(event.type === 'mouseenter')
                subDiv.classList.remove("hidden");   //Fa apparire il sottomenu relativo alla sezione apex
            else
                subDiv.classList.add("hidden");      //Nasconde il sottomenu

            break;
        }

        case "infrastruttura":
        {
            if(event.type === 'mouseenter')
                subDiv.classList.remove("hidden");   //Fa apparire il sottomenu relativo alla sezione apex
            else
                subDiv.classList.add("hidden");      //Nasconde il sottomenu

            break;
        }

        case "computeraccessori":
        {
            if(event.type === 'mouseenter')
                subDiv.classList.remove("hidden");   //Fa apparire il sottomenu relativo alla sezione apex
            else
                subDiv.classList.add("hidden");      //Nasconde il sottomenu
            break;
        }

        case "servizi":
        {
            if(event.type === 'mouseenter')
                subDiv.classList.remove("hidden");   //Fa apparire il sottomenu relativo alla sezione apex
            else
                subDiv.classList.add("hidden");      //Nasconde il sottomenu
            break;
        }

        case "supporto":
        {
            if(event.type === 'mouseenter')
                subDiv.classList.remove("hidden");   //Fa apparire il sottomenu relativo alla sezione apex
            else
                subDiv.classList.add("hidden");      //Nasconde il sottomenu
            break;
        }

        case "offerte":
        {
            if(event.type === 'mouseenter')
                subDiv.classList.remove("hidden");   //Fa apparire il sottomenu relativo alla sezione apex
            else
                subDiv.classList.add("hidden");      //Nasconde il sottomenu
            break;
        }
    }
}


//navbar fissa
function fixed_navbar() 
{
    if (window.scrollY >= sticky)
        navbar.classList.add("fixed");
    else 
        navbar.classList.remove("fixed");  
}


//PayPal REST API
async function createOrder(intent) 
{
    // Funzione per ottenere il token di accesso OAuth2
    async function getAccessToken() 
    {
        const auth = `${client_id}:${client_secret}`;
        const data = 'grant_type=client_credentials';
        const response = await fetch(`${endpoint_url}/v1/oauth2/token`, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${btoa(auth)}`
            },
            body: data
        });
        const json = await response.json();
        return json.access_token;
    }

    const access_token = await getAccessToken();
    const order_data = 
    {
        intent: intent.toUpperCase(),
        purchase_units: 
        [{
            amount: 
            {
                currency_code: 'EUR',
                value: '100.00'
            }
        }]
    };

    const response = await fetch(`${endpoint_url}/v2/checkout/orders`, 
    {
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify(order_data)
    });

    const responseData = await response.json();
    
    // Controlla se l'ordine è stato approvato
    if (responseData.status === 'APPROVED')
    {
        console.log("APPROVATOOOOOOOOOOo");
        const completedOrderData = await completeOrder(responseData.id, 'capture');
        console.log('Ordine completato:', completedOrderData);
    }
    else
        window.location.href = responseData.links.find(link => link.rel === 'approve').href;
}

// Funzione per completare un ordine utilizzando l'API di PayPal
async function completeOrder(order_id, intent) 
{
    // Funzione per ottenere il token di accesso OAuth2
    async function getAccessToken() 
    {
        const auth = `${client_id}:${client_secret}`;
        const data = 'grant_type=client_credentials';
        const response = await fetch(`${endpoint_url}/v1/oauth2/token`, {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${btoa(auth)}`
            },
            body: data
        });
        const json = await response.json();
        return json.access_token;
    }

    const access_token = await getAccessToken();
    const response = await fetch(`${endpoint_url}/v2/checkout/orders/${order_id}/${intent}`, 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        }
    });

    return response.json();
}

//Email validation API
function getDomain(event)
{      
    event.preventDefault(); //Impediamo il submit del form per evitare che l'asincronità della fetch faccia effettuare la submit del form senza i controlli

    let email = document.querySelector("#register #email").value;

    // Effettua la verifica se è presente il carattere '@'
    let atIndex = email.indexOf('@');

    // Estrapola il dominio dalla parte dell'email che segue '@'
    let domain = email.substring(atIndex + 1);

    //API validazione dominio
    fetch("https://api.mailcheck.ai/domain/" + domain)
        .then(response => 
        {
            if (!response.ok) {
                throw new Error('Errore nella richiesta API: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => 
        {
            console.log("Risposta API:", data);

            //Controlli validità        Esempio dominio usa e getta: "tempmail.it"
            if(!data.mx || data.disposable) 
            {
                console.log("(!) Validazione email: L'email non è valida.");
                alert("(!) Email non valida (non usare email usa e getta)")
            }  
            else form.submit();               
        })
        .catch(error => 
        {
            console.error('Si è verificato un errore:', error);
        });
}


//Scorrimento immagini first_main_div
const images =
[
    "Immagini/Homepage/latitude1.jpg",
    "Immagini/Homepage/latitude2.png",
    "Immagini/Homepage/latitude3.png",
    "Immagini/Homepage/latitude4.png"
];
let img_index = 0;

const button3 = document.querySelector("#button3");
button3.addEventListener('click', changeImage);


//Modali (Accedi, Contattaci, Carrello)
const modale_accedi = document.querySelector("#modale_accedi");
const cambia_accedi = document.querySelector("#domanda_accedi");
const cambia_registrati = document.querySelector("#domanda_registrati");
const login_form = document.querySelector("#login");
const register_form = document.querySelector("#register");

const modale_contattaci = document.querySelector("#modale_contattaci");
const modale_carrello = document.querySelector("#modale_carrello");

const accedi = document.querySelector("#accedi");
const cambia_accedi_button = document.querySelector("#cambia_accedi");
const cambia_registrati_button = document.querySelector("#cambia_registrati");

const contattaci = document.querySelector("#contattaci");
const carrello = document.querySelector("#carrello");

const chiudi_button_accedi = document.querySelector("#chiudi_accedi");
const chiudi_button_registrati = document.querySelector("#chiudi_registrati");
const chiudi_button_contattaci = document.querySelector("#chiudi_contattaci");
const chiudi_button_carrello = document.querySelector("#chiudi_carrello");

const blur_div = document.createElement("div");                                     //div per sfondo sfocato

accedi.addEventListener('click', onModalClick);
cambia_accedi_button.addEventListener('click', onModalClick);
cambia_registrati_button.addEventListener('click', onModalClick);

contattaci.addEventListener('click', onModalClick);
carrello.addEventListener('click', onModalClick);

chiudi_button_accedi.addEventListener('click', onChiudiClick); 
chiudi_button_registrati.addEventListener('click', onChiudiClick); 
chiudi_button_contattaci.addEventListener('click', onChiudiClick); 
chiudi_button_carrello.addEventListener('click', onChiudiClick); 



//lower navbar sub-sections
const lowerNav_flexItem = document.querySelectorAll(".lower_navbar .flex-item"); 

for(let element of lowerNav_flexItem)                                              //Assegnazione di EventListener a ogni flex-item
{
    element.addEventListener('mouseenter', lower_navbar_sub);                      //Evento entrata mouse
    element.addEventListener('mouseleave', lower_navbar_sub);                      //Evento uscita mouse
}


//navbar fissa
window.onscroll = function() {fixed_navbar()};

const navbar = document.querySelector("#moving_navbar");
let sticky = navbar.offsetTop;


//PayPal REST API   https://developer.paypal.com/docs/api/payments/v2/

/*
CREDENZIALI PAYPAL SANDBOX
Email: sb-lip5330517516@personal.example.com
Password: nCSG>G3z
*/

//Variabili d'accesso 
const endpoint_url = 'https://api-m.sandbox.paypal.com'; // URL dell'endpoint di PayPal (sandbox)
const client_id = 'AYbELRRNR1eM0SfyYsSNBz_UaE0PgT_N_-JlFeLVCQSEAAKnIpMdI4ehEPOPELIANiPjXFHrJcsuYjG9';
const client_secret = 'EFi-ikrga6RnjrsqMHsCf1jsk3aX-uUxUHyQa-JBbjX2NypNiXo7R3c3AZK1MS35p7f80mDc6UcFsM5C'; 


const pay_button = document.querySelector("#modale_carrello .blue_button");
pay_button.addEventListener('click', async function()
{
    try 
    {
        const orderData = await createOrder('capture');
        console.log('Ordine creato:', orderData);
        
    } 
    catch (error) 
    {
        console.error('Errore:', error);
    }
});


//Email validation API      https://docs.mailcheck.ai/
const form = document.querySelector("#modale_accedi #register");
form.addEventListener('submit', getDomain);
