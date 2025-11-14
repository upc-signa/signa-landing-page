describe('Formulario de Contacto', () => {
  
  beforeEach(() => {
    // Visita la página antes de cada prueba
    cy.visit('http://localhost:5500') // Ajusta la URL según tu proyecto
    
    // Scroll al formulario si es necesario
    cy.get('#contact').scrollIntoView()
  })

  // ========== PRUEBAS DE VALIDACIÓN ==========
  
  describe('Validaciones de campos', () => {
    
    it('Debe mostrar error cuando el nombre tiene menos de 3 caracteres', () => {
      cy.get('#name').type('Ab')
      cy.get('#email').click() // Trigger blur
      cy.get('#nameError').should('be.visible')
      cy.get('#nameError').should('contain', 'El nombre debe tener al menos 3 caracteres')
    })

    it('Debe mostrar error con email inválido', () => {
      cy.get('#email').type('correo-invalido')
      cy.get('#name').click()
      cy.get('#emailError').should('be.visible')
      cy.get('#emailError').should('contain', 'Ingresa un correo válido')
    })

    it('Debe mostrar error cuando el asunto está vacío', () => {
      cy.get('#subject').focus().blur()
      cy.get('#subjectError').should('be.visible')
      cy.get('#subjectError').should('contain', 'El asunto es requerido')
    })

    it('Debe mostrar error cuando el mensaje tiene menos de 10 caracteres', () => {
      cy.get('#message').type('Corto')
      cy.get('#name').click()
      cy.get('#messageError').should('be.visible')
      cy.get('#messageError').should('contain', 'El mensaje debe tener al menos 10 caracteres')
    })

    it('Debe mostrar error con formato de teléfono inválido', () => {
      cy.get('#phone').type('12345')
      cy.get('#name').click()
      cy.get('#phoneError').should('be.visible')
      cy.get('#phoneError').should('contain', 'Formato inválido')
    })

    it('No debe mostrar error con teléfono vacío (campo opcional)', () => {
      cy.get('#phone').should('exist')
      cy.get('#phoneError').should('not.be.visible')
    })
  })

  // ========== PRUEBAS DE ENVÍO EXITOSO ==========
  
  describe('Envío exitoso del formulario', () => {
    
    it('Debe enviar el formulario con todos los campos válidos', () => {
      // Llenar el formulario
      cy.get('#name').type('Juan Pérez')
      cy.get('#email').type('juan.perez@example.com')
      cy.get('#subject').type('Consulta sobre servicios')
      cy.get('#phone').type('987654321')
      cy.get('#message').type('Hola, me gustaría obtener más información sobre sus servicios.')

      // Enviar formulario
      cy.get('#contactForm').submit()

      // Verificar popup de éxito
      cy.get('#successPopup').should('be.visible')
      cy.get('#successPopup').should('contain', '¡Mensaje enviado!')
      cy.get('#successPopup').should('contain', 'Te contactaremos pronto')
      cy.get('#overlay').should('be.visible')
    })

    it('Debe enviar el formulario sin el campo teléfono (opcional)', () => {
      cy.get('#name').type('María García')
      cy.get('#email').type('maria@example.com')
      cy.get('#subject').type('Información general')
      cy.get('#message').type('Me interesa conocer más sobre el Proyecto SIGNA.')

      cy.get('button[type="submit"]').click()

      cy.get('#successPopup').should('be.visible')
    })
  })

  // ========== PRUEBAS DE CAMPOS REQUERIDOS ==========
  
  describe('Campos requeridos', () => {
    
    it('No debe enviar formulario con campos vacíos', () => {
      cy.get('button[type="submit"]').click()
      
      // Verificar que NO aparece el popup
      cy.get('#successPopup').should('not.be.visible')
      
      // Verificar que aparecen los errores
      cy.get('#nameError').should('be.visible')
      cy.get('#emailError').should('be.visible')
      cy.get('#subjectError').should('be.visible')
      cy.get('#messageError').should('be.visible')
    })

    it('Debe validar campo por campo al perder el foco', () => {
      cy.get('#name').focus().blur()
      cy.get('#nameError').should('be.visible')
      
      cy.get('#email').focus().blur()
      cy.get('#emailError').should('be.visible')
      
      cy.get('#subject').focus().blur()
      cy.get('#subjectError').should('be.visible')
      
      cy.get('#message').focus().blur()
      cy.get('#messageError').should('be.visible')
    })
  })

  // ========== PRUEBAS DE EXPERIENCIA DE USUARIO ==========
  
  describe('Experiencia de usuario', () => {
    
    it('Los placeholders deben ser visibles', () => {
      cy.get('#name').should('have.attr', 'placeholder', 'Tu nombre')
      cy.get('#email').should('have.attr', 'placeholder', 'Tu correo')
      cy.get('#subject').should('have.attr', 'placeholder', 'Asunto')
      cy.get('#phone').should('have.attr', 'placeholder', 'Teléfono (opcional)')
      cy.get('#message').should('have.attr', 'placeholder', 'Tu mensaje...')
    })

    it('El botón de envío debe estar visible y habilitado', () => {
      cy.get('button[type="submit"]')
        .should('be.visible')
        .should('not.be.disabled')
        .should('contain', 'Enviar mensaje')
    })

    it('Debe limpiar los errores al corregir los campos', () => {
      // Generar error
      cy.get('#name').type('Ab').blur()
      cy.get('#nameError').should('be.visible')
      
      // Corregir
      cy.get('#name').clear().type('Carlos')
      cy.get('#email').click()
      cy.get('#nameError').should('not.be.visible')
    })
  })

  // ========== PRUEBAS DE INTEGRACIÓN ==========
  
  describe('Flujo completo de usuario', () => {
    
    it('Debe completar todo el flujo: llenar, validar y enviar', () => {
      // Usuario llena el formulario paso a paso
      cy.get('#name').type('Ana Torres')
      cy.wait(300)
      
      cy.get('#email').type('ana.torres@email.com')
      cy.wait(300)
      
      cy.get('#subject').type('Solicitud de demo')
      cy.wait(300)
      
      cy.get('#phone').type('999888777')
      cy.wait(300)
      
      cy.get('#message').type('Buenas tardes, me gustaría agendar una demostración del sistema SIGNA para mi empresa. Gracias.')
      cy.wait(300)
      
      // Envía el formulario
      cy.get('button[type="submit"]').click()
      
      // Verifica el éxito
      cy.get('#successPopup').should('be.visible')
      cy.get('.success-icon').should('contain', '✓')
    })
  })

  // ========== PRUEBAS DE ACCESIBILIDAD ==========
  
  describe('Accesibilidad', () => {
    
    it('Todos los campos deben tener atributos name e id', () => {
      cy.get('#name').should('have.attr', 'name', 'name')
      cy.get('#email').should('have.attr', 'name', 'email')
      cy.get('#subject').should('have.attr', 'name', 'subject')
      cy.get('#phone').should('have.attr', 'name', 'phone')
      cy.get('#message').should('have.attr', 'name', 'message')
    })

    it('El formulario debe tener atributo novalidate', () => {
      cy.get('#contactForm').should('have.attr', 'novalidate')
    })
  })

  // ========== PRUEBAS DE EDGE CASES ==========
  
  describe('Casos extremos', () => {
    
    it('Debe manejar caracteres especiales en el nombre', () => {
      cy.get('#name').type('José María O\'Connor-García')
      cy.get('#email').click()
      cy.get('#nameError').should('not.be.visible')
    })

    it('Debe manejar emails con subdominios', () => {
      cy.get('#email').type('usuario@subdomain.example.com')
      cy.get('#name').click()
      cy.get('#emailError').should('not.be.visible')
    })

    it('Debe manejar mensajes muy largos', () => {
      const mensajeLargo = 'A'.repeat(500)
      cy.get('#message').type(mensajeLargo)
      cy.get('#name').click()
      cy.get('#messageError').should('not.be.visible')
    })

    it('Debe manejar diferentes formatos de teléfono válidos', () => {
      cy.get('#phone').type('987654321')
      cy.get('#name').click()
      cy.get('#phoneError').should('not.be.visible')
    })
  })
})

// ========== COMANDOS PERSONALIZADOS (Opcional) ==========
// Agrega esto en cypress/support/commands.js

Cypress.Commands.add('llenarFormularioContacto', (datos) => {
  if (datos.nombre) cy.get('#name').type(datos.nombre)
  if (datos.email) cy.get('#email').type(datos.email)
  if (datos.asunto) cy.get('#subject').type(datos.asunto)
  if (datos.telefono) cy.get('#phone').type(datos.telefono)
  if (datos.mensaje) cy.get('#message').type(datos.mensaje)
})

// Ejemplo de uso del comando personalizado:
// cy.llenarFormularioContacto({
//   nombre: 'Test User',
//   email: 'test@example.com',
//   asunto: 'Test',
//   telefono: '999999999',
//   mensaje: 'Este es un mensaje de prueba.'
// })