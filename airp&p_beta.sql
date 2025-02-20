CREATE DATABASE airbnb;

USE airbnb;

CREATE TABLE IF NOT EXISTS `airbnb`.`listings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `estado` VARCHAR(255) DEFAULT NULL,
  `nombre` VARCHAR(255) DEFAULT NULL,
  `descripción` TEXT DEFAULT NULL,
  `precio` FLOAT DEFAULT NULL,
  `miniatura` VARCHAR(255) DEFAULT NULL,
  `foto1` VARCHAR(255) DEFAULT NULL,
  `foto2` VARCHAR(255) DEFAULT NULL,
  `foto3` VARCHAR(255) DEFAULT NULL,
  `video1` VARCHAR(255) DEFAULT NULL,
  `proceso_de_llegada` TEXT DEFAULT NULL,
  `invitados_incluidos` INT DEFAULT NULL,
  `cancelación` TEXT DEFAULT NULL,
  `habitaciones` INT DEFAULT NULL,
  `tipo_de_habitación` VARCHAR(255) DEFAULT NULL,
  `camas` INT DEFAULT NULL,
  `baños` FLOAT DEFAULT NULL,
  `cochera` TINYINT(1) DEFAULT '0',
  `parking` TINYINT(1) DEFAULT '0',
  `piscina` TINYINT(1) DEFAULT '0',
  `gimnasio` TINYINT(1) DEFAULT '0',
  `review_scores_rating` INT DEFAULT NULL,
  `number_of_reviews` INT DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
ROW_FORMAT = DYNAMIC;

CREATE TABLE IF NOT EXISTS `airbnb`.`direccion` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `distrito` TEXT DEFAULT NULL,
  `ciudad` TEXT DEFAULT NULL,
  `país` TEXT DEFAULT NULL,
  `dirección` TEXT DEFAULT NULL,
  `puerta` TEXT DEFAULT NULL,
  `codigo_postal` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `direccion_ibfk_1`
    FOREIGN KEY (`id`)
    REFERENCES `airbnb`.`listings` (`id`)
) ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
ROW_FORMAT = DYNAMIC;

CREATE TABLE IF NOT EXISTS `airbnb`.`categorias` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Todas` TINYINT(1) DEFAULT NULL,
  `Bodas` TINYINT(1) DEFAULT NULL,
  `Fiestas` TINYINT(1) DEFAULT NULL,
  `Frente_a_la_playa` TINYINT(1) DEFAULT NULL,
  `Campo` TINYINT(1) DEFAULT NULL,
  `EventosCorporativos` TINYINT(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `categorias_ibfk_1`
    FOREIGN KEY (`id`)
    REFERENCES `airbnb`.`listings` (`id`)
) ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
ROW_FORMAT = DYNAMIC;

CREATE TABLE IF NOT EXISTS `airbnb`.`reglas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `no_smoking` TINYINT(1) DEFAULT '0',
  `no_fiestas` TINYINT(1) DEFAULT '0',
  `horas_de_silencio` TINYINT(1) DEFAULT '0',
  `no_mascotas` TINYINT(1) DEFAULT '0',
  `estrictos_en_el_check_in` TINYINT(1) DEFAULT '0',
  `estrictos_en_el_check_out` TINYINT(1) DEFAULT '0',
  `maximos_invitados_permitidos` TINYINT(1) DEFAULT '0',
  `respectar_las_reglas_de_la_comunidad` TINYINT(1) DEFAULT '0',
  `no_mover_los_muebles` TINYINT(1) DEFAULT '0',
  `limpieza_basica` TINYINT(1) DEFAULT '0',
  `areas_restringidas` TINYINT(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  CONSTRAINT `reglas_ibfk_1`
    FOREIGN KEY (`id`)
    REFERENCES `airbnb`.`listings` (`id`)
) ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
ROW_FORMAT = DYNAMIC;

CREATE TABLE IF NOT EXISTS `airbnb`.`servicios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `wifi` TINYINT(1) DEFAULT '0',
  `aire_acondicionado` TINYINT(1) DEFAULT '0',
  `calefacción` TINYINT(1) DEFAULT '0',
  `lavadora` TINYINT(1) DEFAULT '0',
  `plancha` TINYINT(1) DEFAULT '0',
  `toallas` TINYINT(1) DEFAULT '0',
  `detector_de_humo` TINYINT(1) DEFAULT '0',
  `detector_de_monoxido_de_carbono` TINYINT(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  CONSTRAINT `servicios_ibfk_1`
    FOREIGN KEY (`id`)
    REFERENCES `airbnb`.`listings` (`id`)
) ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
ROW_FORMAT = DYNAMIC;

