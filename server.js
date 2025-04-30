const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise'); // Usar versión con promesas
const cors = require('cors');
const stripe = require('stripe')('sk_test_51RBtjRIdZv7qeALIynbnXNPNTineSJF2ajTfQ9LbZLJXoP1pgAC83QJfa708lRZbjPxWDV7Px0s0TP6fkn1d5QVT0005hqPB8a');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

// Middleware para registrar conexiones entrantes
app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const port = req.connection.remotePort;
  console.log(`Incoming connection from IP: ${ip}, Port: ${port}`);
  next();
});

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Configuración del pool de conexiones
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'AlquilaTuEvento',
  port: 3307,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Pasarela simulada: valida tarjeta “1111222233334444” CVC “123”
app.post('/mock-payment', async (req, res) => {
  try {
    const { cardNumber, expMonth, expYear, cvc, amount, metadata } = req.body;

    // Validación hard-coded
    if (cardNumber !== '1111222233334444' || cvc !== '123') {
      return res.status(402).json({ status: 'declined', error: 'Tarjeta rechazada por mock-gateway' });
    }
    const now = new Date();
    if (
      expYear < now.getFullYear() ||
      (expYear === now.getFullYear() && expMonth < now.getMonth() + 1)
    ) {
      return res.status(402).json({ status: 'declined', error: 'Tarjeta expirada' });
    }

    // Simulamos proceso…
    const transactionId = uuidv4();
    console.log(`[mock-payment] Aprobado tx=${transactionId}`, { amount, metadata });

    return res.json({ status: 'approved', transactionId });
  } catch (err) {
    console.error('[mock-payment] Error:', err);
    res.status(500).json({ status: 'error', error: 'Error interno mock-gateway' });
  }
});


