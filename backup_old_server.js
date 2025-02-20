const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

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

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'airbnb',
  port: 3307 // Cambia el puerto aquí
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL server.');
});

// app.get('/listings', (req, res) => {
//   const { category } = req.query;

//   let query = 'SELECT * FROM listings WHERE estado = 1';
//   const values = [];

//   if (category && category !== 'Todas') {
//     let dbField;
//     switch (category) {
//       case 'Eventos corporativos':
//         dbField = 'EventosCorporativos';
//         break;
//       case 'Frente a la playa':
//         dbField = 'Frente_a_la_playa';
//         break;
//       default:
//         dbField = category;
//     }
//     query += ' AND ?? = 1';
//     values.push(dbField);
//   }

//   connection.query(query, values, (error, results, fields) => {
//     if (error) {
//       console.error('Error fetching listings:', error);
//       res.status(500).send('Server Error');
//     } else {
//       res.json(results);
//     }
//   });
// });

app.get('/listings', async (req, res) => {
  const { category } = req.query;

  // Base de la consulta
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

  // Filtrar por categoría si se proporciona
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
      query += ` AND ${dbField} = 1`;
  }

  try {
      // Ejecutar la consulta con los valores
      const [results] = await connection.query(query, values);
      res.json(results);
  } catch (error) {
      console.error('Error fetching listings:', error);
      res.status(500).send('Server Error');
  }
});


app.get('/listings-owner', (req, res) => { 
  const { propietario } = req.query; // Obtener el parámetro de usuario
  console.log(propietario);
  if (!propietario) { 
    return res.status(400).send('Owner parameter is required'); 
  }
  connection.query('SELECT * FROM listings WHERE estado = 1 AND propietario = ?', [propietario], (error, results, fields) => {
     if (error) { 
      console.error(error); 
      res.status(500).send('Server Error'); 
    } else { 
      res.json(results); 
      console.log(results); 
    } 
  }); 
});

app.get('/listings-admin', (req, res) => { 
  connection.query('SELECT * FROM listings WHERE estado = 1', (error, results, fields) => {
    if (error) { 
      console.error(error); 
      res.status(500).send('Server Error'); 
    } else { 
      res.json(results); 
      console.log(results); 
    } 
  }); 
});

app.get('/listings1', (req, res) => {
  const { id } = req.query;
  console.log(`Received id: ${id}`);
  if (!id) {
    return res.status(400).send('ID parameter is required');
  }
  connection.query('SELECT * FROM listings WHERE id = ?', [id], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('Server Error');
    } else {
      res.json(results);
      console.log(results);
    }
  });
});

// Nueva ruta para actualizar la disponibilidad
app.post('/updateNotAvailability', (req, res) => {
  console.log('Received request to update availability');
  console.log(req.body);
  const { id, availability } = req.body;
  if (!id || !availability) {
    return res.status(400).send('ID and availability are required');
  }
  connection.query('UPDATE listings SET availability = ? WHERE id = ?', [JSON.stringify(availability), id], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('Server Error');
    } else {
      res.json({ message: 'Availability updated successfully' });
      console.log(results);
    }
  });
});

// Endpoint para obtener la disponibilidad
app.get('/getNotAvailability', (req, res) => {
  const { id } = req.query;
  console.log('Received request to get availability for listing ID:', id);
  if (!id) {
    return res.status(400).send('ID parameter is required');
  }
  connection.query('SELECT availability FROM listings WHERE id = ?', [id], (error, results, fields) => {
    console.log('Results:', results);
    if (error) {
      console.error('Error fetching availability:', error);
      res.status(500).send('Internal server error');
    } else if (results.length > 0) {
      res.json(results[0].availability); // Elimina JSON.parse
    } else {
      res.status(404).json({ error: 'Listing not found' });
    }
  });
});

// Ruta para guardar una nueva orden
app.post('/ordenes', (req, res) => {
  const { id_clerk_cliente, id_apartamento, nombre_apellido, check_in, check_out, numero_telefono, notas_adicionales, confirmado } = req.body;

  const query = 'INSERT INTO ordenes (id_clerk_cliente, id_apartamento, nombre_apellido, check_in, check_out, numero_telefono, notas_adicionales, confirmado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [id_clerk_cliente, id_apartamento, nombre_apellido, check_in, check_out, numero_telefono, notas_adicionales, confirmado];

  connection.query(query, values, (err, result) => {
      if (err) {
          console.error('Error inserting order:', err);
          res.status(500).send('Error inserting order');
          return;
      }
      res.status(200).send('Order inserted successfully');
  });
});

