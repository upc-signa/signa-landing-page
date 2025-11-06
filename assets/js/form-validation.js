// Inicializar EmailJS (reemplaza con tu PUBLIC_KEY)
emailjs.init('I0DeLYdXrmxyRUcAx');

const form = document.getElementById('contactForm');
const inputs = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    subject: document.getElementById('subject'),
    phone: document.getElementById('phone'),
    message: document.getElementById('message')
};

// Validaciones en tiempo real
inputs.name.addEventListener('input', () => validateField('name'));
inputs.email.addEventListener('input', () => validateField('email'));
inputs.subject.addEventListener('input', () => validateField('subject'));
inputs.phone.addEventListener('input', () => validateField('phone'));
inputs.message.addEventListener('input', () => validateField('message'));

function validateField(fieldName) {
    const field = inputs[fieldName];
    const errorElement = document.getElementById(fieldName + 'Error');
    let isValid = true;

    // Validación por campo
    switch(fieldName) {
        case 'name':
            isValid = field.value.trim().length >= 3;
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(field.value);
            break;
        case 'subject':
            isValid = field.value.trim().length > 0;
            break;
        case 'phone':
            // Opcional, pero si tiene contenido debe ser válido
            if (field.value.trim().length === 0) {
                isValid = true;
            } else {
                const phoneRegex = /^[0-9]{9,15}$/;
                isValid = phoneRegex.test(field.value.replace(/[\s-]/g, ''));
            }
            break;
        case 'message':
            isValid = field.value.trim().length >= 10;
            break;
    }

    // Actualizar UI
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('success');
        errorElement.classList.remove('show');
    } else {
        field.classList.remove('success');
        field.classList.add('error');
        errorElement.classList.add('show');
    }

    return isValid;
}

// Validación al enviar
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validar todos los campos
    let isFormValid = true;
    for (let fieldName in inputs) {
        if (!validateField(fieldName)) {
            isFormValid = false;
        }
    }

    // Si es válido, enviar con EmailJS
    if (isFormValid) {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        // Enviar email con EmailJS
        emailjs.send(
            'service_5bu9qgk',      // Reemplaza con tu Service ID
            'template_aqsfzrs',     // Reemplaza con tu Template ID
            {
                from_name: inputs.name.value,
                from_email: inputs.email.value,
                subject: inputs.subject.value,
                phone: inputs.phone.value || 'No proporcionado',
                message: inputs.message.value
            }
        ).then(
            function(response) {
                console.log('Email enviado!', response);
                
                // Mostrar popup de éxito
                document.getElementById('overlay').classList.add('show');
                document.getElementById('successPopup').classList.add('show');

                // Resetear formulario
                setTimeout(() => {
                    form.reset();
                    Object.values(inputs).forEach(input => {
                        input.classList.remove('success', 'error');
                    });
                    document.getElementById('overlay').classList.remove('show');
                    document.getElementById('successPopup').classList.remove('show');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Enviar mensaje';
                }, 2500);
            },
            function(error) {
                console.error('Error al enviar:', error);
                alert('Hubo un error al enviar el mensaje. Intenta de nuevo.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar mensaje';
            }
        );
    }
});

// Cerrar popup al hacer click en overlay
document.getElementById('overlay').addEventListener('click', function() {
    this.classList.remove('show');
    document.getElementById('successPopup').classList.remove('show');
});