app.post('/api/update-listing', async (req, res) => {
  const { 
    id, 
    nombre, 
    descripcion, 
    precio, 
    tipo_de_habitacion, 
    habitaciones, 
    camas, 
    banos,
    miniatura,
    foto1,
    foto2,
    foto3 
  } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Falta el identificador del listado' });
  }

  try {
    const query = `
      UPDATE listings 
      SET nombre = ?, descripción = ?, precio = ?, \`tipo_de_habitación\` = ?, 
          habitaciones = ?, camas = ?, baños = ?,
          miniatura = ?, foto1 = ?, foto2 = ?, foto3 = ?
      WHERE id = ?
    `;
    const values = [
      nombre,
      descripcion,
      precio,
      tipo_de_habitacion,
      habitaciones,
      camas,
      banos,
      miniatura,
      foto1,
      foto2,
      foto3,
      id
    ];
    await pool.query(query, values);
    res.json({ message: 'Datos del apartamento actualizados correctamente' });
  } catch (error) {
    console.error('Error al actualizar el listado:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


// 🔹 Endpoint para obtener listados por clerkId del propietario
app.get('/api/listings-by-owner', async (req, res) => {
  const { clerkId } = req.query;

  console.log('🟢 Petición recibida en /api/listings-by-owner');
  console.log('📥 Query recibido:', req.query);

  if (!clerkId) {
    return res.status(400).json({ error: 'Se requiere clerkId' });
  }

  try {
    const connection = await pool.getConnection();
    console.log('🔄 Conexión a la base de datos establecida.');
    console.log('🔍 Buscando listados asociados a:', clerkId);
    
    // 2. Obtener los listados asociados a este usuario
    const [listings] = await connection.execute(
      'SELECT * FROM listings WHERE propietario_id = ?', 
      [clerkId]
    );
    
    connection.release();
    res.json(listings);

    console.log('🔎 Listados encontrados:', listings);
    
  } catch (error) {
    console.error('❌ Error al obtener listados:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});



// 🔹 Endpoint para obtener el rol del usuario
app.post('/api/getUserRole', async (req, res) => {
  const { clerkId } = req.body;

  console.log("🟢 Petición recibida en /api/getUserRole");
  console.log("📥 Body recibido:", req.body);

  if (!clerkId) {
    return res.status(400).json({ error: "Falta el parámetro clerkId" });
  }

  try {
    const connection = await pool.getConnection(); // 📌 Usar `await` para obtener la conexión
    console.log("🔄 Conexión a la base de datos establecida.");

    const query = "SELECT propietario FROM usuarios WHERE clerk_id = ?";
    const [results] = await connection.execute(query, [clerkId]); // 📌 `execute` en lugar de `query`
    
    connection.release(); // 🔹 Liberar la conexión

    console.log('🔎 Resultados de la consulta:', results);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.json({ propietario: results[0].propietario });
  } catch (err) {
    console.error('❌ Error en la consulta SQL:', err);
    return res.status(500).json({ error: 'Error en la base de datos' });0
  }
});


app.post('/webhooks/clerk', async (req, res) => {
  console.log('algo')
  const event = req.body;

  // Verificar que los datos se estén extrayendo correctamente
  console.log('Evento recibido:', event);

  if (event.type === 'user.created') {
    console.log('estoy dentro');
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    // Extracción de email
    const email = email_addresses && email_addresses.length > 0 ? email_addresses[0].email_address : null;
    // Formar el nombre completo
    const nombre = `${first_name || ''} ${last_name || ''}`.trim();
    
    console.log('ID:', id);
    console.log('Nombre:', nombre);
    console.log('Email:', email);
    console.log('Foto URL:', image_url);

    try {
      // Verifica si el usuario ya existe en la base de datos
      console.log('estoy dentro 2');
      const [exists] = await pool.query('SELECT id FROM usuarios WHERE clerk_id = ?', [id]);
      if (!exists.length) {
        // Inserta el usuario en la base de datos
        await pool.query(
          'INSERT INTO usuarios (clerk_id, nombre, email, foto_url, rol) VALUES (?, ?, ?, ?, ?)',
          [id, nombre, email, image_url, 'usuario']
        );
        console.log(`Usuario ${id} insertado correctamente`);
      } else {
        console.log(`El usuario ${id} ya existe`);
      }
    } catch (error) {
      console.error('Error al procesar el webhook:', error);
      return res.sendStatus(500);
    }
  }
  console.log('estoy fuera');

  res.sendStatus(200);
});

// Endpoint: Obtener listados con filtro por categoría
app.get('/listings', async (req, res) => {
  const { category } = req.query;

  let query = `
      SELECT 
          l.id, 
          l.nombre AS name, 
          l.descripción AS description, 
          l.precio AS price, 
          l.foto1, l.foto2, l.foto3, 
          l.review_scores_rating, 
          l.number_of_reviews, 
          l.tipo_de_habitación AS room_type, 
          d.ciudad, d.distrito, 
          c.Todas, c.Fiestas, c.Frente_a_la_playa AS beachfront, c.EventosCorporativos AS corporate_events
      FROM 
          listings l
      LEFT JOIN 
          direccion d ON l.id = d.id
      LEFT JOIN 
          categorias c ON l.id = c.id
      WHERE 
          l.estado = 1
  `;

  const values = [];

  if (category && category !== 'Todas') {
    let dbField;
    switch (category) {
      case 'Eventos corporativos':
        dbField = 'c.EventosCorporativos';
        break;
      case 'Frente a la playa':
        dbField = 'c.Frente_a_la_playa';
        break;
      default:
        dbField = `c.${category}`;
    }
    console.log('dbField:', dbField);
  }

  try {
    const [results] = await pool.query(query, values);
    console.log(`Number of listings found: ${results.length}`);
    res.json(results);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).send('Server Error');
  }
});


// app.get('/all-listings', async (req, res) => {
//     const query = `
//       SELECT 
//         l.*, 
//         d.*, 
//         c.*,
//         r.*,
//         s.*,
//         p.*
//       FROM 
//         listings l
//       LEFT JOIN 
//         direccion d ON l.id = d.id
//       LEFT JOIN 
//         categorias c ON l.id = c.id
//       LEFT JOIN
//         reglas r ON l.id = r.id
//       LEFT JOIN
//         servicios s ON l.id = s.id
//       LEFT JOIN
//         propietario p ON l.id = p.id
//     `;
  
//     try {
//       const [results] = await pool.query(query);
//       console.log(`Number of listings found: ${results.length}`);
//       res.json(results);
//     } catch (error) {
//       console.error('Error fetching all listings:', error);
//       res.status(500).send('Server Error');
//     }
//   });


  app.get('/all-listings', async (req, res) => {
    const { category } = req.query;
  
    // Base de la consulta
    let query = `
      SELECT 
        l.*, 
        d.*, 
        c.*,
        r.*,
        s.*,
        p.*
      FROM 
        listings l
      LEFT JOIN 
        direccion d ON l.id = d.id
      LEFT JOIN 
        categorias c ON l.id = c.id
      LEFT JOIN
        reglas r ON l.id = r.id
      LEFT JOIN
        servicios s ON l.id = s.id
      LEFT JOIN
        propietario p ON l.id = p.id
    `;

    console.log('query:', query);
  
    const values = [];

    console.log('category:', category);
  
    // Verifica si la variable 'category' está definida y no es igual a 'Todas'
    if (category && category !== 'Todas') {
      let dbField;
      console.log('entre dentro del if');

      // Dependiendo del valor de 'category', asigna un campo específico de la tabla 'categorias' a 'dbField'
      switch (category) {
        case 'Eventos corporativos':
          dbField = 'c.EventosCorporativos'; // Si 'category' es 'Eventos corporativos', asigna 'c.EventosCorporativos' a 'dbField'
          break;
        case 'Frente a la playa':
          dbField = 'c.Frente_a_la_playa'; // Si 'category' es 'Frente a la playa', asigna 'c.Frente_a_la_playa' a 'dbField'
          break;
        default:
          dbField = `c.${category}`; // Para cualquier otro valor de 'category', asigna 'c.' seguido del valor de 'category' a 'dbField'
      }

      // Imprime el valor de 'dbField' en la consola para depuración
      console.log('dbField:', dbField);

      // Agrega una cláusula WHERE a la consulta SQL para filtrar los resultados donde el campo 'dbField' sea igual a 1
      query += ` WHERE ${dbField} = 1`;
    }



  
    try {
      const [results] = await pool.query(query, values);
      console.log(`Number of listings found: ${results.length}`);
      res.json(results);
    } catch (error) {
      console.error('Error fetching all listings:', error);
      res.status(500).send('Server Error');
    }
  });



// Endpoint: Obtener listados por propietario
app.get('/listings-owner', async (req, res) => {
  const { propietario } = req.query;

  if (!propietario) {
    return res.status(400).send('Owner parameter is required');
  }

  try {
    const [results] = await pool.query(
      'SELECT * FROM listings WHERE estado = 1 AND propietario = ?',
      [propietario]
    );
    res.json(results);
  } catch (error) {
    console.error('Error fetching listings by owner:', error);
    res.status(500).send('Server Error');
  }
});

// Endpoint: Obtener un listado por ID
app.get('/listings1', async (req, res) => {
  const { id } = req.query;
  console.log('id:', id);

  if (!id) {
    return res.status(400).send('ID parameter is required');
  }

  try {
    const [results] = await pool.query('SELECT * FROM listings WHERE id = ?', [
      id,
    ]);
    res.json(results);
  } catch (error) {
    console.error('Error fetching listing by ID:', error);
    res.status(500).send('Server Error');
  }
});

// Endpoint: Actualizar disponibilidad
app.post('/updateNotAvailability', async (req, res) => {
  const { id, availability } = req.body;

  if (!id || !availability) {
    return res.status(400).send('ID and availability are required');
  }

  try {
    await pool.query(
      'UPDATE listings SET availability = ? WHERE id = ?',
      [JSON.stringify(availability), id]
    );
    res.json({ message: 'Availability updated successfully' });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).send('Server Error');
  }
});

// Endpoint: Obtener disponibilidad
app.get('/getNotAvailability', async (req, res) => {
  // Como la columna "availability" no existe, simplemente retornamos un arreglo vacío.
  res.json([]);
});


// Endpoint: Guardar una nueva orden
app.post('/ordenes', async (req, res) => {
  const {
    id_clerk_cliente,
    id_apartamento,
    nombre_apellido,
    check_in,
    check_out,
    numero_telefono,
    notas_adicionales,
    confirmado,
    monto_total,
    moneda,
    estado_pago,
    metodo_pago,
  } = req.body;

  const query = `
      INSERT INTO ordenes (
          id_clerk_cliente, id_apartamento, nombre_apellido, fecha_check_in, fecha_check_out, telefono, notas_adicionales, confirmado, monto_total, moneda, estado_pago, metodo_pago
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    id_clerk_cliente,
    id_apartamento,
    nombre_apellido,
    check_in,
    check_out,
    numero_telefono,
    notas_adicionales,
    confirmado,
    monto_total,
    moneda,
    estado_pago,
    metodo_pago,
  ];

  try {
    await pool.query(query, values);
    res.status(200).send('Order inserted successfully');
  } catch (error) {
    console.error('Error inserting order:', error);
    res.status(500).send('Server Error');
  }
});

app.post('/create-listing', async (req, res) => {
  // Extraemos los datos enviados desde el cliente
  const { id_clerk, nombre_usuario, imagen_url, paso1_1, paso1_2, paso1_3, paso1_4, paso1_5, paso1_6, paso1_7 } = req.body;

  try {
    console.log("ID Clerk recibido:", id_clerk, nombre_usuario, imagen_url); // Para depuración

    // Definición de miniatura y fotos a partir de paso1_7
    const miniatura = (paso1_7 && paso1_7.photos && paso1_7.photos.length > 0) ? paso1_7.photos[0] : null;
    const foto1 = miniatura;
    const foto2 = (paso1_7 && paso1_7.photos && paso1_7.photos.length > 1) ? paso1_7.photos[1] : null;
    const foto3 = (paso1_7 && paso1_7.photos && paso1_7.photos.length > 2) ? paso1_7.photos[2] : null;

    // 1. Insertar en la tabla listings
    const queryListing = `
      INSERT INTO listings 
      (estado, nombre, descripción, precio, miniatura, foto1, foto2, foto3, 
       proceso_de_llegada, invitados_incluidos, cancelación, habitaciones, tipo_de_habitación, 
       camas, baños, cochera, parking, piscina, gimnasio, review_scores_rating, number_of_reviews, propietario_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const listingsValues = [
      paso1_2?.pais || null,              // Se usa el país como "estado"
      paso1_6?.titulo || null,             // Título del anuncio
      paso1_6?.descripcion || null,        // Descripción
      paso1_6?.precio || null,             // Precio
      miniatura,
      foto1,
      foto2,
      foto3,
      null,                                // proceso_de_llegada (vacío o por defecto)
      paso1_3?.huespedes,                  // invitados_incluidos (valor por defecto)
      paso1_3?.cancelación,                // cancelación
      paso1_3?.dormitorios || null,         // habitaciones (aquí usamos dormitorios)
      paso1_3 ? "Duplex" : null,            // tipo_de_habitación (valor fijo de ejemplo)
      paso1_3?.camas || null,               // camas
      paso1_3?.baños || null,               // baños
      paso1_3?.cochera ||  null,            // cochera
      paso1_3?.parking ||  null,            // parking
      paso1_3?.piscina ||  null,           // piscina
      paso1_3?.gimnasio ||  null,           // gimnasio
      null,                                // review_scores_rating
      null,                                 // number_of_reviews
      id_clerk                             // propietario_id
    ];
    await pool.query(queryListing, listingsValues);

    // 2. Insertar en la tabla direccion
    const queryDireccion = `
      INSERT INTO direccion (distrito, ciudad, país, dirección, puerta, codigo_postal)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const direccionValues = [
      paso1_2?.district || null,
      paso1_2?.city || paso1_2?.ciudad || null,
      paso1_2?.pais || null,
      paso1_2?.address || null,
      paso1_2?.door || null,
      paso1_2?.postalCode || paso1_2?.codigo_postal || null

    ];
    await pool.query(queryDireccion, direccionValues);

    // 3. Insertar en la tabla categorias
    // Paso1_1 es un array con las categorías seleccionadas.
    const categorias = {
      Todas: paso1_1.includes('Todas') ? 1 : 0,
      Bodas: paso1_1.includes('Bodas') ? 1 : 0,
      Fiestas: paso1_1.includes('Fiestas') ? 1 : 0,
      Frente_a_la_playa: paso1_1.includes('Frente a la Playa') ? 1 : 0,
      Campo: paso1_1.includes('Campo') ? 1 : 0,
      EventosCorporativos: paso1_1.includes('Eventos Corporativos') ? 1 : 0,
    };
    const queryCategorias = `
      INSERT INTO categorias (Todas, Bodas, Fiestas, Frente_a_la_playa, Campo, EventosCorporativos)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const categoriasValues = [
      categorias.Todas,
      categorias.Bodas,
      categorias.Fiestas,
      categorias.Frente_a_la_playa,
      categorias.Campo,
      categorias.EventosCorporativos
    ];
    await pool.query(queryCategorias, categoriasValues);

    // 4. Insertar en la tabla reglas
    const reglas = paso1_5 || {};
    const queryReglas = `
      INSERT INTO reglas (no_fumar, no_fiestas, horas_de_silencio, no_mascotas, estrictos_en_el_check_in, estrictos_en_el_check_out, maximos_invitados_permitidos, respectar_las_reglas_de_la_comunidad, no_mover_los_muebles, limpieza_basica, areas_restringidas)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const reglasValues = [
      reglas.no_fumar ? 1 : 0,
      reglas.no_fiestas ? 1 : 0,
      reglas.horas_de_silencio ? 1 : 0,
      reglas.no_mascotas ? 1 : 0,
      reglas.estrictos_en_el_check_in ? 1 : 0,
      reglas.estrictos_en_el_check_out ? 1 : 0,
      reglas.maximos_invitados_permitidos ? 1 : 0,
      reglas.respetar_las_reglas_de_la_comunidad ? 1 : 0,
      reglas.no_mover_los_muebles ? 1 : 0,
      reglas.limpieza_basica ? 1 : 0,
      reglas.areas_restringidas ? 1 : 0
    ];
    await pool.query(queryReglas, reglasValues);

    // 5. Insertar en la tabla servicios
    const servicios = paso1_4 || {};
    const queryServicios = `
      INSERT INTO servicios (wifi, aire_acondicionado, calefacción, lavadora, plancha, toallas, detector_de_humo, detector_de_monoxido_de_carbono)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const serviciosValues = [
      servicios.wifi ? 1 : 0,
      servicios.aire_acondicionado ? 1 : 0,
      servicios.calefacción ? 1 : 0,
      servicios.lavadora ? 1 : 0,
      servicios.plancha ? 1 : 0,
      servicios.toallas ? 1 : 0,
      servicios.detector_de_humo ? 1 : 0,
      servicios.detector_de_monoxido_de_carbono ? 1 : 0,
    ];
    await pool.query(queryServicios, serviciosValues);

    // 6. Insertar en la tabla propietario
    const queryPropietario = `
      INSERT INTO propietario (foto_url, id_usuario, nombre_propietario, fecha_de_creación_de_cuenta, verificado)
      VALUES (?, ?, ?, ?, ?)
    `;
    const propietarioValues = [
      imagen_url || null,
      id_clerk || 'Desconocido',
      nombre_usuario ||'Desconocido',
      new Date(), // Fecha actual
      0
    ];
    await pool.query(queryPropietario, propietarioValues);

    res.status(200).send('Listado creado correctamente');
  } catch (error) {
    console.error('Error al crear el listado:', error);
    res.status(500).send('Server Error');
  }
});


app.post('/api/update-user', async (req, res) => {
  console.log('Datos recibidos en /api/update-user:', req.body);
  const { clerkId, fullName, email, direccion, telefono } = req.body;
  
  if (!clerkId) {
    console.error('Falta el clerkId en la petición');
    return res.status(400).json({ error: 'Se requiere el clerkId' });
  }
  try {
    const query = "UPDATE usuarios SET nombre = ?, email = ?, dirección = ?, telefono = ? WHERE clerk_id = ?";
    const values = [fullName, email, direccion, telefono, clerkId];
    console.log('Ejecutando query con valores:', values);
    const [result] = await pool.query(query, values);
    console.log('Resultado de la consulta:', result);
    res.json({ message: 'Datos del usuario actualizados correctamente' });
  } catch (error) {
    console.error('Error en /api/update-user:', error);
    res.status(500).json({ error: 'Error en el servidor', details: error.toString() });
  }
});

// Nuevo endpoint para obtener datos del usuario
app.get('/api/get-user', async (req, res) => { // <-- Usa comillas simples
  const { clerkId } = req.query;

  if (!clerkId) {
    return res.status(400).json({ error: 'Se requiere clerkId' });
  }

  try {
    const [results] = await pool.query(
      'SELECT nombre, email, dirección, telefono FROM usuarios WHERE clerk_id = ?',
      [clerkId]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(results[0]); // <-- Devuelve JSON
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error en el servidor' }); // <-- Siempre devuelve JSON
  }
});

// Nuevo endpoint para buscar listings sin filtrar por "estado"
app.get('/api/search-listings', async (req, res) => {
  const { destino, guests } = req.query;
  let query = `
    SELECT 
      l.id, 
      l.nombre AS name, 
      l.descripción AS description, 
      l.precio AS price, 
      l.foto1, 
      d.ciudad, 
      d.distrito,
      l.invitados_incluidos
    FROM listings l
    LEFT JOIN direccion d ON l.id = d.id
    WHERE 1=1
  `;
  const values = [];

  if (destino) {
    query += ` AND LOWER(d.ciudad) LIKE ?`;
    values.push('%' + destino.toLowerCase() + '%');
  }

 if (guests) {
   query += ` AND l.invitados_incluidos >= ?`;
   values.push(parseInt(guests, 10));
 }

  try {
    const [results] = await pool.query(query, values);
    res.json(results);
  } catch (error) {
    console.error('Error al buscar listings:', error);
    res.status(500).send('Error en el servidor');
  }
});



app.post('/api/getOwnerStatus', async (req, res) => {
  const { clerkId } = req.body;
  
  if (!clerkId) {
    return res.status(400).json({ error: 'Falta el parámetro clerkId' });
  }

  try {
    const [results] = await pool.query(
      'SELECT propietario, revision FROM usuarios WHERE clerk_id = ?', 
      [clerkId]
    );
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ 
      propietario: results[0].propietario,
      revision: results[0].revision 
    });
    
  } catch (error) {
    console.error('Error en /api/getOwnerStatus:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


app.post('/api/updateUserDocuments', async (req, res) => {
  const { clerk_id, documentopersonal_adelante, documentopersonal_detras, documentodomicilio, fotocara } = req.body;

  console.log('Datos recibidos en /api/updateUserDocuments:', req.body);

  if (!clerk_id || !documentopersonal_adelante || !documentopersonal_detras || !documentodomicilio || !fotocara) {
    return res.status(400).json({ error: 'Faltan documentos requeridos' });
  }

  try {
    const [result] = await pool.query(
      `UPDATE usuarios 
       SET documentopersonaladelante = ?, 
           documentopersonaldetras = ?,
           documentodomicilio = ?,
           fotocara = ?,
           revision = 1 
       WHERE clerk_id = ?`,
      [documentopersonal_adelante, documentopersonal_detras, documentodomicilio, fotocara, clerk_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Documentación actualizada y en revisión' });
  } catch (error) {
    console.error('Error en la base de datos:', error);
    res.status(500).json({ error: 'Error al guardar la documentación' });
  }
});

// Endpoint para crear Payment Intent
app.post('/create-payment-intent', async (req, res) => {
  try {
    console.log('[create-payment-intent] Inicio');
    const { amount, metadata } = req.body;
    // Validación de amount
    if (typeof amount !== 'number' || amount <= 0) {
      console.error('[create-payment-intent] Monto inválido:', amount);
      return res.status(400).json({ error: 'Amount must be a positive number.' });
    }
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'eur',
        metadata,
        automatic_payment_methods: { enabled: true }
    });
    console.log('[create-payment-intent] PaymentIntent creado:', paymentIntent.id);
    res.json({
        clientSecret: paymentIntent.client_secret,
        paymentId: paymentIntent.id
    });
    console.log('[create-payment-intent] Fin');
  } catch (error) {
    console.error('[create-payment-intent] Error:', error);
    res.status(500).json({ error: error.message || 'Error al crear PaymentIntent.' });
  }
});

// Endpoint para confirmar el pago y guardar la orden
app.post('/confirm-payment', async (req, res) => {
  try {
    console.log('[confirm-payment] Inicio');
    const { paymentId, orderData } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
    console.log('[confirm-payment] PaymentIntent status:', paymentIntent.status);
    if (paymentIntent.status !== 'succeeded') {
      throw new Error('El pago no fue exitoso');
    }
    // Insertar la orden en la base de datos...
    // Por ejemplo:
    const query = `
        INSERT INTO ordenes (
            id_clerk_cliente, id_apartamento, nombre_apellido, check_in, check_out, numero_telefono, notas_adicionales, monto_total, stripe_payment_id, estado_pago
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'completado')
    `;
    await pool.query(query, [
        orderData.id_clerk_cliente,
        orderData.id_apartamento,
        orderData.nombre_apellido,
        orderData.check_in,
        orderData.check_out,
        orderData.numero_telefono,
        orderData.notas_adicionales,
        orderData.monto_total,
        orderData.stripe_payment_id
    ]);
    console.log('[confirm-payment] Orden insertada');
    res.json({ success: true });
    console.log('[confirm-payment] Fin');
  } catch (error) {
    console.error('[confirm-payment] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