// Ruta para obtener el nombre de un listing por ID desde el cuerpo de la solicitud
app.post('/obtenerApartamento', (req, res) => {
  console.log('Received request to get listing name by ID');
  const { listingId } = req.body;

  if (!listingId) {
    res.status(400).send('listingId is required');
    return;
  }

  const query = 'SELECT name FROM listings WHERE id = ?';
  connection.query(query, [listingId], (error, results, fields) => {
    if (error) {
      console.error('Error fetching listing name:', error);
      res.status(500).send('Server Error');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Listing not found');
      return;
    }
    res.json({ name: results[0].name });
  });
});

app.post('/anyadir-propiedad', (req, res) => {
  const {
      name, miniatura, foto1, foto2, foto3, video1, room_type, maximo_personas, bedrooms, beds, bathrooms,
      review_scores_rating, number_of_reviews, host_picture_url, host_name, host_since, description, price,
      distrito, ciudad, pais, estado, propietario, availability, todas, bodas, fiestas, frente_a_la_playa,
      campo, eventosCorporativos, no_smoking, no_pirotecnia, quiet_hours, no_pets, check_in_out_strict,
      max_guests_allowed, respect_community_rules, no_furniture_moving, basic_cleaning_required, restricted_areas, wifi, kitchen,
      parking, tv, air_conditioning, heating, washer_dryer, pool, gym, hair_dryer, iron, towels_and_linen,
      smoke_detector, carbon_monoxide_detector
  } = req.body;

  const query = `
  INSERT INTO listings (
      name, foto1, room_type, maximo_personas, bedrooms, beds, bathrooms, review_scores_rating,
      number_of_reviews, host_picture_url, host_name, host_since, description, price, miniatura, party,
      proceso_de_llegada, cancelacion, distrito, ciudad, pais, estado, propietario, availability, Todas,
      Bodas, Fiestas, Frente_a_la_playa, Campo, EventosCorporativos, no_smoking, no_pirotecnia, quiet_hours,
      no_pets, check_in_out_strict, max_guests_allowed, respect_community_rules, no_furniture_moving, basic_cleaning_required,
      restricted_areas, wifi, kitchen, parking, tv, air_conditioning, heating, washer_dryer, pool, gym,
      hair_dryer, iron, towels_and_linen, smoke_detector, carbon_monoxide_detector, foto2, foto3
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const values = [
  name, foto1, room_type, maximo_personas, bedrooms, beds, bathrooms, review_scores_rating, number_of_reviews,
  host_picture_url, host_name, host_since, description, price, miniatura, 1, 1, 1, distrito, ciudad, pais, estado,
  propietario, JSON.stringify(availability), todas, bodas, fiestas, frente_a_la_playa, campo, eventosCorporativos,
  no_smoking, no_pirotecnia, quiet_hours, no_pets, check_in_out_strict, max_guests_allowed, respect_community_rules,
  no_furniture_moving, basic_cleaning_required, restricted_areas, wifi, kitchen, parking, tv, air_conditioning, heating,
  washer_dryer, pool, gym, hair_dryer, iron, towels_and_linen, smoke_detector, carbon_monoxide_detector, foto2, foto3
];

  connection.query(query, values, (err, result) => {
      if (err) {
          console.error('Error inserting property:', err);
          res.status(500).send('Error inserting property');
          return;
      }
      res.status(200).send('Property inserted successfully');
  });
});


app.post('/insert-listing', (req, res) => {
  const query = `
    INSERT INTO listings (
      name, foto1, room_type, maximo_personas, bedrooms, beds, bathrooms, review_scores_rating,
      number_of_reviews, host_picture_url, host_name, host_since, description, price, miniatura, party,
      proceso_de_llegada, cancelacion, distrito, ciudad, pais, estado, propietario, availability, Todas,
      Bodas, Fiestas, Frente_a_la_playa, Campo, EventosCorporativos, no_smoking, no_pirotecnia, quiet_hours,
      no_pets, check_in_out_strict, max_guests_allowed, respect_community_rules, no_furniture_moving, basic_cleaning_required,
      restricted_areas, wifi, kitchen, parking, tv, air_conditioning, heating, washer_dryer, pool, gym,
      hair_dryer, iron, towels_and_linen, smoke_detector, carbon_monoxide_detector, foto2, foto3
    ) VALUES (
      'Cozy Cabin Retreat', 'https://a0.muscache.com/im/pictures/4f366dcd-0481-4d40-9c24-3f99695068b5.jpg?aki_policy=x_large', 'Studio', '2', '1', '1', '1', '92', '45', 'https://a0.muscache.com/im/pictures/4f366dcd-0481-4d40-9c24-3f99695068b5.jpg?aki_policy=x_large', 'Michael Johnson', '0000-00-00', 'Este moderno apartamento de un dormitorio, situado en el corazÃ³n de la ciudad, es perfecto para explorar todo lo que ofrece la vida metropolitana. Con una decoraciÃ³n elegante y contemporÃ¡nea, el espacio estÃ¡ diseÃ±ado para tu comodidad y estilo. El luminoso salÃ³n cuenta con grandes ventanales que permiten disfrutar de vistas panorÃ¡micas de la ciudad. RelÃ¡jate en el sofÃ¡ mientras disfrutas de tu serie favorita o prepara una cena en la cocina abierta, equipada con electrodomÃ©sticos de Ãºltima generaciÃ³n y todo lo necesario para tus comidas.', '120', 'https://a0.muscache.com/im/pictures/4f366dcd-0481-4d40-9c24-3f99695068b5.jpg?aki_policy=x_large', '1', '1', '1', 'London', 'London', 'UK', '1', 'user_2meNa6DZWkgTu3zumDFDHHfiiMU', '[\"2024-09-29\", \"2024-10-01\", \"2024-10-02\", \"2024-09-30\", \"2024-10-03\", \"2024-10-04\", \"2024-10-24\"]', '1', '1', '0', '1', '1', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '', ''
    )
  `;

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error inserting property:', err);
      res.status(500).send('Error inserting property');
      return;
    }
    res.status(200).send('Property inserted successfully');
  });
});

const CONSTANTS = {
  name: 'Cozy Cabin Retreat',
  foto1: 'https://a0.muscache.com/im/pictures/4f366dcd-0481-4d40-9c24-3f99695068b5.jpg?aki_policy=x_large',
  room_type: 'Studio',
  maximo_personas: 2,
  bedrooms: 1,
  beds: 1,
  bathrooms: 1,
  review_scores_rating: 92,
  number_of_reviews: 45,
  host_picture_url: 'https://a0.muscache.com/im/pictures/4f366dcd-0481-4d40-9c24-3f99695068b5.jpg?aki_policy=x_large',
  host_name: 'Michael Johnson',
  host_since: '0000-00-00',
  description: 'Este moderno apartamento de un dormitorio, situado en el corazón de la ciudad, es perfecto para explorar todo lo que ofrece la vida metropolitana...',
  price: 120,
  miniatura: 'https://a0.muscache.com/im/pictures/4f366dcd-0481-4d40-9c24-3f99695068b5.jpg?aki_policy=x_large',
  party: 1,
  proceso_de_llegada: 1,
  cancelacion: 1,
  distrito: 'London',
  ciudad: 'London',
  pais: 'UK',
  estado: 1,
  propietario: 'user_2meNa6DZWkgTu3zumDFDHHfiiMU',
  // Asegúrate de escapar las comillas dentro del JSON
  availability: '["2024-09-29", "2024-10-01", "2024-10-02", "2024-09-30", "2024-10-03", "2024-10-04", "2024-10-24"]',
  Todas: 1,
  Bodas: 1,
  Fiestas: 0,
  Frente_a_la_playa: 1,
  Campo: 1,
  EventosCorporativos: 0,
  no_smoking: 1,
  no_pirotecnia: 1,
  quiet_hours: 1,
  no_pets: 1,
  check_in_out_strict: 1,
  max_guests_allowed: 1,
  respect_community_rules: 1,
  no_furniture_moving: 1,
  basic_cleaning_required: 1,
  restricted_areas: 1,
  wifi: 1,
  kitchen: 1,
  parking: 1,
  tv: 1,
  air_conditioning: 1,
  heating: 1,
  washer_dryer: 1,
  pool: 1,
  gym: 1,
  hair_dryer: 1,
  iron: 1,
  towels_and_linen: 1,
  smoke_detector: 1,
  carbon_monoxide_detector: 1,
  foto2: '',  // Si no hay imagen, dejar vacío
  foto3: ''   // Si no hay imagen, dejar vacío
};


app.post('/insert-listing1', (req, res) => {
  // Asegurarnos de que availability sea un JSON string válido si es necesario
  const availabilityJson = JSON.stringify(CONSTANTS.availability);

  const query = `
    INSERT INTO listings (
      name, foto1, room_type, maximo_personas, bedrooms, beds, bathrooms, review_scores_rating,
      number_of_reviews, host_picture_url, host_name, host_since, description, price, miniatura, party,
      proceso_de_llegada, cancelacion, distrito, ciudad, pais, estado, propietario, availability, Todas,
      Bodas, Fiestas, Frente_a_la_playa, Campo, EventosCorporativos, no_smoking, no_pirotecnia, quiet_hours,
      no_pets, check_in_out_strict, max_guests_allowed, respect_community_rules, no_furniture_moving, basic_cleaning_required,
      restricted_areas, wifi, kitchen, parking, tv, air_conditioning, heating, washer_dryer, pool, gym,
      hair_dryer, iron, towels_and_linen, smoke_detector, carbon_monoxide_detector, foto2, foto3
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    CONSTANTS.name, CONSTANTS.foto1, CONSTANTS.room_type, CONSTANTS.maximo_personas, CONSTANTS.bedrooms, CONSTANTS.beds, CONSTANTS.bathrooms, CONSTANTS.review_scores_rating, CONSTANTS.number_of_reviews,
    CONSTANTS.host_picture_url, CONSTANTS.host_name, CONSTANTS.host_since, CONSTANTS.description, CONSTANTS.price, CONSTANTS.miniatura, CONSTANTS.party, CONSTANTS.proceso_de_llegada, CONSTANTS.cancelacion,
    CONSTANTS.distrito, CONSTANTS.ciudad, CONSTANTS.pais, CONSTANTS.estado, CONSTANTS.propietario, availabilityJson, CONSTANTS.Todas, CONSTANTS.Bodas, CONSTANTS.Fiestas, CONSTANTS.Frente_a_la_playa,
    CONSTANTS.Campo, CONSTANTS.EventosCorporativos, CONSTANTS.no_smoking, CONSTANTS.no_pirotecnia, CONSTANTS.quiet_hours, CONSTANTS.no_pets, CONSTANTS.check_in_out_strict, CONSTANTS.max_guests_allowed,
    CONSTANTS.respect_community_rules, CONSTANTS.no_furniture_moving, CONSTANTS.basic_cleaning_required, CONSTANTS.restricted_areas, CONSTANTS.wifi, CONSTANTS.kitchen, CONSTANTS.parking, CONSTANTS.tv,
    CONSTANTS.air_conditioning, CONSTANTS.heating, CONSTANTS.washer_dryer, CONSTANTS.pool, CONSTANTS.gym, CONSTANTS.hair_dryer, CONSTANTS.iron, CONSTANTS.towels_and_linen, CONSTANTS.smoke_detector,
    CONSTANTS.carbon_monoxide_detector, CONSTANTS.foto2, CONSTANTS.foto3
  ];

  // Ejecutamos la consulta con los valores de las constantes
  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting property:', err);
      res.status(500).send('Error inserting property');
      return;
    }
    res.status(200).send('Property inserted successfully');
  });
});