CREATE TABLE IF NOT EXISTS `airbnb`.`propietario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `foto_url` VARCHAR(255) DEFAULT NULL,
  `id_usuario` VARCHAR(255) DEFAULT NULL,
  `nombre_propietario` VARCHAR(255) DEFAULT NULL,
  `fecha_de_creación_de_cuenta` DATE DEFAULT NULL,
  `verificado` TINYINT(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  CONSTRAINT `propietario_ibfk_1`
    FOREIGN KEY (`id`)
    REFERENCES `airbnb`.`listings` (`id`)
) ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
ROW_FORMAT = DYNAMIC;

CREATE TABLE IF NOT EXISTS `airbnb`.`ordenes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_clerk_cliente` VARCHAR(255) NOT NULL,
  `id_apartamento` INT NOT NULL,
  `nombre_apellido` VARCHAR(255) NOT NULL,
  `fecha_check_in` DATETIME NOT NULL,
  `fecha_check_out` DATETIME NOT NULL,
  `telefono` VARCHAR(20) NOT NULL,
  `notas_adicionales` TEXT DEFAULT NULL,
  `confirmado` TINYINT(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  CONSTRAINT `ordenes_ibfk_1`
    FOREIGN KEY (`id_apartamento`)
    REFERENCES `airbnb`.`listings` (`id`)
) ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
ROW_FORMAT = DYNAMIC;

SELECT * FROM listings WHERE id = 2;


/* Inserts ejemplo */

/*Apartamento 1 */
INSERT INTO `airbnb`.`listings` (`id`, `estado`, `nombre`, `descripción`, `precio`, `miniatura`, `foto1`, `proceso_de_llegada`, `invitados_incluidos`, `cancelación`, `habitaciones`, `tipo_de_habitación`, `camas`, `baños`, `cochera`, `parking`, `piscina`, `gimnasio`, `review_scores_rating`, `number_of_reviews`) VALUES ('1', 'España', 'Apartemento en el campo', 'Bienvenidos a nuestro luminoso y cómodo apartamento, ideal para una estancia tranquila y agradable. Ubicado en el centro de la ciudad, estarás a solo unos minutos de las principales atracciones turísticas, restaurantes, tiendas y transporte público, lo que hace de este espacio el lugar perfecto para explorar todo lo que la ciudad tiene para ofrecer.', '50', 'https://a0.muscache.com/im/pictures/miso/Hosting-45306806/original/2c52733a-78b3-421d-a49a-bea959ab86da.jpeg', 'https://a0.muscache.com/im/pictures/miso/Hosting-45306806/original/2c52733a-78b3-421d-a49a-bea959ab86da.jpeg', '1', '40', '1', '4', 'Duplex', '3', '2', '1', '1', '1', '1', '85', '90');

INSERT INTO `airbnb`.`categorias` (`id`, `Todas`, `Bodas`, `Fiestas`, `Frente_a_la_playa`, `Campo`, `EventosCorporativos`) VALUES ('1', '1', '1', '1', '1', '1', '1');

INSERT INTO `airbnb`.`direccion` (`id`, `distrito`, `ciudad`, `país`, `dirección`, `puerta`, `codigo_postal`) VALUES ('1', 'Sant Joan Despi', 'Barcelona', 'España', ' ', ' ', '08001');

INSERT INTO `airbnb`.`reglas` (`id`, `no_smoking`, `no_fiestas`, `horas_de_silencio`, `no_mascotas`, `estrictos_en_el_check_in`, `estrictos_en_el_check_out`, `maximos_invitados_permitidos`, `respectar_las_reglas_de_la_comunidad`, `no_mover_los_muebles`, `limpieza_basica`, `areas_restringidas`) VALUES ('1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1');

INSERT INTO `airbnb`.`servicios` (`id`, `wifi`, `aire_acondicionado`, `calefacción`, `lavadora`, `plancha`, `toallas`, `detector_de_humo`, `detector_de_monoxido_de_carbono`) VALUES ('1', '1', '1', '1', '1', '1', '1', '1', '1');

INSERT INTO `airbnb`.`propietario` (`id`, `foto_url`, `id_usuario`, `nombre_propietario`, `fecha_de_creación_de_cuenta`, `verificado`) VALUES ('1', 'https://a0.muscache.com/im/pictures/miso/Hosting-45306806/original/2c52733a-78b3-421d-a49a-bea959ab86da.jpeg', ' ', 'Marcos', '27/01/2025', '0');


/*Apartamento 2 */
INSERT INTO `airbnb`.`listings` (`id`, `estado`, `nombre`, `descripción`, `precio`, `miniatura`, `foto1`, `proceso_de_llegada`, `invitados_incluidos`, `cancelación`, `habitaciones`, `tipo_de_habitación`, `camas`, `baños`, `cochera`, `parking`, `piscina`, `gimnasio`, `review_scores_rating`, `number_of_reviews`) VALUES ('2', 'España', 'Apartemento en la playa', 'Bienvenidos a nuestro luminoso y cómodo apartamento, ideal para una estancia tranquila y agradable. Ubicado en el centro de la ciudad, estarás a solo unos minutos de las principales atracciones turísticas, restaurantes, tiendas y transporte público, lo que hace de este espacio el lugar perfecto para explorar todo lo que la ciudad tiene para ofrecer.', '50', 'https://a0.muscache.com/im/pictures/miso/Hosting-702213972376625116/original/a8abb8b3-0846-4c21-9672-dbc76bbbeec7.jpeg', 'https://a0.muscache.com/im/pictures/miso/Hosting-45306806/original/2c52733a-78b3-421d-a49a-bea959ab86da.jpeg', '1', '40', '1', '4', 'Duplex', '3', '2', '1', '1', '1', '1', '85', '90');

INSERT INTO `airbnb`.`categorias` (`id`, `Todas`, `Bodas`, `Fiestas`, `Frente_a_la_playa`, `Campo`, `EventosCorporativos`) VALUES ('2', '1', '1', '1', '1', '1', '1');

INSERT INTO `airbnb`.`direccion` (`id`, `distrito`, `ciudad`, `país`, `dirección`, `puerta`, `codigo_postal`)  VALUES ('2', 'Sant Boi', 'Barcelona', 'España', ' ', ' ', '08001');

INSERT INTO `airbnb`.`reglas` (`id`, `no_smoking`, `no_fiestas`, `horas_de_silencio`, `no_mascotas`, `estrictos_en_el_check_in`, `estrictos_en_el_check_out`, `maximos_invitados_permitidos`, `respectar_las_reglas_de_la_comunidad`, `no_mover_los_muebles`, `limpieza_basica`, `areas_restringidas`) VALUES ('2', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1');

INSERT INTO `airbnb`.`servicios` (`id`, `wifi`, `aire_acondicionado`, `calefacción`, `lavadora`, `plancha`, `toallas`, `detector_de_humo`, `detector_de_monoxido_de_carbono`) VALUES ('2', '1', '1', '1', '1', '1', '1', '1', '1');

INSERT INTO `airbnb`.`propietario` (`id`, `foto_url`, `id_usuario`, `nombre_propietario`, `fecha_de_creación_de_cuenta`, `verificado`) VALUES ('2', 'https://a0.muscache.com/im/pictures/miso/Hosting-45306806/original/2c52733a-78b3-421d-a49a-bea959ab86da.jpeg', ' ', 'Marcos', '27/01/2025', '0');


/*Apartamento 3 */
INSERT INTO `airbnb`.`listings` (`id`, `estado`, `nombre`, `descripción`, `precio`, `miniatura`, `foto1`, `proceso_de_llegada`, `invitados_incluidos`, `cancelación`, `habitaciones`, `tipo_de_habitación`, `camas`, `baños`, `cochera`, `parking`, `piscina`, `gimnasio`, `review_scores_rating`, `number_of_reviews`) VALUES 
('3', 'México', 'Casa con vista al mar', 'Hermosa casa con una espectacular vista al mar, equipada con todas las comodidades para una experiencia única. Ideal para familias o grupos de amigos que buscan relajarse y disfrutar.', '120', 'https://a0.muscache.com/im/pictures/miso/Hosting-702213972376625116/original/217efa09-cdb4-43d3-87db-a12264954d9a.jpeg', 'https://a0.muscache.com/im/pictures/miso/Hosting-45306806/original/2c52733a-78b3-421d-a49a-bea959ab86da.jpeg', '2', '6', '1', '3', 'Casa', '4', '3', '1', '1', '1', '1', '90', '150');

INSERT INTO `airbnb`.`categorias` (`id`, `Todas`, `Bodas`, `Fiestas`, `Frente_a_la_playa`, `Campo`, `EventosCorporativos`) VALUES 
('3', '1', '1', '1', '1', '0', '0');

INSERT INTO `airbnb`.`direccion` (`id`, `distrito`, `ciudad`, `país`, `dirección`, `puerta`, `codigo_postal`) VALUES 
('3', 'Tulum', 'Quintana Roo', 'México', ' ', ' ', '77760');

INSERT INTO `airbnb`.`reglas` (`id`, `no_smoking`, `no_fiestas`, `horas_de_silencio`, `no_mascotas`, `estrictos_en_el_check_in`, `estrictos_en_el_check_out`, `maximos_invitados_permitidos`, `respectar_las_reglas_de_la_comunidad`, `no_mover_los_muebles`, `limpieza_basica`, `areas_restringidas`) VALUES 
('3', '1', '0', '1', '0', '1', '1', '1', '1', '1', '0', '1');

INSERT INTO `airbnb`.`servicios` (`id`, `wifi`, `aire_acondicionado`, `calefacción`, `lavadora`, `plancha`, `toallas`, `detector_de_humo`, `detector_de_monoxido_de_carbono`) VALUES 
('3', '1', '1', '0', '1', '1', '1', '1', '1');

INSERT INTO `airbnb`.`propietario` (`id`, `foto_url`, `id_usuario`, `nombre_propietario`, `fecha_de_creación_de_cuenta`, `verificado`) VALUES 
('3', 'https://a0.muscache.com/im/pictures/miso/Hosting-45306806/original/2c52733a-78b3-421d-a49a-bea959ab86da.jpeg', ' ', 'Andrea', '15/05/2022', '0');
