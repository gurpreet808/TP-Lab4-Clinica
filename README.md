## Clínica Online

### Descripción

Clínica Online es una aplicación web que permite a los pacientes solicitar turnos con especialistas, y a los especialistas gestionar sus horarios y la historia clínica de sus pacientes. La aplicación está construida con Angular 17, Firebase (Firestore, Authentication, Storage) y PrimeNG para los estilos.

### Tecnologías Utilizadas

*   Angular 17
*   Firebase (Firestore, Authentication, Storage)
*   PrimeNG

### Funcionalidades

**Autenticación:**

*   Registro de usuarios como pacientes, especialistas.
*   Inicio de sesión con email y contraseña.
*   Verificación de email.
*   Recuperación de contraseña.

**Gestión de Usuarios:**

*   El administrador puede registrar nuevos usuarios como pacientes o especialistas o si es necesario como administradores.
*   El administrador puede habilitar o deshabilitar el acceso de los especialistas.

**Especialidades:**

*   El administrador puede gestionar las especialidades médicas (crear, editar, eliminar).
*   Los especialistas pueden agregar nuevas especialidades durante el registro, sujetas a aprobación del administrador.

**Obras Sociales:**

*   El administrador puede gestionar las obras sociales (crear, editar, eliminar).

**Turnos:**

*   Los pacientes pueden solicitar turnos con especialistas, seleccionando la especialidad, el especialista, la fecha y la hora.
*   Los especialistas pueden gestionar sus horarios de atención por especialidad (crear, editar, eliminar).
*   Los especialistas pueden ver, aceptar, rechazar y finalizar los turnos solicitados.
*   Los administradores pueden ver y cancelar los turnos si es que ya no se aceptó por parte del especialista.

**Historia Clínica:**

*   Los especialistas pueden registrar la historia clínica de los pacientes al finalizar un turno, incluyendo información básica (altura, peso, temperatura, presión) y campos dinámicos que necesite agregar.
*   Los pacientes pueden ver su propia historia clínica.
*   Los especialistas pueden ver la historia clínica de todos los pacientes en la sección Pacientes.
*   Los administradores pueden ver la historia clínica de todos los pacientes en la sección Usuarios.

**Exportar Datos:**

*   El administrador puede exportar los datos de los usuarios a un archivo Excel.

### Instrucciones de Uso

1.  **Registro:** Accede a la página de registro y crea una cuenta como paciente, especialista o administrador.
2.  **Inicio de sesión:** Inicia sesión con tu email y contraseña. No olvides validar tu mail. Si no encuentras el mail revisa SPAM o desde la aplicación puedes reenviar el mail.
3.  **Solicitar Turno (Paciente/Administrador):** Selecciona la especialidad, el especialista, la fecha y la hora del turno. Si el que está solicitando el turno es un administrador primero debe seleccionar el paciente.
4.  **Gestionar Horarios (Especialista):** Accede a la sección "Mis Horarios" para configurar tu disponibilidad horaria por especialidad.
5.  **Gestionar Turnos (Especialista):** Accede a la sección "Mis Turnos" para ver, aceptar, rechazar o finalizar los turnos solicitados.
6.  **Ver Historia Clínica (Paciente):** Accede a la sección "Mi Perfil" para ver tu historia clínica.
7.  **Gestionar Usuarios (Administrador):** Accede a la sección "Usuarios" para crear, editar o eliminar usuarios.