// Ruta para obtener todas las órdenes
app.get('/orders', (req, res) => {
  const query = 'SELECT * FROM ordenes';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      res.status(500).send('Error fetching orders');
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener una orden por ID
app.get('/orders/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM ordenes WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching order:', err);
      res.status(500).send('Error fetching order');
      return;
    }
    res.json(results[0]);
  });
});

// Ruta para actualizar una orden
app.put('/orders/:id', (req, res) => {
  const { id } = req.params;
  const { confirmado, check_in_date, check_in_time, check_out_date, check_out_time, ...rest } = req.body;

  // Construir la consulta SQL dinámicamente
  let query = 'UPDATE ordenes SET ';
  const fields = [];

  if (confirmado !== undefined) {
    fields.push(`confirmado = ${connection.escape(confirmado)}`);
  }

  // Combinar las fechas y horas para check_in y check_out
  if (check_in_date && check_in_time) {
    fields.push(`check_in = ${connection.escape(`${check_in_date}T${check_in_time}:00.000Z`)}`);
  }

  if (check_out_date && check_out_time) {
    fields.push(`check_out = ${connection.escape(`${check_out_date}T${check_out_time}:00.000Z`)}`);
  }

  for (const [key, value] of Object.entries(rest)) {
    fields.push(`${key} = ${connection.escape(value)}`);
  }

  if (fields.length === 0) {
    res.status(400).send('No fields to update');
    return;
  }

  query += fields.join(', ') + ' WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error updating order:', err);
      res.status(500).send('Error updating order');
      return;
    }
    res.send('Order updated successfully');
  });
});

// Ruta para eliminar una orden
app.delete('/orders/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM ordenes WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting order:', err);
      res.status(500).send('Error deleting order');
      return;
    }
    res.send('Order deleted successfully');
  });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});