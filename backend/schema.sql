CREATE DATABASE IF NOT EXISTS barbertime DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE barbertime;

-- TABLA DE USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(30) DEFAULT '',
    ciudad VARCHAR(100) DEFAULT '',
    fecha_nacimiento DATE NULL,
    barbero_favorito VARCHAR(100) DEFAULT '',
    avatar LONGTEXT NULL,
    email_verificado TINYINT(1) DEFAULT 0,
    premium TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA DE BARBERÍAS
CREATE TABLE IF NOT EXISTS barberias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL,
    nombre VARCHAR(150) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    telefono VARCHAR(30) DEFAULT '',
    horario VARCHAR(100) DEFAULT '',
    descripcion TEXT,
    imagen LONGTEXT,
    disponible TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- TABLA DE SERVICIOS (Relacionada a barberías)
CREATE TABLE IF NOT EXISTS servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    barberia_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (barberia_id) REFERENCES barberias(id) ON DELETE CASCADE
);

-- TABLA DE RESEÑAS
CREATE TABLE IF NOT EXISTS resenas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    barberia_id INT NOT NULL,
    usuario_id INT NOT NULL,
    estrellas INT CHECK (estrellas BETWEEN 1 AND 5),
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (barberia_id) REFERENCES barberias(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- TABLA DE PRODUCTOS DE LA TIENDA
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    brand VARCHAR(100) DEFAULT '',
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discount INT DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 5.0,
    stock INT DEFAULT 0,
    featured TINYINT(1) DEFAULT 0,
    image LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA DE COMPRAS / ÓRDENES
CREATE TABLE IF NOT EXISTS compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL,
    nombre_cliente VARCHAR(150) NOT NULL,
    telefono VARCHAR(30) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- DETALLES DE COMPRA
CREATE TABLE IF NOT EXISTS detalles_compra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    compra_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (compra_id) REFERENCES compras(